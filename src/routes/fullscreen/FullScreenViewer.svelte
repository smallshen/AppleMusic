<svelte:options immutable={true} />

<script lang="ts">
    import PlayPauseButton from "$lib/components/controls/PlayPauseButton.svelte"
    import TTMLLyrics from "$lib/components/lyrics/TTMLLyrics.svelte"
    import type { MediaItem, PlayParameters, Songs } from "$lib/musickit"
    import { AMPMusicKit } from "$lib/musickit/AMPMusicKit"
    import { trad2simp } from "$lib/trad2simp"
    import { onDestroy, onMount } from "svelte"
    import type { RGB } from "./extractColor"
    import { Gradient } from "./fluid/Gradient"
    import ProgressController from "./ProgressController.svelte"

    export let openFullScreen: boolean
    export let song: Songs

    function handleWindowKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            openFullScreen = false
        }
    }

    $: width = song.attributes!.artwork.width
    $: height = song.attributes!.artwork.height

    $: artwork = song.attributes!.artwork
    $: artworkUrl = song.attributes!.artwork.url.replace("{w}", width.toString()).replace("{h}", height.toString())
    $: songName = song.attributes!.name
    $: author = song.attributes!.artistName

    type Catlog = {
        id: string
        type: "lyrics"
        attributes: {
            playParams: PlayParameters
            ttml: string
        }
    }

    type LyricsInfo = {
        from: "apple" | "qq" | "netease"
        lyrics: string
    }

    let lyrics: LyricsInfo | null | undefined = undefined

    async function updateLyrics(song: Songs): Promise<LyricsInfo | null> {
        if (song.attributes!.hasLyrics) {
            const res = await AMPMusicKit.music(`/v1/catalog/{{storefrontId}}/songs/${song.id}/lyrics`)

            const { data } = res.data as {
                data: Catlog[]
            }

            return {
                from: "apple",
                lyrics: trad2simp(data[0].attributes.ttml)
            }
        }

        //  const qqLyrics = await loadQQLyrics(song.attributes!.artistName, song.attributes!.name)

        //     return {
        //         from: "qq",
        //         lyrics: qqLyrics
        //     }

        return null
    }

    $: {
        updateLyrics(song)
            .then((l) => {
                lyrics = l
            })
            .catch((e) => {
                console.error(e)
                lyrics = null
            })
    }

    const music = MusicKit.getInstance()

    let paused = music.playbackState !== MusicKit.PlaybackStates.playing
    let animationPause = false
    let playingItem: MediaItem<Songs.Attributes> = music.nowPlayingItem

    onMount(() => {
        const music = MusicKit.getInstance()
        const callback = (e: {
            oldState: MusicKit.PlaybackStates
            state: MusicKit.PlaybackStates
            item: MediaItem<Songs.Attributes>
        }) => {
            const { state } = e
            playingItem = e.item
            paused = state !== MusicKit.PlaybackStates.playing
            animationPause = state === MusicKit.PlaybackStates.paused
        }

        music.addEventListener("playbackStateDidChange", callback)

        return () => {
            music.removeEventListener("playbackStateDidChange", callback)
        }
    })

    onMount(() => {
        const timeout = setTimeout(() => {
            animationPause = music.playbackState === MusicKit.PlaybackStates.paused
        }, 300)

        return () => {
            clearTimeout(timeout)
        }
    })

    $: rgbs = orderByLuminance(song.__rgbs)

    $: fixedColors = [rgbs[0], rgbs[3], rgbs[7], rgbs[14]]

    $: colors = fixedColors.map((rgb) => rgbToHex(rgb))

    let canvas: HTMLCanvasElement

    let gradient: Gradient

    function rgbToHex(pixel: RGB) {
        const componentToHex = (c: number) => {
            const hex = c.toString(16)
            return hex.length == 1 ? "0" + hex : hex
        }

        return ("#" + componentToHex(pixel.r) + componentToHex(pixel.g) + componentToHex(pixel.b)).toUpperCase()
    }

    function orderByLuminance(rgbValues: RGB[]) {
        const calculateLuminance = (p) => {
            return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b
        }

        return rgbValues.sort((p1, p2) => {
            return calculateLuminance(p2) - calculateLuminance(p1)
        })
    }

    let canvasWidth: number
    let canvasHeight: number

    $: {
        if (gradient) {
            if (animationPause) {
                gradient.pause()
            } else {
                gradient.play()
            }
        }
    }

    $: {
        if (gradient) {
            gradient.resize(canvasWidth, canvasHeight)
        }
    }

    $: {
        if (gradient) {
            gradient.destroy()
        }

        if (rgbs && canvas) {
            gradient = new Gradient(canvas, colors)
        }
    }

    onDestroy(() => {
        gradient.destroy()
    })
</script>

<svelte:window on:keydown={handleWindowKeyDown} />

<main class="{paused ? 'paused' : ''} dark-theme">
    <!-- <canvas id="gradient" class="background" /> -->
    <!-- <img src={artworkUrl} alt={songName} class="background" /> -->
    <div bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} class="background">
        <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} id="gradient" />
    </div>
    <div class="blur" data-paused={animationPause} />

    <section class="content">
        <section class="left">
            <section class="info">
                <div class="img-box">
                    <img src={artworkUrl} alt={songName} class="img" />
                    <!-- <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} id="gradient" class="img" /> -->
                </div>
                <section class="info-detail">
                    <h1 class="subtitle3 title">{songName}</h1>
                    <h2 class="body1 cap">{author}</h2>
                </section>
            </section>

            <section class="player">
                {#key playingItem}
                    <ProgressController song={playingItem} />
                {/key}
                <PlayPauseButton />
            </section>
        </section>
        <section class="lyrics" data-hasLyrics={lyrics !== null}>
            {#if lyrics?.from == "apple"}
                <TTMLLyrics song={playingItem} lyrics={lyrics.lyrics} />
            {/if}
        </section>
    </section>
</main>

<style>
    .title {
        overflow: scroll;
        /* oneline */
        white-space: nowrap;
        color: var(--gray12);
    }

    .info {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
    }

    main {
        width: 100%;
        height: 100%;
        overflow: hidden;
        clip-path: inset(0 0 0 0);
    }

    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: fill;
        object-position: center;
        /* filter: blur(20px); */
    }

    .blur {
        position: absolute;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        animation: blur-transition 10s linear infinite;
        animation-play-state: running;
        animation-direction: alternate;

        will-change: backdrop-filter;
    }

    .blur[data-paused="true"] {
        animation-play-state: paused;
    }

    @keyframes blur-transition {
        0% {
            backdrop-filter: blur(0px);
        }

        55% {
            backdrop-filter: blur(15px);
        }

        80% {
            backdrop-filter: blur(30px);
        }

        100% {
            backdrop-filter: blur(50px);
        }
    }

    .content {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .img-box {
        width: clamp(100px, 25vw, 400px);
        height: clamp(100px, 25vw, 400px);

        display: grid;
        place-items: center;
    }

    .img {
        height: clamp(100px, 25vw, 400px);

        border-radius: 12px;
        border: 1px solid var(--grayA7);
        box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);

        object-fit: cover;

        align-self: center;

        transform: scale(1);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .paused .img {
        transform: scale(0.8);
    }

    .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .info-detail {
        display: flex;
        flex-direction: column;
    }

    .cap {
        color: var(--gray11);
    }

    .lyrics {
        flex: 1;

        transition: flex 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
    }

    .lyrics > * {
        color: var(--gray12);
    }

    .lyrics[data-hasLyrics="false"] {
        flex: unset;
    }

    .player {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    :global(.paused) {
    }
</style>
