import type { Artwork } from "$lib/musickit/Artwork"

export type AlbumInfo = {
    name: string
    artist: string
    genre: string
    repeaseYear: string
    releaseDate: string
    copyright: string
    artwork: Artwork
    totalDurationInMinutes: number
    songs: Array<{
        id: string
        name: string
        artist: string
        duration: number
        trackNumber: number
    }>
}

export async function loadLibraryAlbum(id: string) {
    console.log(id)

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

    console.log(data)

    if (id !== data.data[0].id) {
        throw new Error("id mismatch")
    }

    const libraryAlbum = data.resources["library-albums"][id]
    const album = data.resources.albums[libraryAlbum.relationships.catalog.data[0].id]
    const artist = data.resources["library-artists"][libraryAlbum.relationships.artists.data[0].id]

    const songs = Object.values(data.resources["library-songs"]).map((librarySong) => {
        const song = data.resources.songs[librarySong.relationships.catalog.data[0].id]
        const id = song.id
        const artist = song.attributes.artistName
        const name = song.attributes.name
        const duration = song.attributes.durationInMillis
        const trackNumber = song.attributes.trackNumber

        return {
            id,
            artist,
            name,
            duration,
            trackNumber
        }
    })

    // sort by track number
    songs.sort((a, b) => a.trackNumber - b.trackNumber)

    const totalDurationInMinutes = Math.floor(songs.reduce((prev, curr) => prev + curr.duration, 0) / 1000 / 60)

    return {
        name: libraryAlbum.attributes.name,
        artist: artist.attributes.name,
        genre: album.attributes.genreNames[0],
        repeaseYear: libraryAlbum.attributes.releaseDate.slice(0, 4),
        releaseDate: album.attributes.releaseDate,
        copyright: album.attributes.copyright,
        songs: songs,
        artwork: libraryAlbum.attributes.artwork,
        totalDurationInMinutes: totalDurationInMinutes
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
            }
        >
    }
}
