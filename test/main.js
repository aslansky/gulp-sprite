'use strict';

var assert = require('assert');
var gutil = require('gulp-util');
var sprite = require('../index');
var path = require('path');
var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;

var file1 = new gutil.File({
  path: 'floppy-disk.png',
  contents: fs.readFileSync(path.join(__dirname, 'floppy-disk.png'))
});
var file2 = new gutil.File({
  path: 'fruit-computer.png',
  contents: fs.readFileSync(path.join(__dirname, 'fruit-computer.png'))
});

it('should create a sprite png file', function (cb) {
  var stream = sprite('sprites.png');

  stream.on('data', function (file) {
    var img = new Image();
    img.src = file.contents;
    assert.equal(file.relative, 'sprites.png');
    assert.equal(img.width, 56);
    assert.equal(img.height, 125);
    cb();
  });

  stream.write(file1);
  stream.write(file2);
  stream.end();
});

it('should create a stylesheet file', function (cb) {
  var stream = sprite('sprites.png', {
    imagePath: '../img',
    cssPath: './test',
    prefix: '',
    preprocessor: 'css'
  });

  stream.on('end', function () {
    var style = fs.readFileSync(path.join(__dirname, 'sprites.css'), {
      encoding: 'utf-8'
    });
    assert.notEqual(style.indexOf('.icon-floppy-disk'), -1);
    assert.notEqual(style.indexOf('.icon-fruit-computer'), -1);
    fs.unlink(path.join(__dirname, 'sprites.css'));
    cb();
  });

  stream.write(file1);
  stream.write(file2);
  stream.end();
});
