import getDeveloperToken from "$lib/getDeveloperToken"

await import("https://js-cdn.music.apple.com/musickit/v3/musickit.js")

console.log(MusicKit)

const music = await MusicKit.configure({
    developerToken: await getDeveloperToken(),
    app: {
        name: "Apple Music",
        build: "1.0.0"
    }
})

try {
    await music.authorize()
} catch (error) {
    console.error(error)
}
