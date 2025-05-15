export const metadata = {
  title: 'URL Shortener Tool',
  description: 'Shorten your URLs easily',
}

export default function UrlShortenerLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {children}
    </div>
  )
} 