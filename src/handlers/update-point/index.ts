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
 *           description: The uuid auto-generated id of the update point
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