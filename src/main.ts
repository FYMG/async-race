import 'normalize.css';
import '@styles/index.scss';
import { createRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import { createRaceApiProvider } from '@services/api.ts';

createRouter(undefined, Routes.startPage);
createRaceApiProvider();
