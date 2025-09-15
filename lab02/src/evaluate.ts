import { ReversePolishNotationActionDict} from "./rpn.ohm-bundle";

export const rpnCalc = {
    number(_) {
        return parseInt(this.sourceString);
    }, 
    RpnExpr_RpnPlus(a, b, _) {
        return a.evaluate() + b.evaluate();
    },
    RpnExpr_RpnMult(a, b, _) {
        return a.evaluate() * b.evaluate();
    }
} satisfies ReversePolishNotationActionDict<number>;