import getDeveloperToken from "$lib/getDeveloperToken"


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
