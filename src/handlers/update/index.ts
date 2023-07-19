/**
 * @swagger
 * components:
 *   schemas:
 *     Update:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         id:
 *           type: string
 *           description: The uuid auto-generated id of the update
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
 *           readOnly: true
 *         title:
 *           type: string
 *           description: Title of the product update
 *         body:
 *           type: string
 *           description: The description of the product update
 *         status:
 *           type: string
 *           description: Status of the product update
 *           enum:
 *             - IN_PROGRESS
 *             - LIVE
 *             - DEPRECATED
 *             - ARCHIVED
 *         version:
 *           type: string
 *           description: Version of the product update
 *         asset:
 *           type: string
 *           description: The image / banner of the product update
 *         productId:
 *           type: string
 *           description: The id of the product which is related to the update. Uuid generated string 
 */

/**
 * @swagger
 * tags:
 *   name: Update
 *   description: The API for managing updates
*/

export * from "./get"
export * from "./post"
export * from "./put"
export * from "./delete"