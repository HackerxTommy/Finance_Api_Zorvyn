const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data API',
      version: '1.0.0',
      description: 'API for Finance Data Processing and Access Control',
    },
    servers: [
      {
        url: 'https://financeapizorvyn.vercel.app',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local Server',
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
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

if (!fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.mkdirSync(path.join(__dirname, '../dist'));
}

fs.writeFileSync(
  path.join(__dirname, '../dist/swagger.json'),
  JSON.stringify(swaggerDocs, null, 2)
);

console.log('Swagger documentation generated successfully.');
