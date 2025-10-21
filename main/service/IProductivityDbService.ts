import GenericResponse from "../model/GenericResponse";
import ProductivityDbItem from "../model/ProductivityDbItem";
import IDbService from "./IDbService";

export default interface IProductivityDbService extends IDbService<ProductivityDbItem, GenericResponse<string>,
GenericResponse<ProductivityDbItem[]>, number, GenericResponse<string>, ProductivityDbItem, GenericResponse<string>> {

    findById(id: number): GenericResponse<ProductivityDbItem>;
}