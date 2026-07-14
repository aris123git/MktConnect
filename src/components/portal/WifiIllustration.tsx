import { motion } from 'framer-motion'

export function WifiIllustration() {
  return (
    <div className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center md:h-64">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand/20 via-white/40 to-brand-deep/10 blur-0" />
      <div className="absolute inset-4 rounded-[1.75rem] border border-white/70 bg-white/50 shadow-[0_20px_60px_rgba(11,99,246,0.15)] backdrop-blur-xl" />

      <motion.div
        className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep shadow-[0_20px_50px_rgba(11,99,246,0.35)]"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 64 64" className="h-14 w-14 text-white" fill="none">
          <path
            d="M12 26c11-10 29-10 40 0"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M19 34c7.5-7 18.5-7 26 0"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M26 42c4-3.5 8-3.5 12 0"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="32" cy="50" r="3.5" fill="currentColor" />
        </svg>
      </motion.div>

      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border border-brand/25"
          style={{
            width: `${7 + ring * 3.2}rem`,
            height: `${7 + ring * 3.2}rem`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.15, 0.45, 0.15], scale: [0.95, 1.05, 0.95] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: ring * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
