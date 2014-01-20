# [gulp](http://gulpjs.com)-sprite [![NPM version](https://badge.fury.io/js/gulp-sprite.png)](http://badge.fury.io/js/gulp-sprite) [![Build Status](https://travis-ci.org/aslansky/gulp-sprite.png?branch=master)](https://travis-ci.org/aslansky/gulp-sprite) [![Dependencies](https://david-dm.org/aslansky/gulp-sprite.png)](https://david-dm.org/aslansky/gulp-sprite)

> [gulp](http://gulpjs.com) task for creating a image sprite and the corresponding stylesheets

## Requirements

`gulp-sprite` requires [node-canvas](https://github.com/learnboost/node-canvas) which depends on [Cairo](http://cairographics.org/).

Please refer the [installation guide](https://github.com/learnboost/node-canvas/wiki).

## Install

Install with [npm](https://npmjs.org/package/gulp-sprite)

```
npm install --save-dev gulp-sprite
```

## Example

```js
var gulp = require('gulp');
var sprite = require('gulp-sprite');

gulp.task('sprites', function () {
    gulp.src('./src/img/*.png')
      .pipe(sprite('sprites.png', {
        imagePath: 'dist/img',
        cssPath: './src/scss/utils/',
        preprocessor: 'scss'
      }))
      .pipe(gulp.dest('./dist/img/'));
});
```

## API

### sprite(sprite-name, options)

#### sprite-name

**description:** The name of the sprite file.

### Configuration Options

#### imagePath

**default:** ''

**description:** The http path to images on the web server (relative to css path or absolute).

### cssPath

**default:** ''

**description:** The path where stylesheet file should be created. If ommited no stylesheet file will be created.

### prefix

**default:** '_'

**description:** The prefix for the stylesheet file

### preprocessor

**default:** 'css'

**description:** The output style for the stylesheets.
One of: css, less, sass, scss or stylus.

### margin

**default:** 5

**description:** The space between images within the sprite

## License

MIT © [Alexander Slansky](http://slansky.net)
