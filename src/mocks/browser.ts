
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup the worker with our handlers
export const worker = setupWorker(...handlers);
