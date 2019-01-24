const { override, useEslintRc, addDecoratorsLegacy } = require("customize-cra");

module.exports = override(useEslintRc(), addDecoratorsLegacy());
