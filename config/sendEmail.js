/* eslint-disable no-undef */
const nodemailer = require("nodemailer");
//const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;
//const asyncHandler = require("express-async-handler");

// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// //Get an access token
// async function getAccessToken() {
//   const accessToken = await oauth2Client.getAccessToken();
//   return accessToken.token;
// }

const sendEmail = async (option) => {
  const transport = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // service:'gmail',
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable for email
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
    },
    // auth: {
    //   type: "OAuth2",
    //   user: "josephisrael206@gmail.com",
    //   accessToken: await getAccessToken(),
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   refreshToken: process.env.REFRESH_TOKEN,
    // },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });
  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  try {
    await transport.sendMail(emailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Failed to send email: ", error);
  }
};

module.exports = sendEmail;
