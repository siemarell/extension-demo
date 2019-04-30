import CryptoJS from 'crypto-js'

// This function is used to make brute-force attack difficult. For every password attacker has to calculate 5000(by default)
// sha256 hashes.
function strengthenPassword(pass, rounds = 5000) {
    while (rounds-- > 0){
        pass = CryptoJS.SHA256(pass).toString()
    }
    return pass
}

export function encrypt(str, pass){
    const strongPass = strengthenPassword(pass);
    return CryptoJS.AES.encrypt(str, strongPass).toString()
}

export function decrypt(str, pass){
    const strongPass = strengthenPassword(pass)
    const decrypted = CryptoJS.AES.decrypt(str, strongPass);
    return decrypted.toString(CryptoJS.enc.Utf8)
}