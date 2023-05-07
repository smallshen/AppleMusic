<li class="search">
    <!-- <svg class="icon" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
        />
    </svg> -->
    <input class="search-box" type="text" placeholder="🔍 Search..." />
</li>

<style>
    li {
        all: unset;
        display: block;
    }

    .search {
        height: 50px;
        width: 100%;

        padding: 10px;

        box-sizing: border-box;

        display: flex;
        align-items: center;
        flex-direction: row;
    }

    .icon {
        width: 35px;
        height: 35px;
    }

    .search-box {
        all: unset;
        display: block;
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--gray7);
        height: 30px;
        background-color: var(--gray4);
        padding: 0 10px;

        transition: border 0.2s ease-in-out;
    }

    .search-box:focus {
        border: 1px solid rgb(var(--theme-color));
    }
</style>
