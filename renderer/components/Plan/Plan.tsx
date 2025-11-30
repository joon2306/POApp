import { mainRoute } from "../../pages/home";

export default function Plan({setMainRoute}: {setMainRoute: (route: mainRoute) => void}) {
    return (
        <>
        Plan component works.
        <button onClick={() => setMainRoute("DASHBOARD")}>back</button>
        </>
    )
}