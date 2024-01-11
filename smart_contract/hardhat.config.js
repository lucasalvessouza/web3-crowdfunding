require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
// https://eth-sepolia.g.alchemy.com/v2/SrI_-9Vt7Mj6RXG-jk8nirq9X9l0sNUa
module.exports = {
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/E2MUYzIfYIF7pRQQ2PaEj8KhcjXMXviK',
      accounts: ['d6d89f5cfe6c61da62c17e04e7315e7ff32f33d862e17a723e3ca184c005036b'],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};