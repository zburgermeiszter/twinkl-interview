module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "8.1.0"

  function_name = "ec2-inspector"
  description   = "EC2 inspector Lambda"
  handler       = "index.handler"
  runtime       = "nodejs22.x"

  create_lambda_function_url = true
  source_path                = var.lambda_build_path

  publish = true

  environment_variables = {
    DYNAMODB_TABLE_NAME = aws_dynamodb_table.ec2_inspector_dynamodb_table.id
  }

  attach_policy_statements = true
  policy_statements = {
    ec2 = {
      effect    = "Allow",
      actions   = ["ec2:DescribeInstances"],
      resources = ["*"]
    },
    dynamodb = {
      effect    = "Allow",
      actions   = ["dynamodb:BatchWriteItem"],
      resources = ["arn:aws:dynamodb:${data.aws_region.current.region}:${data.aws_caller_identity.current.account_id}:table/${aws_dynamodb_table.ec2_inspector_dynamodb_table.id}"]
    },
  }

  tags = {
    Name = "ec2-inspector"
  }
}
