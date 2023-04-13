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
                }[]
            }[]
        }
    }
</script>

<script lang="ts">
    import { XMLParser } from "fast-xml-parser"
    import { onMount } from "svelte"
    import LyricsLine from "./LyricsLine.svelte"
    export let lyrics: string

    $: ttml = new XMLParser({
        ignoreAttributes: false,
        attributesGroupName: "attributes",
        attributeNamePrefix: "",
        textNodeName: "text"
    }).parse(lyrics).tt as TT

    $: totalMilliseconds = hmsToMilliseconds(ttml.body.attributes.dur)

    const music = MusicKit.getInstance()

    let currentLine: HTMLElement | null = fineCurrentLine()

    function fineCurrentLine() {
        const currentTime = Math.ceil(music.currentPlaybackProgress * totalMilliseconds)

        // reverse order from current time until 0
        for (let i = currentTime; i >= 0; i--) {
            const elm = document.getElementById(`lyrics_line_${i}`)
            if (elm != null) {
                return elm
            }
        }
        return null
    }

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
        currentLine = fineCurrentLine()

        const music = MusicKit.getInstance()

        const porgressCallback = (event: any) => {
            const elm = fineCurrentLine()

            if (elm == null) {
                return
            }

            if (currentLine != elm) {
                currentLine?.classList.remove("lyrics_line_current")
                currentLine = elm
            }
        }

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

    $: {
        console.log(userScrolling)
        if (!userScrolling) {
            currentLine = fineCurrentLine()
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
                        <li class="lyrics-line">
                            <LyricsLine
                                id="lyrics_line_{hmsToMilliseconds(p.attributes.begin)}"
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
        margin-bottom: 20px;
    }

    .lyrics-line:not(:last-child) {
        display: block;
        padding-bottom: 10px;
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
