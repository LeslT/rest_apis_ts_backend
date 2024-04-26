import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();
/**
 * @swagger 
 * components: 
 *  schemas:
 *    Product: 
 *      type: object
 *      properties: 
 *        id:
 *          type: integer
 *          description: The product ID
 *          example: 1
 *        name: 
 *          type: string
 *          description: The product name
 *          example: Monitor
 *        price:
 *          type: number
 *          description: The product price
 *          example: 300
 *        availability:
 *          type: boolean
 *          description: The product availability
 *          example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *    summary: Get a list of products
 *    tags: 
 *      - Products
 *    description: Return a list of products
 *    responses: 
 *      200: 
 *        description: Successful response
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *    summary: Get a product by id
 *    tags: 
 *      - Products
 *    description: Return a product base on its unique ID
 *    parameters: 
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Not found
 *      400:
 *        description: Bad Request - Invalid ID
 */
router.get(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products/:
 *   post:
 *    summary: Create a new Product
 *    tags: 
 *      - Products
 *    description: Return a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor"
 *              price:
 *                type: number
 *                example: 300
 *    responses:
 *      201:
 *        description: Product created successfully
 *      400:
 *        description: Bad Request - Invalid Input data
 */
router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("el nombre del producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("valor no válido")
    .notEmpty()
    .withMessage("el precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("precio no válido"),
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *      - Products
 *    description: Return the updated product
 *    parameters: 
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor"
 *              price:
 *                type: number
 *                example: 300
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404: 
 *        description: Product not found
 *      400:
 *        description: Bad request - invalid ID or Invalid input data
 */
router.put(
  "/:id",
  body("name")
    .notEmpty()
    .withMessage("el nombre del producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("valor no válido")
    .notEmpty()
    .withMessage("el precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("precio no válido"),
  body("availability").isBoolean().withMessage("Valor incorrecto"),
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Return the updated product
 *    parameters: 
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404: 
 *        description: Product not found
 *      400:
 *        description: Bad request - invalid ID or Invalid input data
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Deletes a Product by a given ID
 *    tags:
 *      - Products
 *    description: Returns a confirmation message
 *    parameters: 
 *      - in: path
 *        name: id
 *        description: The ID of the product to delete
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              value: 'Producto eliminado'
 *      404: 
 *        description: Product not found
 *      400:
 *        description: Bad request - invalid ID or Invalid input data
 */
router.delete("/:id", 
    param("id").isInt().withMessage("ID no válido"),
    handleInputErrors,
    deleteProduct
);

export default router;
