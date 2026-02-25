module.exports = {
  GET_USER_BY_USERNAME: `
    SELECT id, username, password_hash, role, full_name, email 
    FROM users 
    WHERE username = ? AND is_deleted = 0
  `,
  CREATE_USER: `
    INSERT INTO users (username, password_hash, role, full_name, email)
    VALUES (?, ?, ?, ?, ?)
  `
};
