import { useState } from 'react';

/**
 * Image with graceful fallback. Renders the real photo; if the file is
 * missing it shows a navy placeholder block of the same size (per client
 * spec — no stock photos, no broken images). Drop the file into
 * /public/images/ later and it appears with no code changes.
 */
export default function Photo({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  imgClassName = '',
  eager = false,
  fallback,
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (fallback) return fallback;
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-ink ${className}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <span className="font-display text-2xl font-bold text-white/25">DBZ</span>
      </div>
    );
  }

  // Cache-safe URL: the preview proxy caches images aggressively, so every
  // image gets a version query. Bump the version when a file is replaced.
  const finalSrc = src.includes('?') ? src : `${src}?v=2`;

  return (
    <img
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className} ${imgClassName}`}
    />
  );
}
