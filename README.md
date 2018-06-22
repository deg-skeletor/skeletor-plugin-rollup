# Skeletor Rollup Plugin
[![Build Status](https://travis-ci.org/deg-skeletor/skeletor-plugin-rollup.svg?branch=master)](https://travis-ci.org/deg-skeletor/skeletor-plugin-rollup)

The purpose of this plugin is to bundle modules together using rollup.

This is a functioning plugin that can be installed as-is to a Skeletor-equipped project. 

To learn more about Skeletor, [go here](https://github.com/deg-skeletor/skeletor-core).

## Getting Started
After you have cloned this repository, run `npm install` in a terminal to install some necessary tools, including a testing framework (Jest) and a linter (ESLint). 

## Source Code
The primary source code for this sample plugin is located in the `index.js` file.

## Running Tests
This sample plugin is pre-configured with the [Jest testing framework](https://facebook.github.io/jest/) and an example test. 

From a terminal, run `npm test`. You should see one test pass and feel pleased.

Test code can be found in the `index.test.js` file.

## Skeletor Plugin API

For a Skeletor plugin to function within the Skeletor ecosystem, it must expose a simple API that the Skeletor task runner will interact with.
The method signatures of the API are as follows:

### run(config)

The `run()` method executes a plugin's primary task,. It is the primary way (and, currently, the *only* way) that the Skeletor task runner interacts with a plugin.

## Config Options

Example:
```
{
    bundles: [{
        entry: "source/js/main.js",
        output: [{
            file: "dist/js/main-bundle.js",
            format: "es"
        }]
    }],
    rollupPlugins: [
        {
            module: require('rollup-plugin-babel'),
            pluginConfig: {
                exclude: 'node_modules/**'   
            }
        },
        {
            module: require('rollup-plugin-node-resolve'),
            pluginConfig: {
                browser: true
            }
        },
        {
            module: require('rollup-plugin-commonjs')
        }
    ]
}
```

**bundles**

Type: `Object[]`

A list of [bundle config objects](#bundle-config-object).

**rollupPlugins (optional)**

Type: `Object[]`

A list of [rollup plugin configs](#rollup-plugin-config-object).
*Note*: Order of plugins does matter! Rollup plugins are executed from last to first.

### Bundle Config Object

Example:
```
{
    bundles: [
        {
            entry: "source/js/main.js",
            output: [{
                fille: "dist/js/main-bundle.js",
                format: "es"
            }]
        },
        {
            entry: "source/js/formHandler.js",
            output: [
                {
                    file: "dist/js/formHandler-bundle.js",
                    format: "es"
                },
                {
                    file: "dist/js/formHandler-bundle-legacy.js",
                    format: "iife"
                }
            ]
        }
    ]
}
```

**entry**

Type: `String`

Path to entry point for bundle. This path is from the root of the project.

**output**

Type: `Object[]`

Describes the output files from rollup. This object should include properties supported by [rollup outputs](https://rollupjs.org/guide/en#big-list-of-options)

If not specified, the `format` property will default to `es`.

### Rollup Plugin Config Object

Example:
```
{
    rollupPlugins: [
        {
            "module": require('rollup-plugin'),
            "pluginConfig": {}
        }
    ]
}
```

**module**

Type: `NPM module`

An rollup plugin npm module. Check out the list of [rollup plugins](https://github.com/rollup/rollup/wiki/Plugins) for the possibilities.

**pluginConfig (optional)**

Type: `Object`
Default: `{}`

A config object for the corresponding plugin. Check the module's documentation for configuration options.


## Return Value
A Promise that resolves to a [Status object](#the-status-object).

### The Status Object
The Status object is a simple Javascript `Object` for storing the current status of your plugin. The structure of this object is as follows:

#### Properties

**status**

Type: `String`

Possible Values: `'complete'`, `'error'`

Contains the status of the plugin. If the plugin has completed successfully, the `'complete'` value should be used. If an error was encountered during plugin execution, the `'error'` value should be used.

**message**

Type: `String`

Contains any additional information regarding the status of the plugin. If the plugin executed successfully, this property could include information about what the plugin accomplished. If the plugin encountered an error, this property could include error details. 

## Required Add-Ins
[rollup](https://github.com/rollup/rollup):
A module bundler for JavaScript.
