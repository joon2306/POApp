import GenericDbResponse from "../model/DbItem";
import ProductivityDbItem from "../model/ProductivityDbItem";
import IDbService from "./IDbService";

export default interface IProductivityDbService extends IDbService<ProductivityDbItem, GenericDbResponse<string>,
GenericDbResponse<ProductivityDbItem[]>, number, GenericDbResponse<string>, ProductivityDbItem, GenericDbResponse<string>> {

    findById(id: number): GenericDbResponse<ProductivityDbItem>;
}