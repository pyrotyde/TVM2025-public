import { Expr } from "./ast";

export function printExpr(expr: Expr, parKind : string = "no", parentPrec: number = -1, isRight: boolean = false): string {
    const prec = getPrecedence(expr);

    let s: string;
    switch (expr.kind) {
        case "num":
            s = expr.value.toString();
            break;
        case "var":
            s = expr.name;
            break;
        case "add":
            s = `${printExpr(expr.left, expr.kind, prec, false)} + ${printExpr(expr.right, expr.kind, prec, true)}`;
            break;
        case "sub":
            s = `${printExpr(expr.left, expr.kind, prec, false)} - ${printExpr(expr.right, expr.kind, prec, true)}`;
            break;
        case "mul":
            s = `${printExpr(expr.left, expr.kind, prec, false)} * ${printExpr(expr.right, expr.kind, prec, true)}`;
            break;
        case "div":
            s = `${printExpr(expr.left, expr.kind, prec, false)} / ${printExpr(expr.right, expr.kind, prec, true)}`;
            break;
        case "neg": {
            const inner = expr.expr;
            const innerStr = printExpr(inner, expr.kind, prec);
            if (inner.kind === "num" || inner.kind === "var") {
                // -1, -x
                s = `-${innerStr}`;
            } else {
                // -(a+b), -(x*y)
                s = `-(${innerStr})`;
            }
            break;
        }
    }

    if (parentPrec != -1 && prec < parentPrec && parKind != 'num' && parKind != 'var') {
        return `(${s})`;
    }

    if (prec === parentPrec && isRight) {
        if (parKind === "add" || parKind === "mul" || parKind === "num" || parKind === "var") {
            return s; 
        }
        return `(${s})`;
    }

    return s;
}

function getPrecedence(expr: Expr): number {
    switch (expr.kind) {
        case "num":
        case "var":
            return 4;
        case "neg":
            return 3;
        case "mul":
        case "div":
            return 2;
        case "add":
        case "sub":
            return 1;
    }
}