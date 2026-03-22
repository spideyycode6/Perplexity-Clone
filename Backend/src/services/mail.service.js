import nodemailer from "nodemailer";

const mailUser = () => process.env.GOOGLE_USER || process.env.SMTP_USER;

/** Gmail app password: use GMAIL_APP_PASSWORD or GOOGLE_APP_PASSWORD (16 chars, spaces optional). */
const appPassword = () => {
    const raw =
        process.env.GMAIL_APP_PASSWORD ||
        process.env.GOOGLE_APP_PASSWORD ||
        process.env.SMTP_PASS;
    if (!raw) return "";
    return String(raw).replace(/\s/g, "");
};

/** Avoid hanging the HTTP request if SMTP is slow or blocked (common on cloud hosts). */
const smtpTimeouts = {
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 15_000,
};

const createTransporter = () => {
    const user = mailUser();
    const pass = appPassword();

    if (user && pass) {
        return nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user, pass },
            ...smtpTimeouts,
        });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    const oauthConfigured =
        user &&
        clientId &&
        clientSecret &&
        refreshToken &&
        !String(clientId).includes("your_google") &&
        !String(refreshToken).includes("your_google");

    if (oauthConfigured) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user,
                clientId,
                clientSecret,
                refreshToken,
            },
            ...smtpTimeouts,
        });
    }

    return null;
};

export function isMailConfigured() {
    return createTransporter() !== null;
}

export const sendMail = async ({ to, subject, html }) => {
    const transporter = createTransporter();
    if (!transporter) {
        const err = new Error(
            "Mail not configured: set GMAIL_APP_PASSWORD (and GOOGLE_USER), or valid Google OAuth env vars — see .env.example"
        );
        err.code = "MAIL_NOT_CONFIGURED";
        throw err;
    }

    const from = mailUser();
    const mailOptions = {
        from,
        to,
        subject,
        html,
    };

    try {
        const detail = await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully", detail.messageId);
        return detail;
    } catch (error) {
        console.error("Mail not sent", error);
        throw error;
    }
};
