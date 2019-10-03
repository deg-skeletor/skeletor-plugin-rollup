# Skeletor Rollup Plugin
[![Build Status](https://travis-ci.org/deg-skeletor/skeletor-plugin-rollup.svg?branch=master)](https://travis-ci.org/deg-skeletor/skeletor-plugin-rollup)

The purpose of this plugin is to bundle modules together using [Rollup](https://rollupjs.org). This plugin is part of the Skeletor ecosystem. To learn more about Skeletor, [go here](https://github.com/deg-skeletor/skeletor-core).

## Installation
Install this plugin into your Skeletor-equipped project via the following terminal command: 
```
    npm install --save-dev @deg-skeletor/plugin-rollup
```

## Configuration

The configuration for this plugin mimics the standard configuration patterns for Rollup (learn more [here](https://rollupjs.org/guide/en#configuration-files)).

### Example Configuration - Single Bundle
```
{
    
    input: "source/js/main.js",        
    output: [
        {
            file: "dist/js/main-bundle.js",
            format: "es"
        },
        {
            file: "dist/js/main-bundle-nomodule.js",
            format: "system"
        }
    ],
    plugins: [
        require('rollup-plugin-babel')({
            exclude: 'node_modules/**'
        }),
        require('rollup-plugin-node-resolve')({
            browser: true
        }),
        require('rollup-plugin-commonjs')()
    ]
}
```

### Example Configuration - Multiple Bundles
```
[
    {   
        input: "source/js/entryA.js",        
        output: [{
            file: "dist/js/entryA-bundle.js",
            format: "es"
        }]
    },
    {   
        input: "source/js/entryB.js",        
        output: [{
            file: "dist/js/entryB-bundle.js",
            format: "es"
        }]
    }
]
```

### Example Configuration - Multiple Bundles With Code Splitting
```
{
    input: ["source/js/entryA.js", "source/js/entryB.js"],        
    output: [
        {
            dir: "dist/js",
            format: "es"
        },
        {
            dir: "dist/js/nomodule",
            format: "system"
        }
    }]
}
```

For a detailed list of configuration options, check out Rollup's [big list of options](https://rollupjs.org/guide/en#big-list-of-options). 