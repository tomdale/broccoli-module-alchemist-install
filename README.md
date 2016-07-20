# Broccoli Module Alchemist Install

This package contains a small script that can be used in tandem with
[broccoli-module-alchemist](https://github.com/monegraph/broccoli-module-alchemist)
to write Node packages in ES6+ but maintain backwards compatibility with
Node 0.12 and before.

## How It Works

Configure your package to use
[broccoli-module-alchemist](https://github.com/monegraph/broccoli-module-alchemist).
In particular, you'll want to make sure that a CommonJS version of your
app is being built into `dist/cjs` (the default behavior).

Once that's done, add a post-install script to your package's
`package.json`. The script will try to load the source from `src/`; if
it's unable to, it will fallback to using the transpiled CommonJS
version in `dist/cjs`.

This allows you to take advantage of new syntax features like `() =>`
arrow functions and destructuring in Node v4+, but detecting failures in
Node 0.12 and before and falling back to the transpiled version.

## Configuration

```sh
# make sure to save as a dependency, not a devDependency,
# so it's available when people npm install your package
npm install broccoli-module-alchemist-install --save
```

```js
// package.json
"scripts": {
  "postinstall": "broccoli-module-alchemist-install"
}
```

After your package is installed, this script will rewrite the
`package.json`'s `main` field to point to `dist/cjs` if it was not able
to `require()` your package's default `main`.

You **MUST** explicitly set an entry point into your package's `src/`
directory via `package.json`'s `main` field. Without that set, this
workflow doesn't work.

## Advantages

This approach treats the `src/` directory as canonical and avoids
transpilation, so while you are developing your package you don't need
to add an error-prone build step before running tests, etc.

Only for backwards-compatibility do you need to deal with transpilation,
so you maintain development speed and the productivity gains of ES2015
and move transpilation cost to distribution time.

## License

MIT
