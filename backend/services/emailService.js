const nodemailer = require('nodemailer');
const { orderConfirmationTemplate, statusUpdateTemplate, adminOrderNotificationTemplate } = require('./emailTemplates');

// Create transporter – use real SMTP if env vars are set, otherwise fall back to Ethereal test account
let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // No real SMTP config – generate test account (Ethereal)
  nodemailer.createTestAccount().then(testAccount => {
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Using Ethereal test email account');
  }).catch(err => {
    console.error('❌ Failed to create Ethereal test account', err);
  });
}

/** Helper to send a mail and log result */
async function sendMail(mailOptions) {
  // Wait for transporter to be ready if using Ethereal async creation
  if (!transporter) {
    // simple poll until transporter is defined (max 5 seconds)
    const start = Date.now();
    while (!transporter && Date.now() - start < 5000) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  if (!transporter) {
    console.error('❌ Transporter not initialized – email not sent');
    return;
  }
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent →', mailOptions.to);
    // If using Ethereal, output preview URL
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log('🔗 Preview URL:', previewUrl);
    }
  } catch (err) {
    console.error('❌ Email error:', err);
  }
}

/** Helper to send a mail and log result */
async function sendMail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent →', mailOptions.to);
  } catch (err) {
    console.error('❌ Email error:', err);
  }
}

/** 1️⃣ Customer – order confirmation */
async function sendOrderConfirmation(to, order) {
  await sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `✅ Đặt hàng thành công – Mã #${order._id}`,
    html: orderConfirmationTemplate(order),
  });
}

/** 2️⃣ Customer – status update */
async function sendStatusUpdate(to, order) {
  await sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `📦 Cập nhật trạng thái đơn hàng #${order._id}`,
    html: statusUpdateTemplate(order),
  });
}

/** 3️⃣ Admin – notification for new order or status change */
async function sendOrderNotificationToAdmin(order) {
  if (!process.env.ADMIN_EMAIL) return;
  await sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 Đơn hàng mới #${order._id}`,
    html: adminOrderNotificationTemplate(order),
  });
}

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
  sendOrderNotificationToAdmin,
};
