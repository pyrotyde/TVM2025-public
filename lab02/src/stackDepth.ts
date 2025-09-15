import { ReversePolishNotationActionDict } from "./rpn.ohm-bundle";

export const rpnStackDepth = {
    number(_) {
        return {max: 1, out: 1};
    }, 
    RpnExpr_RpnPlus(a, b, _) {
        const A_depth = a.stackDepth;
        const B_depth = b.stackDepth;
        const out = A_depth.out + B_depth.out - 1;
        const max = Math.max(A_depth.max, A_depth.out + B_depth.max);
        return { max, out };
    },
    RpnExpr_RpnMult(a, b, _) {
        const A_depth = a.stackDepth;
        const B_depth = b.stackDepth;
        const out = A_depth.out + B_depth.out - 1;
        const max = Math.max(A_depth.max, A_depth.out + B_depth.max);
        return { max, out };
    }
} satisfies ReversePolishNotationActionDict<StackDepth>;

export const rpnMaxStackDepth = {
    RpnExpr(expr) {
        return expr.maxStackDepth();
    },
    number(_) {
        return this.stackDepth.max;
    },
    RpnExpr_RpnPlus(a, b, _) {
        return this.stackDepth.max;
    },
    RpnExpr_RpnMult(a, b, _) {
        return this.stackDepth.max;
    },
} satisfies ReversePolishNotationActionDict<number>;

export type StackDepth = {max: number, out: number};
