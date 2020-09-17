//Validaciones de registro
export const validateRegisterInput = (
  firtsname,
  lastname,
  birthDate,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (firtsname.trim() === "") {
    errors.firtsname = "El nombre no puede estar vacio";
  }

  if (lastname.trim() === "") {
    errors.lastname = "El apellido no puede estar vacio";
  }

  if (birthDate.trim() === "") {
    errors.birthDate = "La fecha de nacimiento no puede estar vacia";
  }

  if (email.trim() === "") {
    errors.email = "El correo electronico no puede estar vacio";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "El correo electronico no es valido";
    }
  }

  if (password.trim() === "") {
    errors.password = "La contraseña no puede estar vacia";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  } else {
    const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    if (!password.match(regEx)) {
      errors.email = `La contraseña debe tener una por lo menos una letra mayuscula, una letra minuscula y un número. Debe tener más de 8 carácteres`;
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

// Validaciones de Login
export const validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "El Email no puede estar vacio";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "El correo electronico no es valido";
    }
  }

  if (password.trim() === "") {
    errors.password = "La contraseña no puede estar vacia";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
