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
    .music {
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    .img {
        width: 50px;
        height: 50px;

        border-radius: 6px;
        box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
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
        height: 100%;
        backdrop-filter: blur(25px);

        background-color: hsla(0, 0%, 78%, 0.5);

        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;

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
