import { useRoute } from "../../context/RouteContext"

export default function Plan() {
    const { mainRoute, setMainRoute } = useRoute();
    return (
        <div className="bg-white w-screen h-screen">
            {mainRoute && mainRoute.params && mainRoute.params.map((param: string) => {
                return <p key={param}>{param}</p>
            })}
            <button onClick={() => setMainRoute("DASHBOARD")}>back</button>
        </div>
    )
}