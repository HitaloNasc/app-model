import Router, { Request, Response } from 'express';
import { Handler } from '../common/lib/handler';
import { Logger } from '../common/lib/logger';
import { GetAllRoleService } from '../server/services/role/get-all-role.service';
import { GetByIdRoleService } from '../server/services/role/get-by-id-role.service';
import { CreateRoleService } from '../server/services/role/create-role.service';
import { UpdateRoleService } from '../server/services/role/update-role.service';

const router = Router();
const path = '/role';

router.get('/', (request: Request, response: Response) => {
  Logger.log('route - role - getAll');
  const promise = new GetAllRoleService().execute();
  new Handler().json(response, promise);
});

router.get('/:id', (request: Request, response: Response) => {
  Logger.log('route - role - getByID');
  const id = parseInt(request.params.id);
  const promise = new GetByIdRoleService().execute(id);
  new Handler().json(response, promise);
});

router.post('/', (request: Request, response: Response) => {
  Logger.log('route - role - create');
  const params = request.body;
  const promise = new CreateRoleService().execute(params);
  new Handler().json(response, promise);
});

router.put('/:id', (request: Request, response: Response) => {
  Logger.log('route - role - update');
  const id = parseInt(request.params.id);
  const params = request.body;
  const promise = new UpdateRoleService().execute(id, params);
  new Handler().json(response, promise);
});

export { router, path };
