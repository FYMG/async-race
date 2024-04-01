import 'normalize.css';
import '@styles/index.scss';
import { createRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import { createLocalStorageProvider } from '@services/localStorageProvider';
import { createAuthProvider } from '@services/auth';
import { createRaceApiProvider, useRaceApi } from '@services/api.ts';

createLocalStorageProvider();
createAuthProvider();
createRouter(undefined, Routes.startPage);
createRaceApiProvider();

const { getCars, getCar, createCar, deleteCar, generateCars } = useRaceApi();
void createCar('test', 'red', (data) => console.log(data));
getCars(1, 7, (data, headers) => console.log(data, headers.get('X-Total-Count')));
getCar(3, (data) => console.log(data));

getCars(1, 7, (data) => deleteCar(data[data.length - 1]?.id ?? -1));

generateCars(100, (data) => console.log(data));
