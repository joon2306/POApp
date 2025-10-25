
import Productivity from "../../../main/model/Productivity";
import useProductivity from "../../hooks/useProductivity";
import Card from "../Card";
import TrackingProductivityCard from "./TrackingProductivityCard";

export default function ProductivityComponent() {

    const { productivity, date } = useProductivity() as {
        productivity: Productivity,
        date: string
    };

    


    return (
        <div className="m-5">
            <Header date={date}></Header>

            <div className="my-10">
                <TrackingProductivityCard></TrackingProductivityCard>

            </div>
        </div>

    )

}


function Header({ date }: { date: string }) {

    return (
        <div className="flex justify-between">
            <div>
                <h1 className="text-2xl font-bold text-[#000000]">Productivity Dashboard</h1>
                <p>Track your tasks and time efficiency</p>
            </div>

            <div className="mt-1">
                <p>Today's Date</p>
                <p className="text-lg font-semibold text-[#000000]">{date}</p>
            </div>
        </div>
    )

}