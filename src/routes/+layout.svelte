<script context="module" lang="ts">
    const classList = () => document.documentElement.classList

    function changeTheme(theme: "dark" | "light" | "auto") {
        if (theme == "dark") {
            if (!classList().contains("dark-theme")) {
                classList().add("dark-theme")
            }
        }

        if (theme == "light") {
            if (classList().contains("dark-theme")) {
                classList().remove("dark-theme")
            }
        }
    }
</script>

<script lang="ts">
    import type { MediaItem, Songs } from "$lib/musickit"
    import { onMount } from "svelte"
    import BottomBar from "./BottomBar.svelte"
    import LeftNav from "./LeftNav.svelte"
    import ToastWrapper from "./ToastWrapper.svelte"
    import "./baseLine.css"
    import "./baseStyle.css"
    import FullScreenViewer from "./fullscreen/FullScreenViewer.svelte"
    import "./typography.css"
    import { cubicInOut } from "svelte/easing"

    const music = MusicKit.getInstance()

    let darkTheme

    let listener = (e: MediaQueryListEvent) => {
        darkTheme = e.matches
        changeTheme(darkTheme ? "dark" : "light")
    }

    onMount(() => {
        const query = window.matchMedia("(prefers-color-scheme: dark)")
        darkTheme = query.matches
        changeTheme(darkTheme ? "dark" : "light")
        query.addEventListener("change", listener)

        return () => {
            query.removeEventListener("change", listener)
        }
    })

    let currentMusic: Songs | null = null

    onMount(() => {
        const callback = async (e: {
            oldState: MusicKit.PlaybackStates
            state: MusicKit.PlaybackStates
            nowPlayingItem: MediaItem<unknown> | undefined
        }) => {
            if (e.nowPlayingItem == null) {
                currentMusic = null
                return
            }

            const queryParameters = { l: "zh-CN" }

            const { data } = await music.api.music(
                `/v1/catalog/{{storefrontId}}/songs/${e.nowPlayingItem.id}`,
                queryParameters
            )

            currentMusic = data.data[0]
        }

        music.addEventListener("playbackStateDidChange", callback)

        return () => {
            music.removeEventListener("playbackStateDidChange", callback)
        }
    })

    let showFullScreen = false

    function toggleFullScreen() {
        if (music.playbackState !== MusicKit.PlaybackStates.none) {
            showFullScreen = true
        }
    }

    function slideBottomUp(node: Node, options: any) {
        return {
            duration: options.duration,
            css: (t: number) => {
                const eased = cubicInOut(t)

                return `
				    transform: translateY(${(1 - eased) * 100}%);
			    `
            }
        }
    }

    $: {
        if (showFullScreen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    $: {
        if (!currentMusic) {
            showFullScreen = false
        }
    }
</script>

<ToastWrapper />

<main>
    <LeftNav />
    <section>
        <slot />
        <button class="fullscreen-toggle" on:click={toggleFullScreen}>
            <BottomBar songs={currentMusic} />
        </button>
    </section>
</main>

{#if showFullScreen && currentMusic}
    <div class="fullscreen" transition:slideBottomUp={{ duration: 200 }}>
        <FullScreenViewer bind:openFullScreen={showFullScreen} song={currentMusic} />
    </div>
{/if}

<style>
    :global(:root) {
        --bottombar-height: 65px;
    }

    main {
        display: flex;
        flex-direction: row;
    }

    section {
        height: 100%;
        width: 100%;
    }

    .fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        will-change: transform;
    }

    .fullscreen-toggle {
        all: unset;
        width: 100%;

        position: sticky;
        bottom: 0;
        border-top: 1px solid var(--gray8);
        height: calc(var(--bottombar-height));
        box-sizing: border-box;
    }
</style>
