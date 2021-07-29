const SHA256 = require("crypto-js/sha256");
const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const secpNoble = require('noble-secp256k1')


var EC = require("elliptic").ec;
var ec = new EC("secp256k1");

class Transaction {
    constructor(amount, from, to) {
        this.amount = amount;

        if (typeof from !== "string") {
            this.fromPublic = from.getPublic("hex");
            this.fromPrivate = from.getPrivate("hex");
            this.toPublic = to.getPublic("hex");
            this.toPrivate = to.getPrivate("hex");
            this.signature = to.sign(this.amount).toDER('hex');

        } else {
            this.from = from;
            this.to = to;
        }
    }

}


class Coinbase {
    constructor(amount, to) {
        this.amount = amount;
        this.to = to;
    }
}

class Block {
    constructor(index, nonce, data, previousHash, coinbase, keyPair) {
        this.index = index;
        this.nonce = nonce;
        this.data = data;
        this.previousHash = previousHash;

        if (coinbase) {
            this.coinbase = coinbase;
        } else {
            this.coinbase = "";
        }

        if (keyPair) {
            this.privateKey = keyPair.getPrivate("hex");
        }

        this.stringData = this.dataToString(data);
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.index + this.nonce + this.stringData + this.previousHash
        ).toString();
    }


    setTransactions(Transactions) {
        this.data = Transactions;
        this.stringData = this.dataToString(Transactions);
        this.hash = this.calculateHash();
        this.mineBlock(4)
    }

    setCoinbase(coinbase) {
        this.coinbase = coinbase;
        this.stringData = this.dataToString(this.data);
        this.hash = this.calculateHash();
        this.mineBlock(4)
    }

    mineBlock(difficulty) {
        this.nonce = 0;
        this.hash = this.calculateHash();

        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        return this;
    }

    dataToString(data) {
        if (data instanceof String || typeof data === 'string') {
            return data;
        }

        let str = "";

        if (this.privateKey) {
            for (let i = 0; i < data.length; i++) {
                str += data[i].amount + data[i].fromPublic + data[i].toPublic + data[i].signature;
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                str += data[i].amount + data[i].from + data[i].to;
            }
        }
        if (this.coinbase != "") {
            return (this.coinbase.amount + this.coinbase.to + str)
        }
        return str;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        var block = new Block(1, 1, "", "");
        block.mineBlock(4);
        return block;
    }

    getLatestBlockHash() {
        return this.chain[this.chain.length - 1].hash;
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlockHash();
        newBlock.mineBlock(4); //for creating dummy already "mined" blocks
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
module.exports.Coinbase = Coinbase;
module.exports.Block = Block;