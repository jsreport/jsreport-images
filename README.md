# jsreport-images
[![NPM Version](http://img.shields.io/npm/v/jsreport-images.svg?style=flat-square)](https://npmjs.com/package/jsreport-images)
[![Build Status](https://travis-ci.org/jsreport/jsreport-images.png?branch=master)](https://travis-ci.org/jsreport/jsreport-images)

> ⚠️ This extension is deprecated and does not work since jsreport v2, use [assets](https://github.com/jsreport/jsreport-assets) extension instead

> jsreport extension for storing static images inside the store and embedding them into templates

See https://jsreport.net/learn/images

## Installation
> npm install jsreport-images

## jsreport-core
You can apply this extension also manually to [jsreport-core](https://github.com/jsreport/jsreport-core)

```js
var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-images')())
```
