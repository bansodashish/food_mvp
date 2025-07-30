#!/bin/bash

# Secure deployment script that sets up environment variables
# This keeps secrets out of git while making them available locally

echo "🔐 Setting up secure environment variables for deployment..."

# Generate a new random NextAuth secret
echo "🔑 Generating a new random NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Export as Terraform environment variable
export TF_VAR_nextauth_secret="$NEXTAUTH_SECRET"

echo "✅ Environment variables set up successfully!"
echo "✅ Generated new secure random NextAuth secret"
echo ""
echo "📋 You can now run terraform commands:"
echo "   cd terraform"
echo "   terraform init"
echo "   terraform plan"
echo "   terraform apply"
echo ""
echo "🔒 The NextAuth secret is set as an environment variable and won't be committed to git"
echo ""

# Optional: Show the commands to run
read -p "Do you want to automatically run terraform apply? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd terraform
    echo "🚀 Running terraform apply..."
    terraform init
    terraform apply -var-file="terraform.tfvars.1k-users"
else
    echo "💡 Run the following commands manually:"
    echo "   export TF_VAR_nextauth_secret=\"$NEXTAUTH_SECRET\""
    echo "   cd terraform"
    echo "   terraform apply -var-file=\"terraform.tfvars.1k-users\""
fi

# Remind about security best practices
echo ""
echo "⚠️ Security reminder: This script generates a new secret each time it runs."
echo "🔒 For production, consider rotating this secret periodically."
