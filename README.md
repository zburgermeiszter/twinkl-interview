# Senior Platform Engineer take-home test @ Twinkl

This repo is deploying a TypeScript Lambda function to AWS using Terraform.  
The Lambda is listing EC2 instances, and saving the list of metadata to EC2.  
The execution is triggered over HTTPS by sending a GET request to an URL.  
The URL is printed at the end of the Terraform apply step.

## Presentation

The requested presentation for Part 2 of the task is available in the `presentation` folder of this repository.

## Streamlined Developer Experience

Terragrunt is used for IaC because it handles Terraform state bucket creation without extra manual deployment.  
It is also splitting the state to limit the blast radius.

Terrarunt is using OpenTofu in the background instead of Terraform due to licensing reasons.

The Lambda is executed (in dev mode), tested and built using `bun` instead of `tsc` which is used only for type-checking.

## Tooling

The project tooling dependencies are managed using [`asdf`](https://asdf-vm.com/) for consistency across environments.  
The dependency versions are defined in the `.tool-versions` file.  
To install them, first install `asdf` and run `asdf install`.

## Lambda

The Lambda function is written in TypeScript, but by default Lambda needs JavaScript code.

### Install node dependencies

Go to `lambda` folder and run `bun install`.

### Development

Uncomment the last line of the `lambda/index.ts` file.  
Run `bun run watch` to run the code and automatically restart on changes.

### Build

To transpile and bundle TypeScript to a single JavaScript file for easy deployment execute `bun run build`, that will emit the output into `lambda/build` path.

## Infrastructure, deployment

On a new AWS account execute `terragrunt backend bootstrap` to create S3 state bucket.

The following step depends on an existing JavaScript artifact in `lambda/build`.

To plan and deploy the infrastructure execute `terragrunt plan` or `terragrunt apply`.

To tear down the resources deployed int the previous step run `terragrunt destroy`

## CI/CD

This repo is using GitHub Actions for CI/CD which authenticates against AWS using OIDC.  
Push to non-`main` branches will trigger a build and plan pipeline.  
For `main` branch automatic deployment is enabled.

## Room for improvements

- Put Lambda behind API Gateway
- Cache Terraform plugins in pipeline
- Push Terraform plan to Pull Requests as a message
- Make infrastructure chart in the presentation more detailed
- Evaluate Atlantis
