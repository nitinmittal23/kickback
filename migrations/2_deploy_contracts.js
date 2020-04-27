const kickback = artifacts.require("./kickback.sol");

module.exports = function(deployer) {
  deployer.deploy(kickback);
};
