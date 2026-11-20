const crypto = require('crypto');
const KEYLEN = 64;

function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plainPassword, salt, KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(plainPassword, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const hashBuffer = crypto.scryptSync(plainPassword, salt, KEYLEN);
  const originalHashBuffer = Buffer.from(originalHash, 'hex');
  if (hashBuffer.length !== originalHashBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, originalHashBuffer);
}

module.exports = { hashPassword, verifyPassword };
