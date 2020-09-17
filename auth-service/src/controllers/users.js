import User from "../models/User";
import { validateRegisterInput, validateLoginInput } from "../utils/validators";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

//Funcion generadora de tokens
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
};

export const signUp = async (req, res) => {
  const {
    firstname,
    lastname,
    birthDate,
    email,
    password,
    confirmPassword,
  } = req.body;

  const { valid, errors } = await validateRegisterInput(
    firstname,
    lastname,
    birthDate,
    email,
    password,
    confirmPassword
  );

  if (!valid) {
    return res.status(200).json({ errors });
  }

  const user = await User.findOne({ email: email });
  if (user) {
    errors.email = "Este email ya está en uso";
    return res.status(200).json({ errors });
  }

  const newPassword = await bcrypt.hash(password, 12);

  const dateOfBirth = birthDate.split("-")

  const newUser = await User.create({
    firstname,
    lastname,
    birthDate: new Date(dateOfBirth[0], dateOfBirth[1], dateOfBirth[2]).toISOString(),
    email,
    password: newPassword,
    createdAt: new Date(),
  });

  // Crear un Token
  const token = generateToken(newUser);

  //Retornar datos
  return res.status(201).json({
    ...newUser._doc,
    id: newUser._id,
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validar los datos proporcionados por el Usuario
  const { valid, errors } = validateLoginInput(email, password);
  if (!valid) {
    res.status(200).json({ errors });
  }

  // Verificar existencia del usuario
  const user = await User.findOne({ email: email });
  if (!user) {
    errors.general = "Usuario no encontrado";
    return res.status(200).json({ errors });
  }

  //verificar contraseña
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    errors.general = "Contraseña incorrecta";
    return res.status(200).json({ errors });
  }

  //generar token
  const token = generateToken(user);

  //retornar datos
  return res.status(200).json({
    ...user._doc,
    id: user._id,
    token,
  });
};


export const validateToken = (req, res) => {
  // context = {...headers}
  const authHeader = req.headers.authorization;
  const errors = {};

  if(authHeader){
      //Bearer ....
      const token = authHeader.split('Bearer ')[1];
      if(token){
          try {
              const user = jwt.verify(token, process.env.SECRET)
              return res.status(200).json({user});
          } catch(err) {
            errors.token = "Invalid/Expired token";
            return res.status(200).json({errors});
          }
      }
      errors.auth = "Authentication token must be \'Bearer [token]";
      return res.status(200).json({errors});
  }
  errors.auth = "Authentication header must be provided";
  return res.status(200).json({errors});
}
