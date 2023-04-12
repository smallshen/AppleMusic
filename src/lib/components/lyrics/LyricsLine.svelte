<script lang="ts">
    export let duration: number
    export let text: string
    export let id: string

    let dom: HTMLElement
</script>

<div bind:this={dom} {id}>
    <h1 class="subtitle1 line">{text}</h1>
</div>

<style>
    div {
        filter: blur(3px);

        transition: filter 0.5s, color 0.5s;
    }

    :global(.lyrics_line_current) {
        filter: blur(0px) !important;
        color: var(--gray12) !important;
    }
</style>
