import Productivity, { CompletedTask, Task } from "../../main/model/Productivity";

export default interface IProductivityService {

    getProductivity(): Promise<Productivity>;
}