import { useContext } from "react"
import { RouteContext } from "../../context/RouteContext"

export default function Plan() {
    const { setMainRoute } = useContext(RouteContext);
    return (
        <>
            Plan component works.
            <button onClick={() => setMainRoute("DASHBOARD")}>back</button>
        </>
    )
}