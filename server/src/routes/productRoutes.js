const express = require("express");
const router = express.Router();

const admin = require("../middleware/admin");
const ProductController = require("../controllers/ProductController");
const upload = require("../middleware/upload");



router.get("/",admin, ProductController.getProduct);
router.post("/", upload.single('file'), ProductController.addProduct);
router.get("/all", admin, ProductController.getAll);
router.delete("/delete", admin, ProductController.deleteOneProduct);
router.put("/updatebyid", admin, upload.single("productImg"), ProductController.updateProductById);


module.exports = router;