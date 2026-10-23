import { argv } from 'node:process';
import pc from 'picocolors';

export const APP_NAME = "bandcamp-get-discography"; // FIXME: придумай что-то покороче

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
${pc.bold(pc.cyan("Bandcamp Discography Downloader"))}
Download albums from a Bandcamp artist's discography.

${pc.bold("USAGE:")}
  ${pc.green(APP_NAME)} ${pc.yellow("<artist-url>")}

${pc.bold("ARGUMENTS:")}
  ${pc.yellow("<artist-url>")}    URL of the Bandcamp artist page

${pc.bold("EXAMPLES:")}
  ${pc.dim("$")} ${pc.green(APP_NAME)} ${pc.cyan(pc.underline("https://artist.bandcamp.com"))}

${pc.bold("NOTES:")}
  - Only ${pc.cyan("HTTPS")} URLs are accepted.
  - The artist's discography is processed sequentially.
  - Failed downloads are skipped so the remaining albums can be processed.
  - Download settings are read from ${pc.yellow("config.json")}.
  - ${pc.yellow("BANDCAMP_COOKIE")} must be set in the environment.

${pc.bold("MORE INFO:")}
  ${pc.cyan(pc.underline("https://github.com/Evolution0/bandcamp-dl#options"))}
`);
};
