import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ProtectedLayout } from '@/layouts/ProtectedLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { BusinessHealthPage } from '@/pages/BusinessHealthPage'
import { DecisionCenterPage } from '@/pages/DecisionCenterPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SettingsPage } from '@/pages/SettingsPage'

// Route tree mirrors constants/nav.js exactly. Public routes use PublicLayout
// (no sidebar); every /app/* route uses ProtectedLayout (sidebar + navbar).
// NOTE: no auth guard yet — real route protection is wired in Sprint 7 with the backend.
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/app" element={<ProtectedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="business-health" element={<BusinessHealthPage />} />
        <Route path="decision-center" element={<DecisionCenterPage />} />
        <Route path="customers" element={<PlaceholderPage title="Customer Analytics" />} />
        <Route path="churn" element={<PlaceholderPage title="Churn Prediction" />} />
        <Route path="recommendations" element={<PlaceholderPage title="Product Recommendation" />} />
        <Route path="forecast" element={<PlaceholderPage title="Sales Forecast" />} />
        <Route path="sentiment" element={<PlaceholderPage title="Review Sentiment" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
      </Route>
    </Routes>
  )
}
