output "amplify_app_url" {
  description = "Amplify app URL"
  value       = "https://main.${aws_amplify_app.main.id}.amplifyapp.com"
}

output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "database_url" {
  description = "Complete database connection URL"
  value       = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.postgres.endpoint}/${var.db_name}?schema=public"
  sensitive   = true
}

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.main.id
}

output "db_password" {
  description = "Database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "vpc_id" {
  description = "VPC ID being used"
  value       = local.vpc_id
}

output "subnet_ids" {
  description = "Subnet IDs being used"
  value       = local.subnet_ids
}

output "infrastructure_type" {
  description = "Whether using existing or new infrastructure"
  value       = var.use_existing_vpc ? "existing" : "new"
}
