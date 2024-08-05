import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'dhruvproperty23@gmail.com',
        pass: 'bidd ylpr mpio hkks'
    }
});

async function mailer(email, link) {
    const subject = 'Password Reset Request';

    const text = `Hello,

                You have requested to reset your password. Please click the link below to reset your password:

                ${link}

                If you did not request this, please ignore this email.

                Best regards,
                Your Company Name`;

    const html = `<p>Hello,</p>
                <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                <p><a href=${link}>Reset Password</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Harsh Kumar Singh</p>`;


    const info = await transporter.sendMail({
        from: {
            name: "Harsh Kumar Singh",
            address: 'dhruvproperty23@gmail.com'
        },
        to: [email], // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });
    console.log(info);
}

export default mailer;