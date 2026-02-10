import { createContext, useContext, useState } from "react";

export type Route = "home" | "chat";

interface NavigationContext {
  route: Route;
  navigate: (route: Route) => void;
}

const navigationContext = createContext<NavigationContext>({
  route: "home",
  navigate: () => { },
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");

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