import nodemailer from "nodemailer";
import { google } from "googleapis";

const getAccessToken = async () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const { token } = await oauth2Client.getAccessToken();
    return token;
};

export const sendMail = async ({ to, subject, html }) => {
    const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken,
        },
    });

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
    };

    try {
        const detail = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully", detail);
        return detail;
    } catch (error) {
        console.error("Mail not sent", error);
        throw error;
    }
};