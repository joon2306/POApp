import { useContext } from "react";
import CommsService from "../../services/impl/CommsService";
import PlannedPiService from "../../services/impl/PlannedPiService";
import PlannedPulseService from "../../services/impl/PlannedPulseService";
import PulseBoard from "./PulseBoard";
import { RouteContext } from "../../context/RouteContext";

export default function PlannedPulseWrapper() {

    const noop = () => { };

    const commsService = new CommsService();
    const piService = new PlannedPiService(commsService);
    const pulseService = new PlannedPulseService(commsService);

    const { setMainRoute } = useContext(RouteContext);

    return (
        <PulseBoard setRoute={setMainRoute} setSelectedFeature={noop} piService={piService} pulseService={pulseService} />
    )
}