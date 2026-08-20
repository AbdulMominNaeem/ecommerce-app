const Product = require("../models/Product");



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
    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};
const getAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1000;

        const skip = (page - 1) * limit;

        const [products, totalItems] = await Promise.all([
            Product.find()
                .skip(skip)
                .limit(limit),
            Product.countDocuments()
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            meta: {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllProductHome = async (req, res) => {
  try {
    const {page,limit} = req.query;
        // 2. Calculate the number of items to skip (offset)
        const skip = (page - 1) * limit;

        // 3. Fetch the paginated data and total count simultaneously
        const [products, totalItems] = await Promise.all([
            Product.find().skip(skip).limit(limit),
            Product.countDocuments()
        ]);

        // 4. Calculate total number of pages
        const totalPages = Math.ceil(totalItems / limit);

        // 5. Send structured response back to client
        res.json({
            success: true,
            meta: {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            data: products
        });
    res.status(200).json({ message: "products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};
const getAllP = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({ message: "products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
};

const deleteOneProduct = async (req, res) => {
  try {
    const productId = req.body._id;
    if (!productId) {
      return res.status(404).json({ message: "Product id not found!" });
    }
    await Product.findOneAndDelete({ _id: productId });
    return res.status(200).json({ message: "Product delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "_id is required to update a product" });
    }

    // If a new file is uploaded, multer-storage-cloudinary provides the secure URL in req.file.path
    if (req.file) {
      updateData.photo = req.file.path; // Make sure this key matches your schema (was 'photo' or 'productImg')
    }

    const product = await Product.findOneAndUpdate(
      { _id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required to get a product" });
    }

    const product = await Product.findOne({ _id:id }).populate('category');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product fetch successfully", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
  
    const { title, description, price, category } = req.body;
    console.log(typeof(price),price)
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Please provide title, description and product image." });
    }

    // Check duplicate products before proceeding
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists." });
    }

    let imgURL = "";
    // multer-storage-cloudinary maps the uploaded image directly onto Cloudinary and yields the link inside req.file.path
    if (req.file) {
      imgURL = req.file.path;

    }

    const product = new Product({
      title,
      description,
      price: Number(price),
      category,
      productImg: imgURL,
    });

    await product.save();
    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id || req.body._id || req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.productImg = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productObj = product.toObject({ virtuals: true });
    return res.status(200).json({ message: "Product updated successfully", product: productObj });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { showAllProducts, getAll, deleteOneProduct, updateProductById, addProduct, getProduct, updateProduct, getAllP,getProductById,getAllProduct, getAllProductHome };
