
import Productivity from "../../../main/model/Productivity";
import useProductivity from "../../hooks/useProductivity";
import Card from "../Card";

export default function ProductivityComponent() {

    const { productivity, date } = useProductivity() as {
        productivity: Productivity,
        date: string
    };

    function cardContent() {
        return (
            <p>Arjoon king</p>
        )
    }


    return (
        <div className="m-5">
            <Header date={date}></Header>

            <div className="my-10">
                <Card width={{large: "300px", medium: "150px"}} height={{large: "300px", medium: "150px"}} Content={cardContent}></Card>

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