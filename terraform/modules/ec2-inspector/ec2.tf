resource "aws_instance" "instance" {
  count         = 2
  ami           = "ami-01dad14554d9a67f4" # Ubuntu 24.04 LTS
  instance_type = "t2.micro"
  tags = {
    Name = "test-instance-${count.index}"
  }
}
