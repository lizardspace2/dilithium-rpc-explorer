"use strict";

const Decimal = require("decimal.js");
const Decimal8 = Decimal.clone({ precision: 8, rounding: 8 });

const blockRewardEras = [new Decimal8(50)];
for (let i = 1; i < 34; i++) {
    let previous = blockRewardEras[i - 1];
    blockRewardEras.push(new Decimal8(previous).dividedBy(2));
}

const currencyUnits = [
    {
        type: "native",
        name: "DIL",
        multiplier: 1,
        default: true,
        values: ["", "dil", "DIL"],
        decimalPlaces: 8
    },
    {
        type: "native",
        name: "mDIL",
        multiplier: 1000,
        values: ["mdil"],
        decimalPlaces: 5
    },
    {
        type: "native",
        name: "bits",
        multiplier: 1000000,
        values: ["bits"],
        decimalPlaces: 2
    },
    {
        type: "native",
        name: "sat",
        multiplier: 100000000,
        values: ["sat", "satoshi"],
        decimalPlaces: 0
    },
    {
        type: "exchanged",
        name: "USD",
        multiplier: "usd",
        values: ["usd"],
        decimalPlaces: 2,
        symbol: "$"
    },
    {
        type: "exchanged",
        name: "EUR",
        multiplier: "eur",
        values: ["eur"],
        decimalPlaces: 2,
        symbol: "€"
    },
];

module.exports = {
    name: "Dilithium",
    ticker: "DIL",
    logoUrlsByNetwork: {
        "main": "./img/network-mainnet/logo.svg",
        "test": "./img/network-testnet/logo.svg",
        "regtest": "./img/network-regtest/logo.svg",
        "signet": "./img/network-signet/logo.svg"
    },
    coinIconUrlsByNetwork: {
        "main": "./img/network-mainnet/coin-icon.svg",
        "test": "./img/network-testnet/coin-icon.svg",
        "signet": "./img/network-signet/coin-icon.svg",
        "regtest": "./img/network-regtest/coin-icon.svg"
    },
    coinColorsByNetwork: {
        "main": "#F7931A", // Keep orange for now or change?
        "test": "#1daf00",
        "signet": "#af008c",
        "regtest": "#777"
    },
    siteTitlesByNetwork: {
        "main": "Dilithium Explorer",
        "test": "Testnet Explorer",
        "regtest": "Regtest Explorer",
        "signet": "Signet Explorer",
    },
    demoSiteUrlsByNetwork: {
        "main": "http://localhost:3002",
        "test": "http://localhost:3002",
        "signet": "http://localhost:3002",
    },
    knownTransactionsByNetwork: {
        main: "0000000000000000000000000000000000000000000000000000000000000000", // Dummy
        test: "0000000000000000000000000000000000000000000000000000000000000000",
        signet: "0000000000000000000000000000000000000000000000000000000000000000"
    },
    miningPoolsConfigUrls: [],
    maxBlockWeight: 4000000,
    maxBlockSize: 1000000,
    minTxBytes: 166,
    minTxWeight: 166 * 4,
    difficultyAdjustmentBlockCount: 2016, // Dilithium might differ
    maxSupplyByNetwork: {
        "main": new Decimal(21000000),
        "test": new Decimal(21000000),
        "regtest": new Decimal(21000000),
        "signet": new Decimal(21000000)
    },
    targetBlockTimeSeconds: 600, // Dilithium might differ
    targetBlockTimeMinutes: 10,
    currencyUnits: currencyUnits,
    currencyUnitsByName: { "DIL": currencyUnits[0], "mDIL": currencyUnits[1], "bits": currencyUnits[2], "sat": currencyUnits[3] },
    baseCurrencyUnit: currencyUnits[3],
    defaultCurrencyUnit: currencyUnits[0],
    feeSatoshiPerByteBucketMaxima: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 75, 100, 150],

    halvingBlockIntervalsByNetwork: {
        "main": 210000,
        "test": 210000,
        "regtest": 150,
        "signet": 210000
    },

    terminalHalvingCountByNetwork: {
        "main": 32,
        "test": 32,
        "regtest": 32,
        "signet": 32
    },

    coinSupplyCheckpointsByNetwork: {
        "main": [0, new Decimal(0)],
        "test": [0, new Decimal(0)],
        "signet": [0, new Decimal(0)],
        "regtest": [0, new Decimal(0)]
    },

    utxoSetCheckpointsByNetwork: {
        "main": {
            "height": 0,
            "bestblock": "0000000000000000000000000000000000000000000000000000000000000000",
            "txouts": 0,
            "bogosize": 0,
            "muhash": "0000000000000000000000000000000000000000000000000000000000000000",
            "total_amount": "0",
            "total_unspendable_amount": "0",
            "transactions": 0,
            "disk_size": 0,
            "hash_serialized_2": "0000000000000000000000000000000000000000000000000000000000000000",
            "lastUpdated": 0
        }
    },

    genesisBlockHashesByNetwork: {
        "main": "0000000000000000000000000000000000000000000000000000000000000000",
        "test": "0000000000000000000000000000000000000000000000000000000000000000",
        "regtest": "0000000000000000000000000000000000000000000000000000000000000000",
        "signet": "0000000000000000000000000000000000000000000000000000000000000000",
    },
    genesisCoinbaseTransactionIdsByNetwork: {
        "main": "0000000000000000000000000000000000000000000000000000000000000000",
        "test": "0000000000000000000000000000000000000000000000000000000000000000",
        "regtest": "0000000000000000000000000000000000000000000000000000000000000000",
        "signet": "0000000000000000000000000000000000000000000000000000000000000000"
    },
    genesisCoinbaseTransactionsByNetwork: {
        "main": {
            "hex": "",
            "txid": "",
            "hash": "",
            "size": 0,
            "vsize": 0,
            "version": 1,
            "confirmations": 1,
            "vin": [],
            "vout": [],
            "blockhash": "",
            "time": 0,
            "blocktime": 0
        },
        "test": {
            "hex": "",
            "txid": "",
            "hash": "",
            "version": 1,
            "size": 0,
            "vsize": 0,
            "weight": 0,
            "locktime": 0,
            "vin": [],
            "vout": [],
            "blockhash": "",
            "time": 0,
            "blocktime": 0
        },
        "regtest": {
            "hex": "",
            "txid": "",
            "hash": "",
            "version": 1,
            "size": 0,
            "vsize": 0,
            "weight": 0,
            "locktime": 0,
            "vin": [],
            "vout": [],
            "blockhash": "",
            "time": 0,
            "blocktime": 0
        },
        "signet": {
            "hex": "",
            "txid": "",
            "hash": "",
            "version": 1,
            "size": 0,
            "vsize": 0,
            "weight": 0,
            "locktime": 0,
            "vin": [],
            "vout": [],
            "blockhash": "",
            "time": 0,
            "blocktime": 0
        }
    },
    genesisBlockStatsByNetwork: {
        "main": {
            "avgfee": 0, "avgfeerate": 0, "avgtxsize": 0, "blockhash": "", "feerate_percentiles": [0, 0, 0, 0, 0], "height": 0, "ins": 0, "maxfee": 0, "maxfeerate": 0, "maxtxsize": 0, "medianfee": 0, "mediantime": 0, "mediantxsize": 0, "minfee": 0, "minfeerate": 0, "mintxsize": 0, "outs": 0, "subsidy": 5000000000, "swtotal_size": 0, "swtotal_weight": 0, "swtxs": 0, "time": 0, "total_out": 0, "total_size": 0, "total_weight": 0, "totalfee": 0, "txs": 1, "utxo_increase": 1, "utxo_size_inc": 0
        },
        "test": {
            "avgfee": 0, "avgfeerate": 0, "avgtxsize": 0, "blockhash": "", "feerate_percentiles": [0, 0, 0, 0, 0], "height": 0, "ins": 0, "maxfee": 0, "maxfeerate": 0, "maxtxsize": 0, "medianfee": 0, "mediantime": 0, "mediantxsize": 0, "minfee": 0, "minfeerate": 0, "mintxsize": 0, "outs": 0, "subsidy": 5000000000, "swtotal_size": 0, "swtotal_weight": 0, "swtxs": 0, "time": 0, "total_out": 0, "total_size": 0, "total_weight": 0, "totalfee": 0, "txs": 1, "utxo_increase": 1, "utxo_size_inc": 0
        },
        "regtest": {
            "avgfee": 0, "avgfeerate": 0, "avgtxsize": 0, "blockhash": "", "feerate_percentiles": [0, 0, 0, 0, 0], "height": 0, "ins": 0, "maxfee": 0, "maxfeerate": 0, "maxtxsize": 0, "medianfee": 0, "mediantime": 0, "mediantxsize": 0, "minfee": 0, "minfeerate": 0, "mintxsize": 0, "outs": 0, "subsidy": 5000000000, "swtotal_size": 0, "swtotal_weight": 0, "swtxs": 0, "time": 0, "total_out": 0, "total_size": 0, "total_weight": 0, "totalfee": 0, "txs": 1, "utxo_increase": 1, "utxo_size_inc": 0
        },
        "signet": {
            "avgfee": 0, "avgfeerate": 0, "avgtxsize": 0, "blockhash": "", "feerate_percentiles": [0, 0, 0, 0, 0], "height": 0, "ins": 0, "maxfee": 0, "maxfeerate": 0, "maxtxsize": 0, "medianfee": 0, "mediantime": 0, "mediantxsize": 0, "minfee": 0, "minfeerate": 0, "mintxsize": 0, "outs": 0, "subsidy": 5000000000, "swtotal_size": 0, "swtotal_weight": 0, "swtxs": 0, "time": 0, "total_out": 0, "total_size": 0, "total_weight": 0, "totalfee": 0, "txs": 1, "utxo_increase": 1, "utxo_size_inc": 0
        }
    },
    genesisCoinbaseOutputAddressScripthash: "",
    historicalData: [],
    exchangeRateData: {
        jsonUrl: "",
        responseBodySelectorFunction: function (responseBody) { return null; }
    },
    goldExchangeRateData: {
        jsonUrl: "",
        responseBodySelectorFunction: function (responseBody) { return null; }
    },
    blockRewardFunction: function (blockHeight, chain) {
        let halvingBlockInterval = (chain == "regtest" ? 150 : 210000);
        let index = Math.floor(blockHeight / halvingBlockInterval);

        return blockRewardEras[index] || new Decimal8(0);
    }
};
