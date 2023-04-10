import type { Artwork } from "./Artwork"
import type { EditorialNotes } from "./EditorialNotes"
import type { PlayParameters } from "./PlayParameters"

export interface Albums {
    id: string
    type: string
    href: string
    attributes?: Albums.Attributes
}

namespace Albums {
    export interface Attributes {
        artistName: string
        artistUrl?: string
        artwork: Artwork
        audioVariants?: string[]
        contentRating?: "clean" | "explicit"
        copyright?: string
        editorialNotes?: EditorialNotes
        genreNames: string[]
        isCompilation: boolean
        isComplete: boolean
        isMasteredForItunes: boolean
        isSingle: boolean
        name: string
        playParams?: PlayParameters
        recordLabel?: string
        releaseDate?: string
        trackCount: number
        upc?: string
        url: string
    }
}
