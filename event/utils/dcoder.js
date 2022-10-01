var ethers = require("ethers");
const decoder = new ethers.utils.AbiCoder();
const from = decoder.decode(
    ["address"],
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
);
console.log(from);
// console.log(
//   ethers.utils.defaultAbiCoder.decode(
//     ["address"],
//     "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b"
//   )
// );
