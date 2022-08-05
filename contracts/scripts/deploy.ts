import { ethers } from "hardhat";

async function main() {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const targetMint = "0x4A87a2A017Be7feA0F37f03F3379d43665486Ff8";
  const targetMint2 = "0x26d625d436dE2665B2f67C1cCf8c054D45995354";

  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();

  await sleep(5000);

  console.log(`USDC address is: `, usdc.address);

  usdc.mint(targetMint2, ethers.utils.parseUnits("10000", 18));
  console.log("USDC minted for: ", targetMint);
  await sleep(5000);

  usdc.mint(targetMint, ethers.utils.parseUnits("10000", 18));
  console.log("USDC minted for: ", targetMint2);
  await sleep(5000);

  const Muzu = await ethers.getContractFactory("Muzu");
  const muzu = await Muzu.deploy();

  await muzu.initialize(usdc.address);

  console.log(`MUZU address is: `, muzu.address);
}

//USDC address is:  0x62251F8cFdB9389935a225beF541d0E940cfb6cE
//MUZU address is:  0x5F9872012C1A71a2334deb78763ac0dD20037C00

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
