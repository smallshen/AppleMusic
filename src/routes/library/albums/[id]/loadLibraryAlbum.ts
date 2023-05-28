import type { Artwork } from "$lib/musickit/Artwork"

export type AlbumInfo = {
    libraryId: string
    albumId: string
    name: string
    artist: string
    genre: string
    repeaseYear: string
    releaseDate: string
    copyright: string
    artwork: Artwork
    songs: Array<{
        id: string
        name: string
        artist: string
        duration: number
        trackNumber: number
        inLibrary: boolean
    }>
}

export async function loadLibraryAlbum(id: string) {
    const music = MusicKit.getInstance()

    const albums = await music.api.music(`/v1/me/library/albums/${id}`, {
        "fields[artists]": "name,url",
        "format[resources]": "map",
        includeOnly: "catalog,artists,tracks",

        "include[library-albums]": "artists,tracks",
        "include[albums]": " artists,tracks",
        "include[music-videos]": " catalog,artists,tracks",

        l: "zh-CN"
    })
    const data = albums.data as LibraryAlbumsData

    if (id !== data.data[0].id) {
        throw new Error("id mismatch")
    }

    const libraryAlbum = data.resources["library-albums"][id]
    const album = data.resources.albums[libraryAlbum.relationships.catalog.data[0].id]

    Object.values(data.resources["library-songs"]).forEach((libSong) => {
        const catalog = libSong.relationships.catalog.data[0].id
        data.resources.songs[catalog].inLibrary = true
    })

    const songs = Object.values(data.resources.songs).map((song) => {
        const id = song.id
        const artist = song.attributes.artistName
        const name = song.attributes.name
        const duration = song.attributes.durationInMillis
        const trackNumber = song.attributes.trackNumber
        const inLibrary = song.inLibrary!

        delete song.inLibrary

        return {
            id,
            artist,
            name,
            duration,
            trackNumber,
            inLibrary
        }
    })

    return {
        libraryId: data.data[0].id,
        albumId: libraryAlbum.relationships.catalog.data[0].id,
        name: album.attributes.name,
        artist: album.attributes.artistName,
        genre: album.attributes.genreNames[0],
        repeaseYear: album.attributes.releaseDate.slice(0, 4),
        releaseDate: album.attributes.releaseDate,
        copyright: album.attributes.copyright,
        songs: songs,
        artwork: libraryAlbum.attributes.artwork
    } satisfies AlbumInfo
}

export type LibraryAlbumsData = {
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
                    artistName: string
                    releaseDate: string
                    copyright: string
                    genreNames: string[]
                }
            }
        >

        "library-albums": Record<
            string,
            {
                attributes: {
                    artwork: Artwork
                    name: string
                    genreNames: string[]
                    // format 2021-01-01
                    releaseDate: string
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

        "library-songs": Record<
            string,
            {
                id: string
                attributes: {
                    name: string
                    artwork: Artwork
                    durationInMillis: number
                    artistName: string
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

        songs: Record<
            string,
            {
                id: string
                attributes: {
                    name: string
                    artwork: Artwork
                    durationInMillis: number
                    artistName: string
                    trackNumber: number
                }
                inLibrary?: boolean
            }
        >
    }
}
