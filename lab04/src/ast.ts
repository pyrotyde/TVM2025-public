export type Expr =
    | NumLiteral
    | VarRef
    | Add
    | Sub
    | Mul
    | Div
    | Neg;

export interface NumLiteral {
    kind: "num";
    value: number;
}

export interface VarRef {
    kind: "var";
    name: string;
}

export interface Add {
    kind: "add";
    left: Expr;
    right: Expr;
}

export interface Sub {
    kind: "sub";
    left: Expr;
    right: Expr;
}

export interface Mul {
    kind: "mul";
    left: Expr;
    right: Expr;
}

export interface Div {
    kind: "div";
    left: Expr;
    right: Expr;
}

export interface Neg {
    kind: "neg";
    expr: Expr;
}
