import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { notFoundHandler } from './middleware/not-found.middleware';
import { errorHandler } from './middleware/handler-error.middleware';

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '500mb',
    parameterLimit: 25000,
  }),
);
app.use(express.json());
app.use(cors());
app.use(helmet());
routes(app);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
