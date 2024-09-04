const { createCanvas } = require("canvas");
const { concat } = require("ethers");
const fs = require("fs");
const { PinataSDK } = require("pinata");
const { Blob } = require("buffer");

require("dotenv").config();

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
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
  });

  // Generate token image and save it to disk
  let tokenName = text.concat(tokenId.toString());
  let tokenPath = "./tokens/" + tokenName + ".png";
  let imageBuffer = createImage(tokenName);
  fs.writeFileSync(tokenPath, imageBuffer);

  // Upload image to Pinata
  let image = fs.readFileSync(tokenPath);
  let blob = new Blob([image]);
  let file = new File([blob], tokenName, { type: "image/png" });
  let imageUploadResponse = await pinata.upload.file(file);
  console.log("imageUploadResponse: ", imageUploadResponse);

  // Create metadata and save it to disk
  let metadata = {
    name: "Lesson " + tokenId + "NFT",
    description: "This is the Darwinia Bootcamp Lesson " + tokenId + " NFT",
    image: "ipfs://" + imageUploadResponse.cid,
    external_url: "https://pinata.cloud",
  };
  let metadataPath = "./tokens/" + tokenName + ".json";
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  // Upload metadata to Pinata
  let metadataUploadResponse = await pinata.upload.json(metadata);
  console.log("metadataUploadResponse: ", metadataUploadResponse);

  // Return token metadata URL
  return "ipfs://" + metadataUploadResponse.cid;
}

module.exports = { generateTokenUrl };
