'use client'

import { TrophyIcon, HeartIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const stats = [
  {
    id: 1,
    name: 'Food Items Saved',
    value: '12,543',
    icon: HeartIcon,
    change: '+15%',
    changeType: 'positive',
  },
  {
    id: 2,
    name: 'CO₂ Emissions Reduced',
    value: '2,847 kg',
    icon: GlobeAltIcon,
    change: '+8%',
    changeType: 'positive',
  },
  {
    id: 3,
    name: 'Money Saved by Users',
    value: '$89,432',
    icon: CurrencyDollarIcon,
    change: '+23%',
    changeType: 'positive',
  },
  {
    id: 4,
    name: 'Community Impact Score',
    value: '9.2/10',
    icon: TrophyIcon,
    change: '+0.3',
    changeType: 'positive',
  },
]

const impactCategories = [
  {
    title: 'Environmental Impact',
    description: 'Reducing food waste helps combat climate change',
    metrics: [
      { label: 'Waste Prevented', value: '15.2 tons' },
      { label: 'Water Saved', value: '2.1M liters' },
      { label: 'Land Preserved', value: '45 hectares' },
    ],
    color: 'bg-green-100 text-green-800',
  },
  {
    title: 'Economic Benefits',
    description: 'Creating value from surplus food',
    metrics: [
      { label: 'Average Savings', value: '65%' },
      { label: 'Revenue Generated', value: '$156K' },
      { label: 'Jobs Supported', value: '23' },
    ],
    color: 'bg-blue-100 text-blue-800',
  },
  {
    title: 'Social Good',
    description: 'Supporting communities in need',
    metrics: [
      { label: 'Families Fed', value: '1,847' },
      { label: 'Donations Made', value: '3,421' },
      { label: 'Volunteers', value: '156' },
    ],
    color: 'bg-purple-100 text-purple-800',
  },
]

export function SustainabilityStats() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Sustainability Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we&apos;re making a real difference in reducing food waste and building a more sustainable future.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.id} className="card text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 mb-4">
                <stat.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600 mb-2">{stat.name}</div>
              <div className="text-sm text-primary-600 font-medium">
                {stat.change} this month
              </div>
            </div>
          ))}
        </div>

        {/* Impact Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {impactCategories.map((category, index) => (
            <div key={index} className="card">
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.title}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              
              <div className="space-y-4">
                {category.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already making a difference. Start buying, selling, or donating today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Start Shopping
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
