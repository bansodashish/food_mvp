'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline'

const categories = [
  'FRUITS',
  'VEGETABLES',
  'DAIRY', 
  'MEAT',
  'BAKERY',
  'CANNED_GOODS',
  'FROZEN',
  'BEVERAGES',
  'SNACKS',
  'OTHER'
]

export default function SellPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: '',
    originalPrice: '',
    currentPrice: '',
    expiryDate: '',
    location: '',
    images: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Food Item</h1>
          <p className="text-gray-600">Turn your surplus food into income while helping reduce waste</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Item Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Fresh Organic Apples"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item's condition, quality, and any other relevant details..."
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Downtown Market, City Center"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Quantity and Pricing */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Quantity & Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select unit</option>
                  <option value="kg">Kilograms</option>
                  <option value="g">Grams</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                  <option value="ml">Milliliters</option>
                  <option value="bunches">Bunches</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price ($) *
                </label>
                <input
                  type="number"
                  id="currentPrice"
                  name="currentPrice"
                  step="0.01"
                  min="0"
                  required
                  value={formData.currentPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Expiry Information</h2>
            
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                When does this item expire or need to be consumed by?
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="btn-primary">
                    Upload Photos
                  </span>
                  <input id="images" name="images" type="file" className="sr-only" multiple accept="image/*" />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG up to 10MB each. Max 5 photos.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              List Item
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 card bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Better Sales</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Take clear, well-lit photos of your items</li>
            <li>• Be honest about the condition and quality</li>
            <li>• Price competitively based on expiry date</li>
            <li>• Respond quickly to buyer inquiries</li>
            <li>• Offer pickup options to reduce logistics costs</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
