<script lang="ts">
    import type { Songs } from "$lib/musickit"
    import ArtworkCard from "./ArtworkCard.svelte"

    export let song: Songs

    $: artwork = song.attributes!.artwork
    $: title = song.attributes!.name
    $: subtitle = song.attributes!.artistName

    async function onClick() {
        const music = MusicKit.getInstance()
        await music.setQueue({ song: song.id, startPlaying: true })
    }
</script>

<ArtworkCard on:click={onClick} {artwork} {title} {subtitle} />
