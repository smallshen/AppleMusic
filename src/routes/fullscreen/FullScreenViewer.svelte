<svelte:options immutable={true} />

<script lang="ts">
    import PlayPauseButton from "$lib/components/controls/PlayPauseButton.svelte"
    import TTMLLyrics from "$lib/components/lyrics/TTMLLyrics.svelte"
    import type { PlayParameters, Songs } from "$lib/musickit"
    import { AMPMusicKit } from "$lib/musickit/AMPMusicKit"
    import { trad2simp } from "$lib/trad2simp"
    import { onDestroy, onMount } from "svelte"
    import { Gradient } from "./fluid/Gradient"
    import type { RGB } from "./extractColor"

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

    $: {
        if (song.attributes!.hasLyrics) {
            AMPMusicKit.music(`/v1/catalog/{{storefrontId}}/songs/${song.id}/lyrics`).then((res) => {
                const { data } = res.data as {
                    data: Catlog[]
                }

                lyrics = {
                    from: "apple",
                    lyrics: trad2simp(data[0].attributes.ttml)
                }
            })
        } else {
            lyrics = null
        }
    }

    const music = MusicKit.getInstance()

    let paused = music.playbackState !== MusicKit.PlaybackStates.playing
    let animationPause = false

    onMount(() => {
        const music = MusicKit.getInstance()
        const callback = (e: { oldState: MusicKit.PlaybackStates; state: MusicKit.PlaybackStates }) => {
            const { state } = e
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
    $: console.log(rgbs)

    $: fixedColors = [rgbs[0], rgbs[3], rgbs[10], rgbs[14]]

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

<main class={paused ? "paused" : ""}>
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
                    <h1 class="subtitle1 title">{songName}</h1>
                    <h2 class="subtitle3 cap">{author}</h2>
                </section>
            </section>

            <section class="player">
                <PlayPauseButton />
            </section>
        </section>
        <section class="lyrics">
            {#if lyrics === null}
                <h1 class="subtitle1">Lyrics</h1>
                <h2 class="body2">Coming soon...</h2>
            {/if}

            {#if lyrics?.from == "apple"}
                <TTMLLyrics lyrics={lyrics.lyrics} />
            {/if}
        </section>
    </section>
</main>

<style>
    .title {
        overflow: scroll;
        /* oneline */
        white-space: nowrap;
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
        animation-play-state: paused;

        will-change: backdrop-filter;
    }

    .blur[data-paused="false"] {
        animation-play-state: running;
        animation-direction: alternate;
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
        width: 100%;
        height: 100%;

        border-radius: 12px;
        border: 1px solid var(--grayA7);
        box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);

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
    }

    .player {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>
