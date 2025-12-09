export type Result<T, U> = Ok<T, U> | Err<T, U>;

interface IResult <T, U> {
    match(pattern: MatchPattern<T, U>): T | U;
}

type MatchPattern<T, U> = {
    ok: (value: T) => T,
    err: (error: U) => U
}

export class Ok<T, U> implements IResult<T, U> {
    private value: T;
    constructor(value: T) {
        this.value = value;
    }

    public match(pattern: MatchPattern<T, U>): T | U {
        return pattern.ok(this.value);
    }
}

export class Err<T, U> implements IResult<T, U> {
    private error: U;
    constructor(error: U) {
        this.error = error;
    }
    public match(pattern: MatchPattern<T, U>): T | U {
        return pattern.err(this.error);
    }
}