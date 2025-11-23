import CommsService from "../../services/impl/CommsService";
import PlannedPiService from "../../services/impl/PlannedPiService";
import PlannedPulseService from "../../services/impl/PlannedPulseService";
import PulseBoard from "./PulseBoard";

export default function PlannedPulseWrapper() {

    const noop = () => {};

    const commsService = new CommsService();
    const piService = new PlannedPiService(commsService);
    const pulseService = new PlannedPulseService(commsService);

    return (
        <PulseBoard setRoute={noop} setSelectedFeature={noop} piService={piService} pulseService={pulseService}/>
    )
}