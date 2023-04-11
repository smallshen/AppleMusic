<svelte:options immutable={true} />

<script lang="ts">
    import PlayPauseButton from "$lib/components/controls/PlayPauseButton.svelte"
    import type { PlayParameters, Songs } from "$lib/musickit"
    import { AMPMusicKit } from "$lib/musickit/AMPMusicKit"

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

    $: {
        if (song.attributes!.hasLyrics) {
            AMPMusicKit.music(`/v1/catalog/{{storefrontId}}/songs/${song.id}/lyrics`).then((res) => {
                const { data } = res.data as {
                    data: Catlog[]
                }
            })
        }
    }
</script>

<svelte:window on:keydown={handleWindowKeyDown} />

<main>
    <!-- <canvas id="gradient" class="background" /> -->
    <img src={artworkUrl} alt={songName} class="background" />
    <div class="blur" />

    <section class="content">
        <section class="left">
            <section class="info">
                <img src={artworkUrl} alt={songName} class="img" />
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
            <h1 class="subtitle1">Lyrics</h1>
            <h2 class="body2">Coming soon...</h2>
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
    }

    main {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .background {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: fill;
        object-position: center;
        filter: blur(20px);
    }

    .blur {
        position: absolute;
        width: 100%;
        height: 100%;

        backdrop-filter: blur(100px);
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

    .img {
        width: clamp(100px, 25vw, 400px);
        height: clamp(100px, 25vw, 400px);

        border-radius: 12px;
        border: 1px solid var(--grayA7);
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
</style>
