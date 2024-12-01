# nekotsume IME | ネコツメIME

Efficient Japanese IME for (almost) any website in your web browser!

<!-- TODO: Features and Usage -->

## Building from Source

The core code is not compiled and doesn't need to be. However, it uses open-source third-party dependencies that may provide their own build procedures for the following library files:

Require compilation, and can optionally be minified:

* `lib/igo.min.js`: igo-javascript, <https://github.com/shogo82148/igo-javascript>

Don't require any compilation, but can optionally be minified:

* `lib/zip.min.js`: zipjs, <https://github.com/shogo82148/zipjs>

To prepare the dependencies:

1. Init Git submodules (or clone the above Git repositories in the `lib/` directory)
2. Manually follow the libraries instructions to setup a build environment and complete the process
3. Copy the respective built files to the paths specified above

## Copyright Notice

_nekotsume IME_ is forked and readapted to work as a Web Extension from _IgoIME_ by shogo82148 (Ichinose Shogo): <https://github.com/shogo82148/IgoIME>. _IgoIME_ is based on _Ajax IME_ by taku (Taku Kudo).

They are not legally open-source, as _Ajax IME_ is available only under the terms of: `(C) Taku Kudo, all rights reserve rd. Personal use only!`

_nekotsume IME_ is only being distributed in good faith and in the spirit of the fair use doctrine, in the hopes that it can be useful.

