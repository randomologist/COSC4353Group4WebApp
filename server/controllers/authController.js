const bcrypt = require('bcryptjs');
const repo = require('../repositories/userRepoSQLite'); // replaced userStore require
const { sign } = require('../utils/jwtUtil');

async function register(req, res) {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password length must be at least 6 characters' });

  try {
    const existing = await repo.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await repo.create({ email, passwordHash, role });

    const token = sign({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: { id: user.id, email: user.email, name: name || '', role: "user" }, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await repo.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign({ id: user.id, email: user.email, role: user.role });
    res.json({ user: { id: user.id, email: user.email, name: '', role: user.role }, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };