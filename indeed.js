// npm's
const rp = require('request-promise');
const $ = require('cheerio');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

// import oAuth file for sheets
const creds = require('./client_secret.json');

// run send to sheets function
async function accessSpreadsheet(company, link, stars, review, date) {
	// need to exchange xxxxxxx to own spreadsheet value code - see Google spreadsheet url
	const doc = new GoogleSpreadsheet('xxxxxxxxx');
	await promisify(doc.useServiceAccountAuth)(creds);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[1];
	
	const row = {
		company: company,
		Link: link,
		Stars: stars,
		Review: review,
		Date: date
	}
	
	await promisify(sheet.addRow)(row);
}

// crawl trustpilot
async function runTrust() {
	const url = 'https://se.indeed.com/jobs?q=customer+service&l=Sverige&fromage=3';
	rp(url).then(function(html){
		//success!
		const object = $('.company', html)[0].children[1];
		console.log(object);
	})
	.catch(function(err){
		console.log(err);
	});	
}

runTrust();
