// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract Muzu is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721RoyaltyUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    mapping(address => string) public userProfiles;

    CountersUpgradeable.Counter private _tokenIdCounter;
    CountersUpgradeable.Counter private _trackIdCounter;

    // needs to override royalty info

    struct Track {
        string metadata;
        uint256 mintPrice;
        uint256 supply;
        RoyaltyInfo royaltyInfo;
    }

    Track[] public tracks;

    function initialize() public initializer {
        __ERC721_init("Muzu", "MZU");
        __ERC721URIStorage_init();
        __ERC721Royalty_init();
        __Ownable_init();
    }

    function setupAccount(string memory _hash) public {
        userProfiles[msg.sender] = _hash;
        emit AccountSettedUp(msg.sender, _hash);
    }

    function defineTrack(
        string memory _dataHash,
        uint256 _mintPrice,
        uint256 _supply,
        address _royaltyReceiver,
        uint96 _royaltyFraction
    ) public {
        uint256 trackId = _trackIdCounter.current();
        _trackIdCounter.increment();
        tracks.push(
            Track(
                _dataHash,
                _mintPrice,
                _supply,
                RoyaltyInfo(_royaltyReceiver, _royaltyFraction)
            )
        );
        emit TrackDefined(
            msg.sender,
            trackId,
            _dataHash,
            _mintPrice,
            _supply,
            _royaltyReceiver,
            _royaltyFraction
        );
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
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
        string _dataHash,
        uint256 _mintPrice,
        uint256 _supply,
        address _royaltyReceiver,
        uint96 _royaltyFraction
    );
}
