import { createContext, useContext, useState } from "react";

export type Route = "home" | "chat" | "sessions";
const DEFAULT_ROUTE: Route = "home";


interface NavigationContext {
  route: Route;
  navigate: (route: Route) => void;
}

const navigationContext = createContext<NavigationContext>({
  route: DEFAULT_ROUTE,
  navigate: () => { },
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>(DEFAULT_ROUTE);

  const navigate = (route: Route) => {
    setRoute(route);
  };

  const value: NavigationContext = {
    route,
    navigate,
  };

  return <navigationContext.Provider value={value}>{children}</navigationContext.Provider>;
}

export function useNavigate() {
  return useContext(navigationContext);
}