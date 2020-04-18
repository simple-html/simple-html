// transpile lit-html into something ts-jest is able to work with
// ust be better way to do this

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './node_modules/lit-html/lit-html.js',
    output: {
        file: './.cache/lit-html/lit-html.js',
        format: 'cjs'
    },
    plugins: [
        terser({
            warnings: true,
            ecma: 2017,
            compress: {
                unsafe: true
            },
            output: {
                comments: false
            },
            mangle: {
                properties: {
                    regex: /^__/
                }
            }
        }),
        filesize({
            showBrotliSize: true
        })
    ]
};
