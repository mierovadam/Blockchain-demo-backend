const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')


var EC = require("elliptic").ec;
var ec = new EC("secp256k1");

const { Blockchain, Block, Transaction, Coinbase, Keys } = require("./blockchain");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.listen(port, () => console.log(`Listening on port ${port}`));

// get blockchain data
app.get("/getblockchain", (req, res) => {
    let blockchainJson = createBlockchainData();

    res.send(JSON.stringify(blockchainJson));
});

const createBlockchainData = () => {
    let bChain = new Blockchain();

    bChain.addBlock(new Block(2, 0, "", ""));
    bChain.addBlock(new Block(3, 0, "", ""));
    bChain.addBlock(new Block(4, 0, "", ""));

    return bChain;
};

// get blockchain data
app.get("/gettokenblockchain", (req, res) => {
    let blockchainJson = createTokenBlockchainData();

    res.send(JSON.stringify(blockchainJson));
});

const createTokenBlockchainData = () => {
    let bChain = new Blockchain();

    let trans1 = [
        new Transaction("10", "adam", "avi"),
        new Transaction("15", "darcy", "bingly"),
        new Transaction("51", "yuzon", "david"),
        new Transaction("57", "tomer", "shlomi"),
    ];
    let trans2 = [
        new Transaction("7", "path", "nativ"),
        new Transaction("50", "yuzoninio", "ronaldinio"),
        new Transaction("32", "messi", "avi"),
        new Transaction("68", "tami", "avi"),
    ];
    let trans3 = [
        new Transaction("35", "batya", "adam"),
        new Transaction("110", "yafa", "yuzon"),
        new Transaction("25", "sapir", "avi"),
        new Transaction("45", "alon", "shalom"),
    ];
    let trans4 = [
        new Transaction("100", "eylon", "alon"),
        new Transaction("19", "sami", "bob"),
        new Transaction("46", "yosef", "moses"),
        new Transaction("26", "adam", "avi"),
    ];

    bChain.chain[0].setTransactions(trans1);

    bChain.addBlock(new Block(2, 0, trans2, ""));
    bChain.addBlock(new Block(3, 0, trans3, ""));
    bChain.addBlock(new Block(4, 0, trans4, ""));

    return bChain;
};

// get blockchain data
app.get("/getcoinbaseblockchain", (req, res) => {
    let bChain = createCoinbaseBlockchainData();

    res.send(JSON.stringify(bChain));
});

const createCoinbaseBlockchainData = () => {
    let bChain = new Blockchain();

    let trans1 = [];

    let trans2 = [
        new Transaction("7", "path", "nativ"),
        new Transaction("50", "yuzoninio", "ronaldinio"),
        new Transaction("32", "messi", "avi"),
        new Transaction("68", "tami", "avi"),
    ];
    let trans3 = [
        new Transaction("35", "batya", "adam"),
        new Transaction("110", "yafa", "yuzon"),
        new Transaction("25", "sapir", "avi"),
        new Transaction("45", "alon", "shalom"),
    ];
    let trans4 = [
        new Transaction("100", "eylon", "alon"),
        new Transaction("19", "sami", "bob"),
        new Transaction("46", "yosef", "moses"),
        new Transaction("26", "adam", "avi"),
    ];

    bChain.chain[0].setTransactions(trans1);
    bChain.chain[0].setCoinbase(new Coinbase("100", "Adam"));
    bChain.addBlock(new Block(2, 0, trans2, "", new Coinbase("100", "Adam")));
    bChain.addBlock(new Block(3, 0, trans3, "", new Coinbase("100", "Adam")));
    bChain.addBlock(new Block(4, 0, trans4, "", new Coinbase("100", "Adam")));

    return bChain;
};

// get blockchain data
app.get("/getensignedblockchain", (req, res) => {
    let bChain = createSignedBlockchain();
    console.log("\n" + JSON.stringify(bChain));

    res.send(JSON.stringify(bChain));
});


const createSignedBlockchain = () => {
    let bChain = new Blockchain();

    let keyPair = ec.genKeyPair();
    privateKey = keyPair.getPrivate("hex")
    publicKey = keyPair.getPublic("hex")

    let keys = [
        ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair(),
        ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair(),
        ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair(), ec.genKeyPair()
    ]

    let trans1 = [];

    let trans2 = [
        new Transaction("7", keyPair, keys[0]),
        new Transaction("50", keyPair, keys[1]),
        new Transaction("32", keyPair, keys[2]),
        new Transaction("68", keyPair, keys[3]),
    ];

    let trans3 = [
        new Transaction("35", keys[0], keys[4]),
        new Transaction("110", keys[1], keys[5]),
        new Transaction("25", keys[2], keys[6]),
        new Transaction("45", keys[3], keys[7])
    ];

    let trans4 = [
        new Transaction("100", keys[4], keys[8]),
        new Transaction("19", keys[5], keys[9]),
        new Transaction("46", keys[6], keys[10]),
        new Transaction("26", keys[7], keys[11])
    ];

    // bChain.chain[0].setCoinbase(new Coinbase("100", publicKey));
    // bChain.chain[0].setTransactions(trans1);

    bChain.chain[0] = new Block(1, 0, trans1, "", new Coinbase("100", publicKey), keyPair);
    bChain.chain[0].mineBlock(4);
    bChain.addBlock(new Block(2, 0, trans2, "", new Coinbase("100", publicKey), keyPair));
    bChain.addBlock(new Block(3, 0, trans3, "", new Coinbase("100", publicKey), keyPair));
    bChain.addBlock(new Block(4, 0, trans4, "", new Coinbase("100", publicKey), keyPair));

    return bChain;
};


// mine a specific block
app.get("/mineblock", (req, res) => {
    let block = new Block(
        parseInt(req.query.index),
        parseInt(req.query.nonce),
        req.query.data,
        req.query.prevHash
    );

    // console.log("\nBEFOREEEE   " + JSON.stringify(block));
    block.mineBlock(4);
    // console.log("\nAFTERRRRR   " + JSON.stringify(block) + "\n");

    res.send(JSON.stringify(block));
});