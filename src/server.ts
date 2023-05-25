import 'dotenv/config';
import app from './app';
import { Logger } from './common/lib/logger';

const PORT = parseInt(process.env.PORT!) || 5555;

process.on('SIGTERM', () => {
  process.exit();
});

app.listen(PORT, () => {
  Logger.initial(`Server is running on port ${PORT}`);
});
