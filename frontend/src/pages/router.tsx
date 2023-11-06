import { Route, Routes } from 'react-router-dom';
import { routerType } from '../types/router.types';
import pagesData from './pagesData';
import AuthRoute from '../App/components/AuthRoute';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';
import ReactGA4 from 'react-ga4';
import SessionRoute from '../App/components/SessionRoute';


const Router = () => {
  const { auth, loading } = useAuth();

  useEffect(() =>
    ReactGA4.send({ 
      hitType: 'pageview',
      page: window.location.pathname + window.location.search
    }), []);

  const pageRoutes = pagesData.map(
    ({ path, title, element, authRequired }: routerType) => {
      return !authRequired ? (
        <Route key={title} path={`/${path}`} element={element} />
      ) : null;
    },
  );

  const authPageRoutes = pagesData.map(
    ({ path, title, element, authRequired }: routerType) => {
      return authRequired ? (
        <Route key={title} path={`/${path}`} element={element} />
      ) : null;
    },
  );

  const routesNotAvailableWhenInSession = pagesData.map(
    ({ path, title, element, inSession }: routerType) => {
      return !inSession ? (
        <Route key={title} path={`/${path}`} element={element} />
      ) : null;
    },
  );

  return (
    <Routes>
      <Route element={<AuthRoute />}>{authPageRoutes}</Route>
      <Route element={<SessionRoute />}>{routesNotAvailableWhenInSession}</Route>
      {pageRoutes}
    </Routes>
  );
};

export default Router;
