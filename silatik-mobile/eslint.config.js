// https://docs.expo.dev/guides/using-eslint/
const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: path.join(__dirname, './'), // Coba dengan path absolut
  resolvePluginsRelativeTo: path.join(__dirname, './'),
});



// .eslintrc.js (format lama)
// .eslintrc.js

module.exports = {
	// ...other config
	extends: "eslint:recommended",
	rules: {
		semi: ["warn", "always"],
	},
	// ...other config
};


