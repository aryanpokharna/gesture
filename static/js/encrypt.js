const forge = require('node-forge')

const bttn = document.querySelector('button');

bttn.addEventListener("click", function() {
        const submitMessage = document.getElementById("chatMsg")
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

        const data = {message : encrypted}
        fetch("/encryptMessage", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept' : 'application/json'
          },
          body: JSON.stringif(data),
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