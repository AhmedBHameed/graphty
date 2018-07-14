import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: './@graphty/dist/index.js',
    external: ['@angular/core', '@angular/common'],  // External libraries to run on consumer side
    output: {
        sourcemap: true,
        file: './@graphty/dist/graphty.umd.js',
        name: 'ng.@graphty',
        format: 'umd',
        globals: {
            '@angular/core': 'ng.core',
            '@angular/common': 'ng.common',
            'rxjs/Observable': 'Rx',
            'rxjs/ReplaySubject': 'Rx',
            'rxjs/add/operator/map': 'Rx.Observable.prototype',
            'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
            'rxjs/add/observable/fromEvent': 'Rx.Observable',
            'rxjs/add/observable/of': 'Rx.Observable'
        }
    },
    plugins: [
        resolve({
            module: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**',
        })
    ]
}