const { Blockchain, Block } = require("./blockchain");

// const bChain = () => {
//     let coin = new Blockchain();
//     //  console.log("Mining block 1...");
//     coin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));
//     // console.log("Mining block 2...");
//     coin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));

//     //  console.log(JSON.stringify(coin, null, 4));
//     return JSON.stringify(coin, null, 4);
// }

// const mine = () => {
//     let block = new Block(1, "20/07/2017", { amount: 4 });
//     block.mineBlock(4);
//     console.log("hashAdam :" + block.hash);
//     return JSON.stringify(block, null, 4);
// };
// module.exports.bChain = bChain;



// module.exports.mine = mine;