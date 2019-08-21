const Ownable = artifacts.require("Ownable");
const GameGuess = artifacts.require("GameGuess");

module.exports = (deployer) => {
    deployer.deploy(Ownable).then(() => deployer.deploy(GameGuess))
};
