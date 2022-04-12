
//const crypto = require("crypto");
//const { generateKeyPairSync } = require('crypto');
//import crypto from 'crypto';
//const nacl = require('tweetnacl');
//nacl.util = require('tweetnacl-util');

//const user = nacl.box.keyPair();
// The `generateKeyPairSync` method accepts two arguments:
// 1. The type of keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
//const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
// 	// The standard secure default length for RSA keys is 2048 bits
	//modulusLength: 2048,
     //});

// const keyPair = window.crypto.subtle.generateKey(
//     {
//         name: "ECDH",
//         namedCurve: "P-256",
//       },
//       true,
//       ["deriveKey", "deriveBits"]
//     );

const pki = require('node-forge').pki;
var keys = pki.rsa.generateKeyPair(2048);
//needs to be heavily edited still but somewhat works 
console.log(keys.publicKey);
var pub = pki.publicKeyToPem(keys.publicKey, 72)
console.log(pub)
