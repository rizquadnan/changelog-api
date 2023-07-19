/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The uuid auto-generated id of the product
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
 *           readOnly: true
 *         name:
 *           type: string
 *           description: Name of the product
 *         belongsToId:
 *           type: string
 *           description: Id of user that owns the product
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: The API for managing products
*/

export * from "./get"
export * from "./post"
export * from "./put"
export * from "./delete";