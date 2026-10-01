export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const res = await fetch(path, { ...options, headers })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    let errorData = null
    try {
      const data = await res.json()
      errorData = data
      if (typeof data === 'string') message = data
      else if (data?.message) message = data.message
      else if (data?.error) message = data.error
    } catch {
      const text = await res.text()
      if (text) message = text
    }
    const err = new Error(message)
    err.code = errorData?.error
    err.field = errorData?.field
    err.data = errorData
    err.status = res.status
    throw err
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export function formatRupiah(value) {
  const n = Number(value || 0)
  return 'Rp' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function getField(obj, path) {
  if (!path) return null
  return path
    .split('.')
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}