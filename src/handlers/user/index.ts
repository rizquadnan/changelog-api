/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The uuid auto-generated id of the book
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
 *           readOnly: true
 *         username:
 *           type: string
 *           description: The string user uses to register / login
 *         password:
 *           type: string
 *           description: Hashed version of user's password
 */

export { createNewUser, signIn } from "./post";
