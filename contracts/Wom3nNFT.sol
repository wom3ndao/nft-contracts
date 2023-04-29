// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Wom3nNFT is Ownable, ERC721URIStorage {
    using Counters for Counters.Counter;
    address public devAddress;
    Counters.Counter private _tokenIds;
    event NewEpicNFTMinted(address sender, uint256 tokenId);
    uint8 private constant MAX_TOTAL_MINTS = 50;
    uint8 private TOTAL_MINTS = 0;
    string public baseUrl;
    bool public mintingAllowed;
    bool public transferAllowed;
    mapping(address => bool) public allowlist;
    mapping(address => bool) public hasMinted;
    mapping(address => uint256[]) private _tokensOwnedBy;

    using Strings for uint256;

    constructor() ERC721("Wom3nNFT", "WMNFT") {
        baseUrl = "https://bafybeihocfptf5aemeo3iuk6hi6ibccbfjemco4xuwzs7sexxqjpssolee.ipfs.nftstorage.link/";
        mintingAllowed = true;
        transferAllowed = false;
        _tokenIds.increment();
        devAddress = 0x4a7D0d9D2EE22BB6EfE1847CfF07Da4C5F2e3f22; // Rike
    }

    modifier onlyDevOrOwner() {
        require(
            msg.sender == owner() || msg.sender == devAddress,
            "Wom3nNFT: Only contract owner or dev can perform this action"
        );
        _;
    }

    function setDevAddress(address _devAddress) public onlyDevOrOwner {
        devAddress = _devAddress;
    }

    function getTotalMints() public view returns (uint8) {
        return TOTAL_MINTS;
    }

    function mint() public {
        require(mintingAllowed, "Wom3nNFT: minting is disabled");
        require(
            TOTAL_MINTS < MAX_TOTAL_MINTS,
            "Wom3nNFT: All NFTs are minted!"
        );
        require(allowlist[msg.sender], "Wom3nNFT: sender not in the allowlist");
        require(
            !hasMinted[msg.sender] || msg.sender == owner(),
            "Wom3nNFT: can't mint twice, except owner"
        );

        TOTAL_MINTS += 1;
        uint newItemId = _tokenIds.current();

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        string(
                            abi.encodePacked(
                                "wom3n.DAO NFT #",
                                newItemId.toString()
                            )
                        ),
                        '", "description": "wom3n.DAO - the dynamic hub for the next-gen digital female leaders and creatives, igniting innovation, growth, and impact in Web3.", "image": "',
                        string(
                            abi.encodePacked(
                                baseUrl,
                                "WiB-Avatar-",
                                newItemId.toString(),
                                ".png"
                            )
                        ),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        _tokenIds.increment();
        hasMinted[msg.sender] = true;
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function setMintingAllowed(bool mintingAllowed_) external onlyDevOrOwner {
        mintingAllowed = mintingAllowed_;
    }

    function setTransferAllowed(bool transferAllowed_) external onlyDevOrOwner {
        transferAllowed = transferAllowed_;
    }

    function addToAllowlist(address[] calldata users) external onlyDevOrOwner {
        for (uint256 i = 0; i < users.length; i++) {
            allowlist[users[i]] = true;
        }
    }

    function removeFromAllowlist(
        address[] calldata users
    ) external onlyDevOrOwner {
        for (uint256 i = 0; i < users.length; i++) {
            allowlist[users[i]] = false;
        }
    }

    function updateBaseUrl(string calldata _baseUrl) external onlyDevOrOwner {
        baseUrl = _baseUrl;
    }

    // only allow token transfers if the transferAllowed flag is set to true or
    // if the operation is a minting or burning operation or the sender is owner
    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 tokenId_,
        uint256 batchSize_
    ) internal virtual override(ERC721) {
        require(
            from_ == address(0) ||
                to_ == address(0) ||
                transferAllowed ||
                msg.sender == owner(),
            "Wom3nNFT: transfer is disabled or not burning or not minting or not executed by owner"
        );

        super._beforeTokenTransfer(from_, to_, tokenId_, batchSize_);
        if (from_ == address(0)) {
            console.log("mint");

            _tokensOwnedBy[to_].push(tokenId_);
        } else if (to_ == address(0)) {
            console.log("burn");
            uint256[] storage tokenList = _tokensOwnedBy[from_];
            for (uint256 i = 0; i < tokenList.length; i++) {
                if (tokenList[i] == tokenId_) {
                    tokenList[i] = tokenList[tokenList.length - 1];
                    tokenList.pop();
                    break;
                }
            }
        } else {
            console.log("transfer");

            uint256[] storage fromList = _tokensOwnedBy[from_];
            uint256[] storage toList = _tokensOwnedBy[to_];
            for (uint256 i = 0; i < fromList.length; i++) {
                if (fromList[i] == tokenId_) {
                    fromList[i] = fromList[fromList.length - 1];
                    fromList.pop();
                    toList.push(tokenId_);
                    break;
                }
            }
        }
    }

    function tokensOwnedBy(
        address owner
    ) public view returns (uint256[] memory) {
        return _tokensOwnedBy[owner];
    }

    // change tokenURI in case of NFT storage changes
    function updateTokenURI(
        uint256 tokenId,
        string memory newURI
    ) external onlyDevOrOwner {
        require(_exists(tokenId), "Wom3nNFT: URI update for nonexistent token");
        _setTokenURI(tokenId, newURI);
    }

    function changeOwner(address newOwner) external onlyDevOrOwner {
        transferOwnership(newOwner);
    }

function transferToken(
        address from_,
        address to_,
        uint256 tokenId_
    ) public {
        require(
            (from_ == msg.sender) ||
                isApprovedForAll(from_, msg.sender) ||
                getApproved(tokenId_) == msg.sender,
            "Wom3nNFT: transfer caller is not owner nor approved"
        );
        require(
            from_ != address(0),
            "Wom3nNFT: transfer from the zero address"
        );
        require(to_ != address(0), "Wom3nNFT: transfer to the zero address");
        require(
            transferAllowed || msg.sender == owner(),
            "Wom3nNFT: transfer is disabled"
        );

        _transfer(from_, to_, tokenId_);
        
    }



    function burn(uint256 tokenId) public {
        require(_exists(tokenId), "Wom3nNFT: burn for nonexistent token");
        require(
            msg.sender == ownerOf(tokenId) || msg.sender == owner(),
            "Wom3nNFT: only the owner or contract owner can burn the token"
        );
        console.log(
            "An NFT w/ ID %s is going to be burnt",
            tokenId
        );
        _burn(tokenId);

    }

    function getOwnerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function contractURI() public pure returns (string memory) {
        string memory name = "wom3n.DAO NFT Series #1";
        string
            memory description = "wom3n.DAO - the dynamic hub for the next-gen digital female leaders and creatives, igniting innovation, growth, and impact in Web3.";
        string
            memory image = "https://bafybeihocfptf5aemeo3iuk6hi6ibccbfjemco4xuwzs7sexxqjpssolee.ipfs.nftstorage.link/WiB-Avatar-1.png";
        string memory external_link = "https://wom3n.io";

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                name,
                '",',
                '"description": "',
                description,
                '",',
                '"image": "',
                image,
                '",',
                '"external_link": "',
                external_link,
                '"'
                "}"
            )
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }
}
