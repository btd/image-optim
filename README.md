# img-optim

For now it process only `.png` files with advpng, pngquant, pngcrush, optipng, pngout. Will be added jpg utils

Optimize (lossless compress) images (jpeg, png, gif, svg) using external utilities:

* [advpng](http://advancemame.sourceforge.net/doc-advpng.html) from [AdvanceCOMP](http://advancemame.sourceforge.net/comp-readme.html)
(will use [zopfli](https://code.google.com/p/zopfli/) on default/maximum level 4)
* [gifsicle](http://www.lcdf.org/gifsicle/)
* [jhead](http://www.sentex.net/~mwandel/jhead/)
* [jpegoptim](http://www.kokkonen.net/tjko/projects.html)
* jpegtran from [Independent JPEG Group's JPEG library](http://www.ijg.org/) or [jpeg-turbo](http://www.libjpeg-turbo.org/). In future will be added mozjpeg.
* [optipng](http://optipng.sourceforge.net/)
* [pngcrush](http://pmt.sourceforge.net/pngcrush/)
* [pngout](http://www.advsys.net/ken/util/pngout.htm)
* [svgo](https://github.com/svg/svgo)
* [pngquant](http://pngquant.org/)
* [pngnq](https://github.com/stuart/pngnq)

Based on [ImageOptim.app](http://imageoptim.com/) and `image_optim` ruby gem.

## Installation

1. Install from npm.

```sh
npm install --save img-optim
```

2. [Install binaries](#binaries_installation)

## Binaries installation

### OS X: Brew

Tested on 10.9.

```bash
brew install advancecomp pngcrush optipng pngquant pngnq libjpeg-turbo jhead jpegoptim
```
Note about libjpeg-turbo. It is fork of libjpeg and it can be drop-in replacement for libjpeg (almost in all features), but in brew it is installed keg-only and you will need to specify full path to binary `jpegtran`.

### pngout installation (optional)

Pngout very good for final png compression as it implements own deflate algorithm, but it is very-very slow, and sometimes does not gain any advantage (as advpng implemented zopfli - so probably you will not get any advantage). I recommend use it only if you know that you need it.

You can install `pngout` by downloading and installing the [binary versions](http://www.jonof.id.au/kenutils).

_Note: pngout is free to use even in commercial soft, but you can not redistribute, repackage or reuse it without consent and agreement of creator. [license](http://advsys.net/ken/utils.htm#pngoutkziplicense)_

### svgo installation (optional)

`svgo` is available from NPM.

```bash
npm install -g svgo
```

## Usage

### From shell

```sh
image_optim *.{jpg,png,gif,svg}

image_optim -h
```
