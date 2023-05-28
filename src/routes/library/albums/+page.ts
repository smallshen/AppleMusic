import type { PageLoad } from "./$types"
import { loadLibrary } from "./loadLibrary"

export const load = (async ({ fetch }) => {
    const oldFetch = fetch
    window.fetch = fetch

    const albums = await loadLibrary()

    window.fetch = oldFetch
    return {
        albums
    }
}) satisfies PageLoad
