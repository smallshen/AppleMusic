<script lang="ts">
    import type { Artwork } from "$lib/musickit"

    export let artwork: Artwork
    export let title: string
    export let subtitle: string

    const size = 350
    $: artworkUrl = artwork.url.replace("{w}", size.toString()).replace("{h}", size.toString())
</script>

<button class="card" on:click>
    <div class="img-holder">
        <img src={artworkUrl} class="artwork" loading="lazy" alt="{title} - {subtitle}" />
    </div>
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
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        align-items: start;
    }

    .img-holder {
        width: clamp(8.5rem, 15vw, 20rem);
        height: clamp(8.5rem, 15vw, 20rem);

        align-self: center;

        will-change: transform;

        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        display: grid;
        place-items: center;
    }

    .artwork {
        border-radius: 0.8rem;
        border: 1px solid var(--gray6);

        max-height: clamp(8.5rem, 15vw, 20rem);
        max-width: clamp(8.5rem, 15vw, 20rem);

        margin-top: auto;
        margin-bottom: auto;

        object-fit: contain;
    }

    /* if card is hover, transform the img inside card */
    .card:is(:hover, :focus) > .img-holder {
        transform: scale(1.03);
    }

    /* if card is active, mouse down, transform the img inside card */
    .card:is(:active) > .img-holder {
        transform: scale(0.97);
    }

    .cap {
        color: var(--gray11);
    }

    .title {
        /* oneline, ellipsis */
        display: block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cap {
        display: block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
