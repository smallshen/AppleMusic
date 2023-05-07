<script lang="ts">
    import ArtworkCard from "$lib/components/ArtworkCard.svelte"
    import { add_attribute } from "svelte/internal"
    import type { PageData } from "./$types"

    export let data: PageData

    $: ({ albums } = data)

    $: albumList = albums.data

    const music = MusicKit.getInstance()

    function onClick(album: any) {
        music.setQueue({ album: album.id, startPlaying: true })
    }

    function albumInfo(albumId: string) {
        const libraryAlbums = data.albums.resources["library-albums"]!
        const libraryArtists = data.albums.resources["library-artists"]!

        const album = libraryAlbums[albumId]
        const artwork = album.attributes.artwork

        const albumName = album.attributes.name
        const albumCatalogId = album.relationships.catalog.data[0]?.id

        const artist = libraryArtists[album.relationships.artists.data[0].id]
        const artistName = artist.attributes.name
        const firstArtistId = artist.relationships.catalog.data[0]?.id

        const title = albumCatalogId ? data.albums.resources.albums[albumCatalogId].attributes.name : albumName
        let subtitle = firstArtistId ? data.albums.resources.artists[firstArtistId].attributes.name : artistName

        const allInfo = {
            artwork,
            title,
            subtitle: subtitle
        }

        return allInfo
    }
</script>

<main>
    <h1 class="subtitle1 title">专辑</h1>
    <section>
        {#each albumList as album}
            {@const { artwork, title, subtitle } = albumInfo(album.id)}

            <!-- <a href="/library/albums/{album.id}"> -->
            <ArtworkCard on:click={() => onClick(album)} {artwork} {title} {subtitle} />
            <!-- </a> -->
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

    a {
        all: unset;
    }
</style>
