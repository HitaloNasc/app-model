import fs from 'fs';
import Path from 'path';
import { Express } from 'express';

const routes = (app: Express) => {
  const rootPath = __dirname;

  let files = fs.readdirSync(rootPath);
  files = files.filter((file) => file !== 'index.ts');

  files.forEach((file) => {
    const pathFile = Path.resolve(rootPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { path, router } = require(pathFile);
    app.use(path, router);
  });
};

export default routes;
