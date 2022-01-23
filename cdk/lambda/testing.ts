'use strict';

import { GoogleSpreadsheet } from 'google-spreadsheet'

const allowedOrigins = ['http://localhost:3000', 'https://d15bylhfejzrvc.cloudfront.net', 'https://stephandmattswedding.co.uk']

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