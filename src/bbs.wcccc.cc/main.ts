import { JSDOM } from 'jsdom'

class Page {
    cookie
    constructor(cookie: string) {
        this.cookie = cookie
    }

    fetch(u: URL | string, needCookie: boolean = false) {
        return fetch(u, {
            "headers": {
                ...needCookie ? { "cookie": this.cookie } : {},
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,en-GB;q=0.6",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Microsoft Edge\";v=\"121\", \"Chromium\";v=\"121\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://bbs.wcccc.cc/",
            },
        });
    }

    /** 获取该目录下最大页数 */
    async findMax(u: URL) {
        const r = await this.fetch(u, false)
        const dom = new JSDOM(await r.text())
        const all = new URL((dom.window.document.querySelector("a.last") as HTMLAnchorElement).href).searchParams.get("page") as string
        return parseInt(all)
    }

    /** 获取列表内容 */
    async list(u: URL) {
        const r = await this.fetch(u, false)
        const document = new JSDOM(await r.text()).window.document
        const all = Array.from(document.querySelectorAll("div.acgiflisttitle"))
        return all.map(i => {
            const s = i.querySelector("a.s") as HTMLAnchorElement
            return {
                url: s.href,
                title: s.innerText,
                needPurchase: i.querySelector("span.xw1") !== null
            }
        })
    }

    /** 获取某帖子内容 */
    async content(u: string, needCookie: boolean = false) {
        const r = await this.fetch(u, needCookie)
        const document = new JSDOM(await r.text()).window.document
        const all = Array.from(document.querySelectorAll("ignore_js_op a")) as HTMLAnchorElement[]
        const a = all.filter(i => i?.href.includes("aid"))[0]
        return {
            url: a.href,
            name: a.innerHTML
        }
    }
}

export { Page }