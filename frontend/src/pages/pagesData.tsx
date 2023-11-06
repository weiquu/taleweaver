import { routerType } from '../types/router.types';
import Home from './Home';
import PageNotFound from './PageNotFound';
import CreateStory from './CreateStory';
import Login from './Login';
import Register from './Register';
import PasswordReset from './PasswordReset';
import MyLibrary from './MyLibrary';
import PublicLibrary from './PublicLibrary';
import StoryPage from './Story';
import Profile from './Profile';

const pagesData: routerType[] = [
  {
    path: '',
    element: <Home />,
    title: 'Home',
    authRequired: false,
    mainNav: true,
    inSession: true,
  },
  {
    path: 'create',
    element: <CreateStory />,
    title: 'Create',
    authRequired: true,
    mainNav: true,
    inSession: true,
  },
  {
    path: 'login',
    element: <Login />,
    title: 'Login',
    authRequired: false,
    mainNav: false,
    inSession: false,
  },
  {
    path: 'register',
    element: <Register />,
    title: 'Register',
    authRequired: false,
    mainNav: false,
    inSession: false,
  },
  {
    path: 'password-reset',
    element: <PasswordReset />,
    title: 'Password Reset',
    authRequired: false,
    mainNav: false,
    inSession: false,
  },
  {
    path: 'my-library',
    element: <MyLibrary />,
    title: 'My Library',
    authRequired: true,
    mainNav: true,
    inSession: true,
  },
  {
    path: 'public-library',
    element: <PublicLibrary />,
    title: 'Gallery',
    authRequired: true,
    mainNav: true,
    inSession: true,
  },
  {
    path: 'story/:id',
    element: <StoryPage />,
    title: 'Story',
    authRequired: false,
    mainNav: false,
    inSession: true,
  },
  {
    path: 'profile',
    element: <Profile />,
    title: 'Profile',
    authRequired: true,
    mainNav: false,
    inSession: true,
  },
  {
    path: '*',
    element: <PageNotFound />,
    title: 'error404',
    authRequired: false,
    mainNav: false,
    inSession: true,
  },
];

export default pagesData;
