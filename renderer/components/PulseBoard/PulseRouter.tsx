import { useEffect, useState } from "react"
import PulseBoard from "./PulseBoard";
import Kanban from "../Kanban";
import { Sprint } from "../../utils/PulseUtils";
import IPiService from "../../services/IPiService";
import PiService from "../../services/impl/PiService";
import CommsService from "../../services/impl/CommsService";

export const ROUTES = {
    DEFAULT: 0,
    USER_STORY: 1,
    DEPENDENCY: 2
}

export type SelectedFeature = {
    featureRef: string;
    piRef: string;
    activeSprint: Sprint
}

export default function PulseRouter({ calculateHeight }: { calculateHeight: () => number }) {

    const [route, setRoute] = useState<number>(ROUTES.DEFAULT);
    const [selectedFeature, setSelectedFeature] = useState<SelectedFeature>(null);

    const piService = new PiService(new CommsService());

    useEffect(() => {
        setRoute(ROUTES.DEFAULT);
    }, [])

    return (
        <>
        {route === ROUTES.DEFAULT && <PulseBoard setRoute={setRoute} setSelectedFeature={setSelectedFeature} piService={piService}/> }
        {route === ROUTES.USER_STORY && <Kanban calculateHeight={calculateHeight} type="USER_STORY" selectedFeature={selectedFeature} />}
        {route === ROUTES.DEPENDENCY && <Kanban calculateHeight={calculateHeight} type="DEPENDENCY" selectedFeature={selectedFeature} />}
        
        
        </>
    )
}