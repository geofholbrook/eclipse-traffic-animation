import fs from 'fs';

export class KeyValueStore {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    public get<T>(key: string): T {
        const fileContents = this.readFileContents();
        return fileContents[key];
    }

    private readFileContents() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(fs.readFileSync(this.path).toString());
        } else {
            return {};
        }
    }

    public set(key: string, value: unknown) {
        const fileContents = this.readFileContents();
        fileContents[key] = value;
        fs.writeFileSync(this.path, JSON.stringify(fileContents, null, 4));
    }
}
