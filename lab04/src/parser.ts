import { MatchResult } from 'ohm-js';
import { arithGrammar, ArithmeticActionDict, ArithmeticSemantics, SyntaxError } from '../../lab03';
import { Expr } from './ast';

export const getExprAst: ArithmeticActionDict<Expr> = {
    Expr(e) {
        return e.parse();
    },

    AddExpr_add(first, ops, rs) {
        let node: Expr = first.parse();
        const n = ops.numChildren;
        for (let i = 0; i < n; i++) {
            const op = ops.child(i).sourceString;
            const rhs = rs.child(i).parse();
            if (op === "+") {
                node = { kind: "add", left: node, right: rhs };
            } else {
                node = { kind: "sub", left: node, right: rhs };
            }
        }
        return node;
    },

    MulExpr_mult(first, ops, rs) {
        let node: Expr = first.parse();
        const n = ops.numChildren;
        for (let i = 0; i < n; i++) {
            const op = ops.child(i).sourceString;
            const rhs = rs.child(i).parse();
            if (op === "*") {
                node = { kind: "mul", left: node, right: rhs };
            } else {
                node = { kind: "div", left: node, right: rhs };
            }
        }
        return node;
    },

    ParExpr_pars(_open, expr, _close) {
        return expr.parse();
    },

    ParExpr_parUnary(_minus, expr) {
        return { kind: "neg", expr: expr.parse() };
    },

    number(_digits) {
        return { kind: "num", value: parseInt(this.sourceString, 10) };
    },

    variable(_first, _rest) {
        return { kind: "var", name: this.sourceString };
    }
}

export const semantics = arithGrammar.createSemantics();
semantics.addOperation("parse()", getExprAst);

export interface ArithSemanticsExt extends ArithmeticSemantics
{
    (match: MatchResult): ArithActionsExt
}

export interface ArithActionsExt 
{
    parse(): Expr
}
export function parseExpr(source: string): Expr
{
    const m: MatchResult = arithGrammar.match(source);
    if (m.failed()) {
        throw new Error("Parse error");
    }
    return semantics(m).parse();
}


    
