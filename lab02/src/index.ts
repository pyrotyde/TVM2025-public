import grammar from "./rpn.ohm-bundle";
import { rpnSemantics } from "./semantics";

export function evaluate(source: string): number
{ 
    const match = grammar.match(source);
    if (match.failed()) {
        throw new SyntaxError("Syntax error")
    }
    return rpnSemantics(match).evaluate();
}

export function maxStackDepth(source: string): number
{ 
    const match = grammar.match(source);
    if (match.failed()) {
        throw new SyntaxError("Syntax error");
    }
    return rpnSemantics(match).maxStackDepth();
}

export class SyntaxError extends Error
{
}
