import "dotenv/config";
import { BandcampFetch } from "bandcamp-fetch";

import { loadConfig } from "./config";
import { download } from "./download";
import { getArgs, isValidUrl, showHelp } from "./cli";

import pc from "picocolors";

const main = async (): Promise<number> => {
  const args = getArgs();

  if (args.length === 0) {
    showHelp();
    return 1;
  }

  const bandUrl = args[0].value;

  if (!isValidUrl(bandUrl)) {
    console.error(pc.red("Invalid Bandcamp URL."));
    showHelp();
    return 1;
  }

  const cookie = process.env.BANDCAMP_COOKIE;

  if (!cookie) {
    throw new Error("BANDCAMP_COOKIE is not set.");
  }

  const config = await loadConfig();
  const bandcamp = new BandcampFetch({ cookie });
  const albums = await bandcamp.band.getDiscography({ bandUrl });

  console.log(`Save directory: ${config.saveDir}`);
  console.log(`Found ${albums.length} album(s).\n`);

  let hasErrors = false;

  for (const album of albums) {
    if (!album.url) {
      console.error(pc.red(`[ERROR] Missing URL for album: ${album.name}`));
      hasErrors = true;
      continue;
    }

    console.log(`${album.artist?.name ?? "Unknown artist"} - ${album.name}`);
    console.log(pc.green(`Downloading: ${album.url}`));

    try {
      await download(album.url.toString(), config);
    } catch (error: unknown) {
      hasErrors = true;

      console.error(pc.red("Download failed. Skipping to the next album."));

      if (error instanceof Error) {
        console.error(pc.red(error.message));
      } else {
        console.error(pc.red(error?.toString()));
      }
    }

    console.log();
  }

  return hasErrors ? 1 : 0;
};

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error(
      pc.red(
        `Fatal error: ${error instanceof Error ? error.message : error}`,
      )
    );

    process.exitCode = 1;
  });
