import type { Artwork } from "$lib/musickit/Artwork"

const pageSize = 26

export async function loadLibrary(page: number = 1) {
    if (page < 1) {
        throw new Error("page must be greater than or equal to 1")
    }
    const music = MusicKit.getInstance()

    const albums = await music.api.music("/v1/me/library/albums", {
        "fields[albums]": "artistName,artistUrl,artwork,editorialArtwork,name,playParams,releaseDate,url",
        "fields[artists]": "name,url",
        "format[resources]": "map",
        includeOnly: "catalog,artists",

        "include[library-albums]": "artists",
        l: "zh-CN",
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
        sort: "dateAdded"
    })
    albums.data.page = page
    return albums.data as LibraryAlbumsData
}

export type LibraryAlbumsData = {
    next: string | null
    page: number
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
