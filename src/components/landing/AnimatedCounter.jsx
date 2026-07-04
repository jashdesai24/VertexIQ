import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

// Counts up once when scrolled into view. useInView({ once: true }) means this
// never re-runs on repeated scroll, keeping the page cheap to render.
export function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, duration = 1.2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const startTime = performance.now()
    function tick(now) {
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, value, duration])

  return (
    <motion.span ref={ref} className="font-data tabular-nums">
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </motion.span>
  )
}
