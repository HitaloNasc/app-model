import { Request, Response } from 'express';

export const notFoundHandler = (request: Request, response: Response) => {
  response
    .status(404)
    .json({
      statusCode: 404,
      title: 'not_found',
      message: {
        result: 'error',
        msg: [{ key: 'error_404__resource_not_found' }],
      },
    })
    .end();
};
