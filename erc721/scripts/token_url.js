const { createCanvas } = require("canvas");
const { concat } = require("ethers");
const fs = require("fs");
const { PinataSDK } = require("pinata");
const { Blob } = require("buffer");
// require("dotenv").config()

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
  // Generate token image and save it to disk
  let tokenName = text.concat(tokenId.toString());
  let tokenPath = "./tokens/lesson" + tokenId + ".png";
  let imageBuffer = createImage(tokenName);
  fs.writeFileSync(tokenPath, imageBuffer);

  try {
    const blob = new Blob([fs.readFileSync(tokenPath)]);
    const file = new File([blob], tokenPath, { type: "image/png" });
    let response = await pinata.upload.file(file);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { generateTokenUrl };
