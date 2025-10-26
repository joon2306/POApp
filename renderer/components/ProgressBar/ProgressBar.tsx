export type ProgressBar = {
    progress: number;
    color: string;
}

export default function ProgressBar({ progress, color }: { progress: number, color: string }) {

    return (
        <div className="rounded-full h-2 w-full bg-gray-300">
            <div className= {`h-2 rounded-full transition-all`} style={{ width: `${progress}%`, backgroundColor: color}}>
            </div>
        </div>
    )

}