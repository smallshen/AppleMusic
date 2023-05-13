// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare module "https://js-cdn.music.apple.com/musickit/v3/musickit.js" {
    export const LitElement: any, html: any
}

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }

    namespace MusicKit {
        interface MusicKitConfiguration {
            developerToken: string
            app: {
                name: string
                build?: string
                icon?: string
            }
            bitrate?: MusicKit.PlaybackBitrate
            storefrontId?: string
        }

        function configure(config: MusicKitConfiguration): Promise<MusicKitInstance>

        function getInstance(): MusicKitInstance

        interface MusicKitInstance {
            api: MusicKitAPI
            bitrate?: MusicKit.PlaybackBitrate
            currentPlaybackDuration: number
            currentPlaybackProgress: number
            currentPlaybackTime: number
            currentPlaybackTimeRemaining: number
            isAuthorized: boolean
            isPlaying: boolean
            nowPlayingItem?: MediaItem
            nowPlayingItemIndex: number
            playbackRate: number
            playbackState: MusicKit.PlaybackStates
            previewOnly?: boolean
            queue: Queue
            queueIsEmpty: boolean
            repeatMode: MusicKit.PlayerRepeatMode
            seekSeconds?: SeekSeconds
            shuffleMode: MusicKit.PlayerShuffleMode
            shuffle?: boolean // deprecated, use shuffleMode instead
            storefrontCountryCode: string
            storefrontId: string
            videoContainerElement?: HTMLVideoElement

            musicUserToken: string

            addEventListener(name: string, callback: Function, options?: { once?: boolean }): void
            authorize(): Promise<string | void>
            changeToMediaAtIndex(index: number): Promise<void>
            changeToMediaItem(descriptor: MusicKit.MediaItem | string): Promise<void>
            changeUserStorefront(storefrontId: string): Promise<void>
            clearQueue(): Promise<MusicKit.Queue>
            exitFullscreen(): Promise<void>
            mute(): void
            pause(): Promise<void>
            play(): Promise<void>
            playAt(position: number, options: MusicKit.QueueOptions): Promise<MusicKit.Queue | void>
            playLater(options: MusicKit.QueueOptions): Promise<MusicKit.Queue | void>
            playNext(options: MusicKit.QueueOptions, clear?: boolean): Promise<MusicKit.Queue | void>
            removeEventListener(name: string, callback: Function): void
            seekToTime(time: number): Promise<void>
            setQueue(descriptor: MusicKit.QueueOptions): Promise<MusicKit.Queue>
            skipBackward(): void
            skipForward(): void
            stop(): void
            unmute(): void
        }

        interface MusicKitAPI {
            music: (
                path: string,
                queryParameters?: Record<string, string | string[]>,
                options?: {
                    fetchOptions?: RequestInit
                }
            ) => Promise<T>
        }

        interface Queue {
            currentItem: MediaItem
            isEmpty: boolean
            items: Array<MediaItem>
            length: number
            nextPlayableItem: MediaItem
            position: number
            previousPlayableItem: MediaItem
        }

        interface QueueOptions {
            album?: string | Array<string>
            albums?: Array<string>
            musicVideo?: string | Array<string>
            musicVideos?: Array<string>
            playlist?: string | Array<string>
            playlists?: Array<string>
            song?: string | Array<string>
            songs?: Array<string>
            url?: string
            repeatMode?: PlayerRepeatMode
            startPlaying?: boolean
            startTime?: number
        }

        interface MediaItem {
            // properties of MediaItem
        }

        enum PlaybackBitrate {
            STANDARD = 64,
            HIGH = 256
        }

        enum PlaybackStates {
            none = 0,
            loading = 1,
            playing = 2,
            paused = 3,
            stopped = 4,
            ended = 5,
            seeking = 6,
            waiting = 8,
            stalled = 9,
            completed = 10
        }

        enum PlayerRepeatMode {
            all = "all",
            none = "none",
            one = "one"
        }

        enum PlayerShuffleMode {
            off = "off",
            songs = "songs"
        }
    }
}

export {}
