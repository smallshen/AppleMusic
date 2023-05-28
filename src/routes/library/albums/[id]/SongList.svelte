<script lang="ts">
    import type { AlbumInfo } from "./loadLibraryAlbum"

    export let albumInfo: AlbumInfo
    export let showFullAlbum: boolean

    function formatMilliseconds(ms: number) {
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
    }

    function playSong(id: string) {
        const music = MusicKit.getInstance()

        music.setQueue({
            song: id,
            startPlaying: true
        })
    }
</script>

<ol>
    {#each albumInfo.songs as song}
        {#if showFullAlbum || (!showFullAlbum && song.inLibrary)}
            <li class="body1">
                <button on:click={() => playSong(song.id)}>
                    <p class="number body2">{song.trackNumber}</p>
                    <h1 class="name">{song.name}</h1>
                    <p class="duration">{formatMilliseconds(song.duration)}</p>
                </button>
            </li>
            <div class="divider" />
        {/if}
    {/each}
</ol>

<style>
    ol {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--gray6);
        border-bottom: 1px solid var(--gray6);
    }

    .divider {
        height: 1px;
        width: calc(100% - 35px);
        background-color: var(--gray6);
        align-self: flex-end;
    }

    .divider:last-child {
        display: none;
    }

    li {
        margin-left: -2rem;
        margin-right: -2rem;
        height: 2.8rem;
    }

    button {
        all: unset;

        padding-left: 2rem;
        padding-right: 2rem;

        box-sizing: border-box;

        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    button:is(:hover, :focus) {
        background-color: var(--gray4);
    }

    button:active {
        background-color: var(--gray5);
    }

    .number {
        width: 35px;
        color: var(--gray11);
    }

    .duration {
        color: var(--gray11);
    }

    .name {
        flex-grow: 1;
    }
</style>
