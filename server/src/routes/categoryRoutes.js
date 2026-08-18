const express = require("express");
const router = express.Router();

const admin = require("../middleware/admin");
const CategoryController = require("../controllers/CategoryController");
const upload = require("../middleware/upload");



router.get("/",admin, CategoryController.getCategory);
router.post("/", upload.single('file'), CategoryController.addCategory);
router.get("/all", admin, CategoryController.getAll);
router.get("/getallp", CategoryController.getAllP);
router.delete("/delete", admin, CategoryController.deleteOneCategory);
router.put("/updatebyid", admin, upload.single("categoryImg"), CategoryController.updateCategoryById);


module.exports = router;