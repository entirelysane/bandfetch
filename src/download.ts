import { spawn } from "node:child_process";
import type { Config } from "./config";
import { once } from "node:events";

export const download = async (url: string, options: Config) => {
  const args = [
    url,
    "--base-dir",
    options.saveDir,
    "--template",
    options.template,
    "--case-convert",
    options.caseConvert,
  ];

  if (options.noConfirm) args.push("--no-confirm");
  if (options.keepSpaces) args.push("--keep-spaces");
  if (options.noSlugify) args.push("--no-slugify");
  if (options.embedArt) args.push("--embed-art");
  if (options.embedLyrics) args.push("--embed-lyrics");
  if (options.noArt) args.push("--no-art");
  if (options.overwrite) args.push("--overwrite");

  const child = spawn("bandcamp-dl", args, {
    stdio: "inherit",
  });

  const [code] = await once(child, "close");

  if (code !== 0) {
    throw new Error(`Downloader exited with code ${code}`);
  }
};
