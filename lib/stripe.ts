import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const LISTING_PRICES = {
  standard: {
    amount: 19900, // $199 in cents
    name: 'Standard Job Listing',
    description: '30-day listing with search visibility and applicant tracking',
  },
  featured: {
    amount: 39900, // $399 in cents
    name: 'Featured Job Listing',
    description: '30-day featured listing with priority placement and social promotion',
  },
  premium: {
    amount: 59900, // $599 in cents
    name: 'Premium Job Listing',
    description: '45-day premium listing with dedicated support and candidate curation',
  },
} as const

export type ListingTier = keyof typeof LISTING_PRICES
