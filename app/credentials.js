"use strict";

const os = require('os');
const path = require('path');
const url = require('url');
const fs = require("fs");

const debug = require("debug");
const debugLog = debug("dilithiumexp:config");

const btcUri = process.env.DILITHIUMEXP_BITCOIND_URI ? url.parse(process.env.DILITHIUMEXP_BITCOIND_URI, true) : { query: {} };
const btcAuth = btcUri.auth ? btcUri.auth.split(':') : [];




function loadFreshRpcCredentials() {
	let username = btcAuth[0] || process.env.DILITHIUMEXP_BITCOIND_USER;
	let password = btcAuth[1] || process.env.DILITHIUMEXP_BITCOIND_PASS;

	let authCookieFilepath = btcUri.query.cookie || process.env.DILITHIUMEXP_BITCOIND_COOKIE || path.join(os.homedir(), '.dilithium', '.cookie');

	let authType = "usernamePassword";

	if (!username && !password && fs.existsSync(authCookieFilepath)) {
		authType = "cookie";
	}

	if (authType == "cookie") {
		debugLog(`Loading RPC cookie file: ${authCookieFilepath}`);

		[username, password] = fs.readFileSync(authCookieFilepath).toString().trim().split(':', 2);

		if (!password) {
			throw new Error(`Cookie file ${authCookieFilepath} in unexpected format`);
		}
	}

	return {
		host: btcUri.hostname || process.env.DILITHIUMEXP_BITCOIND_HOST || "127.0.0.1",
		port: btcUri.port || process.env.DILITHIUMEXP_BITCOIND_PORT || 8332,

		authType: authType,

		username: username,
		password: password,

		authCookieFilepath: authCookieFilepath,

		timeout: parseInt(btcUri.query.timeout || process.env.DILITHIUMEXP_BITCOIND_RPC_TIMEOUT || 5000),
	};
}

module.exports = {
	loadFreshRpcCredentials: loadFreshRpcCredentials,

	rpc: loadFreshRpcCredentials(),

	// optional: enter your api access key from ipstack.com below
	// to include a map of the estimated locations of your node's
	// peers
	// format: "ID_FROM_IPSTACK"
	ipStackComApiAccessKey: process.env.DILITHIUMEXP_IPSTACK_APIKEY,

	// optional: enter your api access key from mapbox.com below
	// to enable the tiles for map of the estimated locations of
	// your node's peers
	// format: "APIKEY_FROM_MAPBOX"
	mapBoxComApiAccessKey: process.env.DILITHIUMEXP_MAPBOX_APIKEY,

	// optional: GA tracking code
	// format: "UA-..."
	googleAnalyticsTrackingId: process.env.DILITHIUMEXP_GANALYTICS_TRACKING,

	// optional: sentry.io error-tracking url
	// format: "SENTRY_IO_URL"
	sentryUrl: process.env.DILITHIUMEXP_SENTRY_URL,
};
