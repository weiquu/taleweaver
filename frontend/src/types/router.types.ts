export interface routerType {
  title: string;
  path: string;
  element: JSX.Element;
  authRequired: boolean;
  mainNav: boolean;
  inSession: boolean;
}
