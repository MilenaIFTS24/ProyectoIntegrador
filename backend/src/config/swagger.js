import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tienda de Té y Artesanías',
      version: '1.0.0',
      description: 'Documentación de la API para el Proyecto Integrador. Incluye gestión de productos, usuarios y autenticación JWT.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Ruta donde Swagger buscará los comentarios
};

export const specs = swaggerJsdoc(options);