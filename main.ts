import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import readlineSync from 'readline-sync';
import fs from 'fs';

const subject = 'TEST MAIL SYSTEM';

interface PayloadSchema {
	email: string;
	name: string;
}

const payload: PayloadSchema[] = [
	{ email: 'kaydenleefale@gmail.com', name: 'Kayden Lee' },
];

function getVariableNames(data: PayloadSchema[] | any): string[] {
	if (data.length > 0) {
		return Object.keys(data[0]);
	}
	return [];
}

function getUserVariableNames(obj: Record<string, any>): string[] {
	return Object.keys(obj);
}

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

const varRegex = /{{\s*[\w]+\s*}}/g;

function readHTMLFile(
	path: string,
	callback: (err: Error | null, html?: string, variables?: string[]) => void
): void {
	fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
		if (err) {
			callback(err);
		} else {
			let matches = html.match(varRegex);
			let variables = matches
				? matches.map((variable) => variable.replace(/[{}]/g, '').trim())
				: [];
			callback(null, html, variables);
		}
	});
}

const transporter = nodemailer.createTransport({
	host: 'cloudservetechcentral.com',
	port: 465,
	secure: true,
	auth: {
		user: 'no-reply@cloudservetechcentral.com',
		pass: 'Nn9C3y&8@ei|4.k87F?N[xxE[pUCBxaRl$+~i5`E1>g.~Vlzee',
	},
	tls: { servername: 'w123.sgcloudhosting.com' },
});

let showPayload: string = readlineSync.question('Show payload? [Y/n] >_');
if (!['no', 'n'].includes(showPayload.toLowerCase())) {
	console.log(`Payload contains ${payload.length} entries.`);
	console.table(payload);
}

readHTMLFile(__dirname + '/template.html', (err, html, variables) => {
	if (err) {
		console.error('[FILE ERR]', err);
		return;
	}
	console.log('Template variables:', variables);

	const template = handlebars.compile(html);

	payload.forEach((user) => {
		const replacements = {
			username: user.name,
		};
		console.log('Your variables:', getUserVariableNames(replacements));
		let answer: string = readlineSync.question('Continue? [Y/n] >_');
		if (['no', 'n'].includes(answer.toLowerCase())) {
			console.log('Exiting...');
			return;
		}
		const htmlToSend = template(replacements);
		const mailOptions = {
			from: 'Kayden Lee <kayden@cloudservetechcentral.com>',
			to: user.email,
			subject: subject,
			html: htmlToSend,
		};
		transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
			if (error) {
				console.error(error);
			} else {
				console.log(
					`${getCurrentTime()} [OK] Sent to ${user.name} <${user.email}>: ${
						info.response
					}`
				);
			}
		});
	});
});
