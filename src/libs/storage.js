import {writeFileSync, readFileSync, accessSync, mkdirSync} from 'fs';
import {dirname} from 'path';

export default class Storage {

    constructor({path, id}) {
        const dir = dirname(path);
        try {
            accessSync(path);
        } catch (e) {
            try {
                accessSync(dir);
            } catch (e) {
                mkdirSync(dir);
            }
            writeFileSync(path, this.serialize({}));
        }
        this.id = id;
        this.path = path;
        this.data = this.unserialize(readFileSync(path).toString());
    }

    name(key) {
        return `${this.id}-${key}`;
    }

    serialize(value) {
        return JSON.stringify(value)
    }

    unserialize(value) {
        return JSON.parse(value)
    }

    flush() {
        writeFileSync(this.path, this.serialize(this.data));
    }

    get(key) {
        return this.data[this.name(key)];
    }

    set(key, value) {
        this.data[this.name(key)] = value;
        this.flush();
    }

}
