<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Food Surplus Platform Development Instructions

## Project Overview
This is a Next.js 14 food surplus management platform designed to reduce food waste through marketplace functionality, donations, and sustainability tracking.

## Architecture
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Serverless functions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **Payment**: Stripe integration
- **AI**: OpenAI API for sustainability insights
- **Deployment**: Vercel (recommended)

## Key Features
1. **Marketplace**: Buy/sell surplus food at discounted prices
2. **Donations**: Food donation system with logistics
3. **Sustainability**: AI-driven impact metrics and reporting
4. **Logistics**: Multi-carrier shipping integration
5. **User Management**: Multiple user types (Consumer, Business, Charity, Admin)

## Code Standards
- Use TypeScript with strict mode
- Follow Next.js App Router patterns
- Implement proper error handling with try-catch blocks
- Use Prisma for database operations
- Follow RESTful API design for routes
- Use Tailwind CSS utility classes
- Implement proper form validation with zod
- Use proper accessibility attributes

## Database Schema
- Users: Authentication and profile data
- FoodItems: Product listings with categories, pricing, expiry
- Transactions: Purchase records with payment status
- Donations: Food donation tracking
- LogisticsInfo: Shipping and delivery tracking
- SustainabilityMetrics: Impact calculation and reporting

## API Patterns
- Use NextRequest/NextResponse for API routes
- Implement proper authentication checks
- Return consistent error responses
- Use pagination for list endpoints
- Include proper CORS handling

## Component Structure
- Keep components in `/src/components/`
- Use server components by default, client components when needed
- Implement proper loading and error states
- Use compound component patterns for complex UI

## Security Considerations
- Validate all inputs server-side
- Use environment variables for secrets
- Implement proper session management
- Sanitize user-generated content
- Use HTTPS in production

## Performance
- Optimize images with Next.js Image component
- Implement proper caching strategies
- Use streaming for large data sets
- Implement proper SEO meta tags
