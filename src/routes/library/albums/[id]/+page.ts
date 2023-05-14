import type { PageLoad } from "./$types"
import { loadLibraryAlbum } from "./loadLibraryAlbum"

export const load = (async ({ params }) => {
    const songId = params.id

    return {
        albumInfo: await loadLibraryAlbum(songId)
    }
}) satisfies PageLoad
