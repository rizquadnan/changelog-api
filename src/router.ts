import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/input-validation";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "./handlers/product";
import { createUpdate, deleteUpdate, getUpdateById, getUpdates, updateUpdate } from "./handlers/update";
import { createUpdatePoint, deleteUpdatePointById, getUpdatePoint, getUpdatePointById, updateUpdatePointById } from "./handlers/update-point";

const router = Router();

/* 
 Product
*/
router.get("/product", getProducts);
router.get("/product/:id", getProductById);
router.post(
  "/product",
  ...[body("name").isString()],
  handleInputErrors,
  createProduct
);
router.put("/product/:id", body("name").isString(), handleInputErrors, updateProduct);
router.delete("/product/:id", deleteProduct);

/* 
 Update
*/
router.get("/update", getUpdates);
router.get("/update/:id", getUpdateById);
router.post(
  "/update",
  ...[
    body("title").isString(),
    body("body").isString(),
    body("productId").isString(),
    body("asset").optional().isString(),
    body("version").optional().isString(),
    body("status")
      .optional()
      .isIn(["IN_PROGRESS", "DEPRECATED", "LIVE", "ARCHIVED"]),
  ],
  handleInputErrors,
  createUpdate
);
router.put(
  "/update/:id",
  ...[
    body("title").optional().isString(),
    body("body").optional().isString(),
    body("asset").optional().isString(),
    body("version").optional().isString(),
    body("status")
      .optional()
      .isIn(["IN_PROGRESS", "DEPRECATED", "LIVE", "ARCHIVED"]),
  ],
  handleInputErrors,
  updateUpdate
);
router.delete("/update/:id", deleteUpdate);

/* 
 Update Point
*/
router.get("/update_point", getUpdatePoint);
router.get("/update_point/:id", getUpdatePointById);
router.post(
  "/update_point",
  ...[
    body("title").isString(),
    body("description").isString(),
    body("updateId").isString(),
    body("type").isIn(["FEATURE", "IMPROVEMENT", "BUG"]),
  ],
  handleInputErrors,
  createUpdatePoint
);
router.put(
  "/update_point/:id",
  ...[
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("type").optional().isIn(["FEATURE", "IMPROVEMENT", "BUG"]),
  ],
  handleInputErrors,
  updateUpdatePointById
);
router.delete("/update_point/:id", deleteUpdatePointById);

export default router;
