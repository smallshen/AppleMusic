<script lang="ts">
    import PlayerControl from "$lib/components/controls/PlayerControl.svelte"
    import type { Songs } from "$lib/musickit"

    export let songs: Songs | null

    function updateInfo(song: Songs | null) {
        if (song == null) {
            return {
                artwork: "",
                songName: "",
                author: ""
            }
        }

        const width = 250
        const height = 250

        const artwork = song.attributes!.artwork.url.replace("{w}", width.toString()).replace("{h}", height.toString())
        const songName = song.attributes!.name
        const author = song.attributes!.artistName

        return {
            artwork,
            songName,
            author
        }
    }

    $: ({ artwork, songName, author } = updateInfo(songs))
</script>

<section class="bar">
    <div class="music">
        {#if songs == null}
            <div class="img" style="background-color: var(--gray9);" />
        {:else}
            <img class="img" src={artwork} alt={songName} />
            <section class="info">
                <h1 class="subtitle3 title">{songName}</h1>
                <h2 class="body2 cap">{author}</h2>
            </section>
        {/if}
    </div>
    <PlayerControl />
</section>

<style>
    :global(:root) {
        --bottombar-height: 4.2rem;
    }

    .music {
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    .img {
        width: 50px;
        height: 50px;

        border-radius: 6px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .info {
        margin-left: 1rem;
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

    .bar {
        border-top: 1px solid var(--gray8);

        height: calc(var(--bottombar-height) - 1px);

        backdrop-filter: blur(20px);
        background-color: hsla(0, 0%, 78%, 0.8);

        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;

        width: 100%;
        box-sizing: border-box;
        padding: 0 3rem;

        transition: background-color 0.2s ease-in-out;
    }

    :global(.dark-theme) .bar {
        background-color: hsla(0, 0%, 19%, 0.7);
    }

    .bar:hover {
        background-color: hsla(0, 0%, 78%, 0.9);
    }

    :global(.dark-theme) .bar:hover {
        background-color: hsla(0, 0%, 19%, 0.8);
    }
</style>
