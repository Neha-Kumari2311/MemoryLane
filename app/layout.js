import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream-bg text-charcoal font-display">{children}</body>
    </html>
  )
}
