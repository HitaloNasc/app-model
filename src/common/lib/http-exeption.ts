export class HttpException extends Error {
    name: string;
    statusCode?: number;
    status?: number;
    title: string | undefined;
    errors: string | object[] | null;
  
    constructor(statusCode: number, errors?: string | object[] | null, title?: string) {
      super(title);
      this.name = 'HttpException';
      this.statusCode = statusCode;
      this.errors = errors || null;
      this.title = title;
    }
  }
  
  export const Errors = {
    UNAUTHORIZED: (err: object[]) => new HttpException(401, err, 'unauthorized'),
    FORBIDDEN: () => new HttpException(403, null, 'forbidden'),
    NOT_FOUND: (err: object[]) => new HttpException(404, err, 'not_found'),
    PRECONDITION_FAILED: (err: object[]) => new HttpException(412, err, 'precondition_failed'),
    INTERNAL_SERVER_ERROR: () => new HttpException(500, null, 'internal_server_error'),
  };