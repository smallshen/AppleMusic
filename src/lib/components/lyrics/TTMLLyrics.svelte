<svelte:options immutable={true} />

<script context="module" lang="ts">
    // example format: 16.400 (16 seconds and 400 milliseconds)
    // example format: 1:16.400 (1 minute, 16 seconds and 400 milliseconds)
    function convertStringToMilliseconds(time: string) {
        if (time.indexOf(":") === -1) {
            // no minutes. example: 16.400
            const [seconds, milliseconds] = time.split(".")
            return parseInt(seconds) * 1000 + parseInt(milliseconds)
        } else {
            // has minutes. example: 1:16.400
            const [minutes, remain] = time.split(":")
            const [seconds, milliseconds] = remain.split(".")
            return parseInt(minutes) * 60 * 1000 + parseInt(seconds) * 1000 + parseInt(milliseconds)
        }
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
                const start = Math.round(convertStringToMilliseconds(p.attributes.begin) / 100) * 100
                const end = Math.ceil(convertStringToMilliseconds(p.attributes.end) / 100) * 100

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
            const progress = music.currentPlaybackProgress
            const newLine = findLine(progress)

            if (newLine && newLine != currentLine) {
                currentLine?.classList.remove("lyrics_line_current")

                currentLine = newLine
            }
        }

        const firstNonEmptyLine = lyricsArray.find((line) => line)
        firstNonEmptyLine?.dom?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        })

        music.addEventListener("playbackTimeDidChange", porgressCallback)

        return () => {
            music.removeEventListener("playbackTimeDidChange", porgressCallback)
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

        const currentMark = Math.round(progress * totalSeconds * 1000)

        for (let i = currentMark; i >= 0; i -= 1) {
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
                                duration={convertStringToMilliseconds(p.attributes.end) -
                                    convertStringToMilliseconds(p.attributes.begin)}
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
