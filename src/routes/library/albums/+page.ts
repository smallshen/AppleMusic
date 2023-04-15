import type { Artwork } from "$lib/musickit"
import type { PageLoad } from "./$types"

type LibraryAlbumsResponse = {
    data: Array<{
        id: string
        type: "library-albums"
        href: string
    }>
    resources: {
        artists: Record<
            string,
            {
                attributes: {
                    name: string
                }
            }
        >

        albums: Record<
            string,
            {
                attributes: {
                    name: string
                }
            }
        >

        "library-albums": Record<
            string,
            {
                attributes: {
                    artwork: Artwork
                    name: string
                }
                relationships: {
                    artists: {
                        data: Array<{
                            id: string
                        }>
                    }

                    catalog: {
                        data: Array<{
                            id: string
                        }>
                    }
                }
            }
        >

        "library-artists": Record<
            string,
            {
                id: string
                attributes: {
                    name: string
                }
                relationships: {
                    catalog: {
                        data: Array<{
                            id: string
                        }>
                    }
                }
            }
        >
    }
}

export const load = (async ({ depends }) => {
    const music = MusicKit.getInstance()

    const albums = await music.api.music("/v1/me/library/albums", {
        "fields[albums]": "artistName,artistUrl,artwork,contentRating,editorialArtwork,name,playParams,releaseDate,url",
        "fields[artists]": "name,url",
        "format[resources]": "map",
        includeOnly: "catalog,artists",

        "include[library-albums]": "artists",
        l: "zh-CN",
        limit: "100",
        offset: "0"
    })

    depends("library-albums")

    return {
        albums: albums.data as LibraryAlbumsResponse
    }
}) satisfies PageLoad
