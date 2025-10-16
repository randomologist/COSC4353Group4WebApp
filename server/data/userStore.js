const crypto = require('crypto');

const users = new Map(); 

function createId() {
  return crypto.randomBytes(12).toString('hex');
}

async function findByEmail(email) {
  return users.get(email.toLowerCase()) || null;
}

async function create({ email, passwordHash, name = '', role = 'volunteer' }) {
  const user = { id: createId(), email: email.toLowerCase(), passwordHash, name, role };
  users.set(user.email, user);
  return user;
}

function clearAll() {
  users.clear();
}

module.exports = {
  findByEmail,
  create,
  clearAll,
  _clearAll: clearAll,
};