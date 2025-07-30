# Optimized Terraform configuration for 1000-10000 users
# This configuration includes CloudFront, RDS optimization, and monitoring

# CloudFront distribution for CDN
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = replace(aws_amplify_app.main.default_domain, "https://", "")
    origin_id   = "amplify-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "amplify-origin"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Host", "CloudFront-Forwarded-Proto"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  # Cache behavior for API routes
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "amplify-origin"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "amplify-origin"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 31536000
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  price_class = "PriceClass_100"  # Use only US, Canada, Europe edge locations

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "food-surplus-cdn"
  }
}

# RDS instance optimized for higher load
resource "aws_db_instance" "postgres_optimized" {
  count      = var.enable_optimized_db ? 1 : 0
  identifier = "food-surplus-db-optimized"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_encrypted     = true
  storage_type          = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  # Optimized backup settings
  backup_retention_period = var.backup_retention_period
  backup_window          = "03:00-04:00"
  maintenance_window     = "Sun:04:00-Sun:05:00"

  # Performance insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring[0].arn

  # Connection and performance parameters
  parameter_group_name = aws_db_parameter_group.postgres_optimized[0].name

  skip_final_snapshot = var.skip_final_snapshot
  deletion_protection = var.deletion_protection

  publicly_accessible = true

  tags = {
    Name = "food-surplus-postgres-optimized"
  }
}

# RDS Parameter Group for optimization
resource "aws_db_parameter_group" "postgres_optimized" {
  count  = var.enable_optimized_db ? 1 : 0
  family = "postgres15"
  name   = "food-surplus-postgres-params"

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "max_connections"
    value = var.max_db_connections
  }

  parameter {
    name  = "work_mem"
    value = "4MB"
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "64MB"
  }

  parameter {
    name  = "effective_cache_size"
    value = "256MB"
  }

  tags = {
    Name = "food-surplus-postgres-params"
  }
}

# IAM role for RDS monitoring
resource "aws_iam_role" "rds_monitoring" {
  count = var.enable_optimized_db ? 1 : 0
  name  = "rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.enable_optimized_db ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# CloudWatch alarms for monitoring
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "food-surplus-db-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors db cpu utilization"

  dimensions = {
    DBInstanceIdentifier = var.enable_optimized_db ? aws_db_instance.postgres_optimized[0].id : aws_db_instance.postgres.id
  }
}

resource "aws_cloudwatch_metric_alarm" "database_connections" {
  count               = var.enable_monitoring ? 1 : 0
  alarm_name          = "food-surplus-db-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "120"
  statistic           = "Average"
  threshold           = var.max_db_connections * 0.8
  alarm_description   = "This metric monitors db connections"

  dimensions = {
    DBInstanceIdentifier = var.enable_optimized_db ? aws_db_instance.postgres_optimized[0].id : aws_db_instance.postgres.id
  }
}
