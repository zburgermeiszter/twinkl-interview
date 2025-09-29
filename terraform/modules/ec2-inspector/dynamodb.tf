resource "aws_dynamodb_table" "ec2_inspector_dynamodb_table" {
  name = "${var.prefix}-ec2-inspector"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "InstanceId"

  attribute {
    name = "InstanceId"
    type = "S"
  }

  tags = {
    Name = "${var.prefix}-ec2-inspector"
  }
}
