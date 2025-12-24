import nodemailer from 'nodemailer';

const email = process.env.GOOGLE_EMAIL ?? 'test-sender@example.com';

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
