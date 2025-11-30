import { createContext, Dispatch, SetStateAction } from "react";

export type MainRoute = "DASHBOARD" | "PLANNED";
export type MainRouter = {
    mainRoute: MainRoute
    setMainRoute: Dispatch<SetStateAction<MainRoute>>;
}

export const RouteContext= createContext<MainRouter>({mainRoute: "DASHBOARD", setMainRoute: () => {}});