export interface MediaItem<T> {
    id: string
    type: string
    href: string
    attributes?: T
}
