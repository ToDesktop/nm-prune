# nm-prune [![Build Status](https://travis-ci.org/DaveJ/nm-prune.svg?branch=master)](https://travis-ci.org/DaveJ/nm-prune)

> Prune unneeded files from node_modules folder. Super handy for Elecron and AWS Lambda.

```
$ npm install --global nm-prune
```

<div style="text-align:center"><img src="https://i.imgur.com/Pc1nUZp.gif"></div>

## Customizing files and folders to be pruned

To see the files/folders that `nm-prune` will delete then have a look at [default-prune.json](./default-prune.json).

To provide your own prune list then simply create a `prune.json` in your package's root directory (alongside `package.json`) and nm-prune will use that instead.


## License

MIT © [DaveJ](https://github.com/davej)
