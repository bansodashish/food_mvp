'use client'

import Link from 'next/link'
import { ClockIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'

const featuredItems = [
  {
    id: 1,
    title: 'Fresh Organic Apples',
    description: 'Premium organic apples, slightly overripe but perfect for cooking',
    category: 'Fruits',
    originalPrice: 8.99,
    currentPrice: 4.99,
    expiryDate: '2025-07-25',
    location: 'Downtown Market',
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
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    title: 'Mixed Vegetables',
    description: 'Fresh mixed vegetables, great for soups and stews',
    category: 'Vegetables',
    originalPrice: 12.99,
    currentPrice: 6.99,
    expiryDate: '2025-07-26',
    location: 'Green Grocer',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    title: 'Dairy Products',
    description: 'Milk and yogurt nearing expiry, still fresh',
    category: 'Dairy',
    originalPrice: 15.99,
    currentPrice: 8.99,
    expiryDate: '2025-07-23',
    location: 'Fresh Dairy Co',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 5,
    title: 'Seasonal Fruits',
    description: 'Mixed seasonal fruits bundle',
    category: 'Fruits',
    originalPrice: 18.99,
    currentPrice: 9.99,
    expiryDate: '2025-07-27',
    location: 'Fruit Paradise',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 6,
    title: 'Fresh Meat',
    description: 'Quality meat cuts, perfect for immediate cooking',
    category: 'Meat',
    originalPrice: 25.99,
    currentPrice: 15.99,
    expiryDate: '2025-07-23',
    location: 'Butcher Shop',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
]

const categories = [
  { name: 'Fruits', count: 24, icon: '🍎' },
  { name: 'Vegetables', count: 18, icon: '🥕' },
  { name: 'Bakery', count: 12, icon: '🍞' },
  { name: 'Dairy', count: 15, icon: '🥛' },
  { name: 'Meat', count: 8, icon: '🥩' },
  { name: 'Other', count: 32, icon: '🛒' },
]

export function BrowseSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse Available Items
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover quality food items at discounted prices. Help reduce waste while saving money.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/browse?category=${category.name.toLowerCase()}`}
                className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900 group-hover:text-primary-600">
                  {category.name}
                </div>
                <div className="text-sm text-gray-500">{category.count} items</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Featured Items</h3>
            <Link
              href="/browse"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="card hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover rounded-lg w-full h-48"
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary-600">
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
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Link
                    href={`/item/${item.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
