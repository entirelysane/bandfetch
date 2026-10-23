import { mkdir, readFile, writeFile } from 'fs/promises';
import { homedir, userInfo } from 'os';
import { join } from 'path';
import { APP_NAME } from './cli';
import pc from 'picocolors';

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

const defaultConfig: Config = {
  saveDir: `${userInfo().homedir}/Music/Bandcamp`,
  noConfirm: true,
  template: "%{artist}/%{date} - %{album}/%{track} - %{title}",
  keepSpaces: true,
  noSlugify: false,
  caseConvert: "none",
  embedArt: false,
  embedLyrics: false,
  noArt: false,
  overwrite: false
};

export const loadConfig = async (): Promise<Config> => {
  await mkdir(configDir, { recursive: true });

  try {
    const content = await readFile(configPath, "utf8");
    return { ...defaultConfig, ...JSON.parse(content) } as Config;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  await writeFile(
    configPath,
    `${JSON.stringify(defaultConfig, null, 2)}\n`,
    { flag: "wx" },
  );

  console.log(pc.green(`Created default config: ${configPath}\n`));

  return defaultConfig;
};
