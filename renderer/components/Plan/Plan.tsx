import { useRoute } from "../../context/RouteContext"

export default function Plan() {
    const { setMainRoute } = useRoute();
    return (
        <div className="bg-white w-screen h-screen">
            Plan component works.
            <button onClick={() => setMainRoute("DASHBOARD")}>back</button>
        </div>
    )
}