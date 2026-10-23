import { readFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import { APP_NAME } from './cli';

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

const configDir = join(
  process.env.XDG_CONFIG_HOME || join(homedir(), ".config"),
  APP_NAME,
);

const configPath = join(configDir, "config.json");

export const loadConfig = async (): Promise<Config> => {
  const content = await readFile(configPath, "utf8");
  return JSON.parse(content) as Config;
};
