import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Muzu", function () {
  const deployMuzu = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    usdc.mint(otherAccount.address, ethers.utils.parseUnits("10000", 18));

    const Muzu = await ethers.getContractFactory("Muzu");
    const muzu = await Muzu.deploy();

    await muzu.initialize(usdc.address);

    return { muzu, owner, otherAccount, usdc };
  };

  const deployMuzuAndSetupAccount = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    usdc.mint(otherAccount.address, ethers.utils.parseUnits("10000", 18));

    const Muzu = await ethers.getContractFactory("Muzu");
    const muzu = await Muzu.deploy();

    await muzu.initialize(usdc.address);

    const userProfileHash = "someipfsstring";

    await muzu.setupAccount(userProfileHash);

    return { muzu, owner, otherAccount, usdc };
  };

  const deployMuzuAndSetupAccountAndCreateAlbum = async () => {
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    usdc.mint(otherAccount.address, ethers.utils.parseUnits("10000", 18));

    const Muzu = await ethers.getContractFactory("Muzu");
    const muzu = await Muzu.deploy();

    await muzu.initialize(usdc.address);

    const userProfileHash = "someipfsstring";

    await muzu.setupAccount(userProfileHash);

    const track = {
      metadata: "someipfshashfordata",
      mintPrice: ethers.utils.parseUnits("5", 18),
      supply: 3,
      royaltyInfo: {
        receiver: owner.address,
        royaltyFraction: 500,
      },
    };

    const track2 = {
      metadata: "someipfshashfordata2",
      mintPrice: ethers.utils.parseUnits("6", 18),
      supply: 3,
      royaltyInfo: {
        receiver: owner.address,
        royaltyFraction: 500,
      },
    };

    const track3 = {
      metadata: "someipfshashfordata3",
      mintPrice: ethers.utils.parseUnits("7", 18),
      supply: 3,
      royaltyInfo: {
        receiver: owner.address,
        royaltyFraction: 500,
      },
    };

    const album = {
      info: "someipfshashw",
      tracks: [track, track2, track3],
    };

    await muzu.defineAlbum(album.info, album.tracks);

    return { muzu, owner, otherAccount, anotherAccount, usdc };
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
        metadata: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyInfo: {
          receiver: owner.address,
          royaltyFraction: 500,
        },
      };

      await expect(muzu.defineTrack(track))
        .to.emit(muzu, "TrackDefined")
        .withArgs(
          owner.address,
          0,
          0,
          track.metadata,
          track.mintPrice,
          track.supply,
          track.royaltyInfo.receiver,
          track.royaltyInfo.royaltyFraction
        );
    });

    it("Defining a track should be stored", async function () {
      const { muzu, owner } = await loadFixture(deployMuzuAndSetupAccount);

      const track = {
        metadata: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyInfo: {
          receiver: owner.address,
          royaltyFraction: 500,
        },
      };

      await muzu.defineTrack(track);

      const definedTrack = await muzu.tracks(0);

      expect(definedTrack.metadata).to.equal(track.metadata);
      expect(definedTrack.mintPrice).to.equal(track.mintPrice);
      expect(definedTrack.supply).to.equal(track.supply);
      expect(definedTrack.royaltyInfo.receiver).to.equal(
        track.royaltyInfo.receiver
      );
      expect(definedTrack.royaltyInfo.royaltyFraction).to.equal(
        track.royaltyInfo.royaltyFraction
      );
    });
  });

  describe("Define an album", function () {
    // royalty

    it("Defining an album should emit an event", async function () {
      const { muzu, owner } = await loadFixture(deployMuzuAndSetupAccount);

      const track = {
        metadata: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyInfo: {
          receiver: owner.address,
          royaltyFraction: 500,
        },
      };

      const album = {
        info: "someipfshash",
        tracks: [track, track, track, track],
      };

      await expect(muzu.defineAlbum(album.info, album.tracks))
        .to.emit(muzu, "AlbumDefined")
        .withArgs(owner.address, 1, album.info);
    });

    it("Defining an album should be stored", async function () {
      const { muzu, owner } = await loadFixture(deployMuzuAndSetupAccount);

      const track = {
        metadata: "someipfshashfordata",
        mintPrice: ethers.utils.parseUnits("5", 18),
        supply: 1000,
        royaltyInfo: {
          receiver: owner.address,
          royaltyFraction: 500,
        },
      };

      const album = {
        info: "someipfshash",
        tracks: [track, track, track, track],
      };

      await muzu.defineAlbum(album.info, album.tracks);

      const defineAlbum = await muzu.albums(1);

      expect(defineAlbum.artist).to.equal(owner.address);
      expect(defineAlbum.info).to.equal(album.info);
    });
  });

  describe("Mint track", function () {
    it("Should have money to mint", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(anotherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      await expect(
        muzu.connect(anotherAccount).mintTrack(0)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should not mint more than supply", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(otherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      await muzu.connect(otherAccount).mintTrack(0);
      await muzu.connect(otherAccount).mintTrack(0);
      await muzu.connect(otherAccount).mintTrack(0);

      await expect(muzu.connect(otherAccount).mintTrack(0)).to.be.revertedWith(
        "max supply"
      );
    });

    it("Should increase the artist balance", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(otherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      expect(await muzu.artistsBalances(owner.address)).to.equal(0);

      await muzu.connect(otherAccount).mintTrack(0);
      expect(await muzu.artistsBalances(owner.address)).to.equal(
        ethers.utils.parseUnits("5", 18)
      );
    });

    it("Should actually get the NFT", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(otherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      await muzu.connect(otherAccount).mintTrack(0);

      expect(await muzu.ownerOf(0)).to.equal(otherAccount.address);
      expect(await muzu.tokenURI(0)).to.equal("someipfshashfordata");
      expect(await muzu.tokensToTracks(0)).to.equal(0);
    });

    it("Should actually emit a transfer event", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(otherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      await expect(muzu.connect(otherAccount).mintTrack(0))
        .to.emit(muzu, "Transfer")
        .withArgs(ethers.constants.AddressZero, otherAccount.address, 0);
    });
  });

  describe("Mint Album", function () {
    it("Should have money to mint", async function () {
      const { muzu, owner, otherAccount, anotherAccount, usdc } =
        await loadFixture(deployMuzuAndSetupAccountAndCreateAlbum);

      await usdc
        .connect(otherAccount)
        .approve(muzu.address, ethers.utils.parseUnits("1000", 18));

      await expect(muzu.connect(otherAccount).mintAlbum(1))
        .to.emit(muzu, "AlbumMinted")
        .withArgs(otherAccount.address, 1);
    });
  });
});
