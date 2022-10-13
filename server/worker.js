import path from "path";
import { isMainModule, readJson } from "./services/utils.js";
import { runMagma } from "./services/magma.js";

console.log("loaded worker");

if (isMainModule(import.meta)) {
  console.log("in main module");
  try {
    await main(process.argv, process.env);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export async function main(argv = process.argv, env = process.env) {
  const id = argv[2];
  if (!id) throw new Error("Missing id");
  const paramsFilePath = path.resolve(env.INPUT_FOLDER, id, "params.json");
  const params = await readJson(paramsFilePath);
  console.log({ params });
  console.log(await runMagma(params, console));
}
