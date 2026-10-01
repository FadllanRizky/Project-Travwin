import { useEffect, useState } from 'react'

// Memuat gambar dengan fallback: jika URL (mis. isian user di data/imgs.js)
// salah/kosong/offline, otomatis pindah ke `fallback`, lalu ke `placeholder`.
export default function SmartImage({
  src,
  fallback,
  alt = '',
  imgClassName = '',
  placeholder = null,
  eager = false,
}) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    setStage(0)
  }, [src])

  const current = stage === 0 ? src : fallback

  if (!current || stage === 2) {
    return placeholder
  }

  return (
    <img
      src={current}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className={imgClassName}
      onError={() => {
        if (stage === 0 && fallback) {
          setStage(1)
        } else {
          setStage(2)
        }
      }}
    />
  )
}