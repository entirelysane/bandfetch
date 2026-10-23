import { BandcampFetch } from 'bandcamp-fetch';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { argv } from 'node:process';
import 'dotenv/config';

import { Config, loadConfig } from './config';

const download = async (url: string, options: Config) => {
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

  console.log(`Save directory is: "${config.saveDir}"`);

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
