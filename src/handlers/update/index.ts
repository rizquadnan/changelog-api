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
 *           description: The uuid auto-generated id of the book
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
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
 *       example:
 *         id: uuid generated id
 *         createdAt: 2023-07-17 20:27:11.925
 *         updatedAt: 2023-07-17 20:27:11.925
 *         title: Early Release
 *         body: Long anticipated first release of Chronos is here! Its now fully functional to help the time needs of your work
 *         status: IN_PROGRESS
 *         version: 0.5.0
 *         asset: image url link
 *         productId: uuid generated id
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