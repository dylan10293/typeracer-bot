const puppeteer = require('puppeteer');

// Helper function to get a random integer within a range
const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to calculate delay based on words per minute (WPM)
const calculateDelay = (wpm) => {
	const wordsPerSecond = wpm / 60;
	const charactersPerSecond = wordsPerSecond * 5; // Assuming an average word length of 5 characters
	const delay = 1000 / charactersPerSecond; // Delay in milliseconds
	return delay;
};

// Function to type characters into a page element with a delay
const typeSlowly = async (page, selector, text, delay) => {
	for (const char of text) {
		await page.type(selector, char);
		await page.waitForTimeout(delay);
	}
};

// Function to perform the typing operation on a Typeracer page
const typingOperation = async (page, wpm) => {
	// Wait for the text box to be present and check additional conditions
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

	// Calculate delay based on WPM
	const delay = calculateDelay(wpm);

	// Type the text slowly into the input field
	const inputSelector =
		'table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > input';
	await typeSlowly(page, inputSelector, text, delay);

	// Recursively call the typing operation (optional)
	await typingOperation(page, wpm);
};

// Main function to automate Typeracer with a specific WPM
const typeracer = async (wpm) => {
	try {
		// Launch Puppeteer browser
		const browser = await puppeteer.launch({
			headless: false,
			args: ['--start-maximized', '--enable-automation'],
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

		// Perform the typing operation with the specified WPM
		await typingOperation(page, wpm);
	} catch (error) {
		console.log('Error:', error);
	}
};

module.exports = {
	typeracer,
};
