import { BandcampFetch } from 'bandcamp-fetch';
import { spawn } from 'node:child_process';

const main = async () => {
  const cookie = process.env.BANDCAM_COOKIE;
  const bcfetch = new BandcampFetch({ cookie });

  const albums = await bcfetch.band.getDiscography({
    bandUrl: "https://sandy.bandcamp.com/",
  });

  for (const album of albums) {
    if (!album.url) continue;

    const child = spawn("bandcamp-dl", [album.url.toString()], {
      stdio: 'inherit'
    });

    child.on("close", (code) => {
      console.log(`Process exited with code ${code}`);
    });
  }
}

main();
