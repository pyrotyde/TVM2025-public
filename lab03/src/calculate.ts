import { MatchResult } from "ohm-js";
import grammar, { ArithmeticActionDict, ArithmeticSemantics } from "./arith.ohm-bundle";

export const arithSemantics: ArithSemantics = grammar.createSemantics() as ArithSemantics;


const arithCalc = {
    number(_) {
        return parseInt(this.sourceString);
    },
    variable(_l, _r) {
        return this.args.params[this.sourceString];
    },
    AddExpr_add(l, ops, rs) {
        let res = l.calculate(this.args.params);
        const n = ops.numChildren;
        for (let i = 0; i < n; i++) {
            switch (ops.child(i).sourceString) {
                case '+': 
                    res += rs.child(i).calculate(this.args.params);
                    break;
                case '-': 
                    res -= rs.child(i).calculate(this.args.params);
                    break;
                default: throw new Error;
            }
        }
        return res;
    },
    MulExpr_mult(l, ops, rs) {
        let res = l.calculate(this.args.params);
        const n = ops.numChildren;
        for (let i = 0; i < n; i++) {
            switch (ops.child(i).sourceString) {
                case '*': 
                    res *= rs.child(i).calculate(this.args.params);
                    break;
                case '/':
                    let right = rs.child(i).calculate(this.args.params);
                    if (right == 0) throw new Error("Division by zero");
                    res /= right;
                    break;
                default: throw new Error;
            }
        }
        return res;
    },
    ParExpr_pars(_lpar, expr, _rpar) {
        return expr.calculate(this.args.params);
    },
    ParExpr_parUnary(_minus, expr) {
        return -1 * expr.calculate(this.args.params);
    }
} satisfies ArithmeticActionDict<number | undefined>;



arithSemantics.addOperation<Number>("calculate(params)", arithCalc);


export interface ArithActions {
    calculate(params: {[name:string]:number}): number;
}

export interface ArithSemantics extends ArithmeticSemantics
{
    (match: MatchResult): ArithActions;
}
