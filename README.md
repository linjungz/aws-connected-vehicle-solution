# AWS Connected Vehicle Solution for AWS China Region
The AWS Connected Vehicle Solution is a reference implementation that provides a foundation for automotive product transformations for connected vehicle services, autonomous driving, electric powertrains, and shared mobility.

This project is to migrate the solution to AWS China Region. As some services such as AWS Cognito, Kinesis Analytics are not available in China region, this project will remove the dependancy on these serives and use 3rd party solutions (either open source or SaaS) to replace them. For exmaple, [Authing.cn](https://authing.cn) is chosed to replace cognito. 

## Getting Started
To get started with the AWS Connected Vehicle Solution, please review the solution documentation. https://aws.amazon.com/answers/iot/connected-vehicle-solution/

Detail information about deploying this solutuion in AWS China region is documented here. Deploying the solution in AWS Global Region could be checked in this [repo](https://github.com/awslabs/aws-connected-vehicle-solution) from which this project forked.

## TODO: Instructions on deploying in AWS China Region 

Still working...

## File Structure
The AWS Connected Vehicle Solution project consists of microservices that facilitate the functional areas of the platform. These microservices are deployed to a serverless environment in AWS Lambda.

<pre>
|-source/
  |-services/
    |-helper/       [ AWS CloudFormation custom resource deployment helper ]
  |-services/
    |-anomaly/      [ microservice for humanization and persistence of identified anomalies ]
    |-driversafety/ [ microservice to orchestrate the creation of driver scores ]
    |-dtc/          [ microservice to orchestrate the capture, humanization and persistence of diagnostic trouble codes ]
    |-jitr/         [ microservice to orchestrate registration and policy creation for just-in-time registration of devices ]    
    |-notification/ [ microservice to send SMS and MQTT notifications for the solution ]
    |-vehicle/      [ microservice to provide proxy interface for the AWS Connected Vehicle Solution API ]    
</pre>

Each microservice follows the structure of:

<pre>
|-service-name/
  |-lib/
    |-[ service module libraries and unit tests ]
  |-index.js [ injection point for microservice ]
  |-package.json
</pre>

***