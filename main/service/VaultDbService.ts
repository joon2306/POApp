import GenericResponse from "../model/GenericResponse";
import { VaultDbItem } from "../model/VaultDbItem";
import IDbService from "./IDbService";

export default interface IVaultDbService extends IDbService<VaultDbItem, GenericResponse<string>, GenericResponse<VaultDbItem[]>, string, GenericResponse<string>, VaultDbItem, GenericResponse<string>> {

}