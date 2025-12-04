const jwt = require('jsonwebtoken');

// Middleware para validar que el usuario sea administrador
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = auth.substring(7); // Quita "Bearer "
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario sea admin
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
