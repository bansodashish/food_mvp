# Application Optimizations for Scaling to 1000-10000 Users

## Database Connection Pooling

Create a new file: `food_surplus/src/lib/db-pool.ts`

```typescript
import { Pool } from 'pg'

// Parse the database URL
const databaseUrl = process.env.DATABASE_URL!

const pool = new Pool({
  connectionString: databaseUrl,
  // Connection pool settings for scale
  max: process.env.NODE_ENV === 'production' ? 20 : 5, // Maximum connections
  min: 2, // Minimum connections to maintain
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  connectionTimeoutMillis: 2000, // 2 seconds connection timeout
  acquireTimeoutMillis: 60000, // 60 seconds acquire timeout
})

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end()
})

process.on('SIGTERM', () => {
  pool.end()
})

export default pool
```

## Optimized Prisma Configuration

Update `food_surplus/src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasourceUrl: process.env.DATABASE_URL,
})

// Connection pool configuration for production
if (process.env.NODE_ENV === 'production') {
  prisma.$connect()
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Next.js Configuration Updates

Update `food_surplus/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize images for performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  serverExternalPackages: ['@prisma/client'],
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    },
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## API Route Optimizations

Create `food_surplus/src/lib/api-utils.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting helper
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 100, window: number = 60000) {
  const now = Date.now()
  const windowStart = now - window
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  
  // Remove old requests outside the window
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  
  return true
}

// API response wrapper with caching headers
export function apiResponse(data: any, options: {
  cache?: number
  status?: number
} = {}) {
  const { cache = 0, status = 200 } = options
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (cache > 0) {
    headers['Cache-Control'] = `public, max-age=${cache}, s-maxage=${cache}`
  } else {
    headers['Cache-Control'] = 'no-store, max-age=0'
  }
  
  return NextResponse.json(data, { status, headers })
}

// Error handler
export function handleApiError(error: any) {
  console.error('API Error:', error)
  
  if (error.code === 'P2002') {
    return apiResponse(
      { error: 'Duplicate entry' },
      { status: 409 }
    )
  }
  
  return apiResponse(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

## Database Indexes for Performance

Add these to your Prisma schema (`food_surplus/prisma/schema.prisma`):

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  items    Item[]
  orders   Order[]

  @@index([email])
  @@index([createdAt])
}

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Float
  category    String
  location    String
  imageUrl    String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  expiryDate  DateTime?
  isAvailable Boolean  @default(true)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]

  // Performance indexes
  @@index([userId])
  @@index([category])
  @@index([location])
  @@index([createdAt])
  @@index([expiryDate])
  @@index([isAvailable])
  @@index([category, location])
  @@index([isAvailable, expiryDate])
}

model Order {
  id        String   @id @default(cuid())
  userId    String
  total     Float
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items OrderItem[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

## Caching Strategy

Create `food_surplus/src/lib/cache.ts`:

```typescript
// Simple in-memory cache for API responses
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>()

  set(key: string, data: any, ttl: number = 300) { // 5 minutes default
    const expires = Date.now() + (ttl * 1000)
    this.cache.set(key, { data, expires })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

export const cache = new SimpleCache()

// Cache decorator for API functions
export function withCache(key: string, ttl: number = 300) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`
      
      let result = cache.get(cacheKey)
      if (result) {
        return result
      }

      result = await method.apply(this, args)
      cache.set(cacheKey, result, ttl)
      
      return result
    }
  }
}
```

## Environment Variables for Production

Add to `food_surplus/.env.production`:

```env
# Database
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/food_surplus_db?schema=public&connection_limit=20&pool_timeout=20"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"

# Performance
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED=1

# Logging
LOG_LEVEL="error"

# Rate limiting
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000
```

## Monitoring and Observability

Create `food_surplus/src/lib/monitoring.ts`:

```typescript
// Simple performance monitoring
export class PerformanceMonitor {
  static logDatabaseQuery(query: string, duration: number) {
    if (duration > 1000) { // Log slow queries > 1s
      console.warn(`Slow database query: ${query} took ${duration}ms`)
    }
  }

  static logApiRequest(path: string, method: string, duration: number, status: number) {
    if (duration > 3000) { // Log slow API requests > 3s
      console.warn(`Slow API request: ${method} ${path} took ${duration}ms, status: ${status}`)
    }
  }

  static logError(error: Error, context?: any) {
    console.error('Application error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

// Middleware for API route monitoring
export function withMonitoring(handler: any) {
  return async (req: any, res: any) => {
    const start = Date.now()
    
    try {
      const result = await handler(req, res)
      const duration = Date.now() - start
      
      PerformanceMonitor.logApiRequest(
        req.url,
        req.method,
        duration,
        res.statusCode
      )
      
      return result
    } catch (error) {
      PerformanceMonitor.logError(error as Error, {
        url: req.url,
        method: req.method,
        userAgent: req.headers['user-agent'],
      })
      throw error
    }
  }
}
```

## Package.json Updates

Add these dependencies for production scaling:

```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "@types/pg": "^8.10.9"
  },
  "scripts": {
    "build:analyze": "ANALYZE=true npm run build",
    "db:migrate:prod": "npx prisma migrate deploy",
    "db:seed": "npx prisma db seed",
    "start:prod": "NODE_ENV=production npm start"
  }
}
```

These optimizations will help your application handle 1000-10000 users efficiently while keeping costs manageable.
