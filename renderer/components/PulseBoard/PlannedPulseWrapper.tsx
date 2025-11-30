import { mainRoute } from "../../pages/home";
import CommsService from "../../services/impl/CommsService";
import PlannedPiService from "../../services/impl/PlannedPiService";
import PlannedPulseService from "../../services/impl/PlannedPulseService";
import PulseBoard from "./PulseBoard";

export default function PlannedPulseWrapper({setMainRoute}: {setMainRoute: (route: mainRoute, props: unknown) => void}) {

    const noop = () => {};

    const commsService = new CommsService();
    const piService = new PlannedPiService(commsService);
    const pulseService = new PlannedPulseService(commsService);

    return (
        <PulseBoard setRoute={setMainRoute} setSelectedFeature={noop} piService={piService} pulseService={pulseService}/>
    )
}