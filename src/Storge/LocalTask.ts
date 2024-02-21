import { writeFile } from "fs/promises";
import { join } from "path";
import { Task, type Message } from "@rcrwrate/cli";


class LocalTask extends Task {
    name?: string | undefined = "文件存储";
    noLimit: boolean = true;
    priority: number = 30;

    path: string;
    r: Response;
    constructor(r: Response, paths: string[] | string) {
        super();

        this.r = r;
        this.path = typeof paths == "string" ? paths : join(...paths);
    }

    async Run(m: Message): Promise<any> {
        return writeFile(this.path, new DataView(await this.r.arrayBuffer()));
    }
}
