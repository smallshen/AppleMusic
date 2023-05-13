<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import Visibility from "./Visibility.svelte"
    0
    let elementScroll: HTMLElement
    const dispatch = createEventDispatcher()
    let isLoadMore = false
    export let hasMore: boolean

    let percent: number

    $: {
        if (percent > 10 && !isLoadMore && hasMore) {
            isLoadMore = true
            dispatch("loadMore")
        }
    }
</script>

<div class="item">
    <Visibility steps={100} bind:percent>
        <div bind:this={elementScroll} />
    </Visibility>
</div>

<style>
    .item {
        width: 100%;
    }

    div {
        width: 100%;
        height: 200px;
    }
</style>
