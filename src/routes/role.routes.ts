import Router, { Request, Response } from 'express';
import { Handler } from '../common/lib/handler';
import { Logger } from '../common/lib/logger';
// import { GetAllRoleService } from '../server/services/role/get-all.service';
// import { GetByIdRoleService } from '../server/services/role/get-by-id.service';
import { CreateRoleService } from '../server/services/role/create-role.service';
// import { UpdateRoleService } from '../server/services/role/update-user.service';
// import { DeactivateRoleService } from '../server/services/role/deactivate-user.service';
// import { ReactivateRoleService } from '../server/services/role/reactivate-user.service';

const router = Router();
const path = '/role';

// router.get('/', (request: Request, response: Response) => {
//   Logger.log('route - role - getAll');
//   const promise = new GetAllRoleService().execute();
//   new Handler().json(response, promise);
// });

// router.get('/:id', (request: Request, response: Response) => {
//   Logger.log('route - role - getByID');
//   const id = parseInt(request.params.id);
//   const promise = new GetByIdRoleService().execute(id);
//   new Handler().json(response, promise);
// });

router.post('/', (request: Request, response: Response) => {
  Logger.log('route - role - create');
  const params = request.body;
  const promise = new CreateRoleService().execute(params);
  new Handler().json(response, promise);
});

// router.put('/:id', (request: Request, response: Response) => {
//   Logger.log('route - role - update');
//   const id = parseInt(request.params.id);
//   const params = request.body;
//   const promise = new UpdateRoleService().execute(id, params);
//   new Handler().json(response, promise);
// });

// router.put('/deactivate/:id', (request: Request, response: Response) => {
//   Logger.log('route - role - deactivate');
//   const id = parseInt(request.params.id);
//   const promise = new DeactivateRoleService().execute(id);
//   new Handler().json(response, promise);
// });

// router.put('/reactivate/:id', (request: Request, response: Response) => {
//   Logger.log('route - role - reactivate');
//   const id = parseInt(request.params.id);
//   const promise = new ReactivateRoleService().execute(id);
//   new Handler().json(response, promise);
// });

export { router, path };
