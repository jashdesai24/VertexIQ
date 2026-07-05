import { useEffect, useState } from 'react'
import { Database, CheckCircle2, Trash2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/AsyncState'
import { api } from '@/services/apiClient'
import { useAppData } from '@/hooks/useAppData'
import { formatDate, formatNumber } from '@/utils/format'

// Lists every uploaded dataset for the workspace (GET /api/datasets) and lets
// the person switch which one is active or delete one. Selecting/deleting
// calls DataContext (which bumps dataVersion), so every other page refetches
// automatically — this component only renders, it doesn't own app-wide state.
export function DatasetHistory() {
  const { dataVersion, selectDataset, removeDataset } = useAppData()
  const [datasets, setDatasets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingId, setPendingId] = useState(null) // dataset currently being selected/deleted

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getDatasets()
      setDatasets(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion])

  const handleSelect = async (id) => {
    setPendingId(id)
    try {
      await selectDataset(id)
    } catch (err) {
      setError(`Couldn't switch dataset: ${err.message}`)
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (id, fileName) => {
    if (!window.confirm(`Delete "${fileName}"? This can't be undone.`)) return
    setPendingId(id)
    try {
      await removeDataset(id)
    } catch (err) {
      setError(`Couldn't delete dataset: ${err.message}`)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Database size={15} className="text-[var(--color-accent)]" />
        <p className="text-sm font-semibold">Dataset History</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-xs text-[var(--color-muted)]">
          <Loader2 size={13} className="animate-spin" /> Loading datasets…
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</div>
      ) : !datasets || datasets.length === 0 ? (
        <EmptyState message="No datasets uploaded yet — your first upload will appear here." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs text-[var(--color-muted)] dark:border-[var(--color-border-dark)]">
              <tr>
                <th className="py-2 pr-4 font-medium">File</th>
                <th className="py-2 pr-4 font-medium">Uploaded</th>
                <th className="py-2 pr-4 font-medium">Rows</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((d) => (
                <tr key={d._id} className="border-b border-[var(--color-border)] last:border-0 dark:border-[var(--color-border-dark)]">
                  <td className="py-2.5 pr-4 font-medium">{d.fileName}</td>
                  <td className="py-2.5 pr-4 text-[var(--color-muted)]">{formatDate(d.uploadedAt)}</td>
                  <td className="font-data py-2.5 pr-4 text-[var(--color-muted)]">{formatNumber(d.rowCount)}</td>
                  <td className="py-2.5 pr-4">
                    {d.isActive && (
                      <Badge variant="success">
                        <CheckCircle2 size={11} className="mr-1 inline" /> Active
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex gap-2">
                      {!d.isActive && (
                        <Button
                          variant="secondary"
                          className="px-2.5 py-1 text-xs"
                          onClick={() => handleSelect(d._id)}
                          disabled={pendingId === d._id}
                        >
                          {pendingId === d._id ? 'Switching…' : 'Select'}
                        </Button>
                      )}
                      <button
                        onClick={() => handleDelete(d._id, d.fileName)}
                        disabled={pendingId === d._id}
                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
