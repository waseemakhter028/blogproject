require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler  = require('./middlewares/error-handler.js')

const app = express();
const Routes = require('./routes')
const cors = require('cors')
const swaggerUi  = require("swagger-ui-express")
const swaggerDocument = require('./swagger.json')

global.appRoot = path.join(__dirname);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')))


app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.options('*', cors())
// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Api Routes
app.use('/', Routes);

app.get('/', (req, res, next) => {
    res.send('working server');
})



// Error Middlewares
//404 not found handle
app.use(errorHandler.notFound)
// generic Error handler
app.use(errorHandler.genericErrorHandler);


//server configuration
const server = app.listen(process.env.PORT, async () => {
    console.log(`Server up successfully - host: ${process.env.HOST} port: ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('possibly unhandled rejection happened');
  console.log(err.message);
});

const closeHandler = () => {
  Object
      .values(connections)
      .forEach((connection) => connection.close());

  server.close(() => {
      console.log('Server is stopped succesfully');
      process.exit(0); /* eslint-disable-line */
  });
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);






