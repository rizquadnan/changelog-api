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
 *           description: The uuid auto-generated id of the book
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
 *         name:
 *           type: string
 *           description: Name of the product
 *         belongsToId:
 *           type: string
 *           description: Id of user that owns the product
 *       example:
 *         id: uuid generated id
 *         createdAt: 2023-07-17 20:27:11.925
 *         updatedAt: 2023-07-17 20:27:11.925
 *         name: The Product
 *         belongsToId: uuid generated id
 */

export * from "./get"
export * from "./post"
export * from "./put"
export * from "./delete";