# nm-prune [![Build Status](https://travis-ci.org/pingyhq/nm-prune.svg?branch=master)](https://travis-ci.org/pingyhq/nm-prune)

> Prune unneeded files (.md, .td, etc..) from node_modules folder. Super handy
> for Electron and AWS Lambda.

```
$ npm install --global nm-prune
```

<img src="https://i.imgur.com/Pc1nUZp.gif" width="559">

## Customizing files and folders to be pruned

To see the files/folders that `nm-prune` will delete then have a look at
[default-prune.json](./default-prune.json).

To provide your own prune list then simply create a `prune.json` in your
package's root directory (alongside `package.json`) and nm-prune will use that
instead.

## Skip confirmation

If you want `nm-prune` to run without asking for confirmation then you can run
`nm-prune --force`.

## Discard license files

By default `nm-prune` v4+ does not discard license files because that would
violate the terms of most licenses. If you wish to prune them anyway then you
can run the command `nm-prune --prune-license`.

## License

MIT © [DaveJ](https://github.com/davej)
