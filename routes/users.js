const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Clave secreta para JWT (en producción, usa una variable de entorno)
const JWT_SECRET = 'moodify_secret_key';

// Registro de usuario
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body; // CAMBIA 'name' por 'username'

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
  'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', // ESTA ES LA CORRECTA
  [username, email, hashedPassword]
);

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error('Error en /signup:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login exitoso', token, user: { id: user.id, name: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
