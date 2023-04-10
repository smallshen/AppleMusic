<script lang="ts">
    import { SvelteToast } from "@zerodevx/svelte-toast"
    import type { SvelteToastOptions } from "@zerodevx/svelte-toast/stores"

    const options: SvelteToastOptions = {}
</script>

<div class="toast">
    <SvelteToast {options} />
</div>

<style>
    .toast {
        --toastBackground: var(--gray5);
        --toastBorder: 1px solid var(--gray8);
        --toastWidth: max-content;
        --toastBorderRadius: 0.4rem;
    }

    :global(._toastContainer) {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>
