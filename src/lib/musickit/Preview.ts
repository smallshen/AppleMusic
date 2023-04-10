import type { Artwork } from "./Artwork"

export interface Preview {
    artwork?: Artwork // The preview artwork for the associated preview music video
    url: string // The preview URL for the content
    hlsUrl?: string // The HLS preview URL for the content
}
