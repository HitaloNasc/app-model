import Router, { Request, Response } from 'express';
import { Handler } from '../common/lib/handler';
import { Logger } from '../common/lib/logger';
import { GetAllUserService } from '../api/user/service/get-all.service';
import { GetByIdUserService } from '../api/user/service/get-by-id.service';
import { CreateUserService } from '../api/user/service/create-user.service';
import { UpdateUserService } from '../api/user/service/update-user.service';
import { DeactivateUserService } from '../api/user/service/deactivate-user.service';
import { ReactivateUserService } from '../api/user/service/reactivate-user.service';

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
