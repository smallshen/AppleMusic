<script lang="ts">
    import { onMount } from "svelte"

    export let top = 0
    export let bottom = 0
    export let left = 0
    export let right = 0

    export let steps = 100

    let element: HTMLElement
    export let percent: number = 0
    let observer: IntersectionObserver
    let unobserve = () => {}
    let intersectionObserverSupport = false

    function intersectPercent(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            percent = Math.round(Math.ceil(entry.intersectionRatio * 100))
        })
    }

    function stepsToThreshold(steps: number) {
        return [...Array(steps).keys()].map((n) => n / steps)
    }

    onMount(() => {
        intersectionObserverSupport =
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window &&
            "intersectionRatio" in window.IntersectionObserverEntry.prototype

        const options = {
            rootMargin: `${top}px ${right}px ${bottom}px ${left}px`,
            threshold: stepsToThreshold(steps)
        }

        if (intersectionObserverSupport) {
            observer = new IntersectionObserver(intersectPercent, options)
            observer.observe(element)
            unobserve = () => observer.unobserve(element)
        }

        return unobserve
    })
</script>

<div bind:this={element}>
    <slot {percent} {unobserve} {intersectionObserverSupport} />
</div>
