import { argv } from 'node:process';

const APP_NAME = "bandcamp-get-discography"; // FIXME: придумай что-то покороче

export const getArgs = (): { index: number, value: string }[] => {
  const withoutLaunch = argv.slice(2, argv.length);
  return withoutLaunch
    .map((value, index) => ({ index, value }))
}

export const isValidUrl = (urlString: string): boolean => {
  if (!URL.canParse(urlString)) {
    return false;
  }

  const url = new URL(urlString);
  return url.protocol === 'https:';
}

export const showHelp = () => {
  console.log(`
Bandcamp Discography Downloader
Download albums from a Bandcamp artist's discography.

USAGE:
  ${APP_NAME} <artist-url>

ARGUMENTS:
  <artist-url>    URL of the Bandcamp artist page

EXAMPLES:
  ${APP_NAME} https://artist.bandcamp.com

NOTES:
  - Only HTTPS URLs are accepted.
  - The artist's discography is processed sequentially.
  - Failed downloads are skipped so the remaining albums can be processed.
  - Download settings are read from config.json.
  - BANDCAMP_COOKIE must be set in the environment.

For download options, see:
  https://github.com/Evolution0/bandcamp-dl#options
`);
};
