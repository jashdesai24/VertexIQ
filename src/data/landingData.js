// Landing page content, kept as data so copy changes never touch JSX/layout.
import { TrendingDown, ShoppingBag, LineChart, Sparkles } from 'lucide-react'

export const metrics = [
  { id: 'businesses', value: 1200, suffix: '+', label: 'Businesses' },
  { id: 'accuracy', value: 97, suffix: '%', label: 'Prediction Accuracy' },
  { id: 'customers', value: 2.3, suffix: 'M+', label: 'Customers Analysed', decimals: 1 },
  { id: 'revenue', value: 12, suffix: 'M+', label: 'Revenue Influenced', prefix: '$' },
]

export const whyAura = [
  { icon: TrendingDown, title: 'Predict', desc: 'Spot churn, demand shifts, and risk before they hit your revenue.' },
  { icon: ShoppingBag, title: 'Recommend', desc: 'Personalized product recommendations for every customer segment.' },
  { icon: LineChart, title: 'Forecast', desc: 'See next month\'s numbers with confidence intervals, not guesswork.' },
  { icon: Sparkles, title: 'Decide', desc: 'Every insight ships with a suggested action — not just a chart.' },
]

export const testimonials = [
  {
    name: 'Ritika Sharma',
    company: 'Founder, Lumière Skincare',
    quote: 'AURA flagged a churn spike in our loyalty segment two weeks before it would have shown up in revenue. We ran a win-back campaign and saved most of them.',
  },
  {
    name: 'Arjun Kapoor',
    company: 'Growth Lead, Flowbase (SaaS)',
    quote: 'We stopped guessing which accounts were at risk. The Decision Center is now the first tab I open every morning.',
  },
  {
    name: 'Meera Iyer',
    company: 'CS Lead, Bloom Box',
    quote: 'The sentiment analysis surfaced a delivery issue in our reviews before support tickets even piled up. It genuinely changed how we prioritize.',
  },
]

export const footerLinks = {
  Company: ['About', 'Careers', 'Blog'],
  Product: ['Dashboard', 'Business Health', 'Decision Center', 'Pricing'],
  Resources: ['Documentation', 'Changelog', 'Support'],
}
