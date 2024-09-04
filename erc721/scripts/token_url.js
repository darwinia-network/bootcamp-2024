const { createCanvas } = require("canvas");
const { concat } = require("ethers");
const fs = require("fs");
const { PinataSDK } = require("pinata");
const { Blob } = require("buffer");

require("dotenv").config();
const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_URL,
});

function createImage(text, width = 500, height = 500) {
	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");

	// Draw a background
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, width, height);

	// Draw some text
	context.font = "bold 30pt Menlo";
	context.textAlign = "center";
	context.fillStyle = "#000000";
	context.fillText(text, width / 2, height / 2);

	return canvas.toBuffer("image/png");
}

async function generateTokenUrl(text, tokenId) {
	// Create tokens folder if it doesn't exist
	const tokensFolder = "./tokens";
	if (!fs.existsSync(tokensFolder)) {
		fs.mkdirSync(tokensFolder);
	}

	// Generate token image and save it to disk
	let tokenName = text.concat(tokenId.toString());
	let tokenPath = `./${tokensFolder}/` + tokenName + ".png";
	let imageBuffer = createImage(tokenName);
	fs.writeFileSync(tokenPath, imageBuffer);

	// Upload image to Pinata
	let image = fs.readFileSync(tokenPath);
	let blob = new Blob([image]);
	let file = new File([blob], tokenName, { type: "image/png" });
	// Upload image to Pinata
	let imageUploadResponse = await retryUpload(() => pinata.upload.file(file));

	// Create metadata and save it to disk
	let metadata = {
		name: "Lesson " + tokenId + " NFT",
		description: "This is the Darwinia Bootcamp Lesson " + tokenId + " NFT",
		image: "ipfs://" + imageUploadResponse.cid,
		external_url: "https://pinata.cloud",
	};
	let metadataPath = `./${tokensFolder}/` + tokenName + ".json";
	fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
	// Upload metadata to Pinata
	let metadataUploadResponse = await retryUpload(() =>
		pinata.upload.json(metadata)
	);

	// Return token metadata URL
	return "ipfs://" + metadataUploadResponse.cid;
}

async function retryUpload(uploadFunction, retries = 10, retryDelay = 5000) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			return await uploadFunction();
		} catch (error) {
			console.error(
				`    > Attempt to upload token metadata to IPFS ${attempt} failed:`,
				error.message
			);

			if (attempt < retries) {
				console.log(
					`    > Retrying in ${retryDelay / 1000} seconds...`
				);
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			} else {
				console.error(
					"    > All attempts failed. Please check your network connection or try again later."
				);
				throw error;
			}
		}
	}
}

module.exports = { generateTokenUrl };
