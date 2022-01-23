// 'use strict'



// // TODO:
// // - simplify
// // - make fields match form
// // - move local vars into environment / secret manager?




















// import { SES } from 'aws-sdk'

// const SES_REGION = 'eu-west-2';
// const SES_EMAIL_TO = 'mattandstephgetwed@gmail.com';
// const SES_EMAIL_FROM = 'hello@stephandmattswedding.co.uk';

// const getTextContent = ({name, email, message}: {name: string, email: string, message: string}) => {
//   return `
//     Received an Email! 📬
//     Sent from:
//         👤 ${name}
//         ✉️ ${email}
//     ${message}
//   `;
// }

// const sendEmailParams = ({name, email, message}: {name: string, email: string, message: string}) => {
//   return {
//     Destination: {
//       ToAddresses: [SES_EMAIL_TO],
//     },
//     Message: {
//       Body: {
//         Text: {
//           Charset: 'UTF-8',
//           Data: getTextContent({name, email, message}),
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: `Email from example ses app.`,
//       },
//     },
//     Source: SES_EMAIL_FROM,
//   };
// }

// const sendEmail = async ({name, email, message}: {name: string, email: string, message: string}) => {
//   const ses = new SES({region: SES_REGION});
//   await ses.sendEmail(sendEmailParams({name, email, message})).promise();

//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({message: 'Email sent successfully 🎉🎉🎉'}),
//   };
// }

// exports.handler = async (event: any) => {
//   const { body } = event
//   const parsed = JSON.parse(body)
//   const {name, email, message} = parsed

//   if (!name || !email || !message) {
//     return {
//       statusCode: 400,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({message: 'MISSING DATA'}),
//     };
//   }

//   return await sendEmail({name, email, message});
// };
