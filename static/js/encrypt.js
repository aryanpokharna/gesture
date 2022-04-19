let bttn = document.getElementById("submitMsg");
let textReply = document.getElementById("user1");
let textReply1 = document.getElementById("user2");
var valuefromRequest;
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
var key1 = btoa(localStorage.getItem("publicKey"));

function encryptString(string) {
  var encoder = new TextEncoder();
  var encoded = encoder.encode(string);
  var iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
      additionalData: ArrayBuffer,
    },
    key1,
    encoded
  );
}

bttn.addEventListener("click", function () {
  let msg = document.getElementById("input_message").value;
  const encrypted = encryptString(msg).then(function (encrypted) {
    console.log(new Uint8Array(encrypted));
    return new Uint8Array(encrypted);
  });
  const data = { message: msg, encrypt: encrypted };

  fetch("/encryptMessage", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
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
