import { Storage } from "@rcrwrate/cli";
import { GraphAPI } from "./Graph";

class OProvider extends Storage.StorageProvider {
    api: GraphAPI
    constructor(graph: GraphAPI) {
        super()
        this.api = graph
    }

    async exist(name: string): Promise<boolean> {
        return (await this.api.fileBypath(name.replace(/[:|"|*|<|>|?|\\|\/|。]/g, ""))).error == undefined
    }

    protected async writeString(r: string, filename: string): Promise<any> {
        throw this.error("Method not support in Onedrive")
    }

    protected async writeResponse(r: Response, filename: string): Promise<any> {
        const b = await r.blob()
        return this.api.Upload(filename, b)
    }
}

export { OProvider }