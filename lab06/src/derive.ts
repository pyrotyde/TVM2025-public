import { Expr } from "../../lab04";

function add(left: Expr, right: Expr) : Expr { return {kind: "add", left: left, right: right}; }

function sub(left: Expr, right: Expr) : Expr { return {kind: "sub", left: left, right: right}; }

function mul(left: Expr, right: Expr) : Expr { return {kind: "mul", left: left, right: right}; }

function div(left: Expr, right: Expr) : Expr { return {kind: "div", left: left, right: right}; }

function varExp(name: string) : Expr { return {kind: "var", name: name}; }

function num(value: number) : Expr { return {kind: "num", value: value}; }

function neg(expr: Expr) : Expr { return {kind: "neg", expr: expr}};

export function derive(e: Expr, varName: string): Expr
{   
    let result : Expr;
    switch (e.kind) {
        case ("add") :
            result = add(derive(e.left, varName), derive(e.right, varName));
            break;
        case ("sub"):
            result = sub(derive(e.left, varName), derive(e.right, varName));
            break;
        case ("mul") :
            let gdf : Expr =  mul(derive(e.left, varName), e.right);
            let fdg : Expr = mul(e.left, derive(e.right, varName))
            result = add(gdf, fdg);
            break;
        case ("div") :
            let numleft : Expr = mul(derive(e.left, varName), e.right);
            let numright : Expr = mul(derive(e.right, varName), e.left);
            let denom : Expr = mul(e.right, e.right);
            let numerator : Expr = sub(numleft, numright);
            result = div(numerator, denom);
            break;
        case ("neg") :
            result = neg(derive(e.expr, varName));
            break;
        case ("num") :
            result = num(0);
            break;
        case ("var") :
            if (e.name == varName) {
                result =  num(1);
            } else {
                result = num(0);
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
            if (isZero(inner)) return num(0);   // -0 = 0
            if (inner.kind === "neg") return inner.expr;    // --x = x
            return neg(inner);
        }
        case "add": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(left)) return right; // 0 + x = x + 0 = x
            if (isZero(right)) return left;
            return add(left, right);
        }
        case "sub": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(right)) return left; // x - 0 = x
            if (isZero(left)) {
                if (right.kind == "neg") return right.expr; // 0 - (-x) = x            
                return simplify(neg(right));
            }
            if (right.kind === "neg") return add(left, right.expr); // x - (-y) = x + y
            return sub(left, right);
        }
        case "mul": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isZero(left) || isZero(right)) return num(0);    // 0 * x = x * 0 = 0
            if (isOne(left)) return right;  // 1 * x = x * 1 = x
            if (isOne(right)) return left;
            return mul(left, right);
        }
        case "div": {
            const left = simplify(e.left);
            const right = simplify(e.right);
            if (isOne(right)) return left;  // x / 1 = x
            if (isZero(left)) return { kind: "num", value: 0 }; // 0 / x = 0
            if (left.kind === "neg") return  neg(div(left.expr, right)); // (-x)/y = x/(-y) = -(x/y)
            if (right.kind === "neg") return neg(div(left, right.expr));
            return div(left, right);
        }
    }
}

