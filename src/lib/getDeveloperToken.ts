import { ResponseType, fetch } from "@tauri-apps/api/http"

const idRegex = /<script\s+type="text\/javascript"\s+src="\/app\.([a-z0-9]+)\.js">/

// i feel bad and happy
const tokenRegex = /MusicKit\.configure\(\{developerToken:"([^"]*)"/

export default async function getDeveloperToken(): Promise<string> {
    const musiPage = (await fetch("https://musi.sh/browse")).data as string

    const idMatch = musiPage.match(idRegex)
    if (!idMatch) {
        throw new Error("Could not find id")
    }

    const id = idMatch[1]

    const page = (
        await fetch(`https://musi.sh/app.${id}.js`, {
            method: "GET",
            responseType: ResponseType.Text
        })
    ).data as string

    const tokenMatch = page.match(tokenRegex)

    if (!tokenMatch) {
        throw new Error("Could not find token")
    }

    return tokenMatch[1]
}
