variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "food_surplus_db"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
}

variable "nextauth_secret" {
  description = "NextAuth secret key - set via TF_VAR_nextauth_secret environment variable"
  type        = string
  sensitive   = true
}

variable "custom_domain" {
  description = "Custom domain name (optional)"
  type        = string
  default     = ""
}

# Existing infrastructure variables
variable "existing_vpc_id" {
  description = "ID of existing VPC to use"
  type        = string
  default     = ""
}

variable "existing_subnet_ids" {
  description = "List of existing subnet IDs to use for RDS"
  type        = list(string)
  default     = []
}

variable "use_existing_vpc" {
  description = "Whether to use existing VPC and subnets"
  type        = bool
  default     = false
}

# Scaling and optimization variables
variable "enable_optimized_db" {
  description = "Enable optimized database configuration for higher scale"
  type        = bool
  default     = false
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for database"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for database auto-scaling"
  type        = number
  default     = 100
}

variable "max_db_connections" {
  description = "Maximum database connections"
  type        = number
  default     = 100
}

variable "backup_retention_period" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on database deletion"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection for database"
  type        = bool
  default     = false
}

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring and alarms"
  type        = bool
  default     = false
}
