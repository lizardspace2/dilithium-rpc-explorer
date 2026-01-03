"use strict";

const axios = require("axios");
const config = require("./../config.js");
const utils = require("./../utils.js");
const coins = require("./../coins.js");

const coinConfig = coins[config.coin];

function getAddressDetails(address, scriptPubkey, sort, limit, offset) {
    return new Promise(async (resolve, reject) => {
        try {
            // e.g. http://34.66.15.88:3001/address/73af...
            // The user can configure DILITHIUM_NODE_URL in .env, or we use a fallback
            const nodeUrl = process.env.DILITHIUM_NODE_URL || process.env.DILITHIUMEXP_BITCOIND_URI || "http://127.0.0.1:3001";

            const apiUrl = `${nodeUrl}/address/${address}`;

            const response = await axios.get(apiUrl);
            const data = response.data;

            /*
                Dilithium Node Response:
                {
                    "address": "73af...",
                    "balance": 100,
                    "unspentTxOuts": [ ... ]
                }
            */

            // Map to Explorer expected format
            const addressDetails = {
                address: data.address || address,
                balance: data.balance || 0,
                balanceSat: data.balance || 0,
                txCount: data.unspentTxOuts ? data.unspentTxOuts.length : 0,
                txids: [],
                validateAddressResult: {
                    isvalid: true,
                    address: address
                }
            };

            // If Naivecoin UTXOs have tx references, we can populate txids
            // Assuming unspentTxOuts structure: [{ "txOutId": "...", "txOutIndex": 0, "address": "...", "amount": 50 }]
            if (data.unspentTxOuts) {
                addressDetails.txids = data.unspentTxOuts.map(utxo => utxo.txOutId).filter(id => id);
            }

            resolve({ addressDetails: addressDetails });

        } catch (err) {
            utils.logError("dilithiumNodeApiError", err);
            resolve({ addressDetails: null, errors: [err.toString()] });
        }
    });
}

module.exports = {
    getAddressDetails: getAddressDetails
};
