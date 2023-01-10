const puppeteer = require('puppeteer');

async function typeSlowly(page, selector, text, delay) {
	for (const char of text) {
		await page.type(selector, char);
		const timeout = getRandomInt(50, 175)
		console.log('timeout: ', timeout);
		await page.waitForTimeout(timeout);
	}
}

async function typeracer(string) {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			args: [
				'--start-maximized',
				"--enable-automation"
			],
			devtools: true,
			defaultViewport: null,
		});
		// Create a new page
		const page = await browser.newPage();
		// Navigate to the Typeracer game page
		await page.goto('https://play.typeracer.com');

		await page.waitForFunction(() => {
			return document.querySelector("table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div")?.innerText?.length
		}, { timeout: 0 })
		const text = await page.evaluate(() => {
			return document.querySelector("table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div")?.innerText
		})
		console.log('text: ', text);
		await nowDoIt(page, text)

	} catch (error) {
		console.log('error: ', error);

	}
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const nowDoIt = async (page) => {
	await page.waitForFunction(() => {
		return document.querySelector("table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div")?.innerText?.length
	}, { timeout: 0 })
	const text = await page.evaluate(() => {
		return document.querySelector("table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div")?.innerText
	})
	console.log('text: ', text);
	await page.waitForFunction(() => {
		try {
			if (test) {
				console.log('test: ', test);
				return test
			}
		} catch (error) {

		}
	}, { timeout: 0 });

	console.log("hey");
	await typeSlowly(
		page,
		"table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > input",
		text,
		getRandomInt(70, 100)
	);
	await page.evaluate(() => {
		test = false
	})
}

typeracer('This is a test string.');
