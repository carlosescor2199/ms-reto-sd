import axios from 'axios';
import config from "../app.config";

//Validaciones de registro
export const validateInputsProducts = (
  name,
  description,
  imageURL,
  quantity,
  price
) => {
  const errors = {};
  if (name.trim() === "") {
    errors.name = "El nombre del producto no puede estar vacio";
  }

  if (description.trim() === "") {
    errors.description = "La descripción del producto no puede estar vacia";
  }

  if (imageURL.trim() === "") {
    errors.imageURL = "El producto debe tener una imagen";
  }

  if (quantity.trim() === "") {
    errors.quantity = "La cantidad del producto es requerida";
  }

  if (price.trim() === "") {
    errors.price = "El precio no puede esta vacio";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};


export const validateUser = async (authHeader) => {
  const response = await axios.get(config.endPointAuth, {
    headers: {
      authorization: authHeader,
    }
  });
  return response;
}