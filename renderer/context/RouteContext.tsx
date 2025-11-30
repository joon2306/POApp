import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type Route = "DASHBOARD" | "PLANNED";
export type MainRoute = {
    route: "DASHBOARD" | "PLANNED";
    params: unknown[]
}
export type MainRouter = {
    mainRoute: MainRoute
    setMainRoute: Dispatch<SetStateAction<MainRoute>>;
}

const RouteContext = createContext<MainRouter>(null);

export const MainRouter = ({ children }) => {
    const [mainRoute, setMainRoute] = useState<MainRoute>({ route: "DASHBOARD", params: [] });

    return (
        <RouteContext.Provider value={{ mainRoute, setMainRoute }}>
            {children}
        </RouteContext.Provider>
    )
}

export const useRoute = () => {

    const router = useContext(RouteContext);



    if (router === null) {
        throw "There is an error with the router context";
    }

    const setMainRoute = (value: Route, params?: unknown[]) => {
        if (!params || params.length === 0) {
            return router.setMainRoute((prev: MainRoute) => {
                return { ...prev, route: value };
            })
        }

        return router.setMainRoute({route: value, params});
    }

    return {mainRoute: router.mainRoute, setMainRoute};
}