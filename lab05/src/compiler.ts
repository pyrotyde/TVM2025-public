import { c as C, Op, I32 } from "../../wasm";
import { Expr } from "../../lab04";
import { buildOneFunctionModule, Fn } from "./emitHelper";
const { i32, get_local} = C;

export function getVariables(e: Expr): string[] {
    let varSet : Set<string> = new Set<string>;

    switch (e.kind) {
        case ("var") :
            varSet.add(e.name);
            break;
        case ("add") :
        case ("sub") :
        case ("mul") :
        case ("div") :
            for (const variable of getVariables(e.left)) {
                varSet.add(variable);
            }
            for (const variable of getVariables(e.right)) {
                varSet.add(variable);
            }
            break;
        case ("neg") :
            for (const variable of getVariables(e.expr)) {
                varSet.add(variable);
            }
            break;
        case ("num") :
            break;
    }

    return [...varSet];
}

export async function buildFunction(e: Expr, variables: string[]): Promise<Fn<number>>
{
    let expr = wasm(e, variables)
    return await buildOneFunctionModule("test", variables.length, [expr]);
}

function wasm(e: Expr, args: string[]): Op<I32> {
    switch (e.kind) {
        case "num":
            return i32.const(e.value);
        case "var": {
            const idx = args.indexOf(e.name);
            if (idx === -1) {
                throw new WebAssembly.RuntimeError("Unknown variable");
            }
            return get_local(i32, idx);
        }
        case "add":
            return i32.add(
                wasm(e.left, args),
                wasm(e.right, args)
            );
        case "sub":
            return i32.sub(
                wasm(e.left, args),
                wasm(e.right, args)
            );
        case "mul":
            return i32.mul(
                wasm(e.left, args),
                wasm(e.right, args)
            );
        case "div":
            return i32.div_s(
                wasm(e.left, args),
                wasm(e.right, args)
            );
        case "neg":
            return i32.sub(
                i32.const(0),
                wasm(e.expr, args)
            );
        default:
            throw new Error();
    }
}
