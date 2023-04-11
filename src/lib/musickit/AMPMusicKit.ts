import { appleAMPToken } from "$lib/getAppleMusicAMPToken"
import { fetch } from "@tauri-apps/api/http"

export namespace AMPMusicKit {
    export function music(path: string, queryParameters?: Record<string, string | string[]>) {
        const music = MusicKit.getInstance()

        let url = new URL(path.replace("{{storefrontId}}", music.storefrontId), "https://amp-api.music.apple.com/")

        if (queryParameters) {
            for (const [key, value] of Object.entries(queryParameters)) {
                if (Array.isArray(value)) {
                    value.forEach((v) => url.searchParams.append(key, v))
                } else {
                    url.searchParams.set(key, value)
                }
            }
        }

        return fetch(url.toString(), {
            method: "GET",
            headers: {
                authorization: `Bearer ${appleAMPToken}`,
                "music-user-token": music.musicUserToken,
                origin: "https://music.apple.com",
                referer: "https://music.apple.com/"
            }
        })
    }
}
