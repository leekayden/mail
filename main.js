var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

const subject = 'TEST MAIL SYSTEM';

function getCurrentTime() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
	const year = now.getFullYear();

	return `${hours}:${minutes}:${seconds} ${day}:${month}:${year}`;
}

const payload = [
	{ email: 'kaydenleefale@gmail.com', name: 'John Doe' },
	{ email: 'kaydenleefale@gmail.com', name: 'Jane Smith' },
	{ email: 'kaydenleefale@gmail.com', name: 'Alice Johnson' },
];

var readHTMLFile = function (path, callback) {
	fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
		if (err) {
			callback(err);
		} else {
			callback(null, html);
		}
	});
};

var transporter = nodemailer.createTransport({
	host: 'cloudservetechcentral.com',
	port: 465,
	secure: true,
	auth: {
		user: 'no-reply@cloudservetechcentral.com',
		pass: 'UmF30bLij7Omxdb7',
	},
	tls: { servername: 'w123.sgcloudhosting.com' },
});

readHTMLFile(__dirname + '/template.html', function (err, html) {
	if (err) {
		console.log('[FILE ERR]', err);
		return;
	}
	var template = handlebars.compile(html);

	payload.forEach(function (user) {
		var replacements = {
			username: user.name,
		};
		var htmlToSend = template(replacements);
		var mailOptions = {
			from: 'Kayden Lee <kayden@cloudservetechcentral.com>',
			to: user.email,
			subject: subject,
			html: htmlToSend,
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log(
					`${getCurrentTime()} [OK] Sent to ${user.email}: ${info.response}`
				);
			}
		});
	});
});
