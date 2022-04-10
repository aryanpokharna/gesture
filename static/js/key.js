
//const crypto = require("crypto");
//import { generateKeyPairSync } from "crypto"
//import crypto from 'crypto';
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const user = nacl.box.keyPair();
// The `generateKeyPairSync` method accepts two arguments:
// 1. The type of keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
// 	// The standard secure default length for RSA keys is 2048 bits
// 	modulusLength: 2048,
// });
console.log(user.publicKey, user.secretKey);

