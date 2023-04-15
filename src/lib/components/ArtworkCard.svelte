<script lang="ts">
    import type { Artwork } from "$lib/musickit"

    export let artwork: Artwork
    export let title: string
    export let subtitle: string

    const size = 350
    $: artworkUrl = artwork.url.replace("{w}", size.toString()).replace("{h}", size.toString())
</script>

<button class="card" on:click>
    <img src={artworkUrl} loading="lazy" alt="{title} - {subtitle}" />
    <div class="spacer" />
    <h1 class="subtitle3 title">{title}</h1>
    <h2 class="body2 cap">{subtitle}</h2>
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
        height: clamp(8.5rem, 15vw, 20rem);

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

    .cap {
        /* oneline, ellipsis */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
