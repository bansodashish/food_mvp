'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

const categories = [
  { name: 'All', count: 109 },
  { name: 'Fruits', count: 24 },
  { name: 'Vegetables', count: 18 },
  { name: 'Bakery', count: 12 },
  { name: 'Dairy', count: 15 },
  { name: 'Meat', count: 8 },
  { name: 'Other', count: 32 },
]

const sortOptions = [
  { name: 'Most Recent', value: 'recent' },
  { name: 'Price: Low to High', value: 'price_asc' },
  { name: 'Price: High to Low', value: 'price_desc' },
  { name: 'Expiry Date', value: 'expiry' },
  { name: 'Distance', value: 'distance' },
]

const mockItems = [
  {
    id: 1,
    title: 'Fresh Organic Apples',
    description: 'Premium organic apples, slightly overripe but perfect for cooking',
    category: 'Fruits',
    originalPrice: 8.99,
    currentPrice: 4.99,
    expiryDate: '2025-07-25',
    location: 'Downtown Market',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'Artisan Bread',
    description: 'Day-old artisan sourdough bread, perfect for toast',
    category: 'Bakery',
    originalPrice: 6.50,
    currentPrice: 2.99,
    expiryDate: '2025-07-24',
    location: 'City Bakery',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  // Add more mock items...
]

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Food Items</h1>
          <p className="text-gray-600">Discover quality surplus food at discounted prices</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockItems.map((item) => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover rounded-lg w-full h-48"
                />
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary-600">
                    ${item.currentPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${item.originalPrice}
                  </span>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  {Math.round((item.originalPrice - item.currentPrice) / item.originalPrice * 100)}% off
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Expires: {new Date(item.expiryDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {item.location} • {item.distance}
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  href={`/item/${item.id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details
                </Link>
                <button className="btn-secondary w-full">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="btn-secondary">
            Load More Items
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
