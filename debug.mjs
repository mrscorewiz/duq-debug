import * as util from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const consoleJson = (input) => {
    try {
        const json = typeof input === 'string' ? JSON.parse(input) : input;
        console.log(JSON.stringify(json, null, 4));
    } catch (err) {
        console.log(input);
    }
}

export const isMain = (meta, proc) => proc.argv[1] === fileURLToPath(meta.url);

export const log = (...args) => {
    for (const arg of args) {
        console.log(util.inspect(arg, { showHidden: false, depth: null }));
    }
}

export const dump = (...args) => {
    log(...args);
    process.exit();
}

export const jdump = (...args) => {
    for (const arg of args) {
        consoleJson(arg);
    }
    process.exit();
}

export const jlog = (...args) => {
    for (const arg of args) {
        consoleJson(arg);
    }
}

const loadEnv = async (path, silent = false) => {
    try {
        let env = (await import(path)).default;
        for (let [key, value] of Object.entries(env)) {
            process.env[key] = value.toString();
        }
        silent || console.log('Using ENV variables from file ' + path)
    } catch (error) {
        dump(error);
    }
}

export const run = async (meta, func) => {
    isMain(meta, process) && await func();
}

export const dir = (meta) => dirname(fileURLToPath(meta.url));

export const here = (meta) => {
    return {
        main: isMain(meta, process),
        run: async (func) => { run(meta, func) },
        dir: dir(meta),
        env: (path, silent) => loadEnv(dir(meta) + '/' + path, silent)
    }
}
