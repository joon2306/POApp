export default interface IDbService<TCreate, RCreate, TGetAll, TDelete, RDelete, TModify, RModify> {
    create(arg: TCreate): RModify;

    getAll(): TGetAll;

    delete(arg: TDelete): RDelete;

    modify(arg: TModify): RModify;

}