<svelte:options immutable={true} />

<script context="module" lang="ts">
    // 1:21.822
    function hmsToSecondsOnly(str: string): number {
        let p = str.split(":")
        let s = 0
        let m = 1

        while (p.length > 0) {
            s += m * parseInt(p.pop()!, 10)
            m *= 60
        }

        return s
    }

    // 1:21.822
    function hmsToMilliseconds(str: string): number {
        const [seconds, milliseconds] = str.split(".")
        return hmsToSecondsOnly(seconds) * 1000 + parseInt(milliseconds, 10)
    }

    type TT = {
        attributes: any
        body: {
            attributes: { dur: string }
            div: {
                attributes: { begin: string; end: string }
                p: {
                    attributes: { begin: string; end: string }
                    text: string
                    dom: HTMLElement
                }[]
            }[]
        }
    }
</script>

<script lang="ts">
    import type { MediaItem } from "$lib/musickit"
    import { XMLParser } from "fast-xml-parser"
    import { onMount } from "svelte"
    import LyricsLine from "./LyricsLine.svelte"

    export let song: MediaItem<Songs.Attributes>

    export let lyrics: string

    $: ttml = new XMLParser({
        ignoreAttributes: false,
        attributesGroupName: "attributes",
        attributeNamePrefix: "",
        textNodeName: "text"
    }).parse(lyrics).tt as TT

    const music = MusicKit.getInstance()

    $: lyricsArray = [] as {
        dom: HTMLElement
    }[]

    $: {
        const array = [] as {
            dom: HTMLElement
        }[]
        for (const div of ttml.body.div) {
            if (!div.p) continue

            for (const p of div.p) {
                const start = ceilToThree(hmsToMilliseconds(p.attributes.begin))
                const end = roundToThree(hmsToMilliseconds(p.attributes.end))
                // loop throught start to end
                for (let i = start; i < end; i += 1) {
                    array[i] = p
                }
            }
        }
        lyricsArray = array
    }

    let currentLine: HTMLElement | null

    $: {
        if (currentLine) {
            currentLine.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            })
            currentLine.classList.add("lyrics_line_current")
        }
    }

    onMount(() => {
        const music = MusicKit.getInstance()

        const porgressCallback = (event: any) => {
            const { progress } = event

            const newLine = findLine(progress)

            if (newLine && newLine != currentLine) {
                currentLine?.classList.remove("lyrics_line_current")

                currentLine = newLine
            }
        }

        music.addEventListener("playbackProgressDidChange", porgressCallback)

        return () => {
            music.removeEventListener("playbackProgressDidChange", porgressCallback)
        }
    })

    let lyricsDom: HTMLDivElement

    let userScrolling = false

    let timeoutId: number | null = null

    function resetScroll() {
        userScrolling = false
    }

    function roundToThree(num: number) {
        return Math.round(num * 1000) / 1000
    }

    function ceilToThree(num: number) {
        return Math.ceil(num * 1000) / 1000
    }

    // progress in 0 to 1
    function findLine(progress: number) {
        const totalSeconds = music.currentPlaybackDuration
        const totalMilliseconds = totalSeconds * 1000
        const currentMilliseconds = progress * totalMilliseconds

        // from currentMilliseconds to 0
        for (let i = currentMilliseconds; i >= 0; i -= 1) {
            const line = lyricsArray[i]
            if (line) {
                return line.dom
            }
        }

        return null
    }

    $: {
        if (!userScrolling) {
            currentLine = findLine(music.currentPlaybackProgress)
            if (currentLine) {
                currentLine.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                })
            }
        }
    }

    onMount(() => {
        currentLine = findLine(music.currentPlaybackProgress)
        if (currentLine) {
            currentLine.scrollIntoView({
                block: "center",
                inline: "center"
            })
        }

        const onWheel = (event: WheelEvent) => {
            userScrolling = true
            if (timeoutId != null) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(resetScroll, 3500)
        }

        lyricsDom.addEventListener("wheel", onWheel)

        return () => {
            lyricsDom.removeEventListener("wheel", onWheel)
        }
    })
</script>

<div bind:this={lyricsDom} class="box {userScrolling ? 'scroll-override' : ''}">
    <ul class="all">
        <div class="padding" />
        {#each ttml.body.div as div}
            <li class="verse">
                <ul>
                    {#each div.p as p}
                        <li bind:this={p.dom} class="lyrics-line">
                            <LyricsLine
                                duration={hmsToMilliseconds(p.attributes.end) - hmsToMilliseconds(p.attributes.begin)}
                                text={p.text}
                            />
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
        <div class="padding" />
    </ul>
</div>

<style>
    li,
    ul {
        all: unset;
    }

    .padding {
        height: 45vh;
        width: 1px;
    }

    .verse:not(:last-child) {
        margin-bottom: 40px;
    }

    .lyrics-line:not(:last-child) {
        display: block;
        padding-bottom: 20px;
    }

    .all {
        height: max-content;
        display: flex;
        flex-direction: column;
        color: var(--gray11);
        padding-left: 10px;
        margin-right: 45px;
    }

    .box {
        height: 100vh;
        width: 100%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
    }
</style>
