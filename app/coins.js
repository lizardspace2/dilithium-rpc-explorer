"use strict";

const btc = require("./coins/btc.js");
const dil = require("./coins/dil.js");

module.exports = {
	"BTC": btc,
	"DIL": dil,

	"coins": ["BTC", "DIL"]
};