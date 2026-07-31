import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";

export async function loadTypeScriptModule(relativePath) {
  const absolutePath = resolve(process.cwd(), relativePath);
  const source = await readFile(absolutePath, "utf8");
  const output = ts.transpileModule(source, {
    fileName: absolutePath,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;

  return import(moduleUrl);
}
