# authing-lambda-auth

This project contains source code for a lambda authorizer for AWS API Gateway, using [Authing.cn](https://authing.cn/) as a replacement for AWS Cognito which is not available in AWS China region.

The project is built using AWS [SAM](https://aws.amazon.com/serverless/sam/) for easier local debugging and deployment for Lambda function.

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```