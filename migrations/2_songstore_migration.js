const Songstore = artifacts.require("Songstore");

module.exports = function(deployer) {
  deployer.deploy(Songstore);
};
