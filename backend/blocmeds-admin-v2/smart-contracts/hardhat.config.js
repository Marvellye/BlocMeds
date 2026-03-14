require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    base_testnet: {
      url: "https://testnet.hashio.io/api",
      accounts: ["0x4e5abf0353cc9ddcf7a81ca060c5211a4be3cdfbdc95a066af4731402838aef6"],
      chainId: 296
    }
  }
};
