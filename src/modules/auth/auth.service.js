const db = require('../../config/db');
const queries = require('./auth.queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

exports.login = async (rawIdentifier, password) => {
  const loginIdentifier = rawIdentifier ? rawIdentifier.trim() : '';
  // Admin demo login
  if ((loginIdentifier === 'clinivaAdmin' && password === 'password123') || (loginIdentifier === 'admin' && password === 'admin')) {
    const adminUsername = loginIdentifier === 'admin' ? 'admin' : 'clinivaAdmin';
    const token = jwt.sign(
      { id: 999, username: adminUsername, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      token,
      user: {
        id: 999,
        username: adminUsername,
        role: 'admin',
        full_name: 'Administrador'
      }
    };
  }

  // Find user by username OR email
  console.log('[AUTH] Login identifier:', loginIdentifier);
  const [rows] = await db.query(
    'SELECT id, username, password_hash, role, full_name, email FROM users WHERE (username = ? OR email = ?) AND is_deleted = 0',
    [loginIdentifier, loginIdentifier]
  );

  console.log('[AUTH] Found users:', rows.length);
  if (rows.length === 0) {
    throw new Error('User not found');
  }

  const user = rows[0];
  console.log('[AUTH] User role:', user.role);
  const isMatch = await bcrypt.compare(password, user.password_hash);
  console.log('[AUTH] Password match result:', isMatch);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  let doctorId = null;
  let patientId = null;

  if (user.role === 'doctor') {
    const [docRows] = await db.query('SELECT id FROM doctors WHERE user_id = ? AND is_deleted = 0', [user.id]);
    if (docRows.length > 0) {
      doctorId = docRows[0].id;
    }
  } else if (user.role === 'patient') {
    const [patRows] = await db.query('SELECT id FROM patients WHERE user_id = ? AND is_deleted = 0', [user.id]);
    if (patRows.length > 0) {
      patientId = patRows[0].id;
    }
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, doctorId, patientId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      doctorId,
      patientId
    }
  };
};


exports.register = async (data) => {
  const { username, password, role, full_name, email } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(queries.CREATE_USER, [
    username,
    hashedPassword,
    role || 'staff',
    full_name,
    email
  ]);

  return result;
};
