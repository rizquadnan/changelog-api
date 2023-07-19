/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePoint:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - type
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
 *           description: The title of the update point
 *         description:
 *           type: string
 *           description: Describes what the update point os all about
 *         type:
 *           type: string
 *           description: The type of the update point
 *           enum:
 *             - FEATURE
 *             - BUG
 *             - IMPROVEMENT
 *         updateId:
 *           type: string
 *           description: The update that owns the update point
 *       example:
 *         id: uuid generated id
 *         createdAt: 2023-07-17 20:27:11.925
 *         updatedAt: 2023-07-17 20:27:11.925
 *         title: Feature 1 - Track your time
 *         description: No need to manually keep track of your work. Just input it to Chronos and have auto management available
 *         type: FEATURE
 *         updateId: uuid generated id 
 */

/**
 * @swagger
 * tags:
 *   name: UpdatePoint
 *   description: The API for managing update points
*/

export * from "./get"
export * from "./delete"
export * from "./put"
export * from "./post";