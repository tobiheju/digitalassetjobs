'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  DollarSign,
  FileText,
  X,
  Sparkles,
  Star,
  Zap,
  Eye,
  BarChart3,
  Users,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SECTORS,
  SKILLS,
  WORK_ARRANGEMENTS,
  JOB_TYPES,
  SENIORITY_LEVELS,
} from '@/lib/constants'

// ---------------------------------------------------------------------------
// Animation variants (matching quiz modal)
// ---------------------------------------------------------------------------

const questionVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const questionVariantsBack = {
  initial: { opacity: 0, x: -40, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: 40,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface JobFormData {
  companyName: string
  companyWebsite: string
  companyType: string
  title: string
  department: string
  location: string
  workArrangement: string
  jobType: string
  seniority: string
  skills: string[]
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  description: string
  requirements: string
  benefits: string
  applicationUrl: string
  contactEmail: string
  listingTier: 'standard' | 'featured' | 'premium'
}

const INITIAL: JobFormData = {
  companyName: '',
  companyWebsite: '',
  companyType: '',
  title: '',
  department: '',
  location: '',
  workArrangement: '',
  jobType: '',
  seniority: '',
  skills: [],
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  description: '',
  requirements: '',
  benefits: '',
  applicationUrl: '',
  contactEmail: '',
  listingTier: 'standard',
}

const STEP_COUNT = 6

const STEP_META = [
  { label: 'Company', icon: Building2 },
  { label: 'Role', icon: Briefcase },
  { label: 'Compensation', icon: DollarSign },
  { label: 'Description', icon: FileText },
  { label: 'Listing', icon: Star },
  { label: 'Review', icon: CheckCircle2 },
]

// ---------------------------------------------------------------------------
// Form field helpers
// ---------------------------------------------------------------------------

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors focus:border-[#1a365d] focus:outline-none focus:ring-1 focus:ring-[#1a365d]"
      >
        <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-600">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm"
      />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-600">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors focus:border-[#1a365d] focus:outline-none focus:ring-1 focus:ring-[#1a365d] resize-none"
      />
    </div>
  )
}

function SkillChips({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (skill: string) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill))
    } else {
      onChange([...selected, skill])
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-600">Required skills</label>
      <div className="flex flex-wrap gap-1.5">
        {SKILLS.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggle(skill)}
            className={`rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors ${
              selected.includes(skill)
                ? 'border-[#1a365d]/20 bg-[#1a365d]/5 text-[#1a365d]'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pricing tiers
// ---------------------------------------------------------------------------

const TIERS = [
  {
    id: 'standard' as const,
    name: 'Standard',
    price: '$199',
    period: '30 days',
    description: 'Essential visibility for your open role',
    features: [
      'Listed in search results',
      'Included in email alerts',
      'Basic analytics dashboard',
      'Applicant tracking',
    ],
    icon: Eye,
  },
  {
    id: 'featured' as const,
    name: 'Featured',
    price: '$399',
    period: '30 days',
    description: 'Maximum exposure with priority placement',
    popular: true,
    features: [
      'Everything in Standard',
      'Featured badge on listing',
      'Priority search placement',
      'Highlighted in newsletters',
      'Social media promotion',
      'Enhanced analytics',
    ],
    icon: Zap,
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: '$599',
    period: '45 days',
    description: 'Full-service hiring with dedicated support',
    features: [
      'Everything in Featured',
      'Extended 45-day listing',
      'Dedicated account manager',
      'Candidate shortlist curation',
      'Company profile spotlight',
      'Hiring analytics report',
      'Guaranteed applicant volume',
    ],
    icon: Crown,
  },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PostJobPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<JobFormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const update = (partial: Partial<JobFormData>) => setForm((prev) => ({ ...prev, ...partial }))

  const progress = ((step + 1) / STEP_COUNT) * 100

  const canProceed = () => {
    switch (step) {
      case 0: return !!(form.companyName && form.companyType)
      case 1: return !!(form.title && form.location && form.workArrangement && form.jobType)
      case 2: return true
      case 3: return !!(form.description && form.applicationUrl)
      case 4: return true
      case 5: return true
      default: return false
    }
  }

  async function handleCheckout() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: form.listingTier,
          jobData: {
            title: form.title,
            companyName: form.companyName,
            contactEmail: form.contactEmail,
          },
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned:', data)
        setSubmitting(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setSubmitting(false)
    }
  }

  function handleNext() {
    setDirection('forward')
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
    } else {
      handleCheckout()
    }
  }

  function handleBack() {
    if (step > 0) {
      setDirection('back')
      setStep((s) => s - 1)
    }
  }

  const handleClose = useCallback(() => {
    window.history.back()
  }, [])

  const handleReset = () => {
    setSubmitted(false)
    setStep(0)
    setForm(INITIAL)
    setDirection('forward')
  }

  const variants = direction === 'forward' ? questionVariants : questionVariantsBack

  const selectedTier = TIERS.find((t) => t.id === form.listingTier) || TIERS[0]

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#1a365d]/5">
            <Briefcase className="size-4 text-[#1a365d]" />
          </div>
          <span className="text-sm font-medium text-[#1a365d]">
            Post a Job
          </span>
        </div>
        <button
          onClick={handleClose}
          className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Progress bar */}
      {!submitted && (
        <div className="mx-5 h-1 overflow-hidden rounded-full bg-slate-100 md:mx-8">
          <motion.div
            className="h-full rounded-full bg-[#1a365d]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          />
        </div>
      )}

      {/* Main content — centered */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-8 md:px-8">
        <div className={`w-full ${step === 4 ? 'max-w-3xl' : 'max-w-lg'}`}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="size-8 text-emerald-600" />
                </div>
                <h2 className="font-serif text-2xl font-normal text-[#1a365d]">
                  Listing submitted
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Your <span className="font-medium text-slate-700">{selectedTier.name}</span> listing for{' '}
                  <span className="font-medium text-slate-700">{form.title}</span> at{' '}
                  <span className="font-medium text-slate-700">{form.companyName}</span> has been
                  submitted for review. We'll notify you once it's live.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/jobs">
                    <Button className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] active:scale-[0.98] sm:w-auto sm:px-8">
                      Browse Jobs
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full active:scale-[0.98] sm:w-auto sm:px-8"
                  >
                    Post Another
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Step header */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-[#d4a038]">
                    Step {step + 1} of {STEP_COUNT}
                  </p>
                  <h2 className="mt-1.5 font-serif text-2xl font-normal text-[#1a365d] md:text-3xl">
                    {step === 0 && 'Tell us about your company'}
                    {step === 1 && 'Describe the role'}
                    {step === 2 && 'Set compensation'}
                    {step === 3 && 'Write the job description'}
                    {step === 4 && 'Choose your listing plan'}
                    {step === 5 && 'Review and submit'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {step === 0 && 'Basic company details to display on your listing'}
                    {step === 1 && 'Help candidates understand what the role involves'}
                    {step === 2 && 'Jobs with transparent salaries get 3x more applications'}
                    {step === 3 && 'A great description attracts better candidates'}
                    {step === 4 && 'Select the visibility level that fits your hiring goals'}
                    {step === 5 && 'Confirm everything looks good before submitting'}
                  </p>
                </div>

                {/* Step content */}
                <div>
                  {/* Step 0: Company */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <TextField label="Company name" value={form.companyName} onChange={(v) => update({ companyName: v })} placeholder="e.g. Coinbase" />
                      <TextField label="Company website" value={form.companyWebsite} onChange={(v) => update({ companyWebsite: v })} placeholder="https://example.com" type="url" />
                      <SelectField label="Company sector" value={form.companyType} options={SECTORS} onChange={(v) => update({ companyType: v })} />
                      <TextField label="Contact email" value={form.contactEmail} onChange={(v) => update({ contactEmail: v })} placeholder="hiring@company.com" type="email" />
                    </div>
                  )}

                  {/* Step 1: Role */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <TextField label="Job title" value={form.title} onChange={(v) => update({ title: v })} placeholder="e.g. Senior Smart Contract Engineer" />
                      <TextField label="Department" value={form.department} onChange={(v) => update({ department: v })} placeholder="e.g. Engineering" />
                      <TextField label="Location" value={form.location} onChange={(v) => update({ location: v })} placeholder="e.g. New York / Remote" />
                      <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Work arrangement" value={form.workArrangement} options={WORK_ARRANGEMENTS} onChange={(v) => update({ workArrangement: v })} />
                        <SelectField label="Job type" value={form.jobType} options={JOB_TYPES} onChange={(v) => update({ jobType: v })} />
                      </div>
                      <SelectField label="Seniority level" value={form.seniority} options={SENIORITY_LEVELS} onChange={(v) => update({ seniority: v })} />
                      <SkillChips selected={form.skills} onChange={(v) => update({ skills: v })} />
                    </div>
                  )}

                  {/* Step 2: Compensation */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <TextField label="Minimum salary" value={form.salaryMin} onChange={(v) => update({ salaryMin: v })} placeholder="100,000" />
                        <TextField label="Maximum salary" value={form.salaryMax} onChange={(v) => update({ salaryMax: v })} placeholder="180,000" />
                      </div>
                      <SelectField label="Currency" value={form.salaryCurrency} options={['USD', 'EUR', 'GBP', 'CHF', 'SGD'] as const} onChange={(v) => update({ salaryCurrency: v })} />
                      <TextAreaField
                        label="Benefits and perks"
                        value={form.benefits}
                        onChange={(v) => update({ benefits: v })}
                        placeholder="e.g. Equity, token allocation, remote-first, health insurance..."
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Step 3: Description */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <TextAreaField
                        label="Description"
                        value={form.description}
                        onChange={(v) => update({ description: v })}
                        placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                        rows={5}
                      />
                      <TextAreaField
                        label="Requirements"
                        value={form.requirements}
                        onChange={(v) => update({ requirements: v })}
                        placeholder="List each requirement on a new line..."
                        rows={4}
                      />
                      <TextField
                        label="Application URL"
                        value={form.applicationUrl}
                        onChange={(v) => update({ applicationUrl: v })}
                        placeholder="https://careers.company.com/apply/..."
                        type="url"
                      />
                    </div>
                  )}

                  {/* Step 4: Listing Plan */}
                  {step === 4 && (
                    <div className="grid gap-4 md:grid-cols-3">
                      {TIERS.map((tier) => {
                        const TierIcon = tier.icon
                        const isSelected = form.listingTier === tier.id
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => update({ listingTier: tier.id })}
                            className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all duration-150 ${
                              isSelected
                                ? tier.id === 'premium'
                                  ? 'border-[#d4a038] bg-[#d4a038]/[0.03] shadow-[0_4px_24px_-6px_rgba(212,160,56,0.15)]'
                                  : 'border-[#1a365d] bg-[#1a365d]/[0.02] shadow-[0_4px_24px_-6px_rgba(26,54,93,0.12)]'
                                : 'border-slate-150 hover:border-slate-250 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)]'
                            }`}
                          >
                            {tier.popular && (
                              <span className="absolute -top-2.5 right-4 rounded-md bg-[#1a365d] px-2 py-0.5 text-[10px] font-medium text-white">
                                Most popular
                              </span>
                            )}

                            <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${
                              tier.id === 'premium'
                                ? 'bg-[#d4a038]/10'
                                : 'bg-[#1a365d]/5'
                            }`}>
                              <TierIcon className={`size-4.5 ${
                                tier.id === 'premium'
                                  ? 'text-[#d4a038]'
                                  : 'text-[#1a365d]'
                              }`} />
                            </div>

                            <p className="text-[15px] font-medium text-[#1a365d]">{tier.name}</p>

                            <div className="mt-1 flex items-baseline gap-1">
                              <span className={`text-2xl font-medium ${
                                tier.id === 'premium' ? 'text-[#d4a038]' : 'text-[#1a365d]'
                              }`}>
                                {tier.price}
                              </span>
                              <span className="text-xs text-slate-400">/ {tier.period}</span>
                            </div>

                            <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                              {tier.description}
                            </p>

                            <ul className="mt-4 space-y-2">
                              {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-[12px] text-slate-600">
                                  <CheckCircle2 className={`mt-0.5 size-3 shrink-0 ${
                                    isSelected
                                      ? tier.id === 'premium' ? 'text-[#d4a038]' : 'text-[#1a365d]'
                                      : 'text-slate-300'
                                  }`} />
                                  {feature}
                                </li>
                              ))}
                            </ul>

                            {/* Selection indicator */}
                            <div className={`mt-4 rounded-lg py-1.5 text-center text-[12px] font-medium transition-colors ${
                              isSelected
                                ? tier.id === 'premium'
                                  ? 'bg-[#d4a038]/10 text-[#d4a038]'
                                  : 'bg-[#1a365d]/5 text-[#1a365d]'
                                : 'bg-slate-50 text-slate-400'
                            }`}>
                              {isSelected ? 'Selected' : 'Select plan'}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Step 5: Review */}
                  {step === 5 && (
                    <div className="space-y-4">
                      {/* Selected plan summary */}
                      <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                        form.listingTier === 'premium'
                          ? 'border-[#d4a038]/20 bg-[#d4a038]/[0.03]'
                          : 'border-[#1a365d]/10 bg-[#1a365d]/[0.02]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <selectedTier.icon className={`size-4 ${
                            form.listingTier === 'premium' ? 'text-[#d4a038]' : 'text-[#1a365d]'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-[#1a365d]">{selectedTier.name} listing</p>
                            <p className="text-xs text-slate-500">{selectedTier.period}</p>
                          </div>
                        </div>
                        <span className={`text-lg font-medium ${
                          form.listingTier === 'premium' ? 'text-[#d4a038]' : 'text-[#1a365d]'
                        }`}>
                          {selectedTier.price}
                        </span>
                      </div>

                      <div className="space-y-3 divide-y divide-slate-100 rounded-xl border border-slate-100 p-5">
                        <div>
                          <p className="text-xs font-medium text-slate-400">Company</p>
                          <p className="mt-1 text-sm text-slate-700">{form.companyName}</p>
                          {form.companyWebsite && <p className="text-xs text-slate-400">{form.companyWebsite}</p>}
                          <p className="text-xs text-slate-400">{form.companyType}</p>
                        </div>
                        <div className="pt-3">
                          <p className="text-xs font-medium text-slate-400">Role</p>
                          <p className="mt-1 text-sm text-slate-700">{form.title}</p>
                          <p className="text-xs text-slate-400">
                            {[form.location, form.workArrangement, form.jobType, form.seniority].filter(Boolean).join(' · ')}
                          </p>
                          {form.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {form.skills.map((s) => (
                                <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="pt-3">
                          <p className="text-xs font-medium text-slate-400">Compensation</p>
                          <p className="mt-1 text-sm text-slate-700">
                            {form.salaryMin && form.salaryMax
                              ? `${form.salaryCurrency} ${form.salaryMin} – ${form.salaryMax}`
                              : 'Not specified'}
                          </p>
                        </div>
                        <div className="pt-3">
                          <p className="text-xs font-medium text-slate-400">Description</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{form.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="gap-1.5 active:scale-[0.98]"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`gap-1.5 active:scale-[0.98] ${
                      step === STEP_COUNT - 1
                        ? 'bg-[#d4a038] hover:bg-[#c49030]'
                        : 'bg-[#1a365d] hover:bg-[#2a4a7f]'
                    }`}
                  >
                    {step === STEP_COUNT - 1 ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        Submit — {selectedTier.price}
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Step indicators at the bottom */}
      {!submitted && (
        <div className="flex items-center justify-center gap-2 pb-6">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i < step) {
                  setDirection('back')
                  setStep(i)
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-6 bg-[#1a365d]'
                  : i < step
                    ? 'w-1.5 bg-[#1a365d]/40 cursor-pointer hover:bg-[#1a365d]/60'
                    : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
