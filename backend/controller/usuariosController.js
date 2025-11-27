const Usuario = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Devuelve todos los productos (array en memoria)
const getAllUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find({});
        res.status(200).json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        next(error); // Pasa el error al middleware de errores
    }

};

// Devuelve un producto por id (id numérico en el array en memoria)
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            // Si no se encuentra, creamos y pasamos un error 404 (Not Found)
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            return next(error); // Importante: 'return' para no ejecutar lo siguiente
        }
        res.status(200).json(usuario);
    }
    catch (error) {
        // Si el formato del ID es inválido (ej. no es un ObjectId válido), Mongoose lanza un error
        console.error('Error al buscar usuario por ID:', error.message);
        error.status = 400; // Generalmente, un ID malformado es un Bad Request (400)
        next(error);
    }
};

const loginUser = async (req, res) => {
    try {
    // 1. Buscamos al usuario por su email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Usamos un mensaje genérico por seguridad
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
 
    // 2. Comparamos la contraseña enviada con la hasheada en la BD
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
 
    // 3. Si las credenciales son correctas, generamos el JWT
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Payload: datos que queremos en el token
      process.env.JWT_SECRET,                   // La clave secreta desde .env
      { expiresIn: '1h' }                        // Opciones (ej: expira en 1 hora)
    );
 
    // 4. Respondemos con el token y datos del usuario (sin el password)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crea un nuevo producto en el array en memoria
const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;


        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El email o nombre de usuario ya está en uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
};

// Actualiza un usuario por id
const updateUser = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;
        const datosActualizados = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            datosActualizados, // Mongoose automáticamente usa $set para los campos provistos
            { new: true, runValidators: true } // Opciones importantes
        );

        if (!usuarioActualizado) {
            const error = new Error('Usuario no encontrado para actualizar');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            mensaje: 'Usuario actualizado con éxito',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        // Si el ID es inválido o la validación falla
        error.status = 400;
        next(error);
    }
};

// Elimina un usuario por id
const deleteUser = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;


        // 1. Usar findByIdAndDelete para encontrar y eliminar el documento
        const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId);

        // 2. Verificar si el usuario fue encontrado y eliminado
        if (!usuarioEliminado) {
            const error = new Error('Usuario no encontrado para eliminar');
            error.status = 404;
            return next(error);
        }

        
        res.status(200).json({
            mensaje: 'Usuario eliminado con éxito',
            usuario: usuarioEliminado // Opcional: devolver el usuario eliminado
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        error.status = 400; // Puede ser por un ID malformado
        next(error);
    }
};

module.exports = {
    getAllUsers,
    loginUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
