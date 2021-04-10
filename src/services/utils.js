// Importing 'crypto' module
const crypto = require('crypto');


function getHash(string){

    let hashPwd = crypto.createHash('sha1').update(string).digest('hex');

    return hashPwd;
}


export default getHash;
