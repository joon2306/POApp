import CommsService from "../../services/impl/CommsService";
import PlannedPiService from "../../services/impl/PlannedPiService";
import PulseBoard from "./PulseBoard";

export default function PlannedPulseWrapper() {

    const noop = () => {};

    const piService = new PlannedPiService(new CommsService());

    return (
        <PulseBoard setRoute={noop} setSelectedFeature={noop} piService={piService}/>
    )
}