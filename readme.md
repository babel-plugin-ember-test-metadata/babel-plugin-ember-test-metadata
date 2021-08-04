# babel-plugin-ember-test-metadata

> A Babel plugin for Ember apps that adds a test's file path to test metadata available through `@ember/test-helpers`.

![CI Build](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/workflows/CI%20Build/badge.svg)
[![License](https://img.shields.io/github/license/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata.svg)](https://github.com/babel-plugin-ember-test-metadata/babel-plugin-ember-test-metadata/blob/master/package.json)
[![Package Version](https://img.shields.io/npm/v/babel-plugin-ember-test-metadata.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-ember-test-metadata)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

## Why use this plugin

A test file's path can enable downstream consumers of test results to process, and potentially associate a specific test failure to a file path. This can assist with the analysis of test infrastructure, specifically where identifying ownership over a test file is useful or required.

This Babel plugin transforms a test so that its file path is added to `@ember/test-helpers` [test metadata](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#gettestmetadata), where other utilities can subsequently read that data.

## Installation

```sh
npm install babel-plugin-ember-test-metadata --save-dev

# or

yarn add babel-plugin-ember-test-metadata -D
```

## Usage

This plugin needs to be configured in your `ember-cli-build.js` file by adding it your babel's plugins array:

```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [ require.resolve('babel-plugin-ember-test-metadata') ]
    }
  });

  // additional configuration

  return app.toTree();
};
```

Set the environment variable `BABEL_TEST_METADATA=true` to enable the plugin to perform its transformations.
