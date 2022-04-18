const forge = require('node-forge')

const bttn = document.querySelector('button');

// First get the user that we are chatting with 
//const user = document.

//Now fetch the get userKey api to retrieve their pk
const endpoint = "/userKey/dg"//+user
const request = fetch(endpoint).then(data=> {
    return data.json();
})
console.log(request)

bttn.addEventListener("click", function() {
        const submitMessage = document.getElementById("input")
        //dont need salt as its not used for making the key, instead we have the sessionKey
        const salt = forge.random.getBytesSync(16)
        const iv = forge.random.getBytesSync(16)
        
        //Session storage key fix 
        const key = sessionStorage.getItem('sessionKey')
        const cipher = forge.cipher.createCipher('AES-CBC', key)

        cipher.start({iv: iv})
        cipher.update(forge.util.createBuffer(submitMessage))
        cipher.finish()

        const encrypted = cipher.output.bytes()

        const data = {message : encrypted, iv: iv, sessionKey: key}
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
    })

// console.log({
//     iv: forge.util.encode64(iv),
//     salt: forge.util.encode64(salt),
//     encrypted: forge.util.encode64(encrypted),
//     concatenned: forge.util.encode64(salt + iv + encrypted)
// });