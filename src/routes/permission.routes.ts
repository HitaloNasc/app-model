import Router, { Request, Response } from 'express';
import { Handler } from '../common/lib/handler';
import { Logger } from '../common/lib/logger';
import { GetAllPermissionService } from '../server/services/permission/get-all-permission.service';
import { GetByIdPermissionService } from '../server/services/permission/get-by-id-permission.service';
import { CreatePermissionService } from '../server/services/permission/create-permission.service';
import { UpdatePermissionService } from '../server/services/permission/update-permission.service';

const router = Router();
const path = '/permission';

router.get('/', (request: Request, response: Response) => {
  Logger.log('route - permission - getAll');
  const promise = new GetAllPermissionService().execute();
  new Handler().json(response, promise);
});

router.get('/:id', (request: Request, response: Response) => {
  Logger.log('route - permission - getByID');
  const id = parseInt(request.params.id);
  const promise = new GetByIdPermissionService().execute(id);
  new Handler().json(response, promise);
});

router.post('/', (request: Request, response: Response) => {
  Logger.log('route - permission - create');
  const params = request.body;
  const promise = new CreatePermissionService().execute(params);
  new Handler().json(response, promise);
});

router.put('/:id', (request: Request, response: Response) => {
  Logger.log('route - permission - update');
  const id = parseInt(request.params.id);
  const params = request.body;
  const promise = new UpdatePermissionService().execute(id, params);
  new Handler().json(response, promise);
});

export { router, path };
