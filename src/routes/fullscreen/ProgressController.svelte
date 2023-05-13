<svelte:options immutable={true} />

<script lang="ts">
    import type { MediaItem } from "$lib/musickit/MediaItem"
    import { onMount } from "svelte"

    const music = MusicKit.getInstance()

    export let song: MediaItem<Songs.Attributes>

    let progress: number = music.currentPlaybackProgress * music.currentPlaybackDuration

    let duration = music.currentPlaybackDuration

    $: {
        console.log(song)

        progress = music.currentPlaybackProgress * music.currentPlaybackDuration
        duration = music.currentPlaybackDuration
    }

    async function updateProgress(e: any) {
        const newProgress: number = e.target.value
        await music.seekToTime(newProgress)
    }

    onMount(() => {
        const callback = (e: { progress: number }) => {
            duration = music.currentPlaybackDuration
            progress = e.progress * duration
        }

        music.addEventListener("playbackProgressDidChange", callback)

        return () => {
            music.removeEventListener("playbackProgressDidChange", callback)
        }
    })
</script>

<label class="slider">
    <input type="range" class="level" min="0" max={duration} bind:value={progress} on:change={updateProgress} />
</label>

<style>
    .slider {
        /* slider */
        --slider-width: 100%;
        --slider-height: 6px;
        --slider-bg: rgb(82, 82, 82);
        --slider-border-radius: 999px;
        /* level */
        --level-color: #fff;
        --level-transition-duration: 0.3s;
        /* icon */
        --icon-margin: 15px;
        --icon-color: var(--slider-bg);
        --icon-size: 25px;
        width: clamp(100px, 25vw, 400px);
    }

    .slider {
        cursor: pointer;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        height: calc(var(--slider-height) * 2);
        padding-top: calc(var(--slider-height));
        padding-bottom: calc(var(--slider-height));
        display: inline-flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: reverse;
        -ms-flex-direction: row-reverse;
        flex-direction: row-reverse;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .slider .level {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: var(--slider-width);
        height: var(--slider-height);
        background: var(--slider-bg);
        overflow: hidden;
        border-radius: var(--slider-border-radius);
        -webkit-transition: height var(--level-transition-duration);
        transition: height var(--level-transition-duration) cubic-bezier(0.93, 0.29, 0.11, 0.91);
        cursor: inherit;
    }

    .slider .level::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0;
        height: 0;
        -webkit-box-shadow: -200px 0 0 200px var(--level-color);
        box-shadow: -200px 0 0 200px var(--level-color);
    }

    .slider:hover .level {
        height: calc(var(--slider-height) * 2);
    }
</style>
