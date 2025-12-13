export default function Page() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-coral-red mb-4">Tailwind is Working!</h1>
        <div className="bg-warm-pink p-6 rounded-lg border-2 border-border-warm">
          <p className="text-charcoal">Your custom colors are configured and ready to use.</p>
        </div>
        <div className="mt-4 bg-surface-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Custom Colors Test</h2>
          <div className="space-y-2">
            <div className="bg-cream-bg p-2 rounded">cream-bg</div>
            <div className="bg-warm-pink p-2 rounded">warm-pink</div>
            <div className="bg-charcoal text-white p-2 rounded">charcoal</div>
            <div className="bg-coral-red text-white p-2 rounded">coral-red</div>
          </div>
        </div>
      </div>
    </div>
  )
}
