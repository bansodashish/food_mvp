'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Transform Surplus Into
              <span className="text-primary-600"> Sustainability</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-8">
              Connect with food sellers and buyers to reduce waste, save money, and build a more sustainable future. 
              Every purchase makes a difference.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="btn-primary inline-flex items-center justify-center px-6 py-3 text-lg"
              >
                Browse Items
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/sell"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-lg"
              >
                Start Selling
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Items Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500T</div>
                <div className="text-sm text-gray-600">CO₂ Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">2K+</div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 lg:col-span-6 lg:mt-0">
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-2xl bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
                  alt="Fresh fruits and vegetables"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-400 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-400 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
