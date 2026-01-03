var axios = require("axios");
var config = require("../config.js");
var utils = require("../utils.js");

function getDilithiumData(endpoint) {
	var url = (process.env.DILITHIUM_NODE_URL || "http://localhost:3001") + endpoint;
	return new Promise(function (resolve, reject) {
		axios.get(url).then(function (response) {
			resolve(response.data);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function getDilithiumDataPost(endpoint, data) {
	var url = (process.env.DILITHIUM_NODE_URL || "http://localhost:3001") + endpoint;
	return new Promise(function (resolve, reject) {
		axios.post(url, data).then(function (response) {
			resolve(response.data);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function getBlockCount() {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/blocks").then(function (blocks) {
			resolve(blocks.length);
		}).catch(reject);
	});
}

function getNetworkInfo() {
	return new Promise(function (resolve, reject) {
		Promise.all([
			getDilithiumData("/peers"),
			getDilithiumData("/address")
		]).then(([peers, address]) => {
			resolve({
				version: 1000000,
				subversion: "/Dilithium:1.0.0/",
				protocolversion: 70015,
				localservices: "000000000000040d",
				localrelay: true,
				timeoffset: 0,
				connections: peers.length,
				networks: [],
				start_time: Math.floor(Date.now() / 1000), // Approximate
				relayfee: 0.00001,
				warnings: "",
				address: address.address
			});
		}).catch(reject);
	});
}

function getBlockchainInfo() {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/blocks").then(function (blocks) {
			var bestBlock = blocks[blocks.length - 1] || { hash: "000000", difficulty: 0, timestamp: 0 };
			resolve({
				chain: "main",
				blocks: Math.max(0, blocks.length - 1),
				headers: Math.max(0, blocks.length - 1),
				bestblockhash: bestBlock.hash,
				difficulty: bestBlock.difficulty,
				mediantime: bestBlock.timestamp,
				verificationprogress: 1,
				initialblockdownload: false,
				chainwork: "0000000000000000000000000000000000000000000000000000000000000000", // Dummy
				size_on_disk: 0,
				pruned: false,
				softforks: {},
				bip9_softforks: {},
				warnings: ""
			});
		}).catch(reject);
	});
}

function mapBlockToBtc(block) {
	return {
		hash: block.hash,
		confirmations: 1, // Calculate dynamic?
		strippedsize: 0,
		size: 0,
		weight: 0,
		height: block.index,
		version: 1,
		versionHex: "00000001",
		merkleroot: block.merkleRoot,
		tx: block.data ? block.data.map(tx => tx.id) : [],
		time: block.timestamp,
		mediantime: block.timestamp,
		nonce: 0,
		bits: "1d00ffff",
		difficulty: block.difficulty,
		chainwork: "0000",
		nTx: block.data ? block.data.length : 0,
		previousblockhash: block.previousHash,
		minterAddress: block.minterAddress,
		minterBalance: block.minterBalance
	};
}

function getBlockByHash(hash) {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/block/" + hash).then(function (block) {
			resolve(mapBlockToBtc(block));
		}).catch(function (err) {
			// If 404, might be user error or block not found
			reject(err);
		});
	});
}

function getBlockByIndex(index) {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/block/index/" + index).then(function (block) {
			resolve(mapBlockToBtc(block));
		}).catch(reject);
	});
}

function getBlocksByHeight(heights) {
	if (!heights || heights.length === 0) return Promise.resolve([]);

	let sorted = [...heights].sort((a, b) => a - b);
	let min = sorted[0];
	let max = sorted[sorted.length - 1];

	let isContiguous = true;
	for (let i = 0; i < sorted.length - 1; i++) {
		if (sorted[i + 1] !== sorted[i] + 1) {
			isContiguous = false;
			break;
		}
	}

	if (isContiguous) {
		return new Promise(function (resolve, reject) {
			getDilithiumData(`/blocks/${min}/${max}`).then(function (blocks) {
				let mapped = blocks.map(mapBlockToBtc);
				mapped.sort((a, b) => b.height - a.height);
				resolve(mapped);
			}).catch(reject);
		});
	} else {
		let promises = heights.map(h => getBlockByIndex(h));
		return Promise.all(promises);
	}
}

function getTotalSupply() {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/totalSupply").then(function (response) {
			resolve(response);
		}).catch(reject);
	});
}

function getRichList() {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/addresses").then(function (addresses) {
			resolve(addresses);
		}).catch(reject);
	});
}

function getRawTransaction(txid) {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/transaction/" + txid).then(function (tx) {
			// Map Dilithium Tx to Bitcoin Tx
			var btcTx = {
				txid: tx.id,
				hash: tx.id,
				version: 1,
				size: 0,
				vsize: 0,
				weight: 0,
				locktime: 0,
				vin: tx.txIns.map((input, index) => {
					return {
						txid: input.txOutId || "0000000000000000000000000000000000000000000000000000000000000000",
						vout: input.txOutIndex,
						scriptSig: {
							asm: "",
							hex: input.signature || ""
						},
						sequence: 4294967295,
						coinbase: input.txOutId ? undefined : "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f662073656c6f6e64206261696c6f757420666f722062616e6b73" // Dummy coinbase for genesis/mint
					};
				}),
				vout: tx.txOuts.map((output, index) => {
					return {
						value: output.amount,
						n: index,
						scriptPubKey: {
							asm: "OP_DUP OP_HASH160 ...",
							hex: "",
							reqSigs: 1,
							type: "pubkeyhash",
							addresses: [output.address]
						}
					};
				}),
				hex: "000000" // We don't have raw hex, mock it
			};
			resolve(btcTx);
		}).catch(reject);
	});
}

function getPeerInfo() {
	return new Promise(function (resolve, reject) {
		getDilithiumData("/peers").then(function (peers) {
			var mappedPeers = peers.map((p, i) => {
				return {
					id: i,
					addr: p, // Naivecoin might return just IP or IP:Port
					addrbind: p,
					services: "0000000000000000",
					relaytxes: true,
					lastsend: 0,
					lastrecv: 0,
					bytessent: 0,
					bytesrecv: 0,
					conntime: 0,
					timeoffset: 0,
					pingtime: 0,
					minping: 0,
					version: 70015,
					subver: "/Dilithium:1.0.0/",
					inbound: false,
					addnode: false,
					startingheight: 0,
					banscore: 0,
					synced_headers: 0,
					synced_blocks: 0,
					inflight: [],
					whitelisted: false,
					minfeefilter: 0,
					bytessent_per_msg: {},
					bytesrecv_per_msg: {}
				};
			});
			resolve(mappedPeers);
		}).catch(reject);
	});
}

module.exports = {
	getBlockCount: getBlockCount,
	getNetworkInfo: getNetworkInfo,
	getBlockchainInfo: getBlockchainInfo,
	getBlockByHash: getBlockByHash,
	getRawTransaction: getRawTransaction,
	getPeerInfo: getPeerInfo,
	getBlocksByHeight: getBlocksByHeight,
	getTotalSupply: getTotalSupply,
	getRichList: getRichList,
	// Mock other required methods to avoid crash
	getMempoolInfo: () => Promise.resolve({ size: 0, bytes: 0 }),
	getMiningInfo: () => Promise.resolve({ blocks: 0, currentblocksize: 0, currentblocktx: 0, difficulty: 0, errors: "", networkhashps: 0, pooledtx: 0, chain: "" }),
	getUptimeSeconds: () => Promise.resolve(0),
	getNetTotals: () => Promise.resolve({ totalbytesrecv: 0, totalbytessent: 0, timemillis: Date.now() }),
	getChainTxStats: () => Promise.resolve(null),
	getSmartFeeEstimate: () => Promise.resolve({ feerate: 0.0001 }),
	getUtxoSetSummary: function () {
		return new Promise((resolve, reject) => {
			getTotalSupply().then(supply => {
				resolve({
					total_amount: supply,
					txouts: 0,
					disk_size: 0,
					bestblock: ""
				});
			}).catch(err => {
				// If fails, return null
				resolve(null);
			});
		});
	},
	getBlockStats: () => Promise.resolve(null),
	getIndexInfo: () => Promise.resolve({}),
	getDeploymentInfo: () => Promise.resolve({}),
	validateAddress: (address) => Promise.resolve({ isvalid: true, address: address }), // Mock to prevent crash

	getRpcData: function (cmd) {
		switch (cmd) {
			case "getblockcount": return getBlockCount();
			case "getnetworkinfo": return getNetworkInfo();
			case "getblockchaininfo": return getBlockchainInfo();
			case "getpeerinfo": return getPeerInfo();
			case "getnettotals": return Promise.resolve({ totalbytesrecv: 0, totalbytessent: 0, timemillis: Date.now() });
			case "getmempoolinfo": return Promise.resolve({ size: 0, bytes: 0 });
			case "getmininginfo": return Promise.resolve({ blocks: 0, currentblocksize: 0, currentblocktx: 0, difficulty: 0, errors: "", networkhashps: 0, pooledtx: 0, chain: "" });
			case "getblocktemplate": return Promise.resolve({ transactions: [] });
			case "uptime": return Promise.resolve(0);
			case "validateaddress": return Promise.resolve({ isvalid: true, address: params[0] }); // Avoid calling missing RPC
			default: return Promise.resolve({}); // Return empty for unknown to prevent crash
		}
	},

	getRpcDataWithParams: function (request) {
		var method = request.method;
		var params = request.parameters;

		switch (method) {
			case "getblockhash":
				// Dilithium doesn't seem to have getBlockHashByHeight in the cheat sheet?
				// But we need it for getBlockByHeight. 
				// Assuming /blocks returns all, we might need to fetch all and pick one. 
				// WARNING: Heavy operation.
				// Use optimized endpoint
				return new Promise((resolve, reject) => {
					getDilithiumData("/block/index/" + params[0]).then(block => {
						if (block) resolve(block.hash);
						else reject("Block not found");
					}).catch(reject);
				});

			case "getblock": return getBlockByHash(params[0]);
			case "getblockheader": return getBlockByHash(params[0]); // Dilithium block serves as header too
			case "getrawtransaction": return getRawTransaction(params[0]);
			case "getchaintxstats": return Promise.resolve(null);
			case "estimatesmartfee": return Promise.resolve({ feerate: 0.0001 });
			case "gettxoutsetinfo": return Promise.resolve(null);
			case "validateaddress": return Promise.resolve({ isvalid: true, address: params[0] });
			default: return Promise.resolve(null);
		}
	}
};
