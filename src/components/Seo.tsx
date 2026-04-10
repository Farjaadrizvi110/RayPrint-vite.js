import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'RayPrint'
const TWITTER_HANDLE = '@rayprintuk'
const DEFAULT_OG_IMAGE = 'https://rayprint.co.uk/images/hero_collage.jpg'

type SeoProps = {
  title: string
  description: string
  canonicalPath?: string
  noIndex?: boolean
  ogImage?: string
  keywords?: string
  ogType?: 'website' | 'article' | 'product'
}

function normalizePath(pathname: string) {
  if (!pathname.startsWith('/')) return `/${pathname}`
  return pathname
}

function getCanonicalUrl(origin: string, pathname: string) {
  const normalized = normalizePath(pathname)
  if (normalized === '/') return origin
  return `${origin}${normalized}`
}

export function Seo({
  title,
  description,
  canonicalPath,
  noIndex = false,
  ogImage,
  keywords,
  ogType = 'website',
}: SeoProps) {
  const location = useLocation()
  const origin = typeof window === 'undefined' ? 'https://rayprint.co.uk' : window.location.origin
  const pathname = canonicalPath ? normalizePath(canonicalPath) : location.pathname
  const canonical = getCanonicalUrl(origin, pathname)
  const robots = noIndex ? 'noindex,follow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
  const image = ogImage || DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonical} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  )
}
