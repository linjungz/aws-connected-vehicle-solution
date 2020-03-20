# AWS Connected Vehicle Solution for AWS China Region
The AWS Connected Vehicle Solution is a reference implementation that provides a foundation for automotive product transformations for connected vehicle services, autonomous driving, electric powertrains, and shared mobility.

This project is to migrate the solution to AWS China Region. As some services such as AWS Cognito, Kinesis Analytics are not available in China region, this project will remove the dependancy on these serives and use 3rd party solutions (either open source or SaaS) to replace them. For exmaple, [Authing.cn](https://authing.cn) is leveraged to replace AWS Cognito user pool, for demo purpose. Note that this solution is not tighted to Authing and you may choose [Auth0](https://auth0.com) or other authentication service you like.

## Getting Started
To get started with the AWS Connected Vehicle Solution, please review the solution documentation. https://aws.amazon.com/answers/iot/connected-vehicle-solution/

Detailed information about deploying this solutuion in AWS China region is documented here. Deploying the solution in AWS Global Region could be checked in this [repo](https://github.com/awslabs/aws-connected-vehicle-solution) from which this project forked.

## Instructions on Deployment in AWS China Region 

### 1. Deploy Connected Vehicle Solution ( without Authorizer for API Gateway )

Use following link to deploy the solution with a modified Cloudformation template. Currently only Beijing Region(cn-north-1) is supported. Ningxia Region will be supported as well when the solution is finalized.

[![](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.amazonaws.cn/cloudformation/home?region=cn-north-1#/stacks/quickcreate?templateUrl=https%3A%2F%2Flinjungz-cvra2cn-cn-north-1.s3.cn-north-1.amazonaws.com.cn%2Faws-connected-vehicle-solution-cn.template&stackName=CVRA2-cn)

You could find the template [here](deployment/aws-connected-vehicle-solution-cn.template).

### 2. Deploy a Lambda Authorizer for API Gateway using Authing

#### 2.1 Deploy Lambda function
You could leverage this [repo](https://github.com/linjungz/authing-Lambda-auth) for deploying a Lambda function that would be used as a token-based Lambda authorizer for API Gateway in Connected Vehicle Solution. You could leverage [SAM](https://aws.amazon.com/serverless/sam/) for deploying the Lambda function to AWS China region 

If you choose other authentication service such as Auth0, you need to modify the lambda function for validate the token. Kindly refer to the [sample code](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html) for lambda authorizer in AWS documentation.

#### 2.2 Create Lambda Authorizer for API Gateway

In AWS Console locate the API Gateway "Vehicle Services API" that's created in Step 1 and [create a lambda authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html). Create a lambda authorizer which would use the Lambda function we created in Step 2.1. Here's the configuration:

<img src="pic/create_authorizer.jpg" width=400 align=center>

And change each Method Request to use the Lambda authorizer: 

<img src="pic/change_method_request.jpg" width=400 align=center>

#### 2.3 Change APP Secret for Authing

Authing.cn is ID as a service which I leverage as a authorization service and JWT token would be sent to Lambda authorizer for validation. You could apply a free Authing.cn account and create a OIDC application for test. Kindly refer to these two links for [OIDC](https://authing.cn/blog/5-%E5%88%86%E9%92%9F%E7%90%86%E8%A7%A3%E4%BB%80%E4%B9%88%E6%98%AF-OIDC/) and [Authing configuration](https://blog.csdn.net/chidongzhou7494/article/details/101003055). 

App Secret is stored in Lambda function environment varaible and you could change it to your app secret for Authing.

## 3. Testing Vehicle Service API

### 3.1 Authenticate using Authing.cn and Get JWT Token

Log in to Authing.cn to get JWT token. You may use [this link](https://cvra-cn-demo.authing.cn/oauth/oidc/auth?client_id=5e73faf67f905cbef09a1bb0&redirect_uri=https://authing.cn/guide/oidc/callback&scope=openid%20profile&response_type=id_token%20token&state=jacket ) for demostration purpose without creating a Authing account. ([Contact me](mailto:linjungz@amazon.com) for username and password)

The redirect url shown in the browser address bar contains the JWT token(id_token). Save it for furture API request as a token. Kindly check [this link](https://docs.authing.cn/authing/advanced/verify-jwt-token) for further information.

### 3.2 [Optional] Validate JWT Token in API Gateway

As a test, you could validate the JWT token in API Gateway:

<img src="pic/test_token.jpg" width=400 align=center>

If the token is valid, you would get a 200 response and policy document which would allow API Gateway to invoke the lambda function for vehicle service.

<img src="pic/token_valid.jpg" width=400 align=center>

### 3.3 Use curl to Send Request to API Gateway

As token is needed for API request authorization, you would need curl to send the request with token in header to API Gateway. 

For example, send a POST request to create a new vehicle:

```shell
$ curl -d '{"vin":"vin2","nickname":"car2"}' -H "Content-Type: application/json" -H "Authorization:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi...Very...Long...Token...loqbEvh29E" -X POST https://5cptaoe3of.execute-api.cn-north-1.amazonaws.com.cn/prod/vehicles
```
Here is the response:
```json
{"vin":"vin2","nickname":"car2","owner_id":"test"}%
```

And send a PUT reqeust to retrieve all the vehicles information:

```shell
$ curl -H "Authorization:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTczZmI5...Very...Long...Token...loqbEvh29E" https://5cptaoe3of.execute-api.cn-north-1.amazonaws.com.cn/prod/vehicles
```
Here is the response:
```json
{"Items":[{"nickname":"car1","vin":"vin1","owner_id":"test"},{"nickname":"car2","vin":"vin2","owner_id":"test"}],"Count":2,"ScannedCount":2}%
```


## Todo

- Create a simple web page for demostrating vehicle service API including login and logout from Authing
- Change Step 2 into the Cloudformation template for one-click deployment

***