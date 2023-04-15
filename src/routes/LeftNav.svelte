<script lang="ts">
    import { page } from "$app/stores"
    import SearchBox from "./SearchBox.svelte"

    $: currentPath = function currentPath(id: string) {
        return $page.route.id == id ? "active" : ""
    }
</script>

<ol class="content">
    <SearchBox />

    <section class="library">
        <li>
            <a class="link {currentPath('/')}" href="/">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                        d="M12 20c4.376 0 8-3.631 8-8 0-4.376-3.631-8-8.008-8C7.624 4 4 7.624 4 12c0 4.369 3.631 8 8 8zm0-1.333A6.634 6.634 0 0 1 5.341 12a6.628 6.628 0 0 1 6.651-6.667A6.653 6.653 0 0 1 18.667 12 6.636 6.636 0 0 1 12 18.667zm-.008-5.82a.54.54 0 0 0 .55-.549V7.012a.54.54 0 0 0-.55-.541.532.532 0 0 0-.541.54v4.746H7.898a.534.534 0 0 0-.549.541c0 .314.235.55.549.55h4.094z"
                    />
                </svg>
                <p class="body1">最近</p>
            </a>
        </li>

        <li>
            <a class="link {currentPath('/library/albums')}" href="/library/albums">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                        d="M15.477 3.937c-.044-.61-.396-.937-1.07-.937H9.431c-.675 0-1.027.327-1.07.937h7.115zm1.24 2.013c-.11-.654-.425-1.025-1.159-1.025H8.222c-.741 0-1.057.37-1.167 1.025h9.662zm-.3 14.05c1.313 0 2.083-.756 2.083-2.252v-8.37c0-1.496-.778-2.252-2.304-2.252H7.804C6.27 7.126 5.5 7.875 5.5 9.38v8.369C5.5 19.244 6.27 20 7.804 20h8.612zm-.023-1.17H7.818c-.733 0-1.137-.392-1.137-1.148V9.437c0-.756.404-1.14 1.137-1.14h8.356c.727 0 1.145.384 1.145 1.14v8.245c0 .756-.418 1.148-.925 1.148z"
                    />
                </svg>
                <p class="body1">专辑</p>
            </a>
        </li>
    </section>
</ol>

<style>
    svg {
        fill: rgb(var(--theme-color));
    }

    ol,
    li,
    a {
        all: unset;
        display: block;
    }

    :global(:root) {
        --left-nav-width: 220px;
    }

    .content {
        height: 100vh;

        background-color: var(--gray4);
        width: calc(var(--left-nav-width) - 2px);
        overflow: hidden;

        border-right: 2px solid var(--gray6);

        position: sticky;
        top: 0;
    }

    .library {
        margin-top: 20px;
    }

    .link {
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        font-family: var(--font-regular);

        margin: 0px 10px;
        padding: 5px 10px;
        box-sizing: border-box;
        border-radius: 8px;

        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .active {
        background-color: var(--gray6);
        pointer-events: none;
    }
</style>
