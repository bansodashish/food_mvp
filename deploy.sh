#!/bin/bash

# AWS Food Surplus Platform Deployment Script
# This script automates the deployment of the Food Surplus Platform to AWS

set -e

echo "🚀 Starting AWS Food Surplus Platform Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_status "Prerequisites check passed!"
}

# Initialize Terraform
init_terraform() {
    print_status "Initializing Terraform..."
    cd terraform
    terraform init
    cd ..
}

# Validate Terraform configuration
validate_terraform() {
    print_status "Validating Terraform configuration..."
    cd terraform
    terraform validate
    cd ..
}

# Plan Terraform deployment
plan_terraform() {
    print_status "Planning Terraform deployment..."
    cd terraform
    terraform plan -var-file="terraform.tfvars"
    cd ..
}

# Apply Terraform configuration
apply_terraform() {
    print_status "Applying Terraform configuration..."
    cd terraform
    terraform apply -auto-approve -var-file="terraform.tfvars"
    cd ..
}

# Get outputs from Terraform
get_outputs() {
    print_status "Getting deployment outputs..."
    cd terraform
    
    AMPLIFY_URL=$(terraform output -raw amplify_app_url)
    DATABASE_URL=$(terraform output -raw database_url)
    APP_ID=$(terraform output -raw amplify_app_id)
    
    print_status "Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "🌐 Application URL: $AMPLIFY_URL"
    echo "📊 Amplify App ID: $APP_ID"
    echo "🗄️  Database configured and connected"
    echo ""
    echo "🔗 Next steps:"
    echo "1. Push your code to the configured GitHub repository"
    echo "2. Amplify will automatically build and deploy your application"
    echo "3. Visit the Application URL to see your deployed app"
    
    cd ..
}

# Main deployment function
deploy() {
    check_prerequisites
    init_terraform
    validate_terraform
    
    # Ask for confirmation before applying
    echo ""
    print_warning "This will create AWS resources that may incur costs."
    read -p "Do you want to continue with the deployment? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        plan_terraform
        apply_terraform
        get_outputs
    else
        print_status "Deployment cancelled."
        exit 0
    fi
}

# Destroy infrastructure
destroy() {
    print_warning "This will destroy all AWS resources created by Terraform."
    read -p "Are you sure you want to destroy the infrastructure? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Destroying infrastructure..."
        cd terraform
        terraform destroy -auto-approve -var-file="terraform.tfvars"
        cd ..
        print_status "Infrastructure destroyed successfully!"
    else
        print_status "Destroy cancelled."
    fi
}

# Help function
show_help() {
    echo "AWS Food Surplus Platform Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy the infrastructure and application"
    echo "  destroy   Destroy the infrastructure"
    echo "  help      Show this help message"
    echo ""
}

# Main script logic
case "${1:-}" in
    deploy)
        deploy
        ;;
    destroy)
        destroy
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Invalid command. Use 'help' to see available commands."
        exit 1
        ;;
esac
