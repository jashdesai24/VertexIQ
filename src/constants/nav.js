// Single source of truth for the sidebar/mobile nav. Add a route here once
// and it appears consistently across Sidebar.jsx, MobileNav, and App.jsx routing.
import {
  LayoutDashboard,
  HeartPulse,
  Sparkles,
  Users,
  UserCircle2,
  TrendingDown,
  ShoppingBag,
  LineChart,
  MessageSquareText,
  FileBarChart2,
  Settings,
} from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/app', icon: LayoutDashboard, status: 'live' },
  { label: 'Business Health', path: '/app/business-health', icon: HeartPulse, status: 'live' },
  { label: 'Decision Center', path: '/app/decision-center', icon: Sparkles, status: 'live' },
  { label: 'Customer Analytics', path: '/app/customers', icon: Users, status: 'placeholder' },
  { label: 'Churn Prediction', path: '/app/churn', icon: TrendingDown, status: 'placeholder' },
  { label: 'Product Recommendation', path: '/app/recommendations', icon: ShoppingBag, status: 'placeholder' },
  { label: 'Sales Forecast', path: '/app/forecast', icon: LineChart, status: 'placeholder' },
  { label: 'Review Sentiment', path: '/app/sentiment', icon: MessageSquareText, status: 'placeholder' },
  { label: 'Reports', path: '/app/reports', icon: FileBarChart2, status: 'placeholder' },
  { label: 'Settings', path: '/app/settings', icon: Settings, status: 'placeholder' },
]

export const PROFILE_PATH = '/app/profile'
export const PROFILE_ICON = UserCircle2
