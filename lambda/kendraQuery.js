const AWS = require('aws-sdk');
const bunyan = require('bunyan');

exports.main =  async function(event, context) {
    const promise = new Promise(function(resolve) {
        AWS.config.region = 'us-west-2';
        var kendra = new AWS.Kendra({apiVersion: '2019-02-03'}); 
       
        var params = { IndexId: '4899ed00-1436-479b-a6dc-8b4cff46828d', QueryText: event.queryStringParameters.queryText, PageNumber: parseInt(event.queryStringParameters.pageNumber) };
        kendra.query(params, (error, response) => {
            if(error) {
                resolve({statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify(error)});
            }
            
            else {
                resolve({statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,GET",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                    body: JSON.stringify(response)});
            }
        });
   
    });
    
    return promise;
};

