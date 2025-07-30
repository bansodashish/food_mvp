terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Random password for database
resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Data source for existing VPC
data "aws_vpc" "existing" {
  count = var.use_existing_vpc ? 1 : 0
  id    = var.existing_vpc_id
}

# Data source for existing subnets
data "aws_subnets" "existing" {
  count = var.use_existing_vpc ? 1 : 0
  filter {
    name   = "vpc-id"
    values = [var.existing_vpc_id]
  }
  filter {
    name   = "subnet-id"
    values = var.existing_subnet_ids
  }
}

# VPC for RDS (minimal setup) - only create if not using existing
resource "aws_vpc" "main" {
  count                = var.use_existing_vpc ? 0 : 1
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "food-surplus-vpc"
  }
}

# Internet Gateway - only create if not using existing
resource "aws_internet_gateway" "main" {
  count  = var.use_existing_vpc ? 0 : 1
  vpc_id = aws_vpc.main[0].id

  tags = {
    Name = "food-surplus-igw"
  }
}

# Public subnets - only create if not using existing
resource "aws_subnet" "public_a" {
  count                   = var.use_existing_vpc ? 0 : 1
  vpc_id                  = aws_vpc.main[0].id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "food-surplus-public-"
  }
}

resource "aws_subnet" "public_b" {
  count                   = var.use_existing_vpc ? 0 : 1
  vpc_id                  = aws_vpc.main[0].id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "food-surplus-public-b"
  }
}

# Route table - only create if not using existing
resource "aws_route_table" "public" {
  count  = var.use_existing_vpc ? 0 : 1
  vpc_id = aws_vpc.main[0].id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main[0].id
  }

  tags = {
    Name = "food-surplus-public-rt"
  }
}

# Route table associations - only create if not using existing
resource "aws_route_table_association" "public_a" {
  count          = var.use_existing_vpc ? 0 : 1
  subnet_id      = aws_subnet.public_a[0].id
  route_table_id = aws_route_table.public[0].id
}

resource "aws_route_table_association" "public_b" {
  count          = var.use_existing_vpc ? 0 : 1
  subnet_id      = aws_subnet.public_b[0].id
  route_table_id = aws_route_table.public[0].id
}

# Local values to determine which VPC and subnets to use
locals {
  vpc_id = var.use_existing_vpc ? data.aws_vpc.existing[0].id : aws_vpc.main[0].id
  subnet_ids = var.use_existing_vpc ? var.existing_subnet_ids : [
    aws_subnet.public_a[0].id,
    aws_subnet.public_b[0].id
  ]
}

# Security group for RDS
resource "aws_security_group" "rds" {
  name_prefix = "food-surplus-rds-"
  vpc_id      = local.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "food-surplus-rds-sg"
  }
}

# DB subnet group
resource "aws_db_subnet_group" "main" {
  name       = "food-surplus-db-subnet-group"
  subnet_ids = local.subnet_ids

  tags = {
    Name = "food-surplus-db-subnet-group"
  }
}

# RDS PostgreSQL instance (minimal configuration for cost optimization)
resource "aws_db_instance" "postgres" {
  identifier = "food-surplus-db"

  engine         = "postgres"
  engine_version = "15.13"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true

  db_name  = var.db_name
  username = "food_surplus_postgres"
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"

  skip_final_snapshot = true
  deletion_protection = false

  publicly_accessible = true

  tags = {
    Name = "food-surplus-postgres"
  }
}

# GitHub repository for Amplify
resource "aws_amplify_app" "main" {
  name       = "food-surplus-platform"
  # Repository will be connected later manually
  # repository = var.github_repo_url

  # Build settings
  build_spec = file("${path.module}/amplify.yml")

  # Environment variables that don't reference the app itself
  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "food_surplus"
    NEXTAUTH_SECRET           = var.nextauth_secret
  }

  # Enable auto branch creation
  enable_auto_branch_creation = false
  enable_branch_auto_build    = true
  enable_branch_auto_deletion = false

  # Platform
  platform = "WEB_COMPUTE"

  tags = {
    Name = "food-surplus-amplify"
  }
}

# Amplify branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"
  
  enable_auto_build = true
  
  tags = {
    Name = "food-surplus-main-branch"
  }
}

# Update environment variables after app is created to avoid self-reference
# We'll use a local-exec provisioner in the aws_amplify_app resource
# to update the environment variables after creation

# Amplify domain (optional)
resource "aws_amplify_domain_association" "main" {
  count       = var.custom_domain != "" ? 1 : 0
  app_id      = aws_amplify_app.main.id
  domain_name = var.custom_domain

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }
}
