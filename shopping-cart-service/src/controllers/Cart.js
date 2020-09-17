import Cart from "../models/Cart";
import Products from "../models/Products";
import { validateUser } from "../utils/validators";
import "dotenv/config";
import "../app.config";

export const addProduct = async (req, res) => {
  const errors = {};
  const user = await validateUser(req.headers.authorization);

  if (!user.data.user) {
    errors.token = "Sesión expirada";
    return res.status(200).json({
      errors,
    });
  }
  const { id_product, quantity } = req.body;

  //Buscar el Producto especificado
  const product = await Products.findOne({ _id: id_product });

  //evalua si existe el producto o si hay la cantidad sufuciente
  if (!product) {
    errors.products = "producto no encontrado";
    return res.status(403).json({ errors });
  } else if (parseInt(product.quantity, 10) < parseInt(quantity, 10)) {
    errors.products = "No hay suficientes unidades para vender";
    return res.status(403).json({ errors });
  }


  //Busca si hay un carrito existente para el usuario
  const cart = await Cart.findOne({ user: user.data.user.id });

  //Evalua si el carrito existe
  if (cart) {
    
    //Busca si este producto ya está en el carrito
    const findProduct = await cart.products.find(product => product.id_product === id_product );

    //Evalua si está e producto
    if(findProduct){
        const suma = parseInt(findProduct.quantity, 10) + parseInt(quantity);

        //evalua si hay la cantidad sufuciente para poder agregar
        if ((suma) > product.quantity) {
            errors.products = "No hay suficientes unidades para vender";
            return res.status(403).json({ errors });
        } else {
            //agrega cantidad
            findProduct.quantity = suma
            await cart.save();
            return res.status(200).json({
                cart
            })
        }
    }

    //En caso de que el producto no esté, lo agrega al carro
    cart.products.push({
      id_product: product._id,
      name: product.name,
      description: product.description,
      imageURL: product.imageURL,
      quantity,
      price: product.price,
      seller: user.data.user.id,
    });

    await cart.save()

    return res.status(200).json({
        cart
    })
  }

  //En caso de que no exista un carrito, crea uno nuevo
  const newCart = await Cart.create({
    user: user.data.user.id,
    products: [{
      id_product: product._id,
      name: product.name,
      description: product.description,
      imageURL: product.imageURL,
      quantity,
      price: product.price,
      seller: user.data.user.id,
    }],
});

  return res.status(201).json({
    cart: newCart
  });
};

export const getCart = async (req, res) => {
  const errors = {};
  const user = await validateUser(req.headers.authorization);

  if (!user.data.user) {
    errors.token = "Sesión expirada";
    return res.status(200).json({
      errors,
    });
  }

  const cart = await Cart.findOne({ user: user.data.user.id });

  return res.status(200).json({
    cart,
  });
};

export const updateQuatityProductCart = async (req, res) => {
  const errors = {};
  const user = await validateUser(req.headers.authorization);

  if (!user.data.user) {
    errors.token = "Sesión expirada";
    return res.status(200).json({
      errors,
    });
  }

  const { id_product, quantity } = req.body;

  //Buscar el Producto especificado
  const product = await Products.findOne({ _id: id_product });

  //evalua si existe el producto o si hay la cantidad sufuciente
  if (!product) {
    errors.products = "producto no encontrado";
    return res.status(403).json({ errors });
  } else if (parseInt(product.quantity, 10) < parseInt(quantity, 10)) {
    errors.products = "No hay suficientes unidades para vender";
    return res.status(403).json({ errors });
  }


  const cart = await Cart.findOne({ user: user.data.user.id });

  const findProduct = cart.products.find(product => product.id_product === id_product);

  findProduct.quantity = quantity;

  await cart.save();

  return res.status(200).json({
    cart,
  });
};


export const clearCart = async (req, res) => {
  const errors = {};
  const user = await validateUser(req.headers.authorization);

  if (!user.data.user) {
    errors.token = "Sesión expirada";
    return res.status(200).json({
      errors,
    });
  }

  await Cart.findOneAndDelete({ user: user.data.user.id })

  return res.status(200).json({
    "message": "clear cart successfully"
  })
}
