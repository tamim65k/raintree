// Small loader to allow Vite to read the ESM config (vite.config.mjs)
// This file intentionally keeps minimal CJS wrapper to avoid ESM load errors.
module.exports = require('./vite.config.mjs')
