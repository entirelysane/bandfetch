import { argv } from 'node:process';

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

// FIXME: write understandable helpme
export const showHelp = () => {
  console.log('Specify album url');
  console.log('---');
  console.log('Try something like this:');
  console.log('<binName> <bandcampLink>');
  console.log('\n\n');
  console.log('And yes. Only one line for now. Maybe later I\'ll do whole list or something like that')
}


