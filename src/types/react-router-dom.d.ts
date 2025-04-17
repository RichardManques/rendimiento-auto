declare module 'react-router-dom' {
  import { ComponentType, ReactNode } from 'react';

  export function useNavigate(): (to: string) => void;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  };
  
  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
  export const Routes: ComponentType<{ children?: ReactNode }>;
  export const Route: ComponentType<{
    path?: string;
    element?: ReactNode;
    children?: ReactNode;
  }>;
  export const Navigate: ComponentType<{
    to: string;
    replace?: boolean;
    state?: any;
  }>;
  export const Link: ComponentType<{
    to: string;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    replace?: boolean;
    state?: any;
  }>;
} 