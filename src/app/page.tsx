import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/sections/hero'
import { BrowseSection } from '@/components/sections/browse-section'
import { SustainabilityStats } from '@/components/sections/sustainability-stats'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Hero />
        <BrowseSection />
        <SustainabilityStats />
      </main>
      <Footer />
    </div>
  )
}
