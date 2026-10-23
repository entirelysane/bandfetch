import { BandcampFetch } from 'bandcamp-fetch';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { argv } from 'node:process';
import { readFile } from 'node:fs/promises';
import fs from 'fs';
import 'dotenv/config';

const download = async (url: string, options: Config) => {
  const child = spawn("bandcamp-dl", [url, "--base-dir", options.saveDir, options.noConfirm === true ? '--no-confirm' : ''], {
    stdio: 'inherit'
  });

  child.on("error", (error) => {
    console.error('Ooops! Something is fucked up: ' + error.message);
  });

  const [code] = await once(child, "close");
  if (code !== 0) {
    throw new Error('Downloader return code ' + code);
  }
};

const getArgs = (): { index: number, value: string }[] => {
  const withoutLaunch = argv.slice(2, argv.length);
  return withoutLaunch
    .map((value, index) => ({ index, value }))
}

const isValidHttpsUrl = (urlString: string): boolean => {
  if (!URL.canParse(urlString)) {
    return false;
  }

  const url = new URL(urlString);
  return url.protocol === 'https:';
}

const showHelp = () => {
  console.log('Specify album url');
  console.log('---');
  console.log('Try something like this:');
  console.log('<binName> <bandcampLink>');
  console.log('\n\n');
  console.log('And yes. Only one line for now. Maybe later I\'ll do whole list or something like that')
}

interface Config {
  saveDir: string;
  noConfirm: boolean;
}

const loadConfig = async () => {
  const confPath = "./config.json";
  if (!fs.existsSync(confPath)) {
    throw new Error('Oooops! I can\'t find config file... Someone is fucked up');
  }

  const content = await readFile(confPath, "utf8");
  return JSON.parse(content) as Config;
}

// FIXME: add cmd arg
const main = async () => {
  const args = getArgs();

  // FIXME: write understandable helpme
  if (args.length === 0) {
    showHelp();
    return 1;
  }

  const bandUrl = args[0].value;
  if (!isValidHttpsUrl(bandUrl)) {
    console.log('You sure about your link? Seems like it\'s broken\n\n');
    showHelp();
    return;
  }

  const config = await loadConfig();

  const cookie = process.env.BANDCAMP_COOKIE;
  if (!cookie) {
    throw new Error("BANDCAMP_COOKIE is not set");
  }

  const bcfetch = new BandcampFetch({ cookie });
  const albums = await bcfetch.band.getDiscography({ bandUrl });

  for (const album of albums) {
    if (!album.url) {
      // FIXME: add log flag
      console.log(`[ERROR] album.url is broken (${album.url})`);
      continue;
    }

    console.log(`${album.artist?.name} - ${album.name}`);
    console.log(`Downloading: ${album.url}`);

    await download(album.url.toString(), config);
  }
}

main();
