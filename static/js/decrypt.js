const forge = require('node-forge')

const encrypted = forge.util.binary.base64.decode("PUT IN encrypted message with salt and iv")

const salt_len = iv_len = 16

//dont need salt as its not used for making the key, instead we have the sessionKey
const salt = forge.util.createBuffer(encrypted.slice(0, salt_len))
const iv = forge.util.createBuffer(encrypted.slice(0+salt_len, salt_len+iv_len))

const key = sessionStorage.getItem('sessionKey')
const decipher = forge.cipher.createDecipher("AES-CBC", key)

decipher.start({iv: iv})
decipher.update(forge.util.createBuffer(encrypted.slice(salt_len+iv_len)))
decipher.finish()

//console.log(decipher.output.toString())

