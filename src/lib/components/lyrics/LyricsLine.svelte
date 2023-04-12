<script lang="ts">
    export let duration: number
    export let text: string
</script>

<div>
    <h1 class="subtitle1 line">{text}</h1>
</div>

<style>
    div {
        filter: blur(3px);
    }
</style>
