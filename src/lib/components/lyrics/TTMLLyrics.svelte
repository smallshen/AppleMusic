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
    }).parse(lyrics)

    $: console.log(ttml)

    onMount(() => {
        const music = MusicKit.getInstance()

        const porgressCallback = (event: any) => {
            // console.log(event)
            // console.log(music.currentPlaybackTime);
        }

        music.addEventListener("playbackProgressDidChange", porgressCallback)

        return () => {
            music.removeEventListener("playbackProgressDidChange", porgressCallback)
        }
    })

    $: info = ttml.tt as TT
</script>

<div class="box">
    <ul class="all">
        <div class="padding" />
        {#each info.body.div as div}
            <li>
                <ul>
                    {#each div.p as p}
                        <li>
                            <LyricsLine
                                duration={hmsToSecondsOnly(p.attributes.end) - hmsToSecondsOnly(p.attributes.begin)}
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

    .all {
        height: max-content;
        display: flex;
        flex-direction: column;
        color: var(--gray11);
    }

    .box {
        height: 100vh;
        width: 100%;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
    }
</style>
