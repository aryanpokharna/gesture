const pki = require('node-forge');
var symmetricKey = pki.util.binary.hex.encode(pki.pkcs5.pbkdf2("password", 'salt',1000, 256))
sessionStorage.setItem('sessionKey', symmetricKey)