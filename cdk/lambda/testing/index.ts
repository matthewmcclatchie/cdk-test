// NodeJsFunction attempt
export const handler = async (event:any) => {
  return new Promise((resolve, reject) => {
    if (1 === 1) {
      resolve({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify('HELLO THERE'),
      })
    }

    reject({
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify('Noooooo'),
    })
  })
}




// WORKING TO PUBLISH TO SNS
/*
'use strict';

console.log('⭐️⭐️⭐ Loading function');

var AWS = require('aws-sdk');  
AWS.config.update({region: 'eu-west-2'});

exports.handler = async (event: any) => {

  return new Promise((resolve, reject) => {
    
    // Create publish parameters
    var params = {
      Subject: 'new rsvp...',
      Message: 'Here is the message',
      TopicArn: 'arn:aws:sns:eu-west-2:139120963390:WeddingTestStack-weddingtestsvptopic69A2A650-1W6ZSF87DT4Q9',
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
      function(data: any) {
        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
        
        resolve({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify('SENT MESSAGE'),
        })
      
        
      }).catch(
        function(err: any) {
        console.error(err, err.stack);
        
        reject({
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify('FAILED MESSAGE'),
        });
      });
    
  });
};
*/


// RSVP HANDLER UPDATE
/*
'use strict';

import { GoogleSpreadsheet } from 'google-spreadsheet'

const allowedOrigins = ['http://localhost:3000', 'https://d15bylhfejzrvc.cloudfront.net', 'https://stephandmattswedding.co.uk']

console.log('Loading function');
var AWS = require('aws-sdk');  
AWS.config.update({region: 'eu-west-2'});

exports.handler = async (event: any) => {
  const origin = allowedOrigins.find(origin => origin === event.headers.origin)

  const { body } = event
  const parsed = JSON.parse(body)
  const {name} = parsed

  if (!process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: 'MISSING ENV VARS!!!'}),
    };
  }

  if (!name) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: 'FAILED!!!'}),
    };
  }
        
  try {
    const doc = new GoogleSpreadsheet('1zuAheoPzuwHer7MixlwCQy00ngz48Wfjar07vVbhCqs');
    
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: 'SUCCESS', docTitle: doc.title, sheet: sheet.title}),
    };
  } catch(err) {
    throw new Error(JSON.stringify(err))
  }
};
*/