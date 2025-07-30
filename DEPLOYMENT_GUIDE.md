# AWS Food Surplus Platform Deployment Guide

This guide will help you deploy your Food Surplus Platform to AWS with minimal cost using Terraform and AWS Amplify.

## Architecture Overview

- **Frontend**: Next.js deployed on AWS Amplify (pay-per-use)
- **Database**: PostgreSQL on AWS RDS (db.t3.micro for minimal cost)
- **Infrastructure**: Managed with Terraform
- **Estimated Monthly Cost**: $15-25 USD (depending on usage)

## Prerequisites

Before starting the deployment, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** installed (v1.0+)
4. **GitHub Repository** for your code
5. **Node.js** and **npm** installed locally

## Step 1: Install Required Tools

### Install AWS CLI
```bash
# macOS
brew install awscli

# Configure AWS credentials
aws configure
```

### Install Terraform
```bash
# macOS
brew install terraform
```

## Step 2: Prepare Your Code Repository

1. **Create a GitHub repository** for your Food Surplus Platform
2. **Push your code** to the repository:
   ```bash
   cd food_surplus
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/food-surplus-platform.git
   git push -u origin main
   ```

## Step 3: Configure Terraform Variables

1. **Copy the example variables file**:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars`** with your actual values:
   ```hcl
   # AWS region
   aws_region = "us-east-1"

   # Database configuration
   db_name     = "food_surplus_db"
   db_username = "postgres"

   # Your GitHub repository URL
   github_repo_url = "https://github.com/yourusername/food-surplus-platform"

   # Generate a secure random string for NextAuth
   nextauth_secret = "your-secure-random-string-here"

   # Custom domain (optional)
   custom_domain = ""
   ```

3. **Generate a secure NextAuth secret**:
   ```bash
   openssl rand -base64 32
   ```

## Step 4: Deploy the Infrastructure

### Option A: Automated Deployment (Recommended)

Run the deployment script:
```bash
./deploy.sh deploy
```

### Option B: Manual Deployment

1. **Initialize Terraform**:
   ```bash
   cd terraform
   terraform init
   ```

2. **Plan the deployment**:
   ```bash
   terraform plan -var-file="terraform.tfvars"
   ```

3. **Apply the configuration**:
   ```bash
   terraform apply -var-file="terraform.tfvars"
   ```

## Step 5: Configure GitHub Repository for Amplify

After deployment, you need to connect your GitHub repository to Amplify:

1. **Go to AWS Amplify Console**
2. **Find your app** (it will be created but not connected)
3. **Connect your GitHub repository**
4. **Grant necessary permissions**

Alternatively, you can configure GitHub access token in Terraform by adding:
```hcl
# In terraform/main.tf, add to aws_amplify_app resource:
oauth_token = var.github_token
```

And add the variable to `variables.tf`:
```hcl
variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}
```

## Step 6: Verify Deployment

1. **Check Terraform outputs**:
   ```bash
   cd terraform
   terraform output
   ```

2. **Visit your application URL** (provided in the output)

3. **Monitor the build** in AWS Amplify Console

## Step 7: Database Migration

The database will be automatically created and migrated during the Amplify build process. The build includes:
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database

## Cost Optimization Tips

1. **RDS Instance**: Using `db.t3.micro` (free tier eligible for 12 months)
2. **Amplify**: Pay-per-build and hosting (very low cost for small apps)
3. **VPC**: Using minimal configuration with public subnets only
4. **Storage**: 20GB allocated storage with auto-scaling up to 100GB

## Estimated Monthly Costs

- **RDS db.t3.micro**: $13-15/month (after free tier)
- **Amplify Hosting**: $1-5/month (depending on traffic)
- **Data Transfer**: $1-3/month (minimal for small apps)
- **Total**: ~$15-25/month

## Environment Variables

The following environment variables are automatically configured in Amplify:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXT_PUBLIC_APP_URL`: Public application URL

## Troubleshooting

### Build Failures
1. Check Amplify build logs in AWS Console
2. Ensure all environment variables are set correctly
3. Verify database connectivity

### Database Connection Issues
1. Check RDS security group allows connections
2. Verify DATABASE_URL format
3. Ensure database is publicly accessible

### Custom Domain Setup
1. Add your domain to `terraform.tfvars`
2. Run `terraform apply` again
3. Configure DNS settings as instructed by Amplify

## Cleanup

To destroy all resources and stop incurring costs:
```bash
./deploy.sh destroy
```

Or manually:
```bash
cd terraform
terraform destroy -var-file="terraform.tfvars"
```

## Security Considerations

1. **Database**: Configured with encryption at rest
2. **Secrets**: Stored securely in environment variables
3. **Network**: Public subnets for cost optimization (consider private subnets for production)
4. **Access**: Minimal required permissions

## Next Steps

1. **Set up monitoring** with CloudWatch
2. **Configure backups** (already enabled with 7-day retention)
3. **Add custom domain** if needed
4. **Set up CI/CD** with GitHub Actions (optional)
5. **Configure OAuth providers** for authentication

## Support

For issues with this deployment:
1. Check AWS CloudWatch logs
2. Review Terraform state and outputs
3. Consult AWS Amplify documentation
4. Check PostgreSQL connection and permissions
