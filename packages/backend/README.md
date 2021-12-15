## @vect/backendr
backend a function

[![npm version][badge-npm-version]][url-npm]
[![npm download monthly][badge-npm-download-monthly]][url-npm]
[![npm download total][badge-npm-download-total]][url-npm]
[![npm dependents][badge-npm-dependents]][url-github]
[![npm license][badge-npm-license]][url-npm]
[![pp install size][badge-pp-install-size]][url-pp]
[![github commit last][badge-github-last-commit]][url-github]
[![github commit total][badge-github-commit-count]][url-github]

[//]: <> (Shields)
[badge-npm-version]: https://flat.badgen.net/npm/v/@arpel/backend
[badge-npm-download-monthly]: https://flat.badgen.net/npm/dm/@arpel/backend
[badge-npm-download-total]:https://flat.badgen.net/npm/dt/@arpel/backend
[badge-npm-dependents]: https://flat.badgen.net/npm/dependents/@arpel/backend
[badge-npm-license]: https://flat.badgen.net/npm/license/@arpel/backend
[badge-pp-install-size]: https://flat.badgen.net/packagephobia/install/@arpel/backend
[badge-github-last-commit]: https://flat.badgen.net/github/last-commit/hoyeungw/arpel
[badge-github-commit-count]: https://flat.badgen.net/github/commits/hoyeungw/arpel

[//]: <> (Link)
[url-npm]: https://npmjs.org/package/@arpel/backend
[url-pp]: https://packagephobia.now.sh/result?p=@arpel/backend
[url-github]: https://github.com/hoyeungw/arpel

## Features

- backend a function

## Install
```console
$ npm install @arpel/backend
```

## Usage
```js
import { backend } from '@arpel/backend'

const func = x => x
console.log(func.name) // func
backend(func, 'not-a-method')
console.log(func.name) // not-a-method

```

## Meta
[LICENSE (MIT)](LICENSE)
