# image-optim

Optimize (lossless compress) images (jpeg, png, gif, svg) using external utilities:

* [advpng](http://advancemame.sourceforge.net/doc-advpng.html) from [AdvanceCOMP](http://advancemame.sourceforge.net/comp-readme.html)
(will use [zopfli](https://code.google.com/p/zopfli/) on default/maximum level 4)
* [gifsicle](http://www.lcdf.org/gifsicle/)
* [jhead](http://www.sentex.net/~mwandel/jhead/)
* [jpegoptim](http://www.kokkonen.net/tjko/projects.html)
* jpegtran from [Independent JPEG Group's JPEG library](http://www.ijg.org/) or [jpeg-turbo](http://www.libjpeg-turbo.org/)
* [optipng](http://optipng.sourceforge.net/)
* [pngcrush](http://pmt.sourceforge.net/pngcrush/)
* [pngout](http://www.advsys.net/ken/util/pngout.htm)
* [svgo](https://github.com/svg/svgo)
* [pngquant](http://pngquant.org/)
* [pngnq](https://github.com/stuart/pngnq)

Based on [ImageOptim.app](http://imageoptim.com/) and `image_optim` ruby gem.

## Installation

```sh
npm install --save image-optim
```


## Binaries location

Simplest way for `image_optim` to locate binaries is to install them in common location present in `PATH` (see [Binaries installation](#binaries-installation)).

If you cannot install to common location, then install to custom one and add it to `PATH`.

Specify custom bin location using `XXX_BIN` environment variable (`JPEGOPTIM_BIN`, `OPTIPNG_BIN`, …).

Besides permanently setting environment variables in `~/.profile`, `~/.bash_profile`, `~/.bashrc`, `~/.zshrc`, … they can be set:

* before command:

  `PATH="/custom/location:$PATH" image_optim *.jpg`

  for example:

  `PATH="/Applications/ImageOptim.app/Contents/MacOS:$PATH" image_optim *.jpg`

* inside script:

  `ENV['PATH'] = "/custom/location:#{ENV['PATH']}"; ImageOptim.optimize_images([…])`

  for example:

  `ENV['PATH'] = "/Applications/ImageOptim.app/Contents/MacOS:#{ENV['PATH']}"; ImageOptim.optimize_images([…])`

## Binaries installation

### OS X: Brew

Tested on 10.9.

```bash
brew install advancecomp pngcrush optipng pngquant pngnq
```

### pngout installation (optional)

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