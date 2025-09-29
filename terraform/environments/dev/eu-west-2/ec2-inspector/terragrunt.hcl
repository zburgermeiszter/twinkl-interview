include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

terraform {
  source = "${find_in_parent_folders("modules/ec2-inspector")}"
}

inputs = {
  prefix            = "${include.root.locals.aws_account_id}-${include.root.locals.environment}"
  lambda_build_path = "${get_repo_root()}/lambda/build"
}