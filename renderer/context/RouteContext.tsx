import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export type MainRoute = "DASHBOARD" | "PLANNED";
export type MainRouter = {
    mainRoute: MainRoute
    setMainRoute: Dispatch<SetStateAction<MainRoute>>;
}

const RouteContext = createContext<MainRouter>(null);

export const MainRouter = ({ children }) => {
    const [mainRoute, setMainRoute] = useState<MainRoute>("DASHBOARD");

    return (
        <RouteContext.Provider value={{ mainRoute, setMainRoute }}>
            {children}
        </RouteContext.Provider>
    )
}

export const useRoute = () => {

    const router = useContext(RouteContext);

    const setRoute = (route) => {
        console.log("route: ", route);
        router.setMainRoute(route);
    }

    if (router === null) {
        throw "There is an error with the router context";
    }
    return { mainRoute: router.mainRoute, setMainRoute: setRoute };
}