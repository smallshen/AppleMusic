export async function getAppleMusicAMPToken(): Promise<string> {
    return await fetch("https://raw.githubusercontent.com/lujjjh/LitoMusic/main/token.json")
        .then((res) => res.json())
        .then((data) => data.developerToken)
}

export const appleAMPToken = await getAppleMusicAMPToken()
