import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PulseDot } from '@/components/ui/PulseDot'
import { Card } from '@/components/ui/Card'
import { AnimatedCounter } from '@/components/landing/AnimatedCounter'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { TestimonialCard } from '@/components/landing/TestimonialCard'
import { Footer } from '@/components/landing/Footer'
import { metrics, whyAura, testimonials } from '@/data/landingData'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-12 lg:px-12 lg:pt-20">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted)] dark:border-[var(--color-border-dark)]">
            <PulseDot />
            Your AI Growth Operating System
          </div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mx-auto max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl"
          >
            Stop reading dashboards.<br />Start acting on decisions.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base text-[var(--color-muted)] dark:text-[var(--color-muted-dark)] lg:text-lg"
          >
            AURA AI turns your raw customer data into churn predictions, product
            recommendations, sales forecasts, and a prioritized list of what to do today.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:opacity-90"
            >
              Get started free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-[var(--color-border)] px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:bg-gray-50 dark:border-[var(--color-border-dark)] dark:hover:bg-white/5"
            >
              View live demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Business Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl px-6 py-10 lg:px-12"
      >
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 dark:border-[var(--color-border-dark)] dark:bg-[var(--color-surface-dark)] lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.id} className="text-center">
              <p className="text-2xl font-bold lg:text-3xl">
                <AnimatedCounter value={m.value} suffix={m.suffix} prefix={m.prefix} decimals={m.decimals} />
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-6 py-10 lg:px-12"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold lg:text-3xl">See it in action</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
            A live look at the Dashboard your team opens every morning.
          </p>
        </div>
        <DashboardPreview />
      </motion.div>

      {/* Why AURA AI */}
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center text-2xl font-bold lg:text-3xl"
        >
          Why AURA AI?
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyAura.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="h-full text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)] dark:bg-[var(--color-accent-soft-dark)]">
                  <v.icon size={20} />
                </div>
                <h3 className="text-sm font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">{v.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center text-2xl font-bold lg:text-3xl"
        >
          Trusted by growing teams
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <TestimonialCard {...t} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="mx-auto max-w-6xl px-6 pb-16 lg:px-12">
        <Card className="bg-gradient-to-br from-[var(--color-accent-soft)] to-transparent p-8 text-center dark:from-[var(--color-accent-soft-dark)]">
          <p className="text-sm font-medium text-[var(--color-accent)]">Built on free, open technology</p>
          <p className="mt-1 text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
            No enterprise pricing. No months-long onboarding. Just upload your data and see decisions, not just charts.
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
