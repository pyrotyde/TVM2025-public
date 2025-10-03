import { Expr } from "../../lab04";

export function derive(e: Expr, varName: string): Expr
{   
    let result : Expr;
    switch (e.kind) {
        case ("add") :
            result = {kind: "add", left: derive(e.left, varName), right: derive(e.right, varName)};
            break;
        case ("sub"):
            result ={kind: "sub", left: derive(e.left, varName), right: derive(e.right, varName)};
            break;
        case ("mul") :
            let gdf : Expr = {kind: "mul", left: derive(e.left, varName), right: e.right};
            let fdg : Expr = {kind: "mul", left: e.left, right: derive(e.right, varName)};
            result = {kind: "add", left: gdf, right: fdg};
            break;
        case ("div") :
            let numleft : Expr = {kind: "mul", left: derive(e.left, varName), right: e.right};
            let numright : Expr = {kind: "mul", left: derive(e.right, varName), right: e.left};
            let denom : Expr = {kind: "mul", left: e.right, right: e.right};
            let numerator : Expr = {kind: "sub", left: numleft, right: numright};
            result = {kind: "div", left: numerator, right: denom};
            break;
        case ("neg") :
            result = {kind: "neg", expr: derive(e.expr, varName)};
            break;
        case ("num") :
            result = {kind: "num", value: 0};
            break;
        case ("var") :
            if (e.name == varName) {
                result =  {kind: "num", value: 1};
            } else {
                result =  {kind: "num", value: 0};
            }
            break;
    }

    return simplify(result);
}


function isZero(e: Expr): boolean  { 
    return (e.kind == "num" && e.value == 0);
}

function isOne(e: Expr): boolean  { 
    return (e.kind == "num" && e.value == 1);
}

function simplify(e: Expr): Expr {
    switch (e.kind) {
        case "num":
        case "var":
            return e;
        case "neg": {
            const inner = simplify(e.expr); 
            if (inner.kind === "num" && inner.value === 0) return { kind: "num", value: 0 };
            if (inner.kind === "neg") return inner.expr;
            return { kind: "neg", expr: inner };
        }
        case "add": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(left)) return right;
            if (isZero(right)) return left;
            return { kind: "add", left, right };
        }
        case "sub": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(right)) return left;
            if (isZero(left)) {
                if (right.kind == "neg") return right.expr;                
                return simplify({ kind: "neg", expr: right });
            }
            if (right.kind === "neg") return {kind: "add", left: left, right: right.expr};
            return { kind: "sub", left, right };
        }
        case "mul": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(left) || isZero(right)) return { kind: "num", value: 0 };
            if (isOne(left)) return right;
            if (isOne(right)) return left;
            return { kind: "mul", left, right };
        }
        case "div": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isOne(right)) return left;
            if (isZero(left)) return { kind: "num", value: 0 };
            if (left.kind === "neg") return { kind: "neg", expr: {kind: "div", left: left.expr, right: right}};
            if (right.kind === "neg") return { kind: "neg", expr: {kind: "div", left: left, right: right.expr}};
            return { kind: "div", left, right };
        }
    }
}

