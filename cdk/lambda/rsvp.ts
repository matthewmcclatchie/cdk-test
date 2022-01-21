'use strict'



// TODO:
// - set up fields to match form
// - trigger email on successful submission
// - check to see if rsvp has already been made for name + email combo?






















import { GoogleSpreadsheet } from 'google-spreadsheet'

exports.handler = async (event: any) => {
    const { body } = event
    const parsed = JSON.parse(body)
    const {name, email} = parsed
    
    if (!name || !email) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message: 'MISSING DATA'}),
      };
    }

    const doc = new GoogleSpreadsheet('1zuAheoPzuwHer7MixlwCQy00ngz48Wfjar07vVbhCqs');

    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL!,
      private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, "\n"),
    });

    // Required - loads document properties and worksheets
    await doc.loadInfo();

    // CHECK FOR SHEET EXISTANCE
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRow({
      name,
      email
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message: 'SUCCESS'}),
    };
};
  