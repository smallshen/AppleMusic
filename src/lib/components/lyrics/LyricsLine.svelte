<script lang="ts">
    export let duration: number
    export let text: string

    let dom: HTMLElement
</script>

<div bind:this={dom}>
    <h1 class="subtitle1 line">{text}</h1>
</div>

<style>
    div {
        filter: blur(3px);

        transition: filter 0.5s, color 0.5s;

        will-change: filter, color;
    }

    :global(.lyrics_line_current) div {
        filter: blur(0px);
        color: var(--gray12);
    }

    :global(.scroll-override) div {
        filter: blur(0px) !important;
        transition: filter 0.2s, color 0.2s !important;
    }
</style>
