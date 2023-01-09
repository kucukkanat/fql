import { walk } from "https://deno.land/std@0.170.0/fs/walk.ts";
import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

type IFlags = {};
const args = parse(Deno.args, {
  alias: {
    r: "root",
    e: "exclude",
    m: "match",
  },
  default: {
    root: Deno.cwd(),
  },
  collect: ["e", "d", "m"],
});

const skip = args.exclude
  ? (args.exclude as string[]).map((e) => new RegExp(e, "gi"))
  : [new RegExp("\\.git")];
const match = args.match
  ? (args.match as string[]).map((m) => new RegExp(m, "gi"))
  : [new RegExp(".*")];
for await (
  const entry of walk(args.root as string, {
    skip,
    match,
  })
) {
  if (entry.isFile) {
    console.log(entry.path);
  }
}

console.log(args, { skip });
