import { Router } from "express";
import { body, query } from "express-validator";
import { handleValidationErrors } from "./modules/validation";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getUpdateById,
  getUpdates,
  updateUpdate,
} from "./handlers/update";
import {
  createUpdatePoint,
  deleteUpdatePointById,
  getUpdatePoint,
  getUpdatePointById,
  updateUpdatePointById,
} from "./handlers/update-point";
import { validatePaginationQueryParam } from "./modules/pagination";

const router = Router();

/* 
 Product
*/
router.get(
  "/product",
  ...validatePaginationQueryParam(),
  handleValidationErrors,
  getProducts
);
router.get("/product/:id", getProductById);
router.post(
  "/product",
  ...[body("name").isString()],
  handleValidationErrors,
  createProduct
);
router.put(
  "/product/:id",
  body("name").isString(),
  handleValidationErrors,
  updateProduct
);
router.delete("/product/:id", deleteProduct);

/* 
 Update
*/
router.get("/update", ...validatePaginationQueryParam(), handleValidationErrors, getUpdates);
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
  handleValidationErrors,
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
  handleValidationErrors,
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
  handleValidationErrors,
  createUpdatePoint
);
router.put(
  "/update_point/:id",
  ...[
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("type").optional().isIn(["FEATURE", "IMPROVEMENT", "BUG"]),
  ],
  handleValidationErrors,
  updateUpdatePointById
);
router.delete("/update_point/:id", deleteUpdatePointById);

export default router;
