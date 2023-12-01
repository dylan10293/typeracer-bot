const puppeteer = require('puppeteer');

// Helper function to get a random integer within a range
const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to type characters into a page element with a delay
const typeSlowly = async (page, selector, text, delay) => {
	for (const char of text) {
		await page.type(selector, char);
		const timeout = getRandomInt(50, 175);
		await page.waitForTimeout(timeout);
	}
};

// Function to perform the typing operation on a Typeracer page
const typingOperation = async (page) => {
	// Wait for the text box to be present
	await page.waitForFunction(
		() => {
			return (
				document.querySelector(
					'table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div',
				)?.innerText?.length &&
				!document.querySelector('table input').disabled &&
				!document.querySelector('table.TypingLogReplayPlayer')
			);
		},
		{ timeout: 0 },
	);

	// Extract text from the Typeracer page
	const text = await page.evaluate(() => {
		return document.querySelector(
			'table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div',
		)?.innerText;
	});
	console.log('Found text box:', text);

	// Type the text slowly into the input field
	const inputSelector =
		'table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > input';
	await typeSlowly(page, inputSelector, text, getRandomInt(70, 100));
	await typingOperation(page);
};

// Main function to automate Typeracer
const typeracer = async () => {
	try {
		// Launch Puppeteer browser
		const browser = await puppeteer.launch({
			headless: false,
			args: ['--start-maximized', '--enable-automation'],
			devtools: true,
			defaultViewport: null,
		});

		// Create a new page and navigate to Typeracer
		const page = await browser.newPage();
		await page.goto('https://play.typeracer.com');

		// Wait for the text box to be present
		await page.waitForFunction(
			() => {
				return document.querySelector(
					'table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div',
				)?.innerText?.length;
			},
			{ timeout: 0 },
		);

		// Perform the typing operation
		await typingOperation(page);
	} catch (error) {
		console.log('Error:', error);
	}
};

// Example usage
typeracer();
