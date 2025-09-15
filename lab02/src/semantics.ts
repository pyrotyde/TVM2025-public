import { Dict, MatchResult, Semantics } from "ohm-js";
import grammar from "./rpn.ohm-bundle";
import { rpnStackDepth, StackDepth, rpnMaxStackDepth } from "./stackDepth";
import { rpnCalc } from "./evaluate";

interface RpnDict  extends Dict {
    evaluate(): number;
    stackDepth: StackDepth;
    maxStackDepth(): number;
}

interface RpnSemantics extends Semantics
{
    (match: MatchResult): RpnDict;
}

export const rpnSemantics: RpnSemantics = grammar.createSemantics() as RpnSemantics;

rpnSemantics.addOperation<number>("evaluate()", rpnCalc);
rpnSemantics.addOperation<StackDepth>("maxStackDepth()", rpnMaxStackDepth);
rpnSemantics.addAttribute<StackDepth>("stackDepth", rpnStackDepth);