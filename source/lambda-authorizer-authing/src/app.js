/**
 * This is a token-based Lambda Authorizer for API Gateway which is used to verify token from Authing.cn, 
 * based on the sample from Lambda documentation:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
 * @author Randy Lin
 */

exports.handler =  function(event, context, callback) {
    //console.log(event);
    //console.log(context);
    var token = event.authorizationToken;
    //console.log(token);
    
    const jwt = require('jsonwebtoken');
    try {
        //从Authing.cn控制台获取OIDC应用的App Secret并存入在Lambda环境变量中
        const app_secret = process.env.authingOIDCAppSecret;
        const decoded = jwt.verify(token, app_secret); 
        
        /**
         * 对claims的处理是为了兼容后端Lambda代码使用requestContext中cognito相关的值
         * CVRA的Lambda Function预设验证机制是通过Cognito，因此代码中会通过claims来获取Cognito用户名等
         * 通过模拟Cognito验证后API Gateway发给Lambda的请求，以尽可能减少对CVRA后端代码的修改
         * 原CVRA使用cognito username为唯一值，需要对应Authing的_id
         */
        const claims = {
                "cognito:username": decoded._id
        }

        const expired = (Date.parse(new Date()) / 1000) > decoded.exp
        
      if (expired) {
        //Token过期
        callback("Error: Token Expired");
      }else {
        // 合法也没过期，正常放行
        console.log("Valid token.");
        callback(null, generatePolicy('user', 'Allow', event.methodArn, claims));
      }
    } catch (error) {
        //其他异常
        console.log(error);
        callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource, claims) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        //目前自定义的context不支持直接传入JSON Object，需要先stringify，并在Lambda中parse后进行访问。
        "claims" : JSON.stringify(claims) 
    };
    
    return authResponse;
}