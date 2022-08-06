// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

contract Muzu is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721RoyaltyUpgradeable,
    OwnableUpgradeable
{
    address public usdcAddress;

    using CountersUpgradeable for CountersUpgradeable.Counter;
    mapping(address => string) public userProfiles;
    mapping(address => uint256) public artistsBalances;
    mapping(uint256 => uint256) public tokensToTracks;

    CountersUpgradeable.Counter private _tokenIdCounter;
    CountersUpgradeable.Counter private _trackIdCounter;
    CountersUpgradeable.Counter private _albumIdCounter;

    // needs to override royalty info

    struct Track {
        address artist;
        string metadata;
        uint256 albumId;
        uint256 mintPrice;
        uint256 supply;
        uint256 minted;
        RoyaltyInfo royaltyInfo;
    }

    struct TrackInput {
        string metadata;
        uint256 mintPrice;
        uint256 supply;
        RoyaltyInfo royaltyInfo;
    }

    struct Album {
        address artist;
        string info;
        uint256[] trackIds;
    }

    mapping(uint256 => Track) public tracks;
    mapping(uint256 => Album) public albums;
    mapping(uint256 => uint256[]) public trackTokens;

    function initialize(address _usdcAddress) public initializer {
        __ERC721_init("Muzu", "MZU");
        __ERC721URIStorage_init();
        __ERC721Royalty_init();
        __Ownable_init();
        _albumIdCounter.increment();
        usdcAddress = _usdcAddress;
    }

    function setupAccount(string memory _hash) public {
        userProfiles[msg.sender] = _hash;
        emit AccountSettedUp(msg.sender, _hash);
    }

    function defineTrack(TrackInput memory _track) public {
        _defineTrack(_track, msg.sender, 0);
    }

    function _defineTrack(
        TrackInput memory _track,
        address _artist,
        uint256 _albumId
    ) internal {
        uint256 trackId = _trackIdCounter.current();
        _trackIdCounter.increment();
        tracks[trackId] = (
            Track(
                _artist,
                _track.metadata,
                _albumId,
                _track.mintPrice,
                _track.supply,
                0,
                _track.royaltyInfo
            )
        );
        if (_albumId != 0) {
            Album storage album = albums[_albumId];
            album.trackIds.push(trackId);
        }
        emit TrackDefined(
            msg.sender,
            trackId,
            _albumId,
            _track.metadata,
            _track.mintPrice,
            _track.supply,
            _track.royaltyInfo.receiver,
            _track.royaltyInfo.royaltyFraction
        );
    }

    function defineAlbum(string memory _info, TrackInput[] memory _tracks)
        public
    {
        require(_tracks.length > 0, "empty album");
        uint256 albumId = _albumIdCounter.current();
        _albumIdCounter.increment();
        uint256[] memory trackIds;
        albums[albumId] = Album(msg.sender, _info, trackIds);
        for (uint256 i = 0; i < _tracks.length; i++) {
            _defineTrack(_tracks[i], msg.sender, albumId);
        }
        emit AlbumDefined(msg.sender, albumId, _info);
    }

    function mintTrack(uint256 _trackId) public {
        _mintTrack(_trackId);
    }

    function mintAlbum(uint256 _albumId) public {
        require(_albumId > 0, "Not for tracks");
        Album memory album = albums[_albumId];
        require(album.trackIds.length > 0, "empty album");

        for (uint256 i = 0; i < album.trackIds.length; i++) {
            _mintTrack(album.trackIds[i]);
        }
        emit AlbumMinted(msg.sender, _albumId);
    }

    function _mintTrack(uint256 _trackId) internal {
        Track storage track = tracks[_trackId];
        require(track.minted < track.supply, "max supply");
        track.minted += 1;
        artistsBalances[track.artist] += track.mintPrice;
        IERC20(usdcAddress).transferFrom(
            msg.sender,
            address(this),
            track.mintPrice
        );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, track.metadata);
        _setTokenRoyalty(
            tokenId,
            track.royaltyInfo.receiver,
            track.royaltyInfo.royaltyFraction
        );
        tokensToTracks[tokenId] = _trackId;
        trackTokens[_trackId].push(tokenId);
        emit TrackMinted(_trackId, msg.sender, tokenId);
    }

    function doesOwnTrack(uint256 _trackId, address _userAddress)
        public
        view
        returns (bool result)
    {
        result = false;
        uint256[] memory tokensOfTrack = trackTokens[_trackId];
        for (uint256 i = 0; i < tokensOfTrack.length; i++) {
            if (ownerOf(tokensOfTrack[i]) == _userAddress) {
                result = true;
            }
        }
    }

    function withdraw() public {
        uint256 balance = artistsBalances[msg.sender];
        artistsBalances[msg.sender] = 0;
        IERC20(usdcAddress).transfer(msg.sender, balance);
        emit Withdrawl(msg.sender, balance);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(
            ERC721Upgradeable,
            ERC721URIStorageUpgradeable,
            ERC721RoyaltyUpgradeable
        )
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721RoyaltyUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    event AccountSettedUp(address indexed _userAddress, string _hash);
    event TrackDefined(
        address indexed _artist,
        uint256 indexed _trackId,
        uint256 indexed _albumId,
        string _dataHash,
        uint256 _mintPrice,
        uint256 _supply,
        address _royaltyReceiver,
        uint96 _royaltyFraction
    );
    event AlbumDefined(
        address indexed _artist,
        uint256 indexed _albumId,
        string _dataHash
    );
    event AlbumMinted(address indexed _user, uint256 indexed _albumId);
    event Withdrawl(address indexed _artist, uint256 _amount);
    event TrackMinted(
        uint256 indexed _trackId,
        address indexed _minter,
        uint256 indexed _tokenId
    );
}
