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
 *         createdAt:
 *           type: string
 *           description: Timestamp of creation date
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update date
 *         username:
 *           type: string
 *           description: The string user uses to register / login
 *         password:
 *           type: string
 *           description: Hashed version of user's password
 *       example:
 *         id: uuid generated id
 *         createdAt: 2023-07-17 20:27:11.925
 *         updatedAt: 2023-07-17 20:27:11.925
 *         username: john_doe
 *         password: hashed version of password
 */

export { createNewUser, signIn } from "./post";
