export default interface IDbService<TCreate, RCreate, TGetAll, TDelete, RDelete, TModify, RModify> {
    create(arg: TCreate): RCreate;

    getAll(): TGetAll;

    delete(arg: TDelete): RDelete;

    modify(arg: TModify): RModify;

}