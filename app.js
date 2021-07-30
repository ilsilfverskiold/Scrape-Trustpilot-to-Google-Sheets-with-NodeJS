// npm's
const app = require('express');n
const rp = require('request-promise');
const $ = require('cheerio');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');


// import oAuth file for sheets - you need to get your own
const creds = require('./client_secret.json');

// build simple route



// run send to sheets function
async function accessSpreadsheet(company, link, stars, review, date) {
	// set XXXXXXXXX to own value
	const doc = new GoogleSpreadsheet('XXXXXXXXXXXX');
	await promisify(doc.useServiceAccountAuth)(creds);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[0];
	
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
	const url = 'https://se.trustpilot.com/';
	rp(url).then(function(html){
		//success!
		const reviewCards = $('.reviewCard___34UhI', html);
		console.log(reviewCards.length);

			for(let i = 0; i < reviewCards.length; i++) {
				const reviewCards2 = $('.reviewCard___34UhI', html)[i];
				const header2 = reviewCards2.children[0];
				const company2 = reviewCards2.children[1].children[2].children[2].data;
				const review2 = reviewCards2.children[2].children[0].data;
				const companyLink2 = "https://se.trustpilot.com/" + reviewCards2.children[1].children[2].children[2].parent.attribs.href;
				const reviewStar2 = header2.children[1].children[0].children[0].attribs.alt;
				const starNumber = reviewStar2.match(/(\d+)/);
				const dateobj= new Date() ;
				const month = dateobj.getMonth() + 1;
				const day = dateobj.getDate() ;
				const year = dateobj.getFullYear();
				const date = month + "/" + day + "/" + year;
					if(starNumber[0] == 1 || starNumber[0] == 2) {
						accessSpreadsheet(company2, companyLink2,starNumber[0], review2, date);
						console.log(company2);
						console.log(companyLink2);
						console.log(starNumber[0]);
						console.log(review2);
						console.log(date);
						console.log("-----------------------------------------");
					}
			}
	})
	.catch(function(err){
		console.log(err);
	});	
}

runTrust();
