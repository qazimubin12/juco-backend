const nodemailer = require("nodemailer");

var smtpConfiq = {
  service: "Gmail",
  port: 465,
  auth: {
    user: "richardsteve979@gmail.com",
    pass: "cjoxakbgaheprsvf",
  },
};

module.exports = {
  sendEmail: async (email, code) => {
    var transporter = nodemailer.createTransport(smtpConfiq);
    var mailOptions = {
      from: "richardsteve979@gmail.com",
      to: email,
      subject: "Password Reset Link",
      text: "",
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
            \n\n Your verification code is ${code}:\n\n
            \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
            </p>`,
    };
    let resp = await transporter.sendMail(mailOptions);
    return true;
  },
};
