<script lang="ts">
    import SingleSongCard from "$lib/components/SingleSongCard.svelte"
    import type { Songs } from "$lib/musickit"
    import { getContext } from "svelte"
    import type { PageData } from "./$types"
    import { wrapGrid } from "animate-css-grid"
    import type { Writable } from "svelte/store"

    export let data: PageData

    $: recentSongs = data.recentSongs.data as Songs[]

    let songsGrid: HTMLElement
</script>

<main>
    <h1 class="subtitle1 title">近期歌曲</h1>
    <section bind:this={songsGrid}>
        {#each recentSongs as song}
            <div>
                <SingleSongCard {song} />
            </div>
        {/each}
    </section>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        margin-left: 3rem;
        margin-right: 3rem;
    }

    .title {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    section {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, clamp(8.5rem, 15vw, 20rem));
        grid-gap: 1rem;

        justify-content: space-between;
    }
</style>
