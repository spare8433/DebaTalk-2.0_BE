import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

type MailParam = {
  toEmail: string; // 수신할 이메일
  subject: string; // 메일 제목
  text: string;
};

// let mailSender = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     type: "OAuth2",
//     user: process.env.MAILER_EMAIL,
//     clientId: process.env.MAILER_CLIENT_ID,
//     clientSecret: process.env.MAILER_CLIENT_PWD,
//     accessToken: process.env.MAILER_ACCTKN,
//     refreshToken: process.env.MAILER_REFTKN,
//     expires: 1484314697598,
//   },
// });

// 메일발송 객체
const mailSender = {
  // 메일발송 함수
  sendGmail: function (param: MailParam) {
    console.log(param);
    var transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      requireTLS: true,
      auth: {
        type: "OAuth2",
        user: process.env.MAILER_EMAIL,
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_CLIENT_PWD,
        refreshToken: process.env.MAILER_REFTKN,
      },
    });

    // 메일 옵션
    var mailOptions = {
      from: process.env.MAILER_EMAIL, // 보내는 메일의 주소
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      text: param.text, // 메일 내용
    };

    // 메일 발송
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

export default mailSender;
