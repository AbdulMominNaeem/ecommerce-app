const Category = require('../models/Category');

const getCategory = async (req, res) => {
    try {
        const id = req.params.id || req.query.id || req.body._id;
        if (!id) {
            return res.status(400).json({ message: "Category id is required" });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const categoryObj = category.toObject({ virtuals: true });
        return res.status(200).json({ message: "Category fetch successful", category: categoryObj });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getAll = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json({ message: "category fetched successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllP = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json({ message: "category fetched successfully", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteOneCategory = async (req, res) => {
    try {
        const catId = req.body._id;
        if (!catId) {
            return res.status(404).json({ message: "Category not Found" });
        }
        await Category.findOneAndDelete({ _id: catId });
        return res.status(200).json({ message: "Deleted Successfully" });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateCategoryById = async (req, res) => {
    try {
        const { _id, ...updatedData } = req.body;
        if (!_id) {
            return res.status(400).json({ message: "_id is required to update a category" });
        }

        if (req.file) {
            updatedData.image = req.file.path;
        }
        const category = await Category.findOneAndUpdate(
            { _id },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category updated successfully", category });


    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


const addCategory = async (req, res) => {
  try {
    const name  = req.body.name;

    if (!name) {
      return res.status(400).json({ message: "Please provide name and category image." });
    }

    // Check duplicate category before proceeding
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists." });
    }

    let imgURL = "";
    // multer-storage-cloudinary maps the uploaded image directly onto Cloudinary and yields the link inside req.file.path
    if (req.file) {
      imgURL = req.file.path;
      
    }

    const category = new Category({
      name,
      image: imgURL,
    });

    await category.save();
    return res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id || req.body._id || req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Category id is required" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const categoryObj = category.toObject({ virtuals: true });
    return res.status(200).json({ message: "Category updated successfully", category: categoryObj });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategory, getAll, deleteOneCategory ,addCategory, updateCategoryById, updateCategory, getAllP }