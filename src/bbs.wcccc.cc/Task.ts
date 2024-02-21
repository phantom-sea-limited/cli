import { Task, type Message } from "@rcrwrate/cli";
import { Page } from "./main";


class ListTask extends Task {
    name?: string | undefined = "列表解析"
    priority: number = 65
    u: URL

    constructor(u: URL) {
        super()
        this.u = u
    }

    async Run(m: Message): Promise<any> {
        const p = new Page("")
        this.status = "解析中"
        m.pushLog(this.u.href, "DEBUG")
        const all = await p.list(this.u)
        this.status = "解析完成"
        const tasks: PageTask[] = []
        for (const i of all) {
            tasks.push(new PageTask(i.url, i.needPurchase))
        }
        m.registerTask(tasks)
    }

    async onClose(m: Message): Promise<void> {
        m.cache.push("bbs.wcccc.cc.ListTask", this.u.href)
    }
}


class PageTask extends Task {
    name?: string | undefined = "内容解析"
    priority: number = 60
    u: string
    needCookie: boolean
    constructor(u: string, needCookie: boolean = false) {
        super()
        this.u = u
        this.needCookie = needCookie
    }

    async Run(m: Message): Promise<any> {
        const p = new Page(m.cache.get("wc.cookie") ?? "")
        m.pushLog(this.u, "DEBUG")
        const d = await p.content(this.u, this.needCookie)
        m.pushLog(JSON.stringify(d), "DEBUG")
        m.registerTask(new DownloadTask(d.url, d.name))
    }

    async onClose(m: Message): Promise<void> {
        m.cache.push("bbs.wcccc.cc.PageTask", [this.u, this.needCookie])
    }

    async onFailed(m: Message, e: Error): Promise<void> {
        m.pushStatus({ error: 1 });
        m.pushLog(JSON.stringify({ ...this }), "ERROR");
        m.pushLog(e.stack ?? "", "ERROR")
        if (this.needCookie === false) {
            m.registerTask(new PageTask(this.u, true))
        }
    }
}

class DownloadTask extends Task {
    name: string = "内容下载"
    noLimit: boolean = true
    priority: number = 55
    u: string
    constructor(u: string, filename: string) {
        super()
        this.u = u
        this.name = filename
    }

    async Run(m: Message): Promise<any> {
        const s = await m.Storage.exist(this.name)
        if (s) {
            return m.pushLog(`${this.name} 文件已存在，自动跳过`, "INFO")
        }
        const cookie = m.cache.get<string>("wc.cookie")
        if (cookie) {
            const p = new Page(cookie)
            const r = await p.fetch(this.u, true)
            await m.Storage.write(r, this.name)
            m.pushLog(`${this.name} 下载完成`, "INFO")
        } else {
            m.pushLog("WC:请先使用wc.cookie + [cookie]配置cookie在进行操作", "ERROR")
        }
    }

    async onClose(m: Message): Promise<void> {
        m.cache.push("bbs.wcccc.cc.DownloadTask", [this.u, this.name])
    }
}

const InitTask: Array<(m: Message) => void> = [
    (m) => {
        const all = m.cache.get<string[]>("bbs.wcccc.cc.ListTask")
        if (all) {
            m.registerTask(all.map(i => new ListTask(new URL(i))))
            m.cache.delete("bbs.wcccc.cc.ListTask")
        }
    },
    (m) => {
        const all = m.cache.get<[string, boolean][]>("bbs.wcccc.cc.PageTask")
        if (all) {
            m.registerTask(all.map(i => new PageTask(i[0], i[1])))
            m.cache.delete("bbs.wcccc.cc.PageTask")
        }
    },
    (m) => {
        const all = m.cache.get<[string, string][]>("bbs.wcccc.cc.DownloadTask")
        if (all) {
            m.registerTask(all.map(i => new DownloadTask(i[0], i[1])))
            m.cache.delete("bbs.wcccc.cc.DownloadTask")
        }
    },
]

export { ListTask, InitTask }