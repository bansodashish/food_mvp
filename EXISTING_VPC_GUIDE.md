# Using Existing VPC - Deployment Guide

## Overview

Your Terraform configuration has been updated to use your existing VPC `vpc-092ac0f7eaf3d4221` and subnets instead of creating new infrastructure. All configuration files now include the correct subnet IDs and settings.

## Your Existing Infrastructure

✅ **VPC ID**: `vpc-092ac0f7eaf3d4221` (eu-west-1)
✅ **Public Subnets**:
- `subnet-087046bd3d8c5919c` (test-subnet-public1-eu-west-1a)
- `subnet-05acb25890bb95e62` (test-subnet-public2-eu-west-1b)

## Quick Start

### Option 1: For 1,000 Users (Minimal Cost)
```bash
cp terraform/terraform.tfvars.1k-users terraform/terraform.tfvars
```

### Option 2: For 10,000 Users (Optimized Performance)
```bash
cp terraform/terraform.tfvars.10k-users terraform/terraform.tfvars
```

## Required Configuration Updates

Before deploying, edit your `terraform/terraform.tfvars` file and update these values:

### 1. GitHub Repository
```hcl
github_repo_url = "https://github.com/YOUR-USERNAME/YOUR-REPO-NAME"
```

### 2. NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```
Then update:
```hcl
nextauth_secret = "your-generated-secret-here"
```

### 3. Custom Domain (Optional)
```hcl
custom_domain = "yourdomain.com"  # or leave empty ""
```

## Deploy Your Application

```bash
# 1. Navigate to terraform directory
cd terraform

# 2. Initialize Terraform
terraform init

# 3. Review the plan
terraform plan -var-file="terraform.tfvars"

# 4. Deploy
terraform apply -var-file="terraform.tfvars"
```

## What Gets Created

### ✅ New Resources (In Your Existing VPC):
- RDS security group
- RDS subnet group  
- RDS PostgreSQL instance
- AWS Amplify application

### ❌ NOT Created (Uses Existing):
- VPC, subnets, route tables, internet gateway
- NAT gateways (saves costs)

## Configuration Comparison

| Setting | 1K Users | 10K Users |
|---------|----------|-----------|
| **Database** | db.t3.micro | db.t3.medium |
| **Storage** | 20-100GB | 100-500GB |
| **Connections** | 87 max | 200 max |
| **Backups** | 7 days | 14 days |
| **Monitoring** | Basic | Comprehensive |
| **Cost/Month** | $50-95 | $200-350 |

## Network Security

The RDS security group allows:
- **Inbound**: PostgreSQL (5432) from 0.0.0.0/0
- **Outbound**: All traffic

> **Security Note**: For production, consider restricting inbound access to specific CIDR blocks instead of 0.0.0.0/0

## Troubleshooting

### Common Issues:
1. **Region Mismatch**: Ensure AWS CLI region matches `eu-west-1`
2. **Permissions**: Verify AWS credentials can access the existing VPC
3. **Subnet Access**: Ensure subnets have internet gateway access

### Verify Configuration:
```bash
# Check your AWS region
aws configure get region

# Verify VPC exists
aws ec2 describe-vpcs --vpc-ids vpc-092ac0f7eaf3d4221

# Verify subnets exist
aws ec2 describe-subnets --subnet-ids subnet-087046bd3d8c5919c subnet-05acb25890bb95e62
```

## Cost Optimization Benefits

By using your existing VPC:
- 💰 **No VPC costs**: Uses existing infrastructure
- 🚀 **Faster deployment**: Less resources to create
- 🛡️ **Existing security**: Leverages current setup
- 📊 **Simplified networking**: Uses existing routes

## Scaling Path

1. **Start**: Use `terraform.tfvars.1k-users` for minimal cost
2. **Scale**: Switch to `terraform.tfvars.10k-users` when needed
3. **Monitor**: Use CloudWatch metrics to track performance

Your infrastructure is now optimized to use existing AWS resources while providing excellent scalability for your Food Surplus Platform!
