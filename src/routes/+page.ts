import type { PageLoad } from "./$types"

export const load = (async ({}) => {
    const music = MusicKit.getInstance()
    const queryParameters = { l: "zh-CN" }

    const recent = await music.api.music(`/v1/me/recent/played/tracks`, queryParameters)

    return {
        recentSongs: recent.data
    }
}) satisfies PageLoad
