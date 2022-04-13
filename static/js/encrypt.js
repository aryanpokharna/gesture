const forge = require('node-forge')

const submitMessage = document.querySelector('.text')
const bttn = document.querySelector('button')

bttn.addEventListener("click", encryptMessage)
    function encryptMessage() {
        //dont need salt as its not used for making the key, instead we have the sessionKey
        const salt = forge.random.getBytesSync(16)
        const iv = forge.random.getBytesSync(16)

        const key = sessionStorage.getItem('sessionKey')
        const cipher = forge.cipher.createCipher('AES-CBC', key)

        cipher.start({iv: iv})
        cipher.update(forge.util.createBuffer(submitMessage))
        cipher.finish()

        const encrypted = cipher.output.bytes()
    }

// console.log({
//     iv: forge.util.encode64(iv),
//     salt: forge.util.encode64(salt),
//     encrypted: forge.util.encode64(encrypted),
//     concatenned: forge.util.encode64(salt + iv + encrypted)
//   });