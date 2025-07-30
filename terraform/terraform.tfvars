# Configuration using existing VPC and subnets
aws_region = "eu-west-1"

# Use existing infrastructure
use_existing_vpc = true
existing_vpc_id = "vpc-092ac0f7eaf3d4221"
existing_subnet_ids = [
  "subnet-087046bd3d8c5919c",  # test-subnet-public1-eu-west-1a
  "subnet-05acb25890bb95e62"   # test-subnet-public2-eu-west-1b
]

# Database configuration
db_name     = "food_surplus_db"
db_username = "postgres"

# GitHub repository URL
github_repo_url = "https://bitbucket.tools.3stripes.net/scm/~ashish.bansod_adidas.com/aws_food_surplus.git"

# NextAuth secret (generate a secure random string)
nextauth_secret = "generate_a_secure_random_string_for_production"

# Custom domain (optional)
custom_domain = ""

# Scaling configuration - start minimal
enable_optimized_db = false
db_instance_class = "db.t3.micro"
db_allocated_storage = 20
db_max_allocated_storage = 100
max_db_connections = 87
enable_monitoring = true
backup_retention_period = 7
skip_final_snapshot = true
deletion_protection = false
