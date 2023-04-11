<script lang="ts">
    import type { Songs } from "$lib/musickit"

    export let song: Songs

    $: size = 350

    $: artwork = song.attributes!.artwork.url.replace("{w}", size.toString()).replace("{h}", size.toString())
    $: songName = song.attributes!.name
    $: author = song.attributes!.artistName

    async function onClick() {
        const music = MusicKit.getInstance()
        await music.setQueue({ song: song.id, startPlaying: true })
    }
</script>

<button class="card" on:mouseup={onClick}>
    <img src={artwork} alt={songName} />
    <div class="spacer" />
    <h1 class="subtitle3 title">{songName}</h1>
    <h2 class="body2 cap">{author}</h2>
</button>

<style>
    button {
        all: unset;
    }

    .spacer {
        height: 0.23rem;
    }

    .card {
        width: clamp(8.5rem, 15vw, 20rem);
    }

    img {
        border-radius: 0.8rem;
        border: 1px solid var(--gray6);
        width: 100%;

        will-change: transform;

        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* if card is hover, transform the img inside card */
    .card:is(:hover) > img {
        transform: scale(1.03);
    }

    /* if card is active, mouse down, transform the img inside card */
    .card:is(:active) > img {
        transform: scale(0.97);
    }

    .cap {
        color: var(--gray11);
    }

    .title {
        /* oneline, ellipsis */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
