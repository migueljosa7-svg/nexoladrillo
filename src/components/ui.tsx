import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  dark,
}: {
  eyebrow: string
  title: ReactNode
  sub?: string
  dark?: boolean
}) {
  return (
    <motion.div variants={rise} className="mx-auto mb-12 max-w-3xl text-center">
      <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${dark ? 'text-indigo-300' : 'text-brand'}`}>
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      {sub && <p className={`mt-4 text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{sub}</p>}
    </motion.div>
  )
}

/** Botón con microinteracción magnética ligera. */
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'light'
  className?: string
} & Omit<React.ComponentProps<typeof motion.button>, 'children' | 'className'>) {
  const styles = {
    primary: 'bg-gradient-to-r from-brand to-brand-2 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
    ghost: 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400',
    light: 'bg-white text-slate-900 hover:bg-slate-100',
  }[variant]
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-shadow ${styles} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
