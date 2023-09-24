import { routerType } from '../types/router.types';
import Home from './Home';
import PageNotFound from './PageNotFound';
import CreateStory from './CreateStory';
import Login from './Login';

const pagesData: routerType[] = [
  {
    path: '',
    element: <Home />,
    title: 'Home',
  },
  {
    path: 'create',
    element: <CreateStory />,
    title: 'Weave Story',
  },
  {
    path: 'login',
    element: <Login />,
    title: 'Login',
  },
  {
    path: '*',
    element: <PageNotFound />,
    title: 'error404',
  },
];

export default pagesData;
