import { ListTask } from "./Task"
import { Page } from "./main"
import type { commands } from "@rcrwrate/cli"

const command: commands[] = [
    {
        priority: 50,
        keyword: ["wc"],
        func(input, m) {
            m.Tip("\n月曦论坛›请使用wc.url + [url]爬取目录列表\n", 5000)
        },
    },
    {
        priority: 49,
        keyword: ["wc.url"],
        async func(input, m) {
            try {
                const u = new URL(input)
                const p = new Page(m.cache.get("wc.cookie") ?? "")
                const all = await p.findMax(u)
                m.pushLog(all.toString(), "DEBUG")
                const task: ListTask[] = []
                for (let i = parseInt(u.searchParams.get("page") ?? "1"); i <= all; i++) {
                    u.searchParams.set("page", i.toString())
                    task.push(new ListTask(new URL(u)))
                }
                m.registerTask(task)
            } catch (e) {
                m.Tip(`\n月曦论坛›出现异常${(e as Error).message}\n`, 5000)
            }
        },
    },
    {
        priority: 49,
        keyword: ["wc.cookie"],
        async func(input, m) {
            m.cache.set("wc.cookie", input)
            m.cache.save()
            m.Tip("\n已保存\n")
        },
    },
    {
        priority: 49,
        keyword: ["wc.test"],
        async func(input, m) {
            m.registerTask(new ListTask(new URL(input)))
        },
    }
]

export { command }