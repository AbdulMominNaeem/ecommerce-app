const express = require("express");
const router = express.Router();

const admin = require("../middleware/admin");
const ProductController = require("../controllers/ProductController");
const upload = require("../middleware/upload");



router.get("/",admin, ProductController.getProduct);
router.post("/", admin,upload.single('file'), ProductController.addProduct);
router.get("/all", admin, ProductController.getAll);
router.get("/all-p", ProductController.getAllProduct);
router.get("/all-p-h", ProductController.getAllProductHome);
router.delete("/delete", admin, ProductController.deleteOneProduct);
router.get("/getallp", ProductController.getAllP);
router.put("/updatebyid", admin, upload.single("productImg"), ProductController.updateProductById);
router.get("/product/:id",  ProductController.getProductById);


module.exports = router;