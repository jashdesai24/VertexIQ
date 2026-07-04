import { useState } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { parseCSVFile, validateRows } from '@/utils/csvParser'
import { useAppData } from '@/hooks/useAppData'

// V1 scope: CSV upload only (see PROJECT_MEMORY.md — live integrations are V2).
// Flow: select file -> parse with PapaParse -> preview first 10 rows -> Confirm
// commits to DataContext (Dashboard updates immediately) or Clear reverts to demo data.
export function SettingsPage() {
  const { uploadData, clearData, fileName, uploadedRows } = useAppData()
  const [preview, setPreview] = useState(null) // { rows, fields, fileName }
  const [error, setError] = useState(null)
  const [isParsing, setIsParsing] = useState(false)

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

  const confirmUpload = () => {
    if (!preview) return
    uploadData(preview.rows, preview.fileName)
    setPreview(null)
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

        {uploadedRows ? (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm dark:bg-green-500/10">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 size={16} />
              Using <span className="font-medium">{fileName}</span> ({uploadedRows.length} rows)
            </div>
            <button onClick={clearData} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
              <Trash2 size={13} /> Clear & use demo data
            </button>
          </div>
        ) : (
          <div className="mb-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-[var(--color-muted)] dark:bg-white/5">
            No file uploaded — Dashboard is currently showing demo data.
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
              <Button variant="secondary" onClick={() => setPreview(null)}>Cancel</Button>
              <Button onClick={confirmUpload}>Confirm & Use This Data</Button>
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
    </div>
  )
}
