const Product = require("../models/Product");
const bcrypt = require("bcryptjs");


const getProduct = async (req, res) => {
  try {
    const id = req.params.id || req.query.id || req.body._id;
    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productObj = product.toObject({ virtuals: true });

    return res.status(200).json({ message: "Product fetch successful", product: productObj });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getAll= async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: "products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteOneProduct = async (req, res) => {
  try {
    const productId  = req.body._id;

    if (!productId){
      return res.status(404).json({
      message: "Product id not found!",
    });
    }

    await Product.findOneAndDelete({_id:productId});
  
    return res.status(200).json({
      message: "Product delete successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Access denied" });
    }

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "You do not have permission to delete this user" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProductById = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "_id is required to update a product",
      });
    }

    if (req.file) {
    // Build a public URL for the uploaded file (works with multer storing filename)
    const filename = req.file.filename || req.file.originalname || req.file.path;
    const imgURL= `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    updateData.photo = imgURL;
    }

    const product = await Product.findOneAndUpdate(
      { _id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};




const addProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    const _id = req.body.id;

    // Require title, description and uploaded image for creating a product
    if (!title || !description ) {
      return res.status(400).json({
        message: "Please provide title, description and product image.",
      });
    }

    let imgURL = ""
    if (req.file) {
    // Prevent duplicate products by title
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product already exists.",
      });
    }

    // Build a public URL for the uploaded file (works with multer storing filename)
    const filename = req.file.filename || req.file.originalname || req.file.path;
    imgURL= `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    }
    const product = new Product({
      title,
      description,
      productImg: imgURL, 
    });

    await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id || req.body._id || req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const productObj = product.toObject({ virtuals: true });

    return res.status(200).json({
      message: "Product updated successfully",
      product: productObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {showAllProducts, getAll, deleteOneProduct, updateProductById, addProduct, getProduct, updateProduct, deleteUser };