const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function sendVerificationEmail(userEmail, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@email.com",
      pass: "yourpassword",
    },
  });

  const url = `http://yourdomain.com/verify-email?token=${token}`;

  await transporter.sendMail({
    to: userEmail,
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
}

const token = crypto.randomBytes(32).toString("hex");
// Save `token` and `userId` to a `email_verifications` table or similar
app.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  const record = await db.findVerificationToken(token);

  if (!record || record.expired) {
    return res.status(400).send("Invalid or expired token");
  }

  await db.markEmailVerified(record.userId);
  res.send("Email verified!");
});
