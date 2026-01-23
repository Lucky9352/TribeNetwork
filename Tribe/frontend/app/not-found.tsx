import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-tribe-bg-base">
      <Header showMenuButton={false} />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-tribe-text-primary mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-tribe-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-tribe-text-secondary mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-tribe-primary hover:bg-tribe-primary-hover rounded-lg text-white font-medium transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
