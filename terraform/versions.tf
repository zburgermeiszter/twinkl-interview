terraform {
  required_version = ">= 1.10.6" # OpenTofu version

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
