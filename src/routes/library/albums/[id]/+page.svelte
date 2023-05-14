<script lang="ts">
    import { page } from "$app/stores"
    import type { PageData } from "./$types"
    import SongList from "./SongList.svelte"

    export let data: PageData

    const music = MusicKit.getInstance()

    $: artwork = data.albumInfo.artwork
    $: artworkURL = artwork.url.replace("{w}", artwork.width.toString()).replace("{h}", artwork.height.toString())

    $: localeDate = new Date(data.albumInfo.releaseDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    function playAlbum(shuffle = false) {
        music.shuffleMode = shuffle ? 1 : 0
        music.setQueue({
            album: $page.params.id,
            startPlaying: true
        })
    }
</script>

<main>
    <a class="back-btn" href="/library/albums">
        <svg width="27" height="27" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
            />
        </svg>
    </a>

    <div class="info">
        <div class="image">
            <div class="artwork">
                <img class="dropshadow-img" src={artworkURL} alt="Album Artwork" />
                <img class="artwork-img" src={artworkURL} alt={data.albumInfo.name} />
            </div>
        </div>
        <div class="info-text">
            <div class="info-text-top">
                <h1 class="subtitle2">{data.albumInfo.name}</h1>
                <h2 class="subtitle2">{data.albumInfo.artist}</h2>
                <p class="body2">{data.albumInfo.genre} · {data.albumInfo.repeaseYear}年</p>
            </div>

            <div class="controls">
                <button class="play-btn subtitle3" on:click={() => playAlbum(false)}>
                    <svg height="16" viewBox="0 0 16 16" width="16">
                        <path
                            d="m4.4 15.14 10.386-6.096c.842-.459.794-1.64 0-2.097L4.401.85c-.87-.53-2-.12-2 .82v12.625c0 .966 1.06 1.4 2 .844z"
                        />
                    </svg>
                    播放
                </button>

                <button class="play-btn subtitle3" on:click={() => playAlbum(true)}>
                    <svg height="16" viewBox="0 0 16 16" width="16">
                        <path
                            d="m4.4 15.14 10.386-6.096c.842-.459.794-1.64 0-2.097L4.401.85c-.87-.53-2-.12-2 .82v12.625c0 .966 1.06 1.4 2 .844z"
                        />
                    </svg>
                    随机播放
                </button>
            </div>
        </div>
    </div>
    <div class="songs">
        <SongList albumInfo={data.albumInfo} />
    </div>
    <div class="footer-info">
        <p class="body1">{localeDate}</p>
        <p class="body1">{data.albumInfo.songs.length}首歌曲，{data.albumInfo.totalDurationInMinutes}分钟</p>
        <p class="body1">{data.albumInfo.copyright}</p>
    </div>
</main>

<style>
    a {
        text-decoration: none;
        color: rgb(var(--theme-color));
        position: relative;
        width: fit-content;
        border-radius: 8px;

        display: grid;
        place-items: center;
    }

    a:hover {
        background-color: var(--gray4);
    }

    a:active {
        background-color: var(--gray5);
    }

    main {
        height: fit-content;
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }

    /* main's child, not first and second */
    main > *:not(:nth-child(1)):not(:nth-child(2)) {
        margin-top: 3rem;
    }

    .info {
        margin-top: 0.8rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 2rem;
        height: 270px;
        box-sizing: border-box;
    }

    .image {
        position: relative;
        width: 270px;
        height: 270px;
    }

    .artwork {
        display: block;
        position: relative;

        max-width: 270px;
        max-height: 270px;
    }

    .artwork-img {
        position: absolute;
        max-width: 270px;
        max-height: 270px;

        border-radius: 12px;
        border: 1px solid var(--gray6);
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }

    .dropshadow-img {
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(0.88);
        transform-origin: bottom center;

        filter: blur(20px) saturate(2);

        max-width: 270px;
        max-height: 270px;
    }

    .info-text {
        height: 100%;
        flex-grow: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: var(--font-medium);
        gap: 1rem;
    }

    .info-text h2 {
        color: rgb(var(--theme-color));
    }

    .info-text p {
        color: var(--gray11);
    }

    .controls {
        display: flex;
        width: 100%;
        flex-direction: row;
        gap: 1rem;
    }

    .info-text-top {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .play-btn {
        border: unset;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        width: 100%;
        height: 40px;
        border-radius: 8px;
        background-color: var(--gray3);
        color: var(--red10);
        fill: var(--red10);
        font-family: var(--font-medium);
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .play-btn:hover {
        background-color: var(--gray4);
    }

    .play-btn:active {
        background-color: var(--gray5);
    }

    .footer-info {
        color: var(--gray11);
        display: flex;
        flex-direction: column;
    }

    @media screen and (max-width: 1024px) {
        .info {
            flex-direction: column;
            height: fit-content;
            align-items: center;
        }

        .info-text {
            width: 270px;
            align-items: center;
        }
    }
</style>
