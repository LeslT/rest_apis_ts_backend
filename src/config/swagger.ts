import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TS',
            version: "1.0.0",
            description: "API Docs for products"
        }
    },
    apis: [
        './src/router.ts'
    ]
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUIOptions : SwaggerUiOptions = {
    customCss: `
    .topbar-wrapper .link {
        content: url('https://img.freepik.com/vector-premium/resumen-degradado-ilustracion-pajaro-colorido_343694-1740.jpg');
        height: 100px;
        width: auto
    }
    .swagger-ui .topbar {
        background-color: white;
    }
    `,
    customSiteTitle: 'Documentación REST API express'
}
export default swaggerSpec
export {
    swaggerUIOptions
}