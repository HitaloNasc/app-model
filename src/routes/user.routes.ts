import Router, { Request, Response } from 'express';
import { Handler } from '../common/lib/handler';
import { Logger } from '../common/lib/logger';
import { GetAllUserService } from '../server/services/user/get-all-user.service';
import { GetByIdUserService } from '../server/services/user/get-by-id-user.service';
import { CreateUserService } from '../server/services/user/create-user.service';
import { UpdateUserService } from '../server/services/user/update-user.service';
import { DeactivateUserService } from '../server/services/user/deactivate-user.service';
import { ReactivateUserService } from '../server/services/user/reactivate-user.service';

const router = Router();
const path = '/user';

router.get('/', (request: Request, response: Response) => {
  Logger.log('route - user - getAll');
  const promise = new GetAllUserService().execute();
  new Handler().json(response, promise);
});

router.get('/:id', (request: Request, response: Response) => {
  Logger.log('route - user - getByID');
  const id = parseInt(request.params.id);
  const promise = new GetByIdUserService().execute(id);
  new Handler().json(response, promise);
});

router.post('/', (request: Request, response: Response) => {
  Logger.log('route - user - create');
  const params = request.body;
  const promise = new CreateUserService().execute(params);
  new Handler().json(response, promise);
});

router.put('/:id', (request: Request, response: Response) => {
  Logger.log('route - user - update');
  const id = parseInt(request.params.id);
  const params = request.body;
  const promise = new UpdateUserService().execute(id, params);
  new Handler().json(response, promise);
});

router.put('/deactivate/:id', (request: Request, response: Response) => {
  Logger.log('route - user - deactivate');
  const id = parseInt(request.params.id);
  const promise = new DeactivateUserService().execute(id);
  new Handler().json(response, promise);
});

router.put('/reactivate/:id', (request: Request, response: Response) => {
  Logger.log('route - user - reactivate');
  const id = parseInt(request.params.id);
  const promise = new ReactivateUserService().execute(id);
  new Handler().json(response, promise);
});

export { router, path };
