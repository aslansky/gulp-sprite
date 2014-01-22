'use strict';

var gutil = require('gulp-util');
var through = require('through');
var Canvas = require('canvas');
var lodash = require('lodash');
var path = require('path');
var json2css = require('json2css');
var fs = require('fs');
var PluginError = gutil.PluginError;
var Image = Canvas.Image;

module.exports = function(fileName, opt) {
  if (!fileName) {
    throw new PluginError('gulp-sprite',  'Missing fileName option for gulp-sprite');
  }

  opt = lodash.extend({margin: 5, preprocessor: 'css', imagePath: '', prefix: '', orientation: 'vertical'}, opt);

  var firstFile = null;
  var sprites = [];
  var ctxHeight = 0;
  var ctxWidth = 0;

  function bufferImages(file) {
    if (file.isNull()) {
      return; // ignore
    }

    if (file.isStream()) {
      return this.emit('error', new PluginError('gulp-sprite',  'Streaming not supported'));
    }

    if (!firstFile) {
      firstFile = file;
    }

    var img = new Image();
    img.src = file.contents;
    sprites.push({
      'img': img,
      'name': gutil.replaceExtension(file.relative, ''),
      'x': opt.orientation === 'vertical' ? opt.margin : ctxWidth + opt.margin,
      'y': opt.orientation === 'vertical' ? ctxHeight + opt.margin: opt.margin,
      'width': img.width,
      'height': img.height,
      'image': path.join(opt.imagePath, fileName)
    });

    if (opt.orientation === 'vertical') {
      ctxHeight = ctxHeight + img.height + 2 * opt.margin;
      if (img.width + 2 * opt.margin > ctxWidth) {
        ctxWidth = img.width + 2 * opt.margin;
      }
    }
    else {
      ctxWidth = ctxWidth + img.width + 2 * opt.margin;
      if (img.height + 2 * opt.margin > ctxHeight) {
        ctxHeight = img.height + 2 * opt.margin;
      }
    }
  }

  function endStream () {
    if (sprites.length === 0) {
      return this.emit('end');
    }
    var canvas = new Canvas(ctxWidth, ctxHeight);
    var ctx = canvas.getContext('2d');
    lodash.each(sprites, function (sprite) {
      sprite.total_width = ctxWidth;
      sprite.total_height = ctxHeight;
      ctx.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height);
    });

    var joinedPath = path.join(firstFile.base, fileName);
    var sprite = new gutil.File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: new Buffer(canvas.toBuffer())
    });

    if (opt.cssPath) {
      var cssPath = path.join(firstFile.cwd, opt.cssPath, opt.prefix + gutil.replaceExtension(fileName, '.' + opt.preprocessor));
      var css = json2css(sprites, {'format': opt.preprocessor});
      var that = this;
      fs.writeFile(cssPath, css, function () {
        that.emit('data', sprite);
        that.emit('end');
      });
    }
    else {
      this.emit('data', sprite);
      this.emit('end');
    }
  }

  return through(bufferImages, endStream);

};
