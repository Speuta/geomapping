import pkg from './package.json'
import { terser } from "rollup-plugin-terser";

export default [{
    input: 'src/geomapping.js',
    output: {
        file: 'dist/geomapping.js',
        format: 'umd',
        name: 'GeoMapping',
        sourcemap : true,
        intro : 'console.log("geomapping v' + pkg.version + '")'
    }
},{
    input: 'src/geomapping.js',
    output: {
        file: 'dist/geomapping.min.js',
        format: 'umd',
        name: 'GeoMapping',
        sourcemap : true,
        intro : 'console.log("geomapping v' + pkg.version + '")'
    },
    plugins: [
        terser()
    ]
}, {
    input: 'src/geomapping.js',
    output: {
        file: 'dist/geomapping.es6.js',
        format: 'es',
        name: 'GeoMapping',
        sourcemap : true,
        intro : 'console.log("geomapping v' + pkg.version + '")'
    }
},{
    input: 'src/geomapping.js',
    output: {
        file: 'dist/geomapping.es6.min.js',
        format: 'es',
        name: 'GeoMapping',
        sourcemap : true,
        intro : 'console.log("geomapping v' + pkg.version + '")'
    },
    plugins: [
        terser()
    ]
}];
