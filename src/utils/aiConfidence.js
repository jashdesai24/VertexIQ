// AI Confidence utility (Sprint 10B, Part 7). Reuses the per-trend
// confidence levels trendAnalyzer.js already computes (which reflect
// available history) rather than re-deriving history depth here, and adds
// the dataset-size dimension the spec explicitly asks for.
export function computeConfidence({ rowCount, trends }) {
  if (!rowCount || rowCount < 5) return 'Low'

  const levels = trends.map((t) => t.confidence)
  const highCount = levels.filter((c) => c === 'high').length
  const lowCount = levels.filter((c) => c === 'low').length

  // Dataset size gate — the base confidence ceiling.
  let confidence
  if (rowCount >= 50) confidence = 'High'
  else if (rowCount >= 15) confidence = 'Medium'
  else confidence = 'Low'

  // Downgrade if most underlying trends don't have enough history behind them.
  if (lowCount > levels.length / 2 && confidence !== 'Low') {
    confidence = confidence === 'High' ? 'Medium' : 'Low'
  }
  // Upgrade Medium -> High only if the dataset is solid AND every trend read
  // is itself high-confidence (strong, well-supported signal across the board).
  if (confidence === 'Medium' && highCount === levels.length) {
    confidence = 'High'
  }

  return confidence
}
