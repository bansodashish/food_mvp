# 🌱 Food Surplus Platform

A comprehensive web application designed to reduce food waste through marketplace functionality, donations, and AI-driven sustainability tracking.

## ✨ Features

### 🛒 **Marketplace**
- Browse surplus food items at discounted prices
- Advanced filtering by category, price, location, expiry date
- Real-time availability tracking
- Multi-vendor support

### 💝 **Donation System**
- Food donation requests and fulfillment
- Charity organization integration
- Pickup and delivery coordination
- Impact tracking for donors

### 📊 **Sustainability Analytics**
- AI-powered impact calculations
- CO₂ reduction tracking
- Waste prevention metrics
- Personal and community dashboards
- Monthly sustainability reports

### 💳 **Payment Integration**
- Secure Stripe payment processing
- Multi-party payment splits
- Escrow functionality for secure transactions
- Automated refund handling

### 🚚 **Logistics Management**
- Multi-carrier shipping integration (Shippo API)
- Real-time tracking updates
- Route optimization for deliveries
- Cold chain logistics for perishables

## 🏗️ Architecture

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Headless UI
- **Authentication**: NextAuth.js
- **State Management**: React hooks + Server State

### **Backend**
- **API**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **File Storage**: AWS S3 (configurable)
- **Email**: Configurable email service

### **External Services**
- **Payment**: Stripe
- **AI**: OpenAI API for sustainability insights
- **Shipping**: Shippo API
- **Maps**: Google Maps API
- **Analytics**: Built-in dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd food-surplus-platform
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local` and configure your environment variables:
   ```bash
   cp .env.local .env.local
   ```
   
   Required variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/food_surplus_db"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   OPENAI_API_KEY="sk-..."
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables
- **Users**: Authentication and profile management
- **FoodItems**: Product listings with categories and pricing
- **Transactions**: Purchase records and payment status
- **Donations**: Food donation tracking and fulfillment
- **LogisticsInfo**: Shipping and delivery management
- **SustainabilityMetrics**: Impact tracking and reporting

### User Types
- **Consumer**: Regular users buying discounted food
- **Business**: Food retailers selling surplus inventory
- **Charity**: Organizations receiving donations
- **Admin**: Platform administrators

## 📱 Pages & Features

### 🏠 **Landing Page**
- Hero section with impact statistics
- Featured food items showcase
- Sustainability metrics display
- Newsletter signup

### 🔍 **Browse Page**
- Advanced search and filtering
- Category-based browsing
- Sort by price, expiry, distance
- Interactive item cards

### 🔐 **Authentication**
- Email/password login
- Google OAuth integration
- User registration with profile setup
- Password reset functionality

### 🏪 **Seller Dashboard**
- Item listing management
- Sales analytics
- Inventory tracking
- Sustainability impact reports

### 💰 **Payment Flow**
- Secure checkout process
- Multiple payment methods
- Transaction history
- Automated receipts

## 🤖 AI & Sustainability

### Impact Calculation
- Automated CO₂ reduction estimates
- Food waste prevention tracking
- Water and land resource savings
- Economic impact assessment

### Smart Recommendations
- AI-driven product suggestions
- Demand prediction for sellers
- Optimal pricing recommendations
- Personalized sustainability tips

## 🚚 Logistics Integration

### Shipping Partners
- Multi-carrier rate comparison
- Real-time tracking updates
- Delivery confirmation
- Returns management

### Features
- Pickup scheduling
- Route optimization
- Cold chain compliance
- Delivery notifications

## 🎨 Design System

### Colors
- **Primary**: Green theme for sustainability
- **Secondary**: Yellow accents for energy
- **Neutral**: Gray scale for content

### Components
- Responsive design (mobile-first)
- Accessible UI components
- Consistent spacing and typography
- Interactive states and animations

## 🔒 Security

### Authentication
- Secure session management
- Multi-factor authentication ready
- OAuth integration
- Password security policies

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📈 Performance

### Optimizations
- Next.js automatic code splitting
- Image optimization
- API route caching
- Database query optimization

### Monitoring
- Built-in analytics dashboard
- Error tracking and logging
- Performance metrics
- User behavior insights

## 🌐 Deployment

### Recommended: Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables
Configure all required environment variables in your deployment platform.

### Database Migration
Run database migrations in production:
```bash
npm run db:migrate
```

## 📊 Monitoring & Analytics

### Built-in Dashboard
- Real-time platform statistics
- User engagement metrics
- Sustainability impact tracking
- Revenue and transaction analysis

### Key Metrics
- Food items saved from waste
- CO₂ emissions reduced
- Money saved by users
- Community impact score

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use conventional commit messages
3. Implement proper error handling
4. Write comprehensive tests
5. Ensure accessibility compliance

### Code Style
- ESLint configuration included
- Prettier for code formatting
- Consistent component patterns
- Proper documentation

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Food Items
- `GET /api/items` - List food items (with filters)
- `POST /api/items` - Create new food item
- `GET /api/items/[id]` - Get item details
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - List user transactions
- `GET /api/transactions/[id]` - Get transaction details

### Sustainability
- `GET /api/sustainability/stats` - Get platform stats
- `GET /api/sustainability/user` - Get user impact metrics

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

### Documentation
- Full API documentation
- Component library documentation
- Database schema reference
- Deployment guides

### Community
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Discord community (coming soon)

---

**Built with ❤️ for a more sustainable future** 🌍
