# Skeletor Rollup Plugin
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

**bundles**

Type: `Object[]`

A list of [bundle config objects](#bundle-config-object).

### Bundle Config Object

Example:
```
{
    bundles: [
        {
            entry: "source/js/main.js",
            dest: "dist/js/main-bundle.js",
            format: "es"
        },
        {
            entry: "source/js/formHandler.js",
            dest: "dist/js/formHandler-bundle.js",
            format: "es"
        }
    ]
}
```

**entry**

Type: `String`

Path to entry point for bundle. This path is from the root of the project.

**dest**

Type: `String`

Path to destination for bundle. This path is from the root of the project.

**format**

Type: `String`
Default: `es`

The format that the bundle should be in. Other options include
```
amd – Asynchronous Module Definition, used with module loaders like RequireJS
cjs – CommonJS, suitable for Node and Browserify/Webpack
es – Keep the bundle as an ES module file
iife – A self-executing function, suitable for inclusion as a <script> tag. (If you want to create a bundle for your application, you probably want to use this, because it leads to smaller file sizes.)
umd – Universal Module Definition, works as amd, cjs and iife all in one
system – Native format of the SystemJS loader
```
^^ From [rollup documentation](https://rollupjs.org/guide/en#big-list-of-options)

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