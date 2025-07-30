#!/bin/bash

# Pre-deployment checklist script
# Run this before deploying to ensure everything is configured correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}===================================================${NC}"
    echo -e "${BLUE}  Food Surplus Platform - Pre-Deployment Check${NC}"
    echo -e "${BLUE}===================================================${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_tools() {
    echo "Checking required tools..."
    
    if command -v aws &> /dev/null; then
        AWS_VERSION=$(aws --version 2>&1 | cut -d/ -f2 | cut -d' ' -f1)
        print_status "AWS CLI installed (version: $AWS_VERSION)"
    else
        print_error "AWS CLI not installed"
        echo "  Install with: brew install awscli"
        return 1
    fi
    
    if command -v terraform &> /dev/null; then
        TF_VERSION=$(terraform version | head -n1 | cut -d' ' -f2)
        print_status "Terraform installed (version: $TF_VERSION)"
    else
        print_error "Terraform not installed"
        echo "  Install with: brew install terraform"
        return 1
    fi
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js installed (version: $NODE_VERSION)"
    else
        print_error "Node.js not installed"
        echo "  Install with: brew install node"
        return 1
    fi
    
    if command -v git &> /dev/null; then
        print_status "Git installed"
    else
        print_error "Git not installed"
        return 1
    fi
}

check_aws_credentials() {
    echo ""
    echo "Checking AWS credentials..."
    
    if aws sts get-caller-identity &> /dev/null; then
        AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        AWS_USER=$(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f2)
        AWS_REGION=$(aws configure get region)
        print_status "AWS credentials configured"
        print_info "Account: $AWS_ACCOUNT"
        print_info "User/Role: $AWS_USER"
        print_info "Region: ${AWS_REGION:-'Not set (will use us-east-1)'}"
    else
        print_error "AWS credentials not configured"
        echo "  Run: aws configure"
        return 1
    fi
}

check_terraform_config() {
    echo ""
    echo "Checking Terraform configuration..."
    
    if [ -f "terraform/terraform.tfvars" ]; then
        print_status "terraform.tfvars file exists"
        
        # Check required variables
        if grep -q "github_repo_url.*=" terraform/terraform.tfvars; then
            REPO_URL=$(grep "github_repo_url" terraform/terraform.tfvars | cut -d'"' -f2)
            if [[ $REPO_URL == *"yourusername"* ]] || [[ $REPO_URL == *"your-repo"* ]]; then
                print_warning "GitHub repository URL appears to be placeholder"
                print_info "Update github_repo_url in terraform/terraform.tfvars"
            else
                print_status "GitHub repository URL configured"
            fi
        else
            print_error "github_repo_url not found in terraform.tfvars"
        fi
        
        if grep -q "nextauth_secret.*=" terraform/terraform.tfvars; then
            SECRET=$(grep "nextauth_secret" terraform/terraform.tfvars | cut -d'"' -f2)
            if [[ $SECRET == *"your-secure"* ]] || [[ ${#SECRET} -lt 32 ]]; then
                print_warning "NextAuth secret appears to be weak or placeholder"
                print_info "Generate secure secret with: openssl rand -base64 32"
            else
                print_status "NextAuth secret configured"
            fi
        else
            print_error "nextauth_secret not found in terraform.tfvars"
        fi
        
    else
        print_error "terraform/terraform.tfvars file not found"
        echo "  Copy from: cp terraform/terraform.tfvars.example terraform/terraform.tfvars"
        return 1
    fi
}

check_github_repo() {
    echo ""
    echo "Checking GitHub repository..."
    
    if [ -d "food_surplus/.git" ]; then
        print_status "Git repository initialized"
        
        cd food_surplus
        if git remote get-url origin &> /dev/null; then
            ORIGIN_URL=$(git remote get-url origin)
            print_status "Git remote origin configured: $ORIGIN_URL"
            
            # Check if there are commits
            if git log --oneline -1 &> /dev/null; then
                print_status "Repository has commits"
            else
                print_warning "Repository has no commits"
                print_info "Make initial commit: git add . && git commit -m 'Initial commit'"
            fi
        else
            print_warning "Git remote origin not configured"
            print_info "Add remote: git remote add origin <your-github-repo-url>"
        fi
        cd ..
    else
        print_warning "Git repository not initialized in food_surplus/"
        print_info "Initialize with: cd food_surplus && git init"
    fi
}

check_application() {
    echo ""
    echo "Checking application configuration..."
    
    if [ -f "food_surplus/package.json" ]; then
        print_status "package.json exists"
    else
        print_error "package.json not found in food_surplus/"
        return 1
    fi
    
    if [ -f "food_surplus/prisma/schema.prisma" ]; then
        print_status "Prisma schema exists"
    else
        print_error "Prisma schema not found"
        return 1
    fi
    
    if [ -f "food_surplus/amplify.yml" ]; then
        print_status "Amplify build configuration exists"
    else
        print_warning "amplify.yml not found in food_surplus/"
        print_info "This file should be created during deployment"
    fi
    
    if [ -f "food_surplus/.env.example" ]; then
        print_status "Environment variables example exists"
    else
        print_warning ".env.example not found"
    fi
}

estimate_costs() {
    echo ""
    echo "💰 Estimated monthly costs:"
    echo "  - RDS db.t3.micro: \$13-15 (after free tier expires)"
    echo "  - AWS Amplify hosting: \$1-5 (depends on usage)"
    echo "  - Data transfer: \$1-3"
    echo "  - Total estimated: \$15-25/month"
    echo ""
    print_info "Free tier includes 12 months of db.t3.micro RDS instances"
}

show_next_steps() {
    echo ""
    echo "🚀 Ready to deploy! Next steps:"
    echo ""
    echo "1. Review your terraform.tfvars configuration"
    echo "2. Ensure your GitHub repository is up to date"
    echo "3. Run the deployment:"
    echo "   ./deploy.sh deploy"
    echo ""
    echo "4. After deployment, connect your GitHub repo to Amplify"
    echo "5. Monitor the build process in AWS Amplify Console"
    echo ""
}

# Main execution
main() {
    print_header
    
    local checks_passed=0
    local total_checks=5
    
    if check_tools; then
        ((checks_passed++))
    fi
    
    if check_aws_credentials; then
        ((checks_passed++))
    fi
    
    if check_terraform_config; then
        ((checks_passed++))
    fi
    
    if check_github_repo; then
        ((checks_passed++))
    fi
    
    if check_application; then
        ((checks_passed++))
    fi
    
    echo ""
    echo "===================================================="
    echo "Pre-deployment check complete: $checks_passed/$total_checks checks passed"
    
    if [ $checks_passed -eq $total_checks ]; then
        print_status "All checks passed! Ready for deployment."
        estimate_costs
        show_next_steps
    else
        print_warning "Some checks failed. Please address the issues above before deploying."
        echo ""
        echo "For help, see: DEPLOYMENT_GUIDE.md"
    fi
    
    echo "===================================================="
}

main "$@"
