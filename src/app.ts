import 'dotenv/config';

import { BandcampFetch } from 'bandcamp-fetch';

import { loadConfig } from './config';
import { download } from './download';
import { getArgs, showHelp, isValidUrl } from './cli';

const main = async () => {
  const args = getArgs();

  if (args.length === 0) {
    showHelp();
    return 1;
  }

  const bandUrl = args[0].value;
  if (!isValidUrl(bandUrl)) {
    console.log('You sure about your link? Seems like it\'s broken\n\n');
    showHelp();
    return 1;
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
    } catch (error) {
      console.error('Something went wrong. Moving on...');
      console.error(error);
    }
  }

  return 0;
}

main()
  .then((code) => {
    if (typeof code === "number") {
      process.exitCode = code;
    }
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
