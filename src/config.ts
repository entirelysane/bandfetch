import fs from 'fs';
import { readFile } from 'fs/promises';

export interface Config {
  saveDir: string;
  noConfirm: boolean;
  template: string;
  keepSpaces: boolean;
  noSlugify: boolean;
  caseConvert: "lower" | "upper" | "camel" | "none";
  embedArt: boolean;
  embedLyrics: boolean;
  noArt: boolean;
  overwrite: boolean;
}

export const loadConfig = async () => {
  const confPath = "./config.json";
  if (!fs.existsSync(confPath)) {
    throw new Error('Oooops! I can\'t find config file... Someone is fucked up');
  }

  const content = await readFile(confPath, "utf8");
  return JSON.parse(content) as Config;
}
