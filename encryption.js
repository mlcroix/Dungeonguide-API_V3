var dotEnv = require('dotenv').config();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    hiddenPassword = process.env.encryptpasssword;

exports.encrypt = function(text) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(hiddenPassword), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decrypt = function(text){
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(hiddenPassword), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}