import nodemailer from 'nodemailer';

const email = process.env.GOOGLE_EMAIL ?? 'adepojuololade2020@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // auth: {
    //     type: 'OAuth2',
    //     user: email,
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //     refreshToken: 'PLACEHOLDER_REFRESH_TOKEN',
    // },
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
    },
});

export const sendOrderNotification = async (to: string, orderDetails: any) => {
    try {
        console.log('Sending order notification email to:', to);
        const mailOptions = {
            from: email,
            to,
            subject: 'New Order Notification',
            html: `
        <h1>New Order Received</h1>
        <p>A new order has been placed successfully.</p>
        <p><strong>Transaction Reference:</strong> ${orderDetails.tx_ref}</p>
        <p><strong>Amount:</strong> ₦${orderDetails.amount}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order notification email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending order notification email:', error);
        // Don't throw, just log so payment flow isn't interrupted
        return null;
    }
};

export const sendVerificationEmail = async (to: string, code: string, name: string) => {
    try {
        console.log('Sending verification email to:', to);
        const mailOptions = {
            from: email,
            to,
            subject: "Verify Your Email - Lois Food and Spices",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Verify Your Email</h2>
          <p>Hi ${name || "there"},</p>
          <p>You requested to set a password for your Lois Food and Spices account.</p>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #22c55e; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">© 2026 Lois Food and Spices. All rights reserved.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};
