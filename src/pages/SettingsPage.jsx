import { useEffect, useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { parseCSVFile, validateRows } from '@/utils/csvParser'
import { useAppData } from '@/hooks/useAppData'
import { api } from '@/services/apiClient'
import { DatasetHistory } from '@/components/settings/DatasetHistory'

// V1 scope: CSV upload only. PapaParse still runs client-side (needed for the
// preview table before the person commits), but persistence now goes through
// the backend: POST /api/upload on confirm, DELETE /api/upload to revert to
// demo data. No local fallback here — uploading genuinely requires the backend;
// read-only pages (Dashboard etc.) are the ones that fall back to demo data.
export function SettingsPage() {
  const { uploadData, clearData, dataVersion } = useAppData()
  const [status, setStatus] = useState({ loading: true, isDemoData: true, fileName: null, unreachable: false })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadStatus = async () => {
    setStatus((s) => ({ ...s, loading: true }))
    try {
      const data = await api.getUploadStatus()
      setStatus({ loading: false, isDemoData: data.isDemoData, fileName: data.fileName, unreachable: false })
    } catch {
      setStatus({ loading: false, isDemoData: true, fileName: null, unreachable: true })
    }
  }

  useEffect(() => {
    loadStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setIsParsing(true)
    try {
      const { rows, fields } = await parseCSVFile(file)
      const { valid, missing } = validateRows(fields)
      if (!valid) {
        setError(`Missing required column(s): ${missing.join(', ')}`)
        setPreview(null)
      } else {
        setPreview({ rows, fields, fileName: file.name })
      }
    } catch {
      setError('Could not parse this file. Please upload a valid CSV.')
    } finally {
      setIsParsing(false)
      e.target.value = ''
    }
  }

  const confirmUpload = async () => {
    if (!preview) return
    setIsSubmitting(true)
    setError(null)
    try {
      await uploadData(preview.fileName, preview.rows)
      setPreview(null)
    } catch (err) {
      setError(`Upload failed: ${err.message}. Is the backend running?`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = async () => {
    setError(null)
    try {
      await clearData()
    } catch (err) {
      setError(`Couldn't clear data: ${err.message}. Is the backend running?`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Upload your business data to replace the demo dashboard with your own numbers.
        </p>
      </div>

      <Card>
        <p className="mb-1 text-sm font-semibold">Data Source</p>
        <p className="mb-4 text-xs text-[var(--color-muted)] dark:text-[var(--color-muted-dark)]">
          Required columns: <code className="rounded bg-gray-100 px-1 dark:bg-white/10">customer_name</code>,{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-white/10">product_name</code>,{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-white/10">order_value</code>,{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-white/10">order_date</code>
        </p>

        {status.loading ? (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-[var(--color-muted)] dark:bg-white/5">
            <Loader2 size={13} className="animate-spin" /> Checking current data source…
          </div>
        ) : status.unreachable ? (
          <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
            Backend unreachable — uploads are disabled until the backend is running. Other pages will show demo data in the meantime.
          </div>
        ) : status.isDemoData ? (
          <div className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-[var(--color-muted)] dark:bg-white/5">
            No file uploaded — Dashboard is currently showing demo data.
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm dark:bg-green-500/10">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 size={16} />
              Using <span className="font-medium">{status.fileName}</span>
            </div>
            <button onClick={handleClear} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
              <Trash2 size={13} /> Clear & use demo data
            </button>
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] px-6 py-10 text-center transition-colors hover:border-[var(--color-accent)] dark:border-[var(--color-border-dark)]">
          <UploadCloud size={24} className="text-[var(--color-muted)]" />
          <span className="mt-2 text-sm font-medium">
            {isParsing ? 'Parsing…' : 'Click to upload a CSV file'}
          </span>
          <span className="mt-1 text-xs text-[var(--color-muted)]">.csv up to a few MB</span>
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </label>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={15} /> {error}
          </div>
        )}
      </Card>

      {preview && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Preview — {preview.fileName} <Badge variant="accent">{preview.rows.length} rows</Badge>
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPreview(null)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={confirmUpload} disabled={isSubmitting}>
                {isSubmitting ? 'Uploading…' : 'Confirm & Use This Data'}
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {preview.fields.map((f) => (
                    <th key={f} className="whitespace-nowrap px-3 py-2 font-medium text-[var(--color-muted)]">{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
                    {preview.fields.map((f) => (
                      <td key={f} className="whitespace-nowrap px-3 py-2 font-data text-[var(--color-ink)] dark:text-[var(--color-ink-dark)]">
                        {String(row[f] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <DatasetHistory />
    </div>
  )
}
