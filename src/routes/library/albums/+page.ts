import type { PageLoad } from "./$types"
import { loadLibrary } from "./loadLibrary"

export const load = (async ({}) => {
    return {
        albums: await loadLibrary()
    }
}) satisfies PageLoad
