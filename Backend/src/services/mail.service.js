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

const smtpTimeouts = {
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 25_000,
};

async function sendViaResend({ to, subject, html }) {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
        throw new Error("RESEND_API_KEY is empty");
    }
    const from =
        process.env.RESEND_FROM_EMAIL?.trim() ||
        process.env.EMAIL_FROM?.trim() ||
        "onboarding@resend.dev";

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject,
            html,
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.message || JSON.stringify(data) || res.statusText;
        throw new Error(`Resend (${res.status}): ${msg}`);
    }
    console.log("Mail sent via Resend", data?.id || "");
    return data;
}

function createAppPasswordTransport() {
    const user = mailUser();
    const pass = appPassword();
    if (!user || !pass) return null;
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user, pass },
        ...smtpTimeouts,
    });
}

function createOAuthTransport() {
    const user = mailUser();
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

    if (!oauthConfigured) return null;

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

export function isMailConfigured() {
    if (process.env.RESEND_API_KEY?.trim()) return true;
    return (
        createAppPasswordTransport() !== null ||
        createOAuthTransport() !== null
    );
}

async function sendWithTransporter(transporter, mailOptions) {
    const detail = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully", detail.messageId);
    return detail;
}

export const sendMail = async ({ to, subject, html }) => {
    if (process.env.RESEND_API_KEY?.trim()) {
        return sendViaResend({ to, subject, html });
    }

    const from = mailUser();
    const mailOptions = { from, to, subject, html };

    const appT = createAppPasswordTransport();
    const oauthT = createOAuthTransport();

    if (!appT && !oauthT) {
        const err = new Error(
            "Mail not configured: set RESEND_API_KEY, or GMAIL_APP_PASSWORD + GOOGLE_USER, or OAuth env vars — see .env.example"
        );
        err.code = "MAIL_NOT_CONFIGURED";
        throw err;
    }

    if (appT) {
        try {
            return await sendWithTransporter(appT, mailOptions);
        } catch (error) {
            console.warn(
                "Gmail SMTP (app password) failed, trying OAuth2 if available:",
                error.message
            );
            if (oauthT) {
                return await sendWithTransporter(oauthT, mailOptions);
            }
            console.error("Mail not sent", error);
            throw error;
        }
    }

    try {
        return await sendWithTransporter(oauthT, mailOptions);
    } catch (error) {
        console.error("Mail not sent", error);
        throw error;
    }
};
