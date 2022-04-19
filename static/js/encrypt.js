//const forge = require('node-forge')

// bttn.addEventListener("click", function() {
//         const submitMessage = document.getElementById("input")
//         //dont need salt as its not used for making the key, instead we have the sessionKey
//         const salt = forge.random.getBytesSync(16)
//         const iv = forge.random.getBytesSync(16)
        
//         //Session storage key fix 
//         const key = sessionStorage.getItem('sessionKey')
//         const cipher = forge.cipher.createCipher('AES-CBC', key)

//         cipher.start({iv: iv})
//         cipher.update(forge.util.createBuffer(submitMessage))
//         cipher.finish()

//         const encrypted = cipher.output.bytes()

//         const data = {message : encrypted, iv: iv, sessionKey: key}
//         fetch("/encryptMessage", {
//             method: 'POST',
//             headers: {
//                 'Content-type': 'application/json',
//                 'Accept' : 'application/json'
//           },
//           body: JSON.stringify(data),
//         }).then(response => response.json()).then(data => {console.log('Success', data)
//         }).catch((error) => {console.error('Error', error);
//     });
//     })

// console.log({
//     iv: forge.util.encode64(iv),
//     salt: forge.util.encode64(salt),
//     encrypted: forge.util.encode64(encrypted),
//     concatenned: forge.util.encode64(salt + iv + encrypted)
// });

let bttn = document.getElementById('submitMsg');
// First get the user that we are chatting with 
//const user = document.

// //Now fetch the get userKey api to retrieve their pk
// const endpoint = "/userKey/ap"//+user
// const request = fetch(endpoint).then(data=> {
//     return data.json();
// }).then(post=> {post.PublicKey})
// //const pk = request.get('PublicKey')
// console.log(request)
let textReply = document.getElementById('user1')
let textReply1 = document.getElementById('user2')
var valuefromRequest;
const request = fetch("/decryptMessage").then(data=> {
    return data.json();
}).then(post=> {textReply.textContent = post.lastmsg; textReply1.textContent = post.secondlast;})
// i think we are gonna have to decrypt within this .then section 
// it doesnt seem that we can extract the key-value pairs into a variable to use later 

// const input = document.querySelector('message');
// const log = document.getElementById('message_input');
// input.addEventListener('input', store_msg);

// var msgSend = document.querySelector('input');
// var result = document.getElementsByClassName('result');
var Mainkey = crypto.subtle.generateKey({
    name : "RSA-OAEP",
    modulusLength : 2048,
    hash: {name: "SHA-256"},
    publicExponent: new Uint8Array([1, 0, 1]),
},
    true,
    ['encrypt', 'decrypt']
).then(function(key){
    console.log(key);
    window.crypto.subtle.exportKey(
        "pkcs8",
        key.privateKey
    ).then(function (privateKey){
        let byteCode = String.fromCharCode.apply(null, new Uint8Array(privateKey))
        console.log(window.btoa(byteCode))
        localStorage.setItem("secretKey", byteCode)
    }).catch(function(err){
        console.log(err);
    });
    window.crypto.subtle.exportKey(
        "spki",
        key.publicKey
    ).then(function (publicKey){
        let byteCode = String.fromCharCode.apply(null, new Uint8Array(publicKey))
        console.log(window.btoa(byteCode))
        localStorage.setItem("publicKey", byteCode)
    }).catch(function(err){
        console.error(err)
    });
})
var key1 = btoa(localStorage.getItem("publicKey"))
//console.log(btoa(localStorage.getItem("secretKey")))

function encryptString(string){
    var encoder = new TextEncoder();
    var encoded = encoder.encode(string)
    var iv = crypto.getRandomValues(new Uint8Array(12))
    return crypto.subtle.encrypt({
        name : "AES-GCM",
        iv: iv,
        additionalData: ArrayBuffer,
    },
    key1,
    encoded
    )
}

bttn.addEventListener("click", function() {
  //result.textContent = "Inputted text: " + e.data;
  let msg = document.getElementById("input_message").value;
  //dont need salt as its not used for making the key, instead we have the sessionKey
//   const salt = forge.random.getBytesSync(16)
//   const iv = forge.random.getBytesSync(16)
  const encrypted = encryptString(msg).then(function(encrypted){
    console.log(new Uint8Array(encrypted));
    return new Uint8Array(encrypted)
  });
  //Session storage key fix 
//   const key = 0101001 //sessionStorage.getItem('sessionKey')
//   const cipher = forge.cipher.createCipher('AES-CBC', key)

//   cipher.start({iv: iv})
//   cipher.update(forge.util.createBuffer(msg))
//   cipher.finish()
//   const encrypted = cipher.output.bytes()
  
  const data = {message : msg, encrypt: encrypted}

  fetch("/encryptMessage", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => response.json()).then(data => {console.log('Success', data)
    }).catch((error) => {console.error('Error', error);
    });
  // log.textContent = e.target.value;
});

// function store_msg(e) {
//   log.textContent = e.target.value;
// }