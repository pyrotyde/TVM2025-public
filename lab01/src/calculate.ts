import { Dict, MatchResult, Semantics } from "ohm-js";
import grammar, { AddMulActionDict } from "./addmul.ohm-bundle";

export const addMulSemantics: AddMulSemantics = grammar.createSemantics() as AddMulSemantics;


const addMulCalc = {
    number(_) {
        return parseInt(this.sourceString);
    },
    AddExp_plus(a, _, b) {
        return a.calculate() + b.calculate();
    },
    MulExp_times(a, _, b) {
        return a.calculate() * b.calculate();
    },
    ParExp_parPlus(_par1, num, _par2) {
        return num.calculate();
    },
    ParExp_parMult(_par1, num, _par2) {
        return num.calculate();
    },
    ParExp_parNum(_par1, num, _par2) {
        return num.calculate();
    }
    // Expr(e) {
    //     return e.calculate();
    // }
} satisfies AddMulActionDict<number>

addMulSemantics.addOperation<Number>("calculate()", addMulCalc);

interface AddMulDict  extends Dict {
    calculate(): number;
}

interface AddMulSemantics extends Semantics
{
    (match: MatchResult): AddMulDict;
}
