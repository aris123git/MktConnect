import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFcfa(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function formatDuration(hours: number): string {
  if (hours < 24) {
    return hours === 1 ? '1 hour' : `${hours} hours`
  }

  const days = Math.round(hours / 24)
  if (days < 30) {
    return days === 1 ? '1 day' : `${days} days`
  }

  return '1 month'
}
