import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const subject = 'TEST MAIL SYSTEM';

interface EmailPayload {
    email: string;
    name: string;
}

const payload: EmailPayload[] = [
    { email: 'kaydenleefale@gmail.com', name: 'John Doe' },
    { email: 'kaydenleefale@gmail.com', name: 'Jane Smith' },
    { email: 'kaydenleefale@gmail.com', name: 'Alice Johnson' },
];

function getCurrentTime(): string {
    const now: Date = new Date();
    const hours: string = String(now.getHours()).padStart(2, '0');
    const minutes: string = String(now.getMinutes()).padStart(2, '0');
    const seconds: string = String(now.getSeconds()).padStart(2, '0');
    const day: string = String(now.getDate()).padStart(2, '0');
    const month: string = String(now.getMonth() + 1).padStart(2, '0');
    const year: number = now.getFullYear();

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function readHTMLFile(path: string, callback: (err: Error | null, html?: string) => void): void {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    });
}

const transporter = nodemailer.createTransport({
    host: 'cloudservetechcentral.com',
    port: 465,
    secure: true,
    auth: {
        user: 'no-reply@cloudservetechcentral.com',
        pass: 'i9h.7uJTGwAj=1zR!_+4bJX(,61?L/S*VycyZ]ZM=29gi09e-K',
    },
    tls: { servername: 'w123.sgcloudhosting.com' },
});

readHTMLFile(__dirname + '/template.html', (err, html) => {
    if (err) {
        console.error('[FILE ERR]', err);
        return;
    }
    const template = handlebars.compile(html);

    payload.forEach((user) => {
        const replacements = {
            username: user.name,
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
            from: 'Kayden Lee <kayden@cloudservetechcentral.com>',
            to: user.email,
            subject: subject,
            html: htmlToSend,
        };
        transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
            if (error) {
                console.error(error);
            } else {
                console.log(
                    `${getCurrentTime()} [OK] Sent to ${user.email}: ${info.response}`
                );
            }
        });
    });
});
