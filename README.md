# 🍃 Food Surplus Platform - AWS Deployment

A complete Next.js application for reducing food waste, deployed on AWS with minimal cost infrastructure.

## 📁 Project Structure

```
aws_testing_surplus/
├── food_surplus/           # Next.js application
│   ├── src/                # Application source code
│   ├── prisma/             # Database schema
│   ├── package.json        # Dependencies
│   └── amplify.yml         # Amplify build configuration
├── terraform/              # Infrastructure as Code
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Input variables
│   ├── outputs.tf          # Output values
│   ├── amplify.yml         # Amplify build spec
│   └── terraform.tfvars.example
├── deploy.sh               # Automated deployment script
├── secure-deploy.sh        # Secure deployment with env vars
├── setup-secrets.sh        # AWS Secrets Manager setup
├── .env.terraform.example  # Environment variables template
├── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
└── README.md              # This file
```

## 🚀 Quick Start Deployment

### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Terraform >= 1.0 installed
- GitHub repository for your code
- Node.js and npm installed

### 1-Minute Deployment (Secure Method)

1. **Clone and setup**:
   ```bash
   # Navigate to your project directory
   cd aws_testing_surplus
   
   # Make deployment scripts executable
   chmod +x deploy.sh
   chmod +x secure-deploy.sh
   ```

2. **Configure Terraform**:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values (secrets will be handled separately)
   ```

3. **Secure Deployment** (Recommended):
   ```bash
   # This keeps secrets out of git while making them available locally
   ./secure-deploy.sh
   ```

   **OR Manual Approach**:
   ```bash
   # Set environment variable for NextAuth secret
   export TF_VAR_nextauth_secret="$(openssl rand -base64 32)"
   
   # Deploy
   cd terraform
   terraform apply -var-file="terraform.tfvars.1k-users"
   ```

That's it! Your application will be deployed to AWS with secure credential management.

## 🏗️ Infrastructure Components

### AWS Services Used
- **AWS Amplify**: Frontend hosting and CI/CD
- **Amazon RDS**: PostgreSQL database (db.t3.micro)
- **Amazon VPC**: Network isolation
- **AWS Security Groups**: Network security

### Cost Optimization
- Using AWS Free Tier eligible services where possible
- Minimal RDS instance (db.t3.micro)
- Public subnets to avoid NAT Gateway costs
- Pay-per-use Amplify hosting

### Estimated Monthly Costs
- **RDS**: $13-15/month (after free tier)
- **Amplify**: $1-5/month
- **Data Transfer**: $1-3/month
- **Total**: ~$15-25/month

## 🔧 Configuration

### Required Environment Variables
The following are automatically configured during deployment:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://your-app.amplifyapp.com
NEXTAUTH_SECRET=automatically-set-via-environment-variable
NEXT_PUBLIC_APP_URL=https://your-app.amplifyapp.com
```

### Secure Credential Management

**🔒 Security Best Practice**: Credentials are managed securely and never committed to git.

#### Method 1: Environment Variables (Recommended)
```bash
# Generate a secure NextAuth secret
export TF_VAR_nextauth_secret="$(openssl rand -base64 32)"

# Deploy with terraform
cd terraform
terraform apply -var-file="terraform.tfvars.1k-users"
```

#### Method 2: Use Template File
```bash
# Copy environment template
cp .env.terraform.example .env.terraform.local

# Edit the file with your secrets (this file is gitignored)
# Then source it before deployment:
source .env.terraform.local
```

#### Method 3: AWS Secrets Manager (Advanced)
```bash
# Create secret in AWS Secrets Manager first
./setup-secrets.sh

# Then modify terraform to use Secrets Manager data source
```

### Optional OAuth Configuration
To enable Google OAuth, add to your environment or Amplify environment variables:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**How to get Google OAuth credentials**: See [Google OAuth Setup Guide](#google-oauth-setup) below.

## 📋 Features

- **User Authentication**: NextAuth.js with Google OAuth and credentials
- **Database**: PostgreSQL with Prisma ORM
- **Responsive Design**: Tailwind CSS
- **API Routes**: Next.js API endpoints
- **Type Safety**: Full TypeScript support
- **Database Migrations**: Automatic with Prisma

## 🛠️ Development Workflow

### Local Development
```bash
cd food_surplus
npm install
npm run dev
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

### Deployment Process
1. Push code to GitHub
2. Amplify automatically builds and deploys
3. Database migrations run during build
4. Application is live at your Amplify URL

## 📊 Monitoring and Maintenance

### Logs and Monitoring
- **Amplify Build Logs**: AWS Amplify Console
- **Application Logs**: CloudWatch (via Amplify)
- **Database Metrics**: RDS Console

### Backup and Recovery
- **Database**: Automated daily backups (7-day retention)
- **Code**: Version controlled in GitHub
- **Infrastructure**: Terraform state management

## 🔒 Security Features

- **Database Encryption**: At rest and in transit
- **HTTPS**: Enforced by Amplify
- **Environment Variables**: Securely stored and managed
- **VPC**: Network isolation for database
- **IAM**: Least privilege access
- **Credential Management**: Secrets kept out of version control
- **Environment Variable Isolation**: TF_VAR_* pattern for secure secret passing

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Amplify build logs
   - Verify environment variables are set
   - Ensure database connectivity

2. **Database Connection**:
   - Check security group rules
   - Verify DATABASE_URL format
   - Ensure RDS instance is running

3. **Authentication Issues**:
   - Verify NEXTAUTH_SECRET is set via environment variable
   - Check OAuth provider configuration
   - Ensure NEXTAUTH_URL matches your domain

4. **Missing Environment Variables**:
   ```bash
   # Check if NextAuth secret is set
   echo $TF_VAR_nextauth_secret
   
   # If empty, set it:
   export TF_VAR_nextauth_secret="$(openssl rand -base64 32)"
   ```

5. **Terraform Variable Errors**:
   ```bash
   # If you get "No declaration found for var.nextauth_secret"
   # Make sure you're using environment variables:
   export TF_VAR_nextauth_secret="your-secret"
   
   # Or use -var flag:
   terraform apply -var="nextauth_secret=your-secret"
   ```

### Debug Commands
```bash
# Check Terraform state
terraform show

# View Terraform outputs (sensitive values hidden)
terraform output

# Validate Terraform configuration
terraform validate

# Plan infrastructure changes
terraform plan

# Check environment variables
env | grep TF_VAR
```

## 🔄 CI/CD Pipeline

The deployment uses AWS Amplify's built-in CI/CD:

1. **Code Push**: Push to GitHub main branch
2. **Build Trigger**: Amplify automatically starts build
3. **Build Process**:
   - Install dependencies (`npm ci`)
   - Generate Prisma client (`npx prisma generate`)
   - Run database migrations (`npx prisma db push`)
   - Build Next.js application (`npm run build`)
4. **Deploy**: Automatic deployment to Amplify hosting

## 📈 Scaling Considerations

### When to Scale Up
- **Database**: Monitor CPU and connection metrics
- **Hosting**: Amplify scales automatically
- **Storage**: RDS auto-scaling configured (20GB → 100GB)

### Upgrade Paths
1. **Database**: Upgrade to larger RDS instance
2. **Network**: Move to private subnets with NAT Gateway
3. **CDN**: Add CloudFront distribution
4. **Monitoring**: Add detailed CloudWatch monitoring

## 🧹 Cleanup

To avoid ongoing costs, destroy the infrastructure when not needed:

```bash
./deploy.sh destroy
```

This will remove all AWS resources created by Terraform.

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Food Surplus Platform"
3. Enable Google+ API and Google People API

### Step 2: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in app information:
   - **App name**: Food Surplus Platform
   - **User support email**: Your email
   - **Developer contact email**: Your email

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.amplifyapp.com/api/auth/callback/google`

### Step 4: Secure Credential Storage
**Never commit OAuth credentials to git!** Use environment variables:

```bash
# Add to your .env.terraform.local file
export TF_VAR_google_client_id="your-client-id.apps.googleusercontent.com"
export TF_VAR_google_client_secret="GOCSPX-your-client-secret"
```

Or set directly in Amplify Console under Environment Variables.

## 🛡️ Security Best Practices

### Credential Management
- ✅ Use environment variables for all secrets
- ✅ Never commit `.env` files or credentials to git
- ✅ Use different credentials for dev/staging/production
- ✅ Rotate secrets regularly
- ✅ Use AWS Secrets Manager for production environments

### File Security
- ✅ `.gitignore` configured to exclude sensitive files
- ✅ Use `TF_VAR_*` pattern for Terraform secrets
- ✅ Template files (`.example`) for team collaboration
- ✅ Local-only credential files (`.local` suffix)

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

For detailed step-by-step instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
