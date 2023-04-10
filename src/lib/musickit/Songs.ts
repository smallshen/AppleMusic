import type { Artwork } from "./Artwork"
import type { EditorialNotes } from "./EditorialNotes"
import type { MediaItem } from "./MediaItem"

export interface Songs extends MediaItem<Songs.Attributes> {
    id: string
    type: string
    href: string
    attributes?: Songs.Attributes
}

namespace Songs {
    export interface Attributes {
        name: string // The name of the song
        albumName: string // The name of the album the song appears on
        artistName: string // The artist’s name
        artistUrl?: string // The URL of the artist for the content
        artwork: Artwork // The album artwork
        attribution?: string // The name of the artist or composer to attribute the song with
        audioVariants?: string[] // The specific audio variant for a song
        composerName?: string // The song’s composer
        contentRating?: string // The RIAA rating of the content
        discNumber?: number // The disc number of the album the song appears on
        durationInMillis: number // The duration of the song in milliseconds
        editorialNotes?: EditorialNotes // The notes about the song that appear in the Apple Music catalog
        genreNames: string[] // The genre names the song is associated with
        hasLyrics: boolean // Indicates whether the song has lyrics available in the Apple Music catalog
        isAppleDigitalMaster: boolean // Indicates whether the response delivered the song as an Apple Digital Master
        isrc: string // The ISRC for the song
        movementCount?: number // The movement count of the song
        movementName?: string // The movement name of the song
        movementNumber?: number // The movement number of t
    }
}
