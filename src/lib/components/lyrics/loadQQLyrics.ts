import { ResponseType, fetch } from "@tauri-apps/api/http"

type QQSearchResultData = {
    song: {
        count: number
        itemlist: {
            id: string
            mid: string
            name: string
            singer: string
        }[]
    }
}

export async function loadQQLyrics(singer: string, songName: string) {
    const url = buildURL(singer, songName)

    const res = await fetch(url, {
        method: "GET",
        headers: {
            referer: "https://y.qq.com/",
            origin: "https://y.qq.com",
            accept: "application/json"
        }
    })

    const json = res.data.data as QQSearchResultData

    const song = json.song.itemlist.find((item) => item.name === songName && item.singer === singer)

    if (!song) {
        return null
    }

    const lyrics = await getLyrics(song.mid)
    return lyrics
}

async function getLyrics(mid: string) {
    const url = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?-=MusicJsonCallback_lrc&songmid=${mid}&g_tk=5381&loginUin=3003436226&hostUin=0&inCharset=utf-8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`

    const res = await fetch(url, {
        method: "GET",
        headers: {
            referer: "https://y.qq.com/",
            origin: "https://y.qq.com"
        },
        responseType: ResponseType.Text
    })

    const json = JSON.parse(res.data.replace("MusicJsonCallback(", "").replace("})", "}")) as {
        lyric: string
    }

    function b64_to_utf8(str: string) {
        return decodeURIComponent(escape(window.atob(str)))
    }

    return b64_to_utf8(json.lyric)
}

function buildURL(singer: string, songName: string) {
    return `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?_=1683491794217&cv=4747474&ct=24&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=1&uin=0&g_tk_new_20200303=5381&g_tk=5381&hostUin=0&is_xml=0&key=${encodeURIComponent(
        singer + " " + songName
    )}`
}
