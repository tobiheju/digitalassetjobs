'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// Well-known company domains for logo resolution
const COMPANY_DOMAINS: Record<string, string> = {
  'Aave': 'aave.com',
  'Alchemy': 'alchemy.com',
  'Anchorage Digital': 'anchorage.com',
  'Binance': 'binance.com',
  'BitGo': 'bitgo.com',
  'Bitstamp': 'bitstamp.net',
  'BlackRock': 'blackrock.com',
  'BlackRock Digital Assets': 'blackrock.com',
  'Block (Square)': 'block.xyz',
  'Blur': 'blur.io',
  'BNY Mellon Digital': 'bnymellon.com',
  'Chainalysis': 'chainalysis.com',
  'Circle': 'circle.com',
  'Citi Digital Assets': 'citigroup.com',
  'Cobo': 'cobo.com',
  'Coinbase': 'coinbase.com',
  'Compound': 'compound.finance',
  'Copper.co': 'copper.co',
  'Crypto.com': 'crypto.com',
  'Dune Analytics': 'dune.com',
  'dYdX': 'dydx.exchange',
  'Fidelity Digital Assets': 'fidelity.com',
  'Fireblocks': 'fireblocks.com',
  'Galaxy Digital': 'galaxy.com',
  'Gemini': 'gemini.com',
  'Glassnode': 'glassnode.com',
  'Goldman Sachs Digital': 'goldmansachs.com',
  'Hex Trust': 'hextrust.com',
  'Infura': 'infura.io',
  'JPMorgan Onyx': 'jpmorgan.com',
  'Kraken': 'kraken.com',
  'Ledger': 'ledger.com',
  'Lido': 'lido.fi',
  'Magic Eden': 'magiceden.io',
  'MakerDAO': 'makerdao.com',
  'Messari': 'messari.io',
  'Metamask': 'metamask.io',
  'Morgan Stanley Digital': 'morganstanley.com',
  'Nansen': 'nansen.ai',
  'OKX': 'okx.com',
  'OpenSea': 'opensea.io',
  'Paxos': 'paxos.com',
  'PayPal Crypto': 'paypal.com',
  'Phantom': 'phantom.app',
  'QuickNode': 'quicknode.com',
  'Rainbow': 'rainbow.me',
  'Revolut Crypto': 'revolut.com',
  'Robinhood Crypto': 'robinhood.com',
  'State Street Digital': 'statestreet.com',
  'Stripe': 'stripe.com',
  'Stripe Crypto': 'stripe.com',
  'Tenderly': 'tenderly.co',
  'Tether': 'tether.to',
  'The Block': 'theblock.co',
  'Trezor': 'trezor.io',
  'Uniswap Labs': 'uniswap.org',
}

function getDomain(name: string, logoUrl?: string): string | null {
  if (logoUrl) return null // use logoUrl directly
  const domain = COMPANY_DOMAINS[name]
  if (domain) return domain
  // Try to derive from name
  const simple = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'
  return simple
}

const PALETTE = [
  'bg-[#1e3a5f] text-white',
  'bg-slate-600 text-white',
  'bg-emerald-700 text-white',
  'bg-amber-600 text-white',
  'bg-indigo-600 text-white',
  'bg-rose-600 text-white',
] as const

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const SIZES = {
  sm: 28,
  md: 36,
  lg: 48,
} as const

interface CompanyLogoProps {
  name: string
  logoUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CompanyLogo({ name, logoUrl, size = 'md' }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false)
  const px = SIZES[size]
  const colorClass = PALETTE[hashName(name) % PALETTE.length]
  const initial = name.charAt(0).toUpperCase()
  const fontSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  // Resolve logo URL: explicit URL > Google favicon (high-res)
  const domain = getDomain(name, logoUrl)
  const resolvedUrl = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null)

  if (resolvedUrl && !imgError) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ width: px, height: px }}
      >
        <img
          src={resolvedUrl}
          alt={`${name} logo`}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          style={{ outline: 'none' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden rounded-lg flex items-center justify-center font-medium',
        colorClass,
        fontSize,
      )}
      style={{ width: px, height: px }}
      aria-label={`${name} logo`}
    >
      {initial}
    </div>
  )
}
