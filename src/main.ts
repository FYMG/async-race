import 'normalize.css';
import '@styles/index.scss';
import { createRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import { createLocalStorageProvider } from '@services/localStorageProvider';
import { createAuthProvider } from '@services/auth';
import { createRaceApiProvider } from '@services/api.ts';

createLocalStorageProvider();
createAuthProvider();
createRouter(undefined, Routes.startPage);
createRaceApiProvider();
