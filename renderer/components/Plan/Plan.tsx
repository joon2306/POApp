import { useRoute } from "../../context/RouteContext";
import { PlanningView } from "./PlanningView";
import { Feature } from "./types/types";

export default function Plan() {
    const { mainRoute, setMainRoute } = useRoute();
    const feature: Feature = { title: mainRoute.params[0] as string }
    return (
        <div className="bg-white w-screen h-screen">
            <PlanningView feature={feature} onClose={() => setMainRoute("DASHBOARD", ["PlannedPulse"])} />
        </div>
    )
}