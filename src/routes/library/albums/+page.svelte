<script lang="ts">
    import ArtworkCard from "$lib/components/ArtworkCard.svelte"
    import InfiniteScroll from "$lib/components/InfiniteScroll.svelte"
    import type { PageData } from "./$types"
    import { loadLibrary, type LibraryAlbumsData } from "./loadLibrary"

    export let data: PageData

    let albums: LibraryAlbumsData = data.albums

    let albumList = [...albums.data]

    let libraryAlbums = data.albums.resources["library-albums"]!
    let libraryArtists = data.albums.resources["library-artists"]!
    let albumResources = data.albums.resources.albums!
    let artistResources = data.albums.resources.artists!

    const music = MusicKit.getInstance()

    function onClick(album: any) {
        music.setQueue({ album: album.id, startPlaying: true })
    }

    function albumInfo(albumId: string) {
        const album = libraryAlbums[albumId]
        const artwork = album.attributes.artwork

        const albumName = album.attributes.name
        const albumCatalogId = album.relationships.catalog.data[0]?.id

        const artist = libraryArtists[album.relationships.artists.data[0].id]
        const artistName = artist.attributes.name
        const firstArtistId = artist.relationships.catalog.data[0]?.id

        const title = albumCatalogId ? albumResources[albumCatalogId].attributes.name : albumName
        let subtitle = firstArtistId ? artistResources[firstArtistId].attributes.name : artistName

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
    <ol>
        {#each albumList as album}
            {@const { artwork, title, subtitle } = albumInfo(album.id)}

            <li>
                <ArtworkCard on:click={() => onClick(album)} {artwork} {title} {subtitle} />
            </li>
        {/each}

        {#key albums.page}
            <InfiniteScroll
                hasMore={albums.next ? true : false}
                on:loadMore={async () => {
                    const newAlbums = await loadLibrary(albums.page + 1)

                    albumList = [...albumList, ...newAlbums.data]
                    libraryAlbums = { ...libraryAlbums, ...newAlbums.resources["library-albums"] }
                    libraryArtists = { ...libraryArtists, ...newAlbums.resources["library-artists"] }
                    albumResources = { ...albumResources, ...newAlbums.resources.albums }
                    artistResources = { ...artistResources, ...newAlbums.resources.artists }

                    albums = newAlbums
                }}
            />
        {/key}
    </ol>
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

    ol {
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
