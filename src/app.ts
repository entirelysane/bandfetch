import 'dotenv/config';

import { BandcampFetch } from 'bandcamp-fetch';
import { argv } from 'node:process';

import { loadConfig } from './config';
import { download } from './download';

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

// FIXME: write understandable helpme
const showHelp = () => {
  console.log('Specify album url');
  console.log('---');
  console.log('Try something like this:');
  console.log('<binName> <bandcampLink>');
  console.log('\n\n');
  console.log('And yes. Only one line for now. Maybe later I\'ll do whole list or something like that')
}

const main = async () => {
  const args = getArgs();

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

    try {
      await download(album.url.toString(), config);
    } catch {
      console.log('Something went wrong. Moving on...');
    }
  }
}

main();
