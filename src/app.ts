import { BandcampFetch } from 'bandcamp-fetch';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import 'dotenv/config'

const download = async (url: string) => {
  const child = spawn("bandcamp-dl", [url], {
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

// FIXME: add cmd arg
const main = async () => {
  const cookie = process.env.BANDCAMP_COOKIE;

  if (!cookie) {
    throw new Error("BANDCAMP_COOKIE is not set");
  }

  const bcfetch = new BandcampFetch({ cookie });
  const albums = await bcfetch.band.getDiscography({ bandUrl: "https://sandy.bandcamp.com/" });

  for (const album of albums) {
    if (!album.url) {
      // FIXME: add log flag
      console.log(`[ERROR] album.url is broken (${album.url})`);
      continue;
    }

    console.log(`${album.artist?.name} - ${album.name}`);
    console.log(`Downloading: ${album.url}`);

    await download(album.url.toString());
  }
}

main();
