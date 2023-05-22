/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { Logger } from './logger';
import { Errors } from './http-exeption';

export class Handler {
  private global = (response: Response, statusCode: number, message: any) => {
    Logger.dir({ statusCode });
    return response.status(statusCode).json(message).end();
  };

  private error = (response: Response, error: any) => {
    Logger.log('lib - handler - handlerError');

    if (!error) {
      Logger.dir(Errors.INTERNAL_SERVER_ERROR());
    }

    Logger.log('Error handler:');
    Logger.dir(error);

    const statusCode: number = error.statusCode;

    return response
      .status(statusCode)
      .json({
        statusCode: error.statusCode,
        title: error.title,
        message: {
          result: 'error',
          msg: error.errors,
        },
      })
      .end();
  };

  public json = async (response: Response, promise: Promise<any>) => {
    Logger.log('lib - handler - json');
    let result;
    if (promise) {
      try {
        const res = await promise;
        result = this.global(response, 200, res);
      } catch (error) {
        result = this.error(response, error);
      }
    } else {
      result = this.error(response, null);
    }
    return result;
  };
}
