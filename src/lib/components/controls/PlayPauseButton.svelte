<script lang="ts">
    const music = MusicKit.getInstance()

    let state: MusicKit.PlaybackStates = music.playbackState

    let paused = state !== MusicKit.PlaybackStates.playing

    import { onMount } from "svelte"
    import { quintOut } from "svelte/easing"
    import { scale } from "svelte/transition"

    async function toggle() {
        if (!paused) {
            await music.pause()
        } else {
            await music.play()
        }
    }

    onMount(() => {
        const callback = (e: { oldState: MusicKit.PlaybackStates; state: MusicKit.PlaybackStates }) => {
            state = e.state

            // not playing and not seeking and not waiting
            paused =
                state !== MusicKit.PlaybackStates.playing &&
                state !== MusicKit.PlaybackStates.seeking &&
                state !== MusicKit.PlaybackStates.waiting
        }

        music.addEventListener("playbackStateDidChange", callback)

        return () => {
            music.removeEventListener("playbackStateDidChange", callback)
        }
    })
</script>

<button on:click|stopPropagation={toggle}>
    {#if paused}
        <svg
            transition:scale={{ duration: 300, easing: quintOut }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 96 960 960"
        >
            <path d="M370 850q-26 14-49 1t-23-40V334q0-26 23-39t49 1l372 239q23 14 23 38.5T742 611L370 850Z" />
        </svg>
    {:else}
        <svg
            transition:scale={{ duration: 300, easing: quintOut }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 96 960 960"
        >
            <path
                d="M573 806V345q0-37.213 26.946-64.606Q626.891 253 665.177 253 701 253 728.5 280.394 756 307.787 756 345v461q0 38.213-27.677 65.106-27.677 26.894-64 26.894Q627 898 600 871.106 573 844.213 573 806Zm-367 0V345q0-37.213 26.946-64.606Q259.891 253 298.177 253 334 253 361.5 280.394 389 307.787 389 345v461q0 38.213-27.677 65.106-27.677 26.894-64 26.894Q260 898 233 871.106 206 844.213 206 806Z"
            />
        </svg>
    {/if}
</button>

<style>
    button {
        all: unset;

        width: 48px;
        height: 48px;
        clip-path: circle(50%);

        will-change: background-color, transform;

        transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button svg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        padding: 4px;

        fill: var(--gray12);
    }

    button:hover {
        background-color: var(--grayA4);
        transform: scale(1.1);
    }

    button:active {
        background-color: var(--grayA5);
        transform: scale(0.9);
    }
</style>
