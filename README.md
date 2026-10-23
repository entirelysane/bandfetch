# bandfetch

Download an artist's discography from Bandcamp.

`bandfetch` is a CLI utility that downloads albums from a Bandcamp artist page.

## Requirements

- [Node.js](https://nodejs.org/)
- [bandcamp-dl](https://github.com/Evolution0/bandcamp-dl), available on your system's `PATH`
- A Bandcamp cookie provided through the `BANDCAMP_COOKIE` environment variable.

## Usage

```bash
bandfetch <artist-url>
```

Example:

```bash
bandfetch https://artist.bandcamp.com/
```

Albums are downloaded one at a time. If a download fails, `bandfetch` skips that album and continues with the remaining discography.

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/entirelysane/bandfetch.git
cd bandfetch
pnpm install
```

Run the application: 

```bash
pnpm dev https://artist.bandcamp.com
```

Build the application:

```bash
pnpm build
```

Available scripts are defined in `package.json`.

## Configuration

On its first run, `bandfetch` automatically creates `config.json` with the default settings. You don't need to create the file manually.

Edit `config.json` to customize the available options.

```json
{
  "saveDir": "/home/%user%/Music/Bandcamp",                        // --base-dir
  "noConfirm": true,                                               // --no-confirm
  "template": "%{artist}/%{date} - %{album}/%{track} - %{title}",  // --template
  "keepSpaces": true,                                              // --keep-spaces
  "noSlugify": false,                                              // --no-slugify
  "caseConvert": "none",                                           // --case-convert
  "embedArt": false,                                               // --embedArt. Better don't touch it
  "embedLyrics": false,                                            // --embed-lyrics
  "noArt": false,                                                  // --no-art
  "overwrite": false                                               // --overwrite
}
```

For a list of supported options, see the [bandcamp-dl documentation](https://github.com/Evolution0/bandcamp-dl#options).

## Authentication

`bandfetch` reads the `BANDCAMP_COOKIE` environment variable from the current process.

Set it in your shell before running the application.

**Linux / macOS (Bash or Zsh):**

```bash
export BANDCAMP_COOKIE="your-cookie-value"
bandfetch https://artist.bandcamp.com/
```

**Windows PowerShell:**

```powershell
$env:BANDCAMP_COOKIE = "your-cookie-value"
bandfetch https://artist.bandcamp.com/
```

