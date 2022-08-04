import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Muzu", function () {
  const deployMuzu = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const Muzu = await ethers.getContractFactory("Muzu");
    const muzu = await Muzu.deploy();

    await muzu.initialize();

    return { muzu, owner, otherAccount };
  };

  const deployMuzuAndSetupAccount = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const Muzu = await ethers.getContractFactory("Muzu");
    const muzu = await Muzu.deploy();

    await muzu.initialize();

    const userProfileHash = "someipfsstring";

    await muzu.setupAccount(userProfileHash);

    return { muzu, owner, otherAccount };
  };

  describe("Setup Artist Account", function () {
    it("Setup account should be discoverable", async function () {
      const { muzu, owner } = await loadFixture(deployMuzu);

      const userProfileHash = "someipfsstring";

      expect(await muzu.userProfiles(owner.address)).to.equal("");
      await muzu.setupAccount(userProfileHash);
      expect(await muzu.userProfiles(owner.address)).to.equal(userProfileHash);
    });

    it("Setup account should emit event", async function () {
      const { muzu, owner } = await loadFixture(deployMuzu);

      const userProfileHash = "someipfsstring";

      expect(await muzu.userProfiles(owner.address)).to.equal("");
      await muzu.setupAccount(userProfileHash);
      expect(await muzu.userProfiles(owner.address)).to.equal(userProfileHash);

      await expect(muzu.setupAccount(userProfileHash))
        .to.emit(muzu, "AccountSettedUp")
        .withArgs(owner.address, userProfileHash);
    });
  });

  describe("Define a track", function () {
    // royalty

    it("Defining a track should emit an event", async function () {
      const { muzu, owner } = await loadFixture(deployMuzuAndSetupAccount);

      const track = {
        metatada: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyReceiver: owner.address,
        royaltyFraction: 500,
      };

      await expect(
        muzu.defineTrack(
          track.metatada,
          track.mintPrice,
          track.supply,
          track.royaltyReceiver,
          track.royaltyFraction
        )
      )
        .to.emit(muzu, "TrackDefined")
        .withArgs(
          owner.address,
          0,
          track.metatada,
          track.mintPrice,
          track.supply,
          track.royaltyReceiver,
          track.royaltyFraction
        );
    });

    it("Defining a track should emit an event", async function () {
      const { muzu, owner } = await loadFixture(deployMuzuAndSetupAccount);

      const track = {
        metatada: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyReceiver: owner.address,
        royaltyFraction: 500,
      };

      await muzu.defineTrack(
        track.metatada,
        track.mintPrice,
        track.supply,
        track.royaltyReceiver,
        track.royaltyFraction
      );

      const definedTrack = await muzu.tracks(0);

      expect(definedTrack.metadata).to.equal(track.metatada);
      expect(definedTrack.mintPrice).to.equal(track.mintPrice);
      expect(definedTrack.supply).to.equal(track.supply);
      expect(definedTrack.royaltyInfo.receiver).to.equal(track.royaltyReceiver);
      expect(definedTrack.royaltyInfo.royaltyFraction).to.equal(
        track.royaltyFraction
      );
    });
  });
});
