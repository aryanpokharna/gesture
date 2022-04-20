let bttn = document.getElementById("submitMsg");
let textReply = document.getElementById("user1");
let textReply1 = document.getElementById("user2");

const request = fetch("/decryptMessage")
  .then((data) => {
    return data.json();
  })
  .then((post) => {
    textReply.textContent = post.lastmsg;
    textReply1.textContent = post.secondlast;
  });

var Mainkey = crypto.subtle
  .generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      hash: { name: "SHA-256" },
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ["encrypt", "decrypt"]
  )
  .then(function (key) {
    // console.log(key);
    window.crypto.subtle
      .exportKey("pkcs8", key.privateKey)
      .then(function (privateKey) {
        let byteCode = String.fromCharCode.apply(
          null,
          new Uint8Array(privateKey)
        );
        // console.log(window.btoa(byteCode));
        localStorage.setItem("secretKey", byteCode);
      })
      .catch(function (err) {
        console.log(err);
      });
    window.crypto.subtle
      .exportKey("spki", key.publicKey)
      .then(function (publicKey) {
        let byteCode = String.fromCharCode.apply(
          null,
          new Uint8Array(publicKey)
        );
        // console.log(window.btoa(byteCode));
        localStorage.setItem("publicKey", byteCode);
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  async function generateKey(alg, scope) {
    return new Promise(function(resolve) {
      var genkey = crypto.subtle.generateKey(alg, true, scope)
      genkey.then(function (pair) {
        resolve(pair)
      })
    })
  }

  function arrayBufferToBase64String(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var byteString = ''
    for (var i=0; i<byteArray.byteLength; i++) {
      byteString += String.fromCharCode(byteArray[i])
    }
    return btoa(byteString)
  }

  function base64StringToArrayBuffer(b64str) {
    var byteStr = atob(b64str)
    var bytes = new Uint8Array(byteStr.length)
    for (var i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i)
    }
    return bytes.buffer
  }

  function textToArrayBuffer(str) {
    var buf = unescape(encodeURIComponent(str)) // 2 bytes for each char
    var bufView = new Uint8Array(buf.length)
    for (var i=0; i < buf.length; i++) {
      bufView[i] = buf.charCodeAt(i)
    }
    return bufView
  }

  function arrayBufferToText(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var str = ''
    for (var i=0; i<byteArray.byteLength; i++) {
      str += String.fromCharCode(byteArray[i])
    }
    return str
  }

  function arrayBufferToBase64(arr) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)))
  }

  function convertBinaryToPem(binaryData, label) {
    var base64Cert = arrayBufferToBase64String(binaryData)
    var pemCert = "-----BEGIN " + label + "-----\r\n"
    var nextIndex = 0
    var lineLength
    while (nextIndex < base64Cert.length) {
      if (nextIndex + 64 <= base64Cert.length) {
        pemCert += base64Cert.substr(nextIndex, 64) + "\r\n"
      } else {
        pemCert += base64Cert.substr(nextIndex) + "\r\n"
      }
      nextIndex += 64
    }
    pemCert += "-----END " + label + "-----\r\n"
    return pemCert
  }

  function convertPemToBinary(pem) {
    var lines = pem.split('\n')
    var encoded = ''
    for(var i = 0;i < lines.length;i++){
      if (lines[i].trim().length > 0 &&
          lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
          lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
          lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
          lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
        encoded += lines[i].trim()
      }
    }
    return base64StringToArrayBuffer(encoded)
  }

  function importPublicKey(pemKey) {
    return new Promise(function(resolve) {
      var importer = crypto.subtle.importKey("spki", convertPemToBinary(pemKey), signAlgorithm, true, ["verify"])
      importer.then(function(key) {
        resolve(key)
      })
    })
  }

  function importPrivateKey(pemKey) {
    return new Promise(function(resolve) {
      var importer = crypto.subtle.importKey("pkcs8", convertPemToBinary(pemKey), signAlgorithm, true, ["sign"])
      importer.then(function(key) {
        resolve(key)
      })
    })
  }

  function exportPublicKey(keys) {
    return new Promise(function(resolve) {
      window.crypto.subtle.exportKey('spki', keys.publicKey).
      then(function(spki) {
        resolve(convertBinaryToPem(spki, "RSA PUBLIC KEY"))
      })
    })
  }

  function exportPrivateKey(keys) {
    return new Promise(function(resolve) {
      var expK = window.crypto.subtle.exportKey('pkcs8', keys.privateKey)
      expK.then(function(pkcs8) {
        resolve(convertBinaryToPem(pkcs8, "RSA PRIVATE KEY"))
      })
    })
  }

  function exportPemKeys(keys) {
    return new Promise(function(resolve) {
      exportPublicKey(keys).then(function(pubKey) {
        exportPrivateKey(keys).then(function(privKey) {
          resolve({publicKey: pubKey, privateKey: privKey})
        })
      })
    })
  }

  function signData(key, data) {
    return window.crypto.subtle.sign(signAlgorithm, key, textToArrayBuffer(data))
  }

  function testVerifySig(pub, sig, data) {
    return crypto.subtle.verify(signAlgorithm, pub, sig, data)
  }

  async function encryptData(vector, key, data) {
    return await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        iv: vector
      },
      key,
      textToArrayBuffer(data)
    )
  }

  async function decryptData(vector, key, data) {
    return await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
          iv: vector
        },
        key,
        data
    )
  }

var signAlgorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: {
        name: "SHA-256"
    },
    modulusLength: 2048,
    extractable: false,
    publicExponent: new Uint8Array([1, 0, 1])
}

var encryptAlgorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    extractable: false,
    hash: {
      name: "SHA-256"
    }
}

var _signedData
var _data = "test"
var scopeSign = ["sign", "verify"]
var scopeEncrypt = ["encrypt", "decrypt"]
var vector = crypto.getRandomValues(new Uint8Array(16))


const encrypted = generateKey(encryptAlgorithm, scopeEncrypt).then(function(keys) {

  console.log("<== KEYS ==> ")

  encryptData(vector, keys.publicKey, msg).then(function(encryptedData) {
    encrypted = arrayBufferToBase64(encryptedData)
    console.log("<== ENCRYPTED MESSAGE ==> ", encrypted, " <==ACTUAL MESSAGE ==> ", msg)
    localStorage.setItem('enc', arrayBufferToBase64(encryptedData))
  })
})


bttn.addEventListener("click", async function () {

  let msg = document.getElementById("input_message").value;
  console.log("<== USER ENTERED MESSAGE ==> ", msg);

  const encrypted = await generateKey(encryptAlgorithm, scopeEncrypt).then(function(keys) {

      console.log("<== KEYS ==> ")

      encryptData(vector, keys.publicKey, msg).then(function(encryptedData) {
        encrypted = arrayBufferToBase64(encryptedData)
        console.log("<== ENCRYPTED MESSAGE ==> ", encrypted, " <==ACTUAL MESSAGE ==> ", msg)
        localStorage.setItem('enc', arrayBufferToBase64(encryptedData))
      })
    })

  var data = { message: msg, encrypt: localStorage.getItem('enc') };
  console.log("<== ENCRYPTED MESSAGE RETRIEVED FROM LOCAL ==> ", localStorage.getItem('enc'));

  fetch("/encryptMessage", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success", data);
    })
    .catch((error) => {
      console.error("Error", error);
    });
});