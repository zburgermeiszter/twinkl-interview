data "aws_ami" "this" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "architecture"
    values = ["arm64"]
  }
  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
}

resource "aws_instance" "instance" {
  count         = 2
  ami           = data.aws_ami.this.id
  instance_type = "t4g.nano"
  tags = {
    Name = "test-instance-${count.index}"
  }
}
