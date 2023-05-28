import type { PageLoad } from "./$types"

export const load = (async ({ fetch }) => {
    const oldFetch = fetch
    window.fetch = fetch
    const music = MusicKit.getInstance()
    const queryParameters = { l: "zh-CN" }

    const recent = await music.api.music(`/v1/me/recent/played/tracks`, queryParameters)
    window.fetch = oldFetch

    return {
        recentSongs: recent.data
    }
}) satisfies PageLoad
