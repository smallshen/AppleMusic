/**
 * IMPORTANT NOTE:
 *
 * This file is licensed only for the use of Apple developers in providing MusicKit Web Services,
 * and is subject to the Apple Media Services Terms and Conditions and the Apple Developer Program
 * License Agreement. You may not copy, modify, re-host, or create derivative works of this file or the
 * accompanying Documentation, or any part thereof, including any updates, without Apple's written consent.
 *
 * ACKNOWLEDGEMENTS:
 * https://js-cdn.music.apple.com/musickit/v1/acknowledgements.txt
 */

!(function (e, n) {
    "object" == typeof exports && "undefined" != typeof module
        ? n(exports)
        : "function" == typeof define && define.amd
        ? define(["exports"], n)
        : n(((e = "undefined" != typeof globalThis ? globalThis : e || self).MusicKit = {}))
})(this, function (e) {
    "use strict"
    var n = void 0 !== typeof self ? self : this
    function formatArtworkURL(e, n, d) {
        return (
            (n = n || e.height || 100),
            (d = d || e.width || 100),
            window.devicePixelRatio >= 1.5 && ((d *= 2), (n *= 2)),
            e.url
                .replace("{h}", "" + n)
                .replace("{w}", "" + d)
                .replace("{f}", "jpeg")
        )
    }
    const K = () => {},
        asAsync = (e) => {
            e.then(K, K)
        }
    function deprecationWarning(e, n = {}) {
        var d
        const h = null !== (d = n.message) && void 0 !== d ? d : e + " has been deprecated",
            p = []
        n.since && p.push("since: " + n.since),
            n.until && p.push("until: " + n.until),
            console.warn("Deprecation Warning: " + h + (p.length > 0 ? ` (${p.join(", ")})` : ""))
    }
    const d =
        /\/([a-z]{2})\/(album|artist|episode|movie|music-video|playlist|podcast|post|season|show|song|station)\/(?:[^\/]*\/)?(?:id)?(\d+|[a-z]{2}\.[a-z0-9\-]+|umc.cmc.[a-zA-Z0-9]+)(?:.*(?:[\?|\&]i=(\d+)).*)?.*$/i
    function formattedMediaURL(e) {
        if (!d.test(e)) throw new TypeError("Invalid Media URL: " + e)
        let [, n, h, p, y] = e.match(d)
        return (
            "music-video" === h && (h = "musicVideo"),
            -1 !== ["album", "playlist"].indexOf(h) && y
                ? ((h = "song"), (p = y))
                : "podcast" === h && y && ((h = "episode"), (p = y)),
            { storefrontId: n, kind: h, contentId: p, isUTS: !!p && p.startsWith("umc.") }
        )
    }
    const h = /^http(?:s)?\:\/\/(?:itunes|(embed\.)?(music|podcasts|tv))\.apple\.com/i,
        p = [
            "allow-forms",
            "allow-popups",
            "allow-same-origin",
            "allow-scripts",
            "allow-storage-access-by-user-activation",
            "allow-top-navigation-by-user-activation"
        ],
        y = ["autoplay *", "encrypted-media *", "fullscreen *", "clipboard-write"]
    function isLive(e) {
        var n
        return !!(null == e || null === (n = e.attributes) || void 0 === n ? void 0 : n.isLive)
    }
    function isStream$1(e) {
        var n, d
        return (
            "stream" ===
            (null == e || null === (n = e.attributes) || void 0 === n || null === (d = n.playParams) || void 0 === d
                ? void 0
                : d.format)
        )
    }
    function isLiveRadioStation(e) {
        return isLive(e) && isStream$1(e)
    }
    function isLiveRadioKind(e, n) {
        var d
        return isLiveRadioStation(e) && (null === (d = e.attributes) || void 0 === d ? void 0 : d.mediaKind) === n
    }
    function isBroadcastRadio(e) {
        return (
            isLive(e) &&
            isStream$1(e) &&
            void 0 !== e.attributes.stationProviderName &&
            "Shoutcast" === e.attributes.streamingRadioSubType
        )
    }
    function getFilterFromFlags(e) {
        const n = e.includes("radio-live"),
            d = e.includes("radio-aod"),
            h = e.includes("radio-broadcast")
        return (e) =>
            (!n || (n && !isLiveRadioStation(e))) &&
            (!d ||
                (d &&
                    !(function (e) {
                        return !isLive(e) && isStream$1(e) && "Episode" === e.attributes.streamingRadioSubType
                    })(e))) &&
            (!h || (h && !isBroadcastRadio(e)))
    }
    const m = {
        album: "albums",
        albums: "albums",
        artist: "artists",
        artists: "artists",
        song: "songs",
        songs: "songs"
    }
    function normalizeContentType(e) {
        let n = m[e]
        return (
            n ||
            ((n = e.replace(/_|[A-Z]/g, (e, n) => ("_" === e ? "-" : ((e = e.toLowerCase()), 0 === n ? e : "-" + e)))),
            e.endsWith("y") ? (n = n.substring(0, n.length - 1) + "ies") : n.endsWith("s") || (n += "s"),
            (m[e] = n),
            n)
        )
    }
    const g = {
            400: "REQUEST_ERROR",
            401: "UNAUTHORIZED_ERROR",
            403: "ACCESS_DENIED",
            404: "NOT_FOUND",
            405: "NOT_FOUND",
            413: "REQUEST_ERROR",
            414: "REQUEST_ERROR",
            429: "QUOTA_EXCEEDED",
            500: "SERVER_ERROR",
            501: "NOT_FOUND",
            503: "SERVICE_UNAVAILABLE"
        },
        b = {
            "-1004": "DEVICE_LIMIT",
            "-1017": "GEO_BLOCK",
            1010: g[404],
            2002: "AUTHORIZATION_ERROR",
            2034: "TOKEN_EXPIRED",
            3059: "DEVICE_LIMIT",
            3063: "SUBSCRIPTION_ERROR",
            3076: "CONTENT_UNAVAILABLE",
            3082: "CONTENT_RESTRICTED",
            3084: "STREAM_UPSELL",
            5002: g[500],
            180202: "PLAYREADY_CBC_ENCRYPTION_ERROR",
            190121: "WIDEVINE_CDM_EXPIRED"
        },
        _ = new Set([
            "CONTENT_EQUIVALENT",
            "CONTENT_UNAVAILABLE",
            "CONTENT_UNSUPPORTED",
            "SERVER_ERROR",
            "SUBSCRIPTION_ERROR",
            "UNSUPPORTED_ERROR",
            "USER_INTERACTION_REQUIRED"
        ])
    class MKError extends Error {
        static playActivityError(e) {
            return new this("PLAY_ACTIVITY", e)
        }
        static parseError(e) {
            return new this("PARSE_ERROR", e)
        }
        static responseError(e) {
            const { status: n, statusText: d } = e,
                h = new this(g[n] || "NETWORK_ERROR", d || "" + n)
            return (h.data = e), h
        }
        static serverError(e, n = "UNKNOWN_ERROR") {
            let { status: d, dialog: h, failureType: p, customerMessage: y, errorMessage: m, message: g } = e
            h && ((g = h.message || h.customerMessage || h.errorMessage), (h.message = g))
            const _ = b[p] || b[d] || n,
                T = new this(_, g || y || m)
            return (
                "STREAM_UPSELL" === _ &&
                    h &&
                    h.okButtonAction &&
                    h.okButtonAction.url &&
                    (h.okButtonAction.url = h.okButtonAction.url.replace(
                        /\&(?:challenge|key-system|uri|user-initiated)=[^\&]+/gim,
                        ""
                    )),
                (T.dialog = h),
                T
            )
        }
        static internalError(e) {
            return new this(MKError.INTERNAL_ERROR, e)
        }
        constructor(e, n) {
            super(),
                (this.errorCode = "UNKNOWN_ERROR"),
                e && _.has(e)
                    ? ((this.name = this.errorCode = e), (this.message = this.description = n || e))
                    : n || "string" != typeof e
                    ? ((this.name = this.errorCode = e || "UNKNOWN_ERROR"), n && (this.message = this.description = n))
                    : ((this.name = this.errorCode = "UNKNOWN_ERROR"), (this.message = this.description = e)),
                Error.captureStackTrace && Error.captureStackTrace(this, MKError)
        }
    }
    ;(MKError.ACCESS_DENIED = g[403]),
        (MKError.AGE_VERIFICATION = "AGE_VERIFICATION"),
        (MKError.AUTHORIZATION_ERROR = b[2002]),
        (MKError.CONFIGURATION_ERROR = "CONFIGURATION_ERROR"),
        (MKError.CONTENT_EQUIVALENT = "CONTENT_EQUIVALENT"),
        (MKError.CONTENT_RESTRICTED = b[3082]),
        (MKError.CONTENT_UNAVAILABLE = b[3076]),
        (MKError.CONTENT_UNSUPPORTED = "CONTENT_UNSUPPORTED"),
        (MKError.DEVICE_LIMIT = b[3059]),
        (MKError.GEO_BLOCK = b[-1017]),
        (MKError.INVALID_ARGUMENTS = "INVALID_ARGUMENTS"),
        (MKError.PLAYREADY_CBC_ENCRYPTION_ERROR = "PLAYREADY_CBC_ENCRYPTION_ERROR"),
        (MKError.MEDIA_CERTIFICATE = "MEDIA_CERTIFICATE"),
        (MKError.MEDIA_DESCRIPTOR = "MEDIA_DESCRIPTOR"),
        (MKError.MEDIA_LICENSE = "MEDIA_LICENSE"),
        (MKError.MEDIA_KEY = "MEDIA_KEY"),
        (MKError.MEDIA_PLAYBACK = "MEDIA_PLAYBACK"),
        (MKError.MEDIA_SESSION = "MEDIA_SESSION"),
        (MKError.NETWORK_ERROR = "NETWORK_ERROR"),
        (MKError.NOT_FOUND = b[1010]),
        (MKError.PARSE_ERROR = "PARSE_ERROR"),
        (MKError.PLAY_ACTIVITY = "PLAY_ACTIVITY"),
        (MKError.QUOTA_EXCEEDED = g[429]),
        (MKError.REQUEST_ERROR = g[400]),
        (MKError.SERVER_ERROR = b[5002]),
        (MKError.SERVICE_UNAVAILABLE = g[503]),
        (MKError.STREAM_UPSELL = b[3084]),
        (MKError.SUBSCRIPTION_ERROR = b[3063]),
        (MKError.TOKEN_EXPIRED = b[2034]),
        (MKError.UNAUTHORIZED_ERROR = g[401]),
        (MKError.UNKNOWN_ERROR = "UNKNOWN_ERROR"),
        (MKError.UNSUPPORTED_ERROR = "UNSUPPORTED_ERROR"),
        (MKError.USER_INTERACTION_REQUIRED = "USER_INTERACTION_REQUIRED"),
        (MKError.INTERNAL_ERROR = "INTERNAL_ERROR"),
        (MKError.OUTPUT_RESTRICTED = "OUTPUT_RESTRICTED"),
        (MKError.WIDEVINE_CDM_EXPIRED = "WIDEVINE_CDM_EXPIRED")
    class GenericStorage {
        get data() {
            return this._data
        }
        set data(e) {
            this._data = e
        }
        get length() {
            return this.keys.length
        }
        get keys() {
            return Object.keys(this.data)
        }
        getItem(e) {
            return this.data[e] || null
        }
        setItem(e, n) {
            this.data[e] = n
        }
        removeItem(e) {
            delete this.data[e]
        }
        clear() {
            this.keys.forEach((e) => this.removeItem(e))
        }
        key(e) {
            return this.keys[e] || null
        }
        constructor(e = {}) {
            this.data = e
        }
    }
    function getCookie(e = "", n = document.cookie) {
        const d = n.match(new RegExp(`(?:^|;\\s*)${e}=([^;]*)`))
        if (d) return d[1]
    }
    function setCookie(e, n, d = "", h = 14, p, y) {
        const m = new Date()
        p = null != p ? p : window
        const g =
            (y = null != y ? y : /\./.test(p.location.hostname) ? p.location.hostname : "").length > 0
                ? `domain=${y}; `
                : ""
        m.setTime(m.getTime() + 24 * h * 60 * 60 * 1e3)
        let b = ""
        "https:" === p.location.protocol && (b = "; secure"),
            (p.document.cookie = `${e}=${n}; expires=${m.toUTCString()}; ${g}path=${d}${b}`)
    }
    function removeCookie(e, n, d) {
        setCookie(e, "", "/", 0, n, d)
    }
    function hasSessionStorage() {
        let e = !1
        try {
            e = "undefined" != typeof sessionStorage
        } catch (Mr) {}
        return e
    }
    function getSessionStorage() {
        let e
        return hasSessionStorage() && (e = sessionStorage), e
    }
    function hasLocalStorage() {
        let e = !1
        try {
            e = "undefined" != typeof localStorage
        } catch (Mr) {}
        return e
    }
    function getLocalStorage() {
        let e
        return hasLocalStorage() && (e = localStorage), e
    }
    class Notifications {
        get shouldStorageDispatch() {
            return "undefined" != typeof window && hasSessionStorage() && this.dispatchNamespace
        }
        addEventListener(e, n) {
            Array.isArray(this._eventRegistry[e]) && this._eventRegistry[e].push(n)
        }
        dispatchEvent(e, n) {
            Array.isArray(this._eventRegistry[e]) && this._eventRegistry[e].forEach((e) => e(n))
        }
        dispatchDistributedEvent(e, n) {
            if ((this.dispatchEvent(e, n), this.shouldStorageDispatch)) {
                var d
                const h = `${this.dispatchNamespace}:${e}`
                null === (d = getSessionStorage()) || void 0 === d || d.setItem(h, JSON.stringify(n))
            }
        }
        removeEventListener(e, n) {
            if (Array.isArray(this._eventRegistry[e])) {
                const d = this._eventRegistry[e].indexOf(n)
                this._eventRegistry[e].splice(d, 1)
            }
        }
        _handleGlobalStorageEvent(e) {
            var n
            if (
                this.dispatchNamespace &&
                (null === (n = e.key) || void 0 === n ? void 0 : n.startsWith(this.dispatchNamespace + ":"))
            ) {
                const n = e.key.substring(this.dispatchNamespace.length + 1)
                this.dispatchEvent(n, JSON.parse(e.newValue))
            }
        }
        constructor(e = [], n) {
            ;(this._eventRegistry = {}),
                e.forEach((e) => {
                    this._eventRegistry[e] = []
                }),
                n && n.namespace && (this.dispatchNamespace = "com.apple." + n.namespace),
                this.shouldStorageDispatch &&
                    ((this._handleGlobalStorageEvent = this._handleGlobalStorageEvent.bind(this)),
                    window.addEventListener("storage", this._handleGlobalStorageEvent))
        }
    }
    var T =
        "undefined" != typeof FastBoot
            ? FastBoot.require("buffer").Buffer
            : "undefined" != typeof process && null !== process.versions && null !== process.versions.node
            ? Buffer
            : window.Buffer
    function memoize(e) {
        return function (...n) {
            let d = "",
                h = n.length
            for (e._memoized = e._memoized || {}; h--; ) {
                const e = n[h]
                d += e === Object(e) ? JSON.stringify(e) : e
            }
            return d in e._memoized ? e._memoized[d] : (e._memoized[d] = e(...n))
        }
    }
    function generateUUID() {
        let e = strRandomizer() + strRandomizer()
        for (; e.length < 16; ) e += strRandomizer()
        return e.slice(0, 16)
    }
    function strRandomizer() {
        return Math.random().toString(16).substring(2)
    }
    const S = memoize((e) => /^[a|i|l|p]{1}\.[a-zA-Z0-9]+$/.test(e))
    function isNodeEnvironment$1(e) {
        const isDefined = (e) => null != e
        return (
            0 === arguments.length && "undefined" != typeof process && (e = process),
            (isDefined(e) && isDefined(e.versions) && isDefined(e.versions.node)) || "undefined" != typeof FastBoot
        )
    }
    const P = memoize(isNodeEnvironment$1() ? (e) => T.from(e, "base64").toString("binary") : (e) => window.atob(e))
    memoize(isNodeEnvironment$1() ? (e) => T.from(e).toString("base64") : (e) => window.btoa(e))
    const debounce = (e, n = 250, d = { isImmediate: !1 }) => {
            let h
            return function (...p) {
                const y = this,
                    m = d.isImmediate && void 0 === h
                void 0 !== h && clearTimeout(h),
                    (h = setTimeout(function () {
                        ;(h = void 0), d.isImmediate || e.apply(y, p)
                    }, n)),
                    m && e.apply(y, p)
            }
        },
        exceptFields = (e, ...n) => {
            const d = {}
            return (
                Object.keys(e).forEach((h) => {
                    n.includes(h) || (d[h] = e[h])
                }),
                d
            )
        },
        arrayEquals = (e, n) => !!e && !!n && [].every.call(e, (e, d) => e === n[d])
    function hasOwn(e, n) {
        return Object.prototype.hasOwnProperty.call(Object(e), n)
    }
    function deepClone(e) {
        const n = Object.prototype.toString.call(e).toLowerCase().slice(8, -1)
        switch (n) {
            case "set":
                return new Set([...e].map((e) => deepClone(e)))
            case "map":
                return new Map([...e].map(([e, n]) => [deepClone(e), deepClone(n)]))
            case "date":
                return new Date(e.getTime())
            case "regexp": {
                const n = e,
                    d =
                        "string" == typeof n.flags
                            ? n.flags
                            : [
                                  n.global ? "g" : void 0,
                                  n.ignoreCase ? "i" : void 0,
                                  n.multiline ? "m" : void 0,
                                  n.sticky ? "y" : void 0,
                                  n.unicode ? "u" : void 0
                              ]
                                  .filter((e) => void 0 !== e)
                                  .join("")
                return RegExp(e.source, d)
            }
            case "arraybuffer": {
                const n = e
                if ("function" == typeof n.slice) return n.slice(0)
                {
                    const d = new e.constructor(n.byteLength)
                    return new Uint8Array(d).set(new Uint8Array(n)), d
                }
            }
            case "dataview":
            case "int8array":
            case "uint8array":
            case "uint8clampedarray":
            case "int16array":
            case "uint16array":
            case "int32array":
            case "uint32array":
            case "float32array":
            case "float64array":
            case "bigint64array":
            case "biguint64array": {
                const d = e
                return new (0,
                d.constructor)(deepClone(d.buffer), d.byteOffset, "dataview" === n ? d.byteLength : d.length)
            }
            case "array":
            case "object": {
                const n = Array.isArray(e) ? [] : {}
                for (const d in e) hasOwn(e, d) && (n[d] = deepClone(e[d]))
                return n
            }
            default:
                return e
        }
    }
    function isEmpty(e) {
        if ("object" != typeof e) throw new TypeError("Source is not an Object")
        for (const n in e) if (hasOwn(e, n)) return !1
        return !0
    }
    function transform$8(e, n, d = !1) {
        return (
            d && (e = Object.keys(e).reduce((n, d) => ((n[e[d]] = d), n), {})),
            Object.keys(e).reduce((d, h) => {
                const p = e[h],
                    y =
                        "function" == typeof p
                            ? p()
                            : (function (e, n) {
                                  return n.split(".").reduce((e, n) => {
                                      if (void 0 !== e) return e[n]
                                  }, e)
                              })(n, p)
                return (
                    y &&
                        (function (e, n, d) {
                            n.split(".").reduce((n, h, p, y) => {
                                const m = p === y.length - 1,
                                    g = hasOwn(n, h),
                                    b = n[h] instanceof Object,
                                    _ = null === n[h]
                                if (!m && g && (!b || _))
                                    throw new TypeError(
                                        `Value at ${y.slice(0, p + 1).join(".")} in keypath is not an Object.`
                                    )
                                return m ? ((n[h] = d), e) : g ? n[h] : (n[h] = {})
                            }, e)
                        })(d, h, y),
                    d
                )
            }, {})
        )
    }
    const E = [
            "contributors",
            "modalities",
            "musicVideo",
            "podcast-episodes",
            "radioStation",
            "song",
            "uploaded-audios",
            "uploadedAudio",
            "uploaded-videos",
            "uploadedVideo",
            "workouts",
            "workout-programs"
        ],
        k = {
            "uploaded-videos": !0,
            uploadedVideo: !0,
            "uploaded-audios": !0,
            uploadedAudio: !0,
            "podcast-episodes": !0
        },
        w = [],
        I = {
            mediaItemStateDidChange: "mediaItemStateDidChange",
            mediaItemStateWillChange: "mediaItemStateWillChange"
        },
        O = { CRITICAL: 50, ERROR: 40, WARNING: 30, NOTICE: 20, INFO: 10, DEBUG: 2, TRACE: 1, NONE: 0 }
    const A = {
        OFF: "NONE",
        0: "NONE",
        "+": "INFO",
        "++": "DEBUG",
        V: "DEBUG",
        D: "DEBUG",
        VERBOSE: "DEBUG",
        VV: "TRACE",
        SILLY: "TRACE",
        "*": "TRACE"
    }
    function getLoggingLevel(e, n = {}) {
        if ("number" == typeof e)
            return (function (e) {
                return "number" == typeof e && Object.values(O).includes(e)
            })(e)
                ? e
                : void 0
        let d = e.toUpperCase()
        return (
            n.allowShorthands && void 0 !== A[d] && (d = A[d]),
            (function (e) {
                return "string" == typeof e && void 0 !== O[e.toUpperCase()]
            })(d)
                ? O[d]
                : void 0
        )
    }
    function getLoggingLevelName(e) {
        for (const [n, d] of Object.entries(O)) if (e === d) return n
    }
    function walk(e, n) {
        const d = [e]
        for (; d.length > 0; ) {
            const e = d.shift()
            void 0 !== e && (d.push(...e.children), n(e))
        }
    }
    function _defineProperty$J(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$J(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$J(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$t(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const R = O.ERROR,
        DEFAULT_POLICY = (e, n) => e !== O.NONE && n >= e
    class Logger {
        get parent() {
            return this._parent
        }
        get children() {
            return Array.from(this._children.values())
        }
        get namespace() {
            return void 0 === this._parent ? this.name : this._parent.namespace + "/" + this.name
        }
        get enabled() {
            return this.level !== O.NONE
        }
        get level() {
            var e, n, d
            return null !==
                (d =
                    null !== (n = this._level) && void 0 !== n
                        ? n
                        : null === (e = this.parent) || void 0 === e
                        ? void 0
                        : e.level) && void 0 !== d
                ? d
                : R
        }
        get levelName() {
            var e
            return null !== (e = getLoggingLevelName(this.level)) && void 0 !== e ? e : "UNKNOWN"
        }
        get levelPolicy() {
            var e, n, d
            return null !==
                (d =
                    null !== (n = this._levelPolicy) && void 0 !== n
                        ? n
                        : null === (e = this.parent) || void 0 === e
                        ? void 0
                        : e.levelPolicy) && void 0 !== d
                ? d
                : DEFAULT_POLICY
        }
        get handlers() {
            var e, n, d
            return null !==
                (d =
                    null !== (n = this._handlers) && void 0 !== n
                        ? n
                        : null === (e = this.parent) || void 0 === e
                        ? void 0
                        : e.handlers) && void 0 !== d
                ? d
                : {}
        }
        isEnabledFor(e) {
            return this.levelPolicy(this.level, e)
        }
        setLevel(e) {
            const n = getLoggingLevel(e)
            void 0 !== n && (this._level = n)
        }
        clearLevel() {
            this._level = void 0
        }
        setLevelPolicy(e) {
            this._levelPolicy = e
        }
        clearLevelPolicy() {
            this._levelPolicy = void 0
        }
        addHandler(e, n) {
            this._handlers || (this._handlers = {}), (this._handlers[e] = n)
        }
        hasHandler(e) {
            var n
            return void 0 !== (null === (n = this._handlers) || void 0 === n ? void 0 : n[e])
        }
        removeHandler(e) {
            void 0 !== this._handlers &&
                (delete this._handlers[e], 0 === Object.keys(this._handlers).length && this.clearHandlers())
        }
        clearHandlers() {
            this._handlers = void 0
        }
        createChild(e, n) {
            const d = this._children.get(e)
            return void 0 !== d ? d : new Logger(e, _objectSpreadProps$t(_objectSpread$J({}, n), { parent: this }))
        }
        linkChild(e) {
            if (void 0 !== e.parent && e.parent !== this)
                throw new Error(`Logger '${e.name}' is already a child of a different parent ('${e.parent.name}')`)
            const n = this._children.get(e.name)
            if (void 0 !== n && n !== e) throw new Error(`A child with name '${e.name}' is already registered`)
            return void 0 === n && (this._children.set(e.name, e), e.linkParent(this)), e
        }
        unlinkChild(e) {
            const n = this._children.get(e.name)
            return n === e && (this._children.delete(e.name), n.unlinkParent()), e
        }
        getByName(e) {
            return this._children.get(e)
        }
        getByNamespace(e) {
            return (function (e, n, d = "/") {
                if ("" === (n = n.trim()) || "*" === n) return e
                const h = n.split(d)
                h[0].trim() === e.name && h.shift()
                if (0 === h.length) return e
                let p = e
                for (; void 0 !== p && h.length > 0; ) {
                    const e = h.shift()
                    p = p.getByName(e.trim())
                }
                return p
            })(this, e)
        }
        linkParent(e) {
            return this.parent !== e && (this.unlinkParent(), (this._parent = e), e.linkChild(this)), this
        }
        unlinkParent() {
            return void 0 !== this._parent && (this._parent.unlinkChild(this), (this._parent = void 0)), this
        }
        log(e, n, ...d) {
            const h = getLoggingLevel(e)
            void 0 !== h &&
                this.logRecord({ time: Date.now(), namespace: this.namespace, level: h, message: n, args: d })
        }
        logRecord(e) {
            if (!this.levelPolicy(this.level, e.level)) return
            const n = _objectSpread$J({ namespace: this.namespace }, e)
            for (const d of Object.values(this.handlers)) d.process(n)
        }
        error(e, ...n) {
            this.log(O.ERROR, e, ...n)
        }
        warning(e, ...n) {
            this.log(O.WARNING, e, ...n)
        }
        warn(e, ...n) {
            this.warning(e, ...n)
        }
        info(e, ...n) {
            this.log(O.INFO, e, ...n)
        }
        debug(e, ...n) {
            this.log(O.DEBUG, e, ...n)
        }
        trace(e, ...n) {
            this.log(O.TRACE, e, ...n)
        }
        constructor(e, n) {
            ;(this._children = new Map()),
                (this.name = e),
                (this._levelPolicy = null == n ? void 0 : n.levelPolicy),
                (this._handlers = null == n ? void 0 : n.handlers),
                void 0 !== (null == n ? void 0 : n.parent) && this.linkParent(n.parent),
                void 0 !== (null == n ? void 0 : n.level) && this.setLevel(n.level)
        }
    }
    class CallbackHandler {
        process(e) {
            this.enabled && void 0 !== this.callback && this.callback(e)
        }
        constructor(e, n = {}) {
            var d
            ;(this.callback = e), (this.enabled = null === (d = n.enabled) || void 0 === d || d)
        }
    }
    const C = /%{([^}]+)}/gi
    var M
    const D = {
        timestamp: (e) => String(e.time),
        time: (e) => String(e.time),
        datetime: (e) => new Date(e.time).toISOString(),
        date: (e) => new Date(e.time).toISOString(),
        level: (e) => String(e.level),
        levelname: (e) => (null !== (M = getLoggingLevelName(e.level)) && void 0 !== M ? M : "UNKNOWN"),
        message: (e) => e.message,
        name: (e) => e.namespace.split("/").pop(),
        namespace: (e) => e.namespace
    }
    const x = new Map([
            [O.CRITICAL, "error"],
            [O.ERROR, "error"],
            [O.WARNING, "warn"],
            [O.NOTICE, "warn"],
            [O.INFO, "log"],
            [O.DEBUG, "debug"]
        ]),
        L =
            ((N = "%{datetime} %{levelname} - [%{namespace}] %{message}"),
            function (e) {
                return N.replace(C, function (n, d) {
                    return (d = d.toLowerCase()), void 0 !== D[d] ? D[d](e) : n
                })
            })
    var N
    const j = new Logger("media-item")
    var U, $
    ;(e.PlaybackType = void 0),
        ((U = e.PlaybackType || (e.PlaybackType = {}))[(U.none = 0)] = "none"),
        (U[(U.preview = 1)] = "preview"),
        (U[(U.unencryptedFull = 2)] = "unencryptedFull"),
        (U[(U.encryptedFull = 3)] = "encryptedFull"),
        (function (e) {
            ;(e[(e.none = 0)] = "none"),
                (e[(e.loading = 1)] = "loading"),
                (e[(e.ready = 2)] = "ready"),
                (e[(e.playing = 3)] = "playing"),
                (e[(e.ended = 4)] = "ended"),
                (e[(e.unavailable = 5)] = "unavailable"),
                (e[(e.restricted = 6)] = "restricted"),
                (e[(e.error = 7)] = "error"),
                (e[(e.unsupported = 8)] = "unsupported")
        })($ || ($ = {}))
    const {
            none: G,
            loading: B,
            ready: F,
            playing: V,
            ended: H,
            unavailable: q,
            restricted: W,
            error: Y,
            unsupported: z
        } = $,
        Q = {
            [G]: { allowed: [B], unknown: [H, q, W, Y, z] },
            [B]: { allowed: [F, W, Y, z], unknown: [] },
            [F]: { allowed: [V], unknown: [Y] },
            [V]: { allowed: [H, Y], unknown: [q, W, z] },
            [H]: { allowed: [], unknown: [] },
            [q]: { allowed: [], unknown: [] },
            [W]: { allowed: [], unknown: [] },
            [Y]: { allowed: [], unknown: [] },
            [z]: { allowed: [], unknown: [] }
        },
        toName = (e) => $[e],
        createMediaItemStateGuard = (e = G) => {
            const n = {
                current: e,
                set(e) {
                    const { current: d } = n
                    if (!((e, n) => Q[e].allowed.includes(n))(d, e)) {
                        const n = ((e, n) => Q[e].unknown.includes(n))(d, e)
                        j.debug(
                            `MediaItem.state was changed from ${toName(d)} to ${toName(e)}`,
                            n
                                ? "but it is unknown whether it should be allowed or not."
                                : "and it should not be happening"
                        )
                    }
                    n.current = e
                }
            }
            return n
        }
    function isStringNotEmpty(e) {
        return !(function (e) {
            return void 0 === e || "" === e.trim()
        })(e)
    }
    function transform$7(e) {
        return transform$8(
            {
                "attributes.albumName": "metadata.playlistName",
                "attributes.artistName": "metadata.artistName",
                "attributes.artwork"() {
                    const n = null == e ? void 0 : e.artworkURL
                    if (n)
                        return (function (e) {
                            const n = e.split("/").pop(),
                                [d, h] = (!!n && n.match(/\d+/g)) || ["100", "100"]
                            return {
                                width: parseInt(d, 10),
                                height: parseInt(h, 10),
                                url: e.replace(`${d}x${h}`, "{w}x{h}")
                            }
                        })(n)
                },
                "attributes.composerName": "metadata.composerName",
                "attributes.contentRating"() {
                    var n
                    if (1 === (null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.explicit))
                        return "explicit"
                },
                "attributes.discNumber"() {
                    var n
                    return (null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.discNumber) || 1
                },
                "attributes.durationInMillis": "metadata.duration",
                "attributes.genreNames"() {
                    var n
                    return [null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.genre]
                },
                "attributes.isrc"() {
                    var n
                    const d = null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.xid
                    if (d) return d.replace(/^([^:]+):isrc:/, "$1")
                },
                "attributes.name": "metadata.itemName",
                "attributes.playParams.id": "metadata.itemId",
                "attributes.playParams.kind": "metadata.kind",
                "attributes.previews": () => [{ url: null == e ? void 0 : e.previewURL }],
                "attributes.releaseDate": "metadata.releaseDate",
                "attributes.trackNumber": "metadata.trackNumber",
                assetURL: "URL",
                cloudId: "metadata.cloud-id",
                id() {
                    var n
                    return "" + (null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.itemId)
                },
                flavor: "flavor",
                type: "metadata.kind"
            },
            e
        )
    }
    const { mediaItemStateDidChange: J, mediaItemStateWillChange: X } = I,
        Z = { isEntitledToPlay: !0 }
    class MediaItem extends Notifications {
        get ageGatePolicy() {
            var e
            return null === (e = this.defaultPlayable) || void 0 === e ? void 0 : e.ageGatePolicy
        }
        get albumInfo() {
            const { albumName: e, artistName: n } = this,
                d = []
            return n && d.push(n), e && d.push(e), d.join(" - ")
        }
        get albumName() {
            return this.attributes.albumName
        }
        get artistName() {
            return this.attributes.genreNames &&
                this.attributes.genreNames.indexOf("Classical") > -1 &&
                this.attributes.composerName
                ? this.attributes.composerName
                : this.attributes.artistName
        }
        get artwork() {
            var e, n
            return null !== (n = this.attributes.artwork) && void 0 !== n
                ? n
                : null === (e = this.attributes.images) || void 0 === e
                ? void 0
                : e.coverArt16X9
        }
        get artworkURL() {
            if (this.artwork && this.artwork.url) return this.artwork.url
        }
        get assets() {
            return this._assets
        }
        get canPlay() {
            return this.isPlayable && this.isReady
        }
        get container() {
            return this._container
        }
        set container(e) {
            this._container = e
        }
        get contentRating() {
            return this.attributes.contentRating
        }
        get context() {
            return this._context
        }
        set context(e) {
            this._context = e
        }
        get defaultPlayable() {
            var e
            return null === (e = this.playables) || void 0 === e ? void 0 : e[0]
        }
        get discNumber() {
            return this.attributes.discNumber
        }
        get hasContainerArtwork() {
            return (
                this.container &&
                this.container.attributes &&
                this.container.attributes.artwork &&
                this.container.attributes.artwork.url
            )
        }
        get hasPlaylistContainer() {
            return this.container && "playlists" === this.container.type && this.container.attributes
        }
        get isEntitledToPlay() {
            const { attributes: e, defaultPlayable: n } = this
            var d
            return null !== (d = e.isEntitledToPlay || (null == n ? void 0 : n.isEntitledToPlay)) && void 0 !== d && d
        }
        get supportsLinearScrubbing() {
            var e, n, d
            return (
                this.isLinearStream &&
                !0 ===
                    (null === (e = this.defaultPlayable) ||
                    void 0 === e ||
                    null === (n = e.assets) ||
                    void 0 === n ||
                    null === (d = n.streamCapability) ||
                    void 0 === d
                        ? void 0
                        : d.supportsLinearScrubbing)
            )
        }
        get isAssetScrubbingDisabled() {
            return !!this.isLinearStream && !this.supportsLinearScrubbing
        }
        get isLinearStream() {
            return (function (e) {
                var n, d
                return (
                    "LiveService" === (null == e ? void 0 : e.type) ||
                    "Event" === (null == e || null === (n = e.defaultPlayable) || void 0 === n ? void 0 : n.type) ||
                    "EbsEvent" === (null == e || null === (d = e.defaultPlayable) || void 0 === d ? void 0 : d.type)
                )
            })(this)
        }
        get isLiveRadioStation() {
            return isLiveRadioStation(this)
        }
        get isLiveAudioStation() {
            return isLiveRadioKind(this, "audio")
        }
        get isLiveVideoStation() {
            return isLiveRadioKind(this, "video")
        }
        get isSong() {
            return "song" === this.type
        }
        get info() {
            return `${this.title} - ${this.albumInfo}`
        }
        get isCloudItem() {
            return (this.playParams && this.playParams.isLibrary) || S(this.id)
        }
        get isCloudUpload() {
            return -1 === this._songId
        }
        get isExplicitItem() {
            return "explicit" === this.contentRating
        }
        get isLoading() {
            return this.state === $.loading
        }
        get isPlayableMediaType() {
            return this.isUTS || -1 !== E.indexOf(this.type)
        }
        get isPlayable() {
            var e
            return (
                !!this.isPlayableMediaType &&
                (!(!this.isLiveRadioStation && !this.hasOffersHlsUrl) ||
                    (this.needsPlayParams
                        ? !!this.playParams
                        : this.isUTS
                        ? this.isEntitledToPlay
                        : !!this.attributes.assetUrl ||
                          !!(null === (e = this.attributes.previews) || void 0 === e ? void 0 : e.length)))
            )
        }
        get isPlaying() {
            return this.state === $.playing
        }
        get isPreparedToPlay() {
            if ("song" === this.type) return !!this._assets && !!this.keyURLs && !!this._songId
            if (this.isUTS) {
                const e = isStringNotEmpty(this.assetURL),
                    n = !!(
                        this.keyURLs &&
                        isStringNotEmpty(this.keyURLs["hls-key-cert-url"]) &&
                        isStringNotEmpty(this.keyURLs["hls-key-server-url"]) &&
                        isStringNotEmpty(this.keyURLs["widevine-cert-url"])
                    )
                return e && n
            }
            return (
                !!isStringNotEmpty(this.assetURL) ||
                (this.playRawAssetURL && !!isStringNotEmpty(this.attributes.assetUrl))
            )
        }
        get isrc() {
            return this.attributes.isrc
        }
        get isReady() {
            return this.state === $.ready
        }
        get isRestricted() {
            return this.state === $.restricted
        }
        get isUTS() {
            var e
            return !(
                !(null === (e = this.defaultPlayable) || void 0 === e ? void 0 : e.type) ||
                !w.includes(this.defaultPlayable.type)
            )
        }
        get isUnavailable() {
            return this.state === $.unavailable
        }
        get needsPlayParams() {
            return ["musicVideo", "song"].includes(this.type)
        }
        get normalizedType() {
            return normalizeContentType(this.type)
        }
        get offers() {
            return this.attributes.offers
        }
        get offersHlsUrl() {
            const { offers: e } = this,
                n =
                    null == e
                        ? void 0
                        : e.find((e) => {
                              var n
                              return !!(null === (n = e.hlsUrl) || void 0 === n ? void 0 : n.length)
                          })
            return null == n ? void 0 : n.hlsUrl
        }
        get hasOffersHlsUrl() {
            return isStringNotEmpty(this.offersHlsUrl)
        }
        set playbackData(e) {
            if (void 0 === e) return
            this.previewURL && (e.previewURL = this.previewURL)
            const n = transform$7(e)
            this.artwork && n.artwork && delete n.artwork,
                n.id !== this.id && delete n.id,
                this.playParams && n.attributes.playParams && (n.attributes.playParams = this.playParams),
                Object.assign(this, n),
                j.debug("media-item: item merged with playbackData", this),
                (this.state = $.ready)
        }
        get playbackDuration() {
            return this.attributes.durationInMillis || this.attributes.durationInMilliseconds
        }
        get playEvent() {
            var e
            return null === (e = this.defaultPlayable) || void 0 === e ? void 0 : e.playEvent
        }
        get playlistArtworkURL() {
            var e, n, d
            return this.hasPlaylistContainer && this.hasContainerArtwork
                ? null === (e = this.container) ||
                  void 0 === e ||
                  null === (n = e.attributes) ||
                  void 0 === n ||
                  null === (d = n.artwork) ||
                  void 0 === d
                    ? void 0
                    : d.url
                : this.artworkURL
        }
        get playlistName() {
            var e, n
            return this.hasPlaylistContainer
                ? null === (e = this.container) || void 0 === e || null === (n = e.attributes) || void 0 === n
                    ? void 0
                    : n.name
                : this.albumName
        }
        get playParams() {
            return this.attributes.playParams
        }
        get playRawAssetURL() {
            return this.offers ? this.offers.some((e) => "STDQ" === e.type) : !(!this.isCloudUpload && !k[this.type])
        }
        get previewURL() {
            var e, n, d, h, p, y, m, g, b, _, T, S, P, E, k
            return (
                (null === (e = this.attributes) ||
                void 0 === e ||
                null === (n = e.previews) ||
                void 0 === n ||
                null === (d = n[0]) ||
                void 0 === d
                    ? void 0
                    : d.url) ||
                (null === (h = this.attributes) ||
                void 0 === h ||
                null === (p = h.previews) ||
                void 0 === p ||
                null === (y = p[0]) ||
                void 0 === y
                    ? void 0
                    : y.hlsUrl) ||
                (null === (m = this.attributes) ||
                void 0 === m ||
                null === (g = m.trailers) ||
                void 0 === g ||
                null === (b = g[0]) ||
                void 0 === b ||
                null === (_ = b.assets) ||
                void 0 === _
                    ? void 0
                    : _.hlsUrl) ||
                (null === (T = this.attributes) ||
                void 0 === T ||
                null === (S = T.movieClips) ||
                void 0 === S ||
                null === (P = S[0]) ||
                void 0 === P
                    ? void 0
                    : P.hlsUrl) ||
                (null === (E = this.attributes) || void 0 === E || null === (k = E.video) || void 0 === k
                    ? void 0
                    : k.hlsUrl)
            )
        }
        get rating() {
            return this.attributes.rating
        }
        get releaseDate() {
            if (this._releaseDate) return this._releaseDate
            if (this.attributes && (this.attributes.releaseDate || this.attributes.releaseDateTime)) {
                const e = this.attributes.releaseDate || this.attributes.releaseDateTime
                return (this._releaseDate = /^\d{4}-\d{1,2}-\d{1,2}/.test(e) ? new Date(e) : void 0), this._releaseDate
            }
        }
        set releaseDate(e) {
            this._releaseDate =
                "string" == typeof e
                    ? /^\d{4}-\d{1,2}-\d{1,2}/.test(e)
                        ? new Date(e)
                        : void 0
                    : "number" == typeof e
                    ? new Date(e)
                    : e
        }
        get songId() {
            return this._songId && -1 !== this._songId ? this._songId : this.id
        }
        get state() {
            return this._state.current
        }
        set state(e) {
            const n = { oldState: this._state.current, state: e }
            this._stateWillChange && this._stateWillChange(this),
                this.dispatchEvent(X, n),
                this._state.set(e),
                this._stateDidChange && this._stateDidChange(this),
                this.dispatchEvent(J, n)
        }
        get title() {
            return this.attributes.name || this.attributes.title
        }
        get trackNumber() {
            return this.attributes.trackNumber
        }
        beginMonitoringStateDidChange(e) {
            this._stateDidChange = e
        }
        beginMonitoringStateWillChange(e) {
            this._stateWillChange = e
        }
        endMonitoringStateDidChange() {
            this._stateDidChange = void 0
        }
        endMonitoringStateWillChange() {
            this._stateWillChange = void 0
        }
        isEqual(e) {
            return this.id === e.id && this.type === e.type && this.attributes === e.attributes
        }
        resetState() {
            this.endMonitoringStateWillChange(), this.endMonitoringStateDidChange(), (this.state = $.none)
        }
        restrict() {
            this.isExplicitItem && ((this.state = $.restricted), this._removePlayableData())
        }
        notSupported() {
            ;(this.state = $.unsupported), this._removePlayableData()
        }
        updateFromLoadError(e) {
            switch (e.errorCode) {
                case MKError.CONTENT_RESTRICTED:
                    this.state = $.restricted
                    break
                case MKError.CONTENT_UNAVAILABLE:
                    this.state = $.unavailable
                    break
                default:
                    this.state = $.error
            }
        }
        updateFromSongList(e) {
            "musicVideo" === this.type
                ? this.updateWithLoadedAssets(void 0, e["hls-playlist-url"])
                : this.updateWithLoadedAssets(e.assets),
                (this._songId = e.songId),
                this.updateWithLoadedKeys({
                    "hls-key-cert-url": e["hls-key-cert-url"],
                    "hls-key-server-url": e["hls-key-server-url"],
                    "widevine-cert-url": e["widevine-cert-url"]
                })
        }
        updateWithLoadedKeys(e, n) {
            ;(this.keyURLs = e), n && (this.keyServerQueryParameters = n)
        }
        updateWithLoadedAssets(e, n) {
            e && (this._assets = e), n && (this.assetURL = n)
        }
        _removePlayableData() {
            var e, n, d
            null === (e = this.attributes) || void 0 === e || delete e.playParams,
                null === (n = this.attributes) || void 0 === n || delete n.previews,
                null === (d = this.attributes) || void 0 === d || delete d.trailers
        }
        constructor(n = {}) {
            super([J, X]),
                (this.hlsMetadata = {}),
                (this.playbackType = e.PlaybackType.none),
                (this._assets = []),
                (this._state = createMediaItemStateGuard()),
                j.debug("media-item: creating Media Item with options:", n)
            n.id && n.attributes
                ? (Object.keys(n).forEach((e) => {
                      hasOwn(Z, e) || (this[e] = n[e])
                  }),
                  (this.type = this.playParams && this.playParams.kind ? this.playParams.kind : this.type || "song"))
                : ((this.id = n.id || generateUUID()),
                  (this.type = n.type || "song"),
                  (this.attributes = { playParams: { id: this.id, kind: this.type } })),
                (this._context = n.context || {}),
                n.container
                    ? (this._container = n.container)
                    : n.containerId &&
                      n.containerType &&
                      (this._container = { id: n.containerId, type: n.containerType })
        }
    }
    const ee = [
        "contributors",
        "modalities",
        "movie",
        "musicVideo",
        "musicMovie",
        "trailer",
        "tvEpisode",
        "uploadedVideo",
        "uploaded-videos",
        "music-videos",
        "music-movies",
        "tv-episodes",
        "workouts"
    ]
    function getPlayerType(e) {
        var n, d
        return (null == e ? void 0 : e.isUTS) || ee.includes(null == e ? void 0 : e.type)
            ? "video"
            : "podcast-episodes" === (null == e ? void 0 : e.type)
            ? "audio"
            : null !== (d = null == e || null === (n = e.attributes) || void 0 === n ? void 0 : n.mediaKind) &&
              void 0 !== d
            ? d
            : "audio"
    }
    var te, re
    function asyncGeneratorStep$17(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$17(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$17(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$17(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    ;(e.PlaybackStates = void 0),
        ((te = e.PlaybackStates || (e.PlaybackStates = {}))[(te.none = 0)] = "none"),
        (te[(te.loading = 1)] = "loading"),
        (te[(te.playing = 2)] = "playing"),
        (te[(te.paused = 3)] = "paused"),
        (te[(te.stopped = 4)] = "stopped"),
        (te[(te.ended = 5)] = "ended"),
        (te[(te.seeking = 6)] = "seeking"),
        (te[(te.waiting = 8)] = "waiting"),
        (te[(te.stalled = 9)] = "stalled"),
        (te[(te.completed = 10)] = "completed"),
        (e.PresentationMode = void 0),
        ((re = e.PresentationMode || (e.PresentationMode = {}))[(re.pictureinpicture = 0)] = "pictureinpicture"),
        (re[(re.inline = 1)] = "inline")
    class DeveloperToken {
        get isExpired() {
            return this.expiration < Date.now()
        }
        _decode(e) {
            return JSON.parse(P(e))
        }
        constructor(e) {
            if (((this.token = e), !e || !/^[a-z0-9\-\_]{16,}\.[a-z0-9\-\_]{16,}\.[a-z0-9\-\_]{16,}/i.test(e)))
                throw new Error("Invalid token.")
            const [n, d] = e.split("."),
                { exp: h, iss: p } = this._decode(d)
            if (((this.expiration = 1e3 * h), this.isExpired)) throw new Error("Initialized with an expired token.")
            this.teamId = p
            const { kid: y } = this._decode(n)
            this.keyId = y
        }
    }
    function invoke(e) {
        return void 0 === e || ((e) => "function" != typeof e)(e) ? e : e()
    }
    function _defineProperty$I(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$I(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$I(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$s(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const addPathToURL = (e, n) =>
            void 0 === e || "" === e
                ? n || ""
                : void 0 === n
                ? e
                : (e.endsWith("/") && (e = e.slice(0, -1)), n.startsWith("/") && (n = n.slice(1)), `${e}/${n}`),
        addQueryParamsToURL = (e, n) => {
            const d = urlEncodeParameters(n)
            return "" === d
                ? e
                : e.endsWith("&") || e.endsWith("?")
                ? `${e}${d}`
                : e.includes("?")
                ? `${e}&${d}`
                : `${e}?${d}`
        },
        ne = "undefined" != typeof Headers,
        headersToDict = (e) => {
            let n = {}
            var d
            return (
                (d = e),
                ne && d instanceof Headers
                    ? e.forEach((e, d) => (n[d] = e))
                    : Array.isArray(e)
                    ? e.forEach(([e, d]) => (n[e] = d))
                    : (n = e),
                n
            )
        },
        mergeFetchHeaders = (e = {}, n = {}) => _objectSpread$I({}, headersToDict(e), headersToDict(n)),
        mergeFetchOptions = (e, n) => {
            if (e || n)
                return (null == e ? void 0 : e.headers) && (null == n ? void 0 : n.headers)
                    ? _objectSpreadProps$s(_objectSpread$I({}, e, n), {
                          headers: mergeFetchHeaders(e.headers, n.headers)
                      })
                    : _objectSpread$I({}, e, n)
        }
    function parseQueryParams(e) {
        if (!e || (e.startsWith("http") && !e.includes("?"))) return {}
        try {
            var n
            return parseParams(null !== (n = e.split("?")[1]) && void 0 !== n ? n : e, "&", decodeURIComponent)
        } catch (Mr) {
            return {}
        }
    }
    function parseParams(e, n = "&", d = (e) => e) {
        return "string" != typeof e
            ? {}
            : e
                  .split(n)
                  .map((e) => e.trim().split("=", 2))
                  .reduce((e, n) => {
                      const [h, p] = n
                      return ("" === h && void 0 === p) || ((e[d(h)] = d(p)), void 0 === p && (e[d(h)] = void 0)), e
                  }, {})
    }
    function getMaxAgeFromHeaders(e) {
        const n = (function (e, n) {
            if (void 0 !== n) return ne && n instanceof Headers ? n.get(e) : n[e]
        })("cache-control", e)
        if (n) {
            return ((e) => {
                const n = Number(e)
                if (Number.isFinite(n)) return n
            })(parseParams(n, ",")["max-age"])
        }
    }
    function rewriteLastUrlPath(e, n) {
        const d = e.split("/")
        return d.pop(), d.push(n), d.join("/")
    }
    const recursiveEncodeParameters = (e, n) =>
        Object.keys(e).reduce((d, h) => {
            const p = e[h],
                y = n ? `${n}[${encodeURIComponent(h)}]` : encodeURIComponent(h)
            return `${d}${d ? "&" : ""}${
                (function (e) {
                    return !!e && "object" == typeof e && !Array.isArray(e)
                })(p)
                    ? recursiveEncodeParameters(p, y)
                    : `${y}=${encodeURIComponent("" + p)}`
            }`
        }, "")
    function urlEncodeParameters(e) {
        return e ? recursiveEncodeParameters(e) : ""
    }
    const ie = {}
    function findOrCreate(e, n) {
        const d = e.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (e, n) => n.toUpperCase())
        if (hasOwn(ie, d)) {
            const h = ie[d]
            if (n !== h.constructor)
                throw new Error(`DevFlag ${e} was already registered with a different type (${h.constructor.name})`)
            return h
        }
        const h = new n(e)
        return (
            Object.defineProperty(ie, d, {
                configurable: !0,
                enumerable: !0,
                get: function () {
                    return h
                },
                set(e) {
                    h.set(e)
                }
            }),
            h
        )
    }
    class LocalStorageDevFlag {
        get value() {
            return this.get()
        }
        get configured() {
            return void 0 !== this.value
        }
        read() {
            var e, n
            const d =
                null !== (n = null === (e = getLocalStorage()) || void 0 === e ? void 0 : e.getItem(this.key)) &&
                void 0 !== n
                    ? n
                    : null
            return null !== d ? d : void 0
        }
        write(e) {
            var n
            null === (n = getLocalStorage()) || void 0 === n || n.setItem(this.key, e)
        }
        clear() {
            var e
            null === (e = getLocalStorage()) || void 0 === e || e.removeItem(this.key)
        }
        constructor(e) {
            if ("string" != typeof e || "" === e.trim()) throw new Error("DevFlag requires a non-empty string key")
            this.key = e
        }
    }
    class StringDevFlag extends LocalStorageDevFlag {
        static register(e) {
            return findOrCreate(e, this)
        }
        static get(e) {
            return this.register(e).get()
        }
        static set(e, n) {
            this.register(e).set(n)
        }
        get() {
            return this.read()
        }
        set(e) {
            "string" != typeof e && console.warn("Value for StringDevFlag should be a string"), this.write(e)
        }
    }
    class BooleanDevFlag extends LocalStorageDevFlag {
        static register(e) {
            return findOrCreate(e, this)
        }
        static get(e) {
            return this.register(e).get()
        }
        static set(e, n) {
            this.register(e).set(n)
        }
        get() {
            const e = this.read()
            if (void 0 !== e) return "1" === e || "true" === e.toLowerCase()
        }
        set(e) {
            "boolean" == typeof e
                ? this.write(!0 === e ? "1" : "0")
                : console.warn("Value for BooleanDevFlag should be a boolean")
        }
        get enabled() {
            return !0 === this.get()
        }
        enable() {
            this.set(!0)
        }
        disable() {
            this.set(!1)
        }
        toggle() {
            this.set(!this.get())
        }
    }
    class JsonDevFlag extends LocalStorageDevFlag {
        static register(e) {
            return findOrCreate(e, this)
        }
        static get(e) {
            return this.register(e).get()
        }
        static set(e, n) {
            this.register(e).set(n)
        }
        get() {
            const e = this.read()
            if (void 0 !== e)
                try {
                    return JSON.parse(e)
                } catch (Y) {
                    return
                }
        }
        set(e) {
            this.write(JSON.stringify(e))
        }
        prop(e) {
            if (void 0 !== this.value) return this.value[e]
        }
    }
    const ae = JsonDevFlag.register("mk-hlsjs-automation-config"),
        se = new RegExp(
            "^https://([a-z0-9]+-)?" +
                ("js-cdn.music.apple.com" + "/musickit/v3/".replace(/v3/, "(v2|v3)")).replace(/[\.\/]/g, "\\$&"),
            "i"
        ),
        oe = /^https:\/\/(.*\/includes\/js-cdn)\//i,
        ce = /^([a-z]+:)?\/\//
    function findScript(e) {
        return isNodeEnvironment$1() || !e ? null : document.querySelector(`script[src*="${e}"]`)
    }
    function getScriptSrcElements() {
        if ("undefined" == typeof document || !document.querySelectorAll) return []
        return Array.from(document.querySelectorAll("script[src]"))
    }
    function determineCdnBasePrefix() {
        for (const e of getScriptSrcElements()) {
            const n = se.exec(e.src)
            if (n) return n[1] || ""
        }
        return ""
    }
    function determineCdnPathPrefix() {
        for (const e of getScriptSrcElements()) {
            const n = oe.exec(e.src)
            if (n) return n[1] || ""
        }
        return ""
    }
    function determineCdnBaseHost() {
        if (isNodeEnvironment$1()) return ""
        return `//${determineCdnBasePrefix()}js-cdn.music.apple.com`
    }
    function determineCdnPathHost() {
        const e = determineCdnPathPrefix()
        return e ? "//" + e : e
    }
    const le = StringDevFlag.register("mk-hlsjs-log-level"),
        ue = StringDevFlag.register("mk-hlsjs-version")
    function getHlsJsCdnConfig() {
        const e = { hls: "", rtc: "" }
        if (isNodeEnvironment$1()) return e
        const n = determineCdnPathHost() || determineCdnBaseHost(),
            d = ue.get() || "2.330.1",
            h = (function () {
                const e = le.value
                switch (e) {
                    case "info":
                    case "error":
                    case "warn":
                        return "hls.production.verbose.min.js"
                    case "trace":
                    case "debug":
                        return console.warn(`HLS log level ${e} is not supported, loading production build.`), "hls.js"
                    default:
                        return "hls.js"
                }
            })()
        return (
            (e.hls = `https:${n}/hls.js/${d}/hls.js/${h}`),
            (e.rtc = `https:${n}/hls.js/${d}/rtc.js/rtc.min.js`),
            (function (e) {
                const n = ae.get()
                if (!(null == n ? void 0 : n.url)) return
                const { url: d } = n
                isAppleHostname(d) && "carry-" === determineCdnBasePrefix() && (e.hls = d)
            })(e),
            e
        )
    }
    function isAppleHostname(e) {
        try {
            return new URL(e).hostname.endsWith(".apple.com")
        } catch (Mr) {}
        return !1
    }
    function cdnBaseURL(e, n = window) {
        var d
        if (isNodeEnvironment$1()) return ""
        const h = null === (d = getLocalStorage()) || void 0 === d ? void 0 : d.getItem("mkCDNBaseURLOverride")
        if (h) return h
        const p = findScript(e)
        return p
            ? p.getAttribute("src").replace(new RegExp(e + "$"), "")
            : (determineCdnPathHost() || determineCdnBaseHost()) + "/musickit/v3/"
    }
    const de = new Map()
    function loadScript(e, n) {
        const d = de.get(e)
        if (d) return d
        const h = new Promise((d, h) => {
            isNodeEnvironment$1() && h("Dynamic script loading is unsupported in Node environments.")
            if (findScript(e)) return d()
            const p = document.createElement("script")
            let y
            if (
                (n &&
                    Object.keys(n).forEach((e) => {
                        p.setAttribute(e, n[e])
                    }),
                (p.onload = () => {
                    d()
                }),
                (p.onerror = (e) => {
                    h(e)
                }),
                ce.test(e))
            )
                y = e
            else {
                y = `${cdnBaseURL(e)}${e}`
            }
            ;(p.src = y), document.head.appendChild(p)
        })
        return de.set(e, h), h
    }
    const he = new Logger("storekit"),
        pe = [
            "apps.apple.com",
            "books.apple.com",
            "fitness.apple.com",
            "mediaauth.apple.com",
            "multidev.apple.com",
            "music.apple.com",
            "one.apple.com",
            "podcasts.apple.com",
            "tv.apple.com"
        ]
    class AuthBridgeApp extends class {
        init(e, n) {
            var d
            ;(this._receiveWindow = e),
                (this._sendWindow = n),
                (this.handleMessage = this.handleMessage.bind(this)),
                null === (d = this._receiveWindow) || void 0 === d || d.addEventListener("message", this.handleMessage)
        }
        sendMessage(e, n) {
            const d = { action: "mediakit:" + e, data: n }
            this._sendWindow && this._sendWindow.postMessage(JSON.stringify(d), this._targetOrigin)
        }
        handleMessage(e) {
            if (!this._isOriginAllowed(e.origin)) return
            let n
            try {
                n = JSON.parse(e.data)
            } catch (Mr) {}
            if (!n || !this._isNamespacedData(n)) return
            "*" === this._targetOrigin && (this._targetOrigin = e.origin), he.debug("auth-bridge: handleMessage", n)
            const d = n.action.replace("mediakit:", "")
            this[d] ? this[d](n.data) : he.debug("auth-bridge: unsupported method", d)
        }
        _isOriginAllowed(e) {
            if (!e) return !1
            const [n, d] = e.split("://")
            let h = ""
            return (
                d && ((h = d.split(":")[0]), h && (h = h.toLocaleLowerCase())),
                "https" === n && !!h && pe.some((e) => h === e || h.endsWith("." + e))
            )
        }
        _isNamespacedData(e) {
            return e.action && -1 !== e.action.indexOf("mediakit:")
        }
        constructor() {
            this._targetOrigin = "*"
        }
    } {
        requestAuthUpdate() {
            this.whenFrameInited.then(() => this.sendMessage("requestAuthUpdate"))
        }
        setCookieItem(e, n) {
            this.whenFrameInited.then(() => this.sendMessage("setCookieItem", { name: e, value: n }))
        }
        clearAuth() {
            this.whenFrameInited.then(() => this.sendMessage("clearAuth"))
        }
        frameInit() {
            var e
            null === (e = this._frameInitResolve) || void 0 === e || e.call(this), this.requestAuthUpdate()
        }
        updateAuth(e) {
            if ((null == e ? void 0 : e.enabled) && (null == e ? void 0 : e.cookies)) {
                const n = e.cookies
                Object.keys(n).forEach((e) => {
                    var d
                    const h = null !== (d = n[e]) && void 0 !== d ? d : ""
                    h ? setCookie(e, h, "/", 7) : removeCookie(e)
                })
            }
            this._authUpdateResolve && (this._authUpdateResolve(), (this._authUpdateResolve = void 0))
        }
        authClearedFromOtherFrame() {
            he.warn("Override auth-bridge/app's authClearedFromOtherFrame to trigger app-specific sign out behavior")
        }
        _getIframeSrc() {
            let e = "",
                n = determineCdnPathPrefix()
            if (n) (n += "/musickit/v3/"), (e = "?inc=" + encodeURIComponent(n))
            else {
                const n = determineCdnBasePrefix()
                n && (e = "?env=" + n.substring(0, n.length - 1))
            }
            return "https://mediaauth.apple.com/auth-bridge/" + e
        }
        constructor() {
            super(),
                (this.whenFrameInited = new Promise((e) => (this._frameInitResolve = e))),
                (this.whenAuthCompleted = new Promise((e) => (this._authUpdateResolve = e))),
                (this.frame = document.createElement("iframe")),
                (this.frame.src = this._getIframeSrc()),
                (this.frame.style.display = "none"),
                document.body.appendChild(this.frame),
                this.init(window, this.frame.contentWindow)
        }
    }
    const ye = new Set([]),
        fe = /\.apple\.com$/
    function getCommerceHostname(e, n) {
        !n && "undefined" != typeof location && location.hostname && (n = location)
        let d = e + ".itunes.apple.com"
        if (!n) return d
        const h = (function (e) {
            if (!e || !fe.test(e)) return
            const n = e.split(".")
            let d = n[n.length - 3]
            const h = d
            if (d && d.includes("-")) {
                const e = d.split("-")
                d = e[e.length - 1]
            }
            return ye.has(d) ? h : void 0
        })(n.hostname)
        return h && (d = `${e}.${h}.apple.com`), d
    }
    var me, ge, ve
    function buildQueryParams(e = { app: me.APP, p: me.P }) {
        return (
            void 0 === e.app && (e.app = me.APP),
            void 0 === e.p && (e.p = me.P),
            Object.keys(e)
                .map((n) => `${encodeURIComponent(n)}=${encodeURIComponent(e[n])}`)
                .join("&")
        )
    }
    !(function (e) {
        ;(e.APP = "music"), (e.P = "subscribe")
    })(me || (me = {})),
        (function (e) {
            ;(e.DEFAULT_CID = "pldfltcid"),
                (e.TV_CID = "pltvcid"),
                (e.RESTRICTIONS_ENABLED = "itre"),
                (e.STOREFRONT_COUNTRY_CODE = "itua"),
                (e.USER_TOKEN = "media-user-token")
        })(ge || (ge = {})),
        (e.SKRealm = void 0),
        ((ve = e.SKRealm || (e.SKRealm = {}))[(ve.MUSIC = 0)] = "MUSIC"),
        (ve[(ve.PODCAST = 1)] = "PODCAST"),
        (ve[(ve.TV = 2)] = "TV")
    const be = { [e.SKRealm.TV]: "com.apple.onboarding.tvapp", [e.SKRealm.MUSIC]: "com.apple.onboarding.applemusic" },
        _e = { [e.SKRealm.TV]: "pltvcid", [e.SKRealm.MUSIC]: "pldfltcid" },
        Te = memoize((e) => {
            const n = new Uint16Array(e),
                d = n.length
            let h = ""
            for (let p = 0; p < d; p++) h += String.fromCharCode(n[p])
            return h
        }),
        Se = memoize((e) => {
            const n = P(e)
            return Pe(n)
        })
    function ensureArray(e = []) {
        return Array.isArray(e) ? e : [e]
    }
    const Pe = memoize((e) => {
            const n = e.length,
                d = new ArrayBuffer(n),
                h = new Uint8Array(d)
            for (let p = 0; p < n; p++) h[p] = e.charCodeAt(p)
            return h
        }),
        Ee = memoize((e) => {
            const n = e.length,
                d = new ArrayBuffer(2 * n),
                h = new Uint16Array(d)
            for (let p = 0; p < n; p++) h[p] = e.charCodeAt(p)
            return h
        }),
        ke = memoize((e) => {
            let n,
                d,
                h,
                p,
                y,
                m,
                g,
                b = 0
            const _ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
            let T = ""
            for (; b < e.length; )
                (n = e[b++]),
                    (d = b < e.length ? e[b++] : Number.NaN),
                    (h = b < e.length ? e[b++] : Number.NaN),
                    (p = n >> 2),
                    (y = ((3 & n) << 4) | (d >> 4)),
                    (m = ((15 & d) << 2) | (h >> 6)),
                    (g = 63 & h),
                    isNaN(d) ? (m = g = 64) : isNaN(h) && (g = 64),
                    (T += _.charAt(p) + _.charAt(y) + _.charAt(m) + _.charAt(g))
            return T
        })
    function asyncGeneratorStep$16(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    var we
    !(function (e) {
        ;(e[(e.ParseError = -32700)] = "ParseError"),
            (e[(e.InvalidRequest = -32600)] = "InvalidRequest"),
            (e[(e.MethodNotFound = -32601)] = "MethodNotFound"),
            (e[(e.InvalidParams = -32602)] = "InvalidParams"),
            (e[(e.InternalError = -32603)] = "InternalError")
    })(we || (we = {}))
    class Dispatch {
        get source() {
            return this._source
        }
        set source(e) {
            if (!e && this._source)
                return this._source.removeEventListener("message", this.handle), void (this._source = void 0)
            e.addEventListener("message", this.handle), (this._source = e)
        }
        apply(e, n) {
            if (!this.destination) throw new Error("No destination")
            const d = this._sequence++,
                h = new Promise((e, n) => {
                    this._registry[d] = { resolve: e, reject: n }
                })
            return this.send(this.destination, { jsonrpc: "2.0", id: d, method: e, params: n }), h
        }
        call(e, ...n) {
            return this.apply(e, n)
        }
        handleRequest(e) {
            var n,
                d = this
            return ((n = function* () {
                const n = { jsonrpc: "2.0", id: e.id },
                    h = d.methods[e.method]
                if (!h) return Object.assign(n, { error: { code: we.MethodNotFound, message: "Method not found" } })
                try {
                    const d = yield h.apply(void 0, ensureArray(e.params))
                    return Object.assign(n, { result: d })
                } catch (Y) {
                    return Object.assign(n, { error: { code: Y.code || we.InternalError, message: Y.message } })
                }
            }),
            function () {
                var e = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = n.apply(e, d)
                    function _next(e) {
                        asyncGeneratorStep$16(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$16(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        handleResponse(e) {
            const n = this._registry[e.id]
            delete this._registry[e.id],
                n && (e.error ? n.reject(Object.assign(Error(), e.error)) : n.resolve(e.result))
        }
        send(e, n) {
            e.postMessage(n, e.window === e ? this.origin : void 0)
        }
        constructor(e = {}) {
            ;(this._registry = {}),
                (this._sequence = 0),
                (this.handle = (e) => {
                    e.data &&
                        "2.0" === e.data.jsonrpc &&
                        (("*" !== this.origin && this.origin !== e.origin) ||
                            (e.data.method && this.destination
                                ? this.handleRequest(e.data).then((e) => {
                                      this.send(this.destination, e)
                                  })
                                : (hasOwn(e.data, "result") || e.data.error) && this.handleResponse(e.data)))
                }),
                (this.destination = e.destination),
                (this.methods = e.methods || {}),
                (this.origin = e.origin || "*"),
                e.source && (this.source = e.source)
        }
    }
    function asyncGeneratorStep$15(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$15(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$15(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$15(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$H(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$H(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$H(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$r(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var Ie
    function validateToken(e) {
        if ("string" != typeof e) return !1
        const n = e.match(/[a-zA-Z0-9=\/+]{32,}==$/)
        var d
        return null !== (d = n && n.length > 0) && void 0 !== d && d
    }
    !(function (e) {
        ;(e[(e.UNAVAILABLE = -1)] = "UNAVAILABLE"),
            (e[(e.NOT_DETERMINED = 0)] = "NOT_DETERMINED"),
            (e[(e.DENIED = 1)] = "DENIED"),
            (e[(e.RESTRICTED = 2)] = "RESTRICTED"),
            (e[(e.AUTHORIZED = 3)] = "AUTHORIZED")
    })(Ie || (Ie = {}))
    const Oe = `https://${getCommerceHostname("buy")}/commerce/account/authenticateMusicKitRequest`,
        Ae = "https://authorize.music.apple.com",
        Re = /^https?:\/\/(.+\.)*(apple\.com|apps\.mzstatic\.com)(\/[\w\d]+)*$/
    var Ce, Me
    !(function (e) {
        ;(e[(e.AUTHORIZE = 0)] = "AUTHORIZE"), (e[(e.SUBSCRIBE = 1)] = "SUBSCRIBE")
    })(Ce || (Ce = {}))
    class ServiceSetupView {
        get isServiceView() {
            return (
                /(authorize\.(.+\.)*apple\.com)/i.test(window.location.hostname) ||
                (window && window.name === this.target) ||
                !1
            )
        }
        focus() {
            this._window && window.focus && this._window.focus()
        }
        load(e = { action: Ce.AUTHORIZE }) {
            var n = this
            return _asyncToGenerator$15(function* () {
                return e.action === Ce.SUBSCRIBE ? n._subscribeAction(e.parameters) : n._authorizeAction(e.parameters)
            })()
        }
        present(e = "", n) {
            const { height: d, left: h, top: p, width: y } = this._calculateClientDimensions(),
                m = {
                    height: 650,
                    menubar: "no",
                    resizable: "no",
                    scrollbars: "no",
                    status: "no",
                    toolbar: "no",
                    width: 650
                },
                g = _objectSpread$H(
                    _objectSpreadProps$r(_objectSpread$H({}, m), {
                        left: y / 2 - m.width / 2 + h,
                        top: d / 2 - m.height / 2 + p
                    }),
                    n
                ),
                b = Object.keys(g)
                    .map((e) => `${e}=${g[e]}`)
                    .join(",")
            return (
                /trident|msie/i.test(navigator.userAgent)
                    ? ((this._window = window.open(window.location.href, this.target, b) || void 0),
                      (this._window.location.href = e))
                    : (this._window = window.open(e, this.target, b) || void 0),
                /\bedge\b/i.test(navigator.userAgent) && (this._window.opener = self),
                this.focus(),
                this._window
            )
        }
        _startPollingForWindowClosed(e) {
            this._window &&
                void 0 === this._windowClosedInterval &&
                (this._windowClosedInterval = setInterval(() => {
                    var n
                    ;(null === (n = this._window) || void 0 === n ? void 0 : n.closed) &&
                        (this._stopPollingForWindowClosed(), e())
                }, 500))
        }
        _stopPollingForWindowClosed() {
            void 0 !== this._windowClosedInterval &&
                (clearInterval(this._windowClosedInterval), (this._windowClosedInterval = void 0))
        }
        _authorizeAction(e = {}) {
            var n = this
            return _asyncToGenerator$15(function* () {
                var d
                let h, p
                const y = (null === (d = window.location) || void 0 === d ? void 0 : d.href) || ""
                return (
                    "GET" === n.authenticateMethod
                        ? (p = `${Ae}/woa?${buildQueryParams(
                              _objectSpreadProps$r(_objectSpread$H({}, n.deeplinkParameters), {
                                  a: btoa(n._thirdPartyInfo()),
                                  referrer: y
                              })
                          )}`)
                        : ((h = n._buildFormElement(Oe)), document.body.appendChild(h)),
                    new Promise((d, y) => {
                        const m = n.present(p)
                        n._startPollingForWindowClosed(() => {
                            y(Ie.NOT_DETERMINED)
                        }),
                            (n.dispatch = new Dispatch({
                                methods: {
                                    authorize(e, n, h) {
                                        validateToken(e)
                                            ? d({ restricted: n && "1" === n, userToken: e, cid: h })
                                            : y(Ie.NOT_DETERMINED)
                                    },
                                    close() {},
                                    decline() {
                                        y(Ie.DENIED)
                                    },
                                    switchUserId() {
                                        y(Ie.NOT_DETERMINED)
                                    },
                                    thirdPartyInfo: () =>
                                        n._thirdPartyInfo(
                                            n.developerToken,
                                            _objectSpread$H({}, n.deeplinkParameters, e)
                                        ),
                                    unavailable() {
                                        y(Ie.UNAVAILABLE)
                                    }
                                },
                                origin: Ae,
                                source: window,
                                destination: m
                            })),
                            h && h.submit()
                    })
                )
            })()
        }
        _buildFormElement(e, n = this.target, d = this.developerToken) {
            const h = document.createElement("form")
            h.setAttribute("method", "post"),
                h.setAttribute("action", e),
                h.setAttribute("target", n),
                (h.style.display = "none")
            const p = document.createElement("input")
            p.setAttribute("name", "jwtToken"), p.setAttribute("value", d), h.appendChild(p)
            const y = document.createElement("input")
            y.setAttribute("name", "isWebPlayer"), y.setAttribute("value", "true"), h.appendChild(y)
            const m = document.createElement("input")
            return m.setAttribute("name", "LogoURL"), m.setAttribute("value", ""), h.appendChild(m), h
        }
        _calculateClientDimensions(e = window) {
            return {
                height: e.innerHeight
                    ? e.innerHeight
                    : document.documentElement.clientHeight
                    ? document.documentElement.clientHeight
                    : screen.height,
                left: e.screenLeft ? e.screenLeft : screen.availLeft || screen.left,
                top: e.screenTop ? e.screenTop : screen.availTop || screen.top,
                width: e.innerWidth
                    ? e.innerWidth
                    : document.documentElement.clientWidth
                    ? document.documentElement.clientWidth
                    : screen.width
            }
        }
        _subscribeAction(e = {}) {
            var n = this
            return _asyncToGenerator$15(function* () {
                return (
                    Object.assign(e, n.deeplinkParameters),
                    new Promise((d, h) => {
                        const p = "https://authorize.music.apple.com/upsell?" + buildQueryParams(e)
                        n.present(p),
                            window.addEventListener("message", ({ data: e, origin: n, source: p }) => {
                                const { closeWindow: y, launchClient: m } = "string" == typeof e ? JSON.parse(e) : e
                                ;(n && !Re.test(n)) ||
                                    (m
                                        ? 0 === m.supported
                                            ? h("Unable to subscribe on this platform.")
                                            : d(m)
                                        : h("Subscribe action error."))
                            })
                    })
                )
            })()
        }
        _thirdPartyInfo(e = this.developerToken, n) {
            let d = this.iconURL
            const h = window.location.host || document.referrer,
                p = [
                    ...[].slice.call(document.querySelectorAll('link[rel="apple-music-app-icon"]')),
                    ...[].slice.call(document.querySelectorAll('link[rel="apple-touch-icon-precomposed"]')),
                    ...[].slice.call(document.querySelectorAll('link[rel="apple-touch-icon"]'))
                ]
            if (p && p[0] && p[0].href) {
                const e = p.find((e) => !!e.sizes && "120x120" === e.sizes.value)
                var y
                d = null !== (y = null == e ? void 0 : e.href) && void 0 !== y ? y : p[0].href
            }
            return JSON.stringify({
                thirdPartyIconURL: d,
                thirdPartyName: h,
                thirdPartyParameters: n,
                thirdPartyToken: e
            })
        }
        constructor(e, n = {}) {
            if (
                ((this.developerToken = e),
                (this.authenticateMethod = "GET"),
                (this.target = "apple-music-service-view"),
                (this.deeplinkParameters = (n && n.deeplinkParameters) || {}),
                (this.iconURL = n && n.iconURL),
                (this.authenticateMethod = (n && n.authenticateMethod) || "GET"),
                this.isServiceView && window.opener !== window)
            ) {
                var d
                const e = null === (d = getSessionStorage()) || void 0 === d ? void 0 : d.getItem("ac"),
                    n = null != e ? new URL(e).origin : void 0
                var h
                if (n)
                    this.dispatch = new Dispatch({
                        destination: null !== (h = window.opener) && void 0 !== h ? h : void 0,
                        origin: n,
                        source: window
                    })
            }
        }
    }
    function asyncGeneratorStep$14(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$14(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$14(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$14(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _fetchStorefronts() {
        return (_fetchStorefronts = _asyncToGenerator$14(function* (e, n = "https://api.music.apple.com/v1") {
            const d = new Headers({ Authorization: "Bearer " + e }),
                h = yield fetch(n + "/storefronts", { headers: d }),
                p = yield h.json()
            return p.errors ? Promise.reject(p.errors) : p.data
        })).apply(this, arguments)
    }
    !(function (e) {
        ;(e.ID = "us"), (e.LANGUAGE_TAG = "en-gb")
    })(Me || (Me = {}))
    function asyncGeneratorStep$13(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$13(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$13(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$13(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$G(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$G(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$G(e, n, d[n])
                })
        }
        return e
    }
    var De,
        xe =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Le =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    !(function (e) {
        ;(e.authorizationStatusDidChange = "authorizationStatusDidChange"),
            (e.authorizationStatusWillChange = "authorizationStatusWillChange"),
            (e.eligibleForSubscribeView = "eligibleForSubscribeView"),
            (e.storefrontCountryCodeDidChange = "storefrontCountryCodeDidChange"),
            (e.storefrontIdentifierDidChange = "storefrontIdentifierDidChange"),
            (e.userTokenDidChange = "userTokenDidChange")
    })(De || (De = {})),
        ge.DEFAULT_CID
    const Ne = "https://" + getCommerceHostname("buy"),
        je = `https://${getCommerceHostname("play")}/WebObjects/MZPlay.woa/wa`
    class StoreKit extends Notifications {
        updateUserTokenFromStorage() {
            const e = this._getStorageItem(ge.USER_TOKEN)
            this.userToken = e || void 0
        }
        get authorizationStatus() {
            return this._authorizationStatus
        }
        set authorizationStatus(e) {
            this._authorizationStatus !== e &&
                (this._getIsActiveSubscription.updateCache(void 0),
                this.dispatchEvent(De.authorizationStatusWillChange, {
                    authorizationStatus: this._authorizationStatus,
                    newAuthorizationStatus: e
                }),
                (this._authorizationStatus = e),
                this.dispatchEvent(De.authorizationStatusDidChange, { authorizationStatus: e }))
        }
        get cid() {
            if (!this._cids[this.cidNamespace]) {
                const e = this._getStorageItem(this.cidNamespace)
                this._cids[this.cidNamespace] = e || void 0
            }
            return this._cids[this.cidNamespace]
        }
        set cid(e) {
            e ? this._setStorageItem(this.cidNamespace, e) : this._removeStorageItem(this.cidNamespace),
                (this._cids[this.cidNamespace] = e)
        }
        eligibleForSubscribeView() {
            var e = this
            return _asyncToGenerator$13(function* () {
                const n = yield e.hasMusicSubscription()
                return (!e.hasAuthorized || (e.hasAuthorized && !n)) && !e._dispatchedSubscribeView
            })()
        }
        get hasAuthorized() {
            return this.authorizationStatus > Ie.DENIED
        }
        get logoutURL() {
            if (!this._disableLogoutURL) return this.playBase + "/webPlayerLogout"
        }
        get _pldfltcid() {
            return this._cids[ge.DEFAULT_CID]
        }
        set _pldfltcid(e) {
            this._cids[ge.DEFAULT_CID] = e
        }
        get restrictedEnabled() {
            if (this.userToken && "boolean" != typeof this._restrictedEnabled) {
                const e = this._getStorageItem(ge.RESTRICTIONS_ENABLED)
                if (e) this._restrictedEnabled = "0" !== e
                else if (this._storefrontCountryCode) {
                    const e = ["br", "ch", "gt", "hu", "id", "in", "it", "kr", "la", "lt", "my", "ru", "sg", "tr"]
                    this._restrictedEnabled = -1 !== e.indexOf(this._storefrontCountryCode) || void 0
                }
            }
            return this._restrictedEnabled
        }
        set restrictedEnabled(e) {
            this._restrictedEnabledOverridden ||
                (this.userToken && void 0 !== e && this._setStorageItem(ge.RESTRICTIONS_ENABLED, e ? "1" : "0"),
                (this._restrictedEnabled = e),
                e && (this.authorizationStatus = Ie.RESTRICTED))
        }
        overrideRestrictEnabled(e) {
            ;(this._restrictedEnabledOverridden = !1),
                (this.restrictedEnabled = e),
                (this._restrictedEnabledOverridden = !0)
        }
        get storefrontCountryCode() {
            if (!this._storefrontCountryCode) {
                const e = this._getStorageItem(ge.STOREFRONT_COUNTRY_CODE)
                this._storefrontCountryCode = (null == e ? void 0 : e.toLowerCase()) || Me.ID
            }
            return this._storefrontCountryCode
        }
        set storefrontCountryCode(e) {
            e && this.userToken
                ? this._setStorageItem(ge.STOREFRONT_COUNTRY_CODE, e)
                : this._removeStorageItem(ge.STOREFRONT_COUNTRY_CODE),
                e !== this._storefrontCountryCode &&
                    ((this._storefrontCountryCode = e),
                    this.dispatchEvent(De.storefrontCountryCodeDidChange, { storefrontCountryCode: e }))
        }
        get storefrontIdentifier() {
            return this._storefrontIdentifier
        }
        set storefrontIdentifier(e) {
            ;(this._storefrontIdentifier = e),
                this.dispatchEvent(De.storefrontIdentifierDidChange, { storefrontIdentifier: e })
        }
        runTokenValidations(e, n = !0) {
            e && validateToken(e)
                ? (n && this._setStorageItem(ge.USER_TOKEN, e),
                  (this.authorizationStatus = this.restrictedEnabled ? Ie.RESTRICTED : Ie.AUTHORIZED))
                : (this._removeStorageItem(ge.USER_TOKEN), (this.authorizationStatus = Ie.NOT_DETERMINED))
        }
        wrapDynamicUserTokenForChanges(e, n = invoke(e)) {
            if ("function" != typeof e) return e
            let d = n
            return () => {
                const n = invoke(e)
                return (
                    d !== n &&
                        ((d = n),
                        this.runTokenValidations(n, !1),
                        this.dispatchEvent(De.userTokenDidChange, { userToken: n })),
                    n || ""
                )
            }
        }
        get dynamicUserToken() {
            return this._dynamicUserToken
        }
        set dynamicUserToken(e) {
            const n = invoke(e)
            ;(this._dynamicUserToken = this.wrapDynamicUserTokenForChanges(e, n)),
                this.runTokenValidations(n, "function" != typeof e),
                this.dispatchEvent(De.userTokenDidChange, { userToken: n })
        }
        get userToken() {
            return invoke(this.dynamicUserToken)
        }
        set userToken(e) {
            this.dynamicUserToken = e
        }
        get userTokenIsValid() {
            return validateToken(this.userToken)
        }
        deeplinkURL(e = {}) {
            return (
                "https://finance-app.itunes.apple.com/deeplink?" +
                buildQueryParams((e = _objectSpread$G({}, this.deeplinkParameters || {}, e)))
            )
        }
        itunesDeeplinkURL(e = { p: "browse" }) {
            return (
                "https://itunes.apple.com/deeplink?" +
                buildQueryParams((e = _objectSpread$G({}, this.deeplinkParameters || {}, e)))
            )
        }
        pldfltcid() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (!e._cids[ge.DEFAULT_CID])
                    try {
                        yield e.infoRefresh()
                    } catch (Mr) {
                        return
                    }
                return e._cids[ge.DEFAULT_CID]
            })()
        }
        renewUserToken() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (!e.userToken) return e.requestUserToken()
                const n = new Headers({
                        Authorization: "Bearer " + e.developerToken,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-Apple-Music-User-Token": "" + e.userToken
                    }),
                    d = yield fetch(e.playBase + "/renewMusicToken", { method: "POST", headers: n })
                if (401 === d.status) return yield e.revokeUserToken(), Promise.reject(new Error("Renew token"))
                const h = yield d.json()
                return h["music-token"] && (e.userToken = h["music-token"]), e.userToken
            })()
        }
        requestStorefrontCountryCode() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (e.authorizationStatus <= Ie.DENIED)
                    return Promise.reject("Not authorized: " + e.authorizationStatus)
                const n = new Headers({
                        Authorization: "Bearer " + e.developerToken,
                        "Music-User-Token": e.userToken || ""
                    }),
                    d = yield fetch(e.apiBase + "/me/storefront", { headers: n })
                if (d && !d.ok) return e._reset(), Promise.reject("Storefront Country Code error.")
                const h = yield d.json()
                if (h.errors) return Promise.reject(h.errors)
                const [p] = h.data
                return p && p.id
                    ? ((e.storefrontCountryCode = p.id), e.storefrontCountryCode)
                    : Promise.reject("Storefront Country Code error.")
            })()
        }
        requestStorefrontIdentifier() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (!e.storefrontIdentifier) {
                    const n = yield class {
                        static inferFromLanguages(
                            e,
                            n = (function () {
                                if ("undefined" == typeof navigator) return []
                                if (navigator.languages) return navigator.languages
                                const e = navigator.language || navigator.userLanguage
                                return e ? [e] : []
                            })()
                        ) {
                            return _asyncToGenerator$14(function* () {
                                const d = yield (function (e) {
                                        return _fetchStorefronts.apply(this, arguments)
                                    })(e),
                                    h = d.map((e) => e.id),
                                    p = n[0] || "en-US",
                                    [y, m] = p.toLowerCase().split(/-|_/),
                                    g = h.includes(m) ? m : "us"
                                return d.find((e) => e.id === g)
                            })()
                        }
                        constructor(e, n, d) {
                            ;(this.id = e),
                                (this.attributes = n),
                                (this.type = "storefronts"),
                                (this.href = d || `/v1/${this.type}/${e}`)
                        }
                    }.inferFromLanguages(e.developerToken)
                    e.storefrontIdentifier = n.id
                }
                return e.storefrontIdentifier
            })()
        }
        requestUserToken() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (e._serviceSetupView.isServiceView) return e.userToken || ""
                try {
                    const n = yield e._serviceSetupView.load({ action: Ce.AUTHORIZE })
                    ;(e.cid = n.cid), (e.userToken = n.userToken), (e.restrictedEnabled = n.restricted)
                } catch (n) {
                    return e._reset(), (e.authorizationStatus = n), Promise.reject(n)
                }
                return e.userToken
            })()
        }
        revokeUserToken() {
            var e = this
            return _asyncToGenerator$13(function* () {
                var n
                try {
                    yield e._webPlayerLogout()
                } catch (Mr) {}
                null === (n = e.authBridgeApp) || void 0 === n || n.clearAuth(),
                    e.dispatchEvent(De.authorizationStatusWillChange, {
                        authorizationStatus: e.authorizationStatus,
                        newAuthorizationStatus: Ie.NOT_DETERMINED
                    }),
                    e._reset(),
                    e.dispatchEvent(De.authorizationStatusDidChange, { authorizationStatus: e.authorizationStatus }),
                    e.dispatchEvent(De.userTokenDidChange, { userToken: e.userToken })
            })()
        }
        setCids(e) {
            ;(this._cids = _objectSpread$G({}, this._cids, e)),
                Object.keys(this._cids).forEach((e) => {
                    this._setStorageItem(e, this._cids[e])
                })
        }
        hasMusicSubscription() {
            var e = this
            return _asyncToGenerator$13(function* () {
                return !!e.hasAuthorized && e._getIsActiveSubscription()
            })()
        }
        _getIsActiveSubscription() {
            var e = this
            return _asyncToGenerator$13(function* () {
                var n
                return !!(null === (n = (yield e.me()).subscription) || void 0 === n ? void 0 : n.active)
            })()
        }
        resetSubscribeViewEligibility() {
            this._dispatchedSubscribeView = !1
        }
        presentSubscribeViewForEligibleUsers(e = {}, n = !0) {
            var d = this
            return _asyncToGenerator$13(function* () {
                const h = yield d.eligibleForSubscribeView()
                if (!d._serviceSetupView.isServiceView && h) {
                    if (!n)
                        return d.dispatchEvent(De.eligibleForSubscribeView, e), void (d._dispatchedSubscribeView = !0)
                    try {
                        const e = yield d._serviceSetupView.load({ action: Ce.SUBSCRIBE })
                        return (d._dispatchedSubscribeView = !0), e
                    } catch (p) {
                        return d.revokeUserToken()
                    }
                }
            })()
        }
        infoRefresh() {
            var e = this
            return _asyncToGenerator$13(function* () {
                if (e.authorizationStatus <= Ie.DENIED)
                    return Promise.reject("Not authorized: " + e.authorizationStatus)
                const n = new Headers({
                    Authorization: "Bearer " + e.developerToken,
                    "Music-User-Token": e.userToken || ""
                })
                try {
                    const d = yield fetch(e.iTunesBuyBase + "/account/web/infoRefresh", {
                            credentials: "include",
                            headers: n
                        }),
                        h = yield d.json()
                    e.setCids(h)
                } catch (Mr) {}
            })()
        }
        me() {
            if (this.authorizationStatus <= Ie.DENIED)
                return Promise.reject("Not authorized: " + this.authorizationStatus)
            if (!this._me) {
                var n = this
                this._me = new Promise(
                    ((d = _asyncToGenerator$13(function* (d, h) {
                        const p = new Headers({
                                Authorization: "Bearer " + n.developerToken,
                                "Music-User-Token": n.userToken || ""
                            }),
                            y = addQueryParamsToURL(
                                n.apiBase + "/me/account",
                                _objectSpread$G({ meta: "subscription" }, n.meParameters)
                            ),
                            m = yield fetch(y, { headers: p })
                        if (m && !m.ok) return n.realm !== e.SKRealm.TV && n._reset(), h("Account error.")
                        let g = yield m.json()
                        if (g.errors) return h(g.errors)
                        const { data: b, meta: _ } = g
                        if (!_ || !_.subscription) return h("Account error.")
                        n.storefrontCountryCode = _.subscription.storefront
                        const T = { meta: _, subscription: _.subscription }
                        return b && b.length && (T.attributes = b[0].attributes), d(T)
                    })),
                    function (e, n) {
                        return d.apply(this, arguments)
                    })
                )
                    .then((e) => {
                        var n
                        return (
                            this._getIsActiveSubscription.updateCache(
                                (null === (n = e.subscription) || void 0 === n ? void 0 : n.active) || !1
                            ),
                            (this._me = null),
                            e
                        )
                    })
                    .catch((e) => ((this._me = null), Promise.reject(e)))
            }
            var d
            return this._me
        }
        _getStorageItem(e) {
            var n
            if (e)
                return "cookie" === this.persist
                    ? getCookie(e)
                    : "localstorage" === this.persist
                    ? null === (n = this.storage) || void 0 === n
                        ? void 0
                        : n.getItem(`${this.storagePrefix}.${e}`)
                    : void 0
        }
        _processLocationHash(e) {
            const n = /^\#([a-zA-Z0-9+\/]{200,}={0,2})$/
            if (n.test(e)) {
                const d = e.replace(n, "$1")
                try {
                    const { itre: e, musicUserToken: n, cid: h } = JSON.parse(atob(d))
                    ;(this.restrictedEnabled = e && "1" === e), (this.userToken = n), (this.cid = h)
                } catch (Mr) {}
                history.replaceState(null, document.title, " ")
            }
        }
        _removeStorageItem(e) {
            if ("cookie" === this.persist) this._removeCookieFromDomains(e)
            else if ("localstorage" === this.persist) {
                var n
                return null === (n = this.storage) || void 0 === n ? void 0 : n.removeItem(`${this.storagePrefix}.${e}`)
            }
        }
        _removeCookieFromDomains(e, n = window) {
            removeCookie(e)
            const { hostname: d } = n.location,
                h = d.split(".")
            if (h.length && (h.shift(), h.length > 2))
                for (let p = h.length; p > 2; p--) {
                    const d = h.join(".")
                    h.shift(), removeCookie(e, n, d)
                }
        }
        _reset(e = Ie.NOT_DETERMINED) {
            ;(this._authorizationStatus = e),
                (this._cids = {}),
                (this._dispatchedSubscribeView = !1),
                (this._restrictedEnabled = void 0),
                (this._storefrontCountryCode = void 0),
                this._getIsActiveSubscription.updateCache(void 0),
                Object.keys(_e).forEach((e) => {
                    this._removeStorageItem(_e[e])
                }),
                this._removeStorageItem(ge.RESTRICTIONS_ENABLED),
                this._removeStorageItem(ge.USER_TOKEN),
                this._removeStorageItem(ge.STOREFRONT_COUNTRY_CODE),
                (this._dynamicUserToken = void 0),
                (this._me = null)
        }
        _setStorageItem(e, n) {
            var d, h
            return "cookie" === this.persist
                ? (null === (d = this.authBridgeApp) || void 0 === d || d.setCookieItem(e, n),
                  setCookie(e, n, "/", 180))
                : "localstorage" === this.persist
                ? null === (h = this.storage) || void 0 === h
                    ? void 0
                    : h.setItem(`${this.storagePrefix}.${e}`, n)
                : void 0
        }
        _webPlayerLogout() {
            var e = this
            return _asyncToGenerator$13(function* () {
                const n = e.logoutURL
                if (!n) return
                const d = new Headers({
                        Authorization: "Bearer " + e.developerToken,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-Apple-Music-User-Token": "" + e.userToken
                    }),
                    h = yield fetch(n, { method: "POST", headers: d, credentials: "same-origin" })
                return h && !h.ok ? Promise.reject(h.status) : h.json()
            })()
        }
        constructor(n, d) {
            super([
                De.authorizationStatusDidChange,
                De.authorizationStatusWillChange,
                De.eligibleForSubscribeView,
                De.storefrontCountryCodeDidChange,
                De.userTokenDidChange,
                De.storefrontIdentifierDidChange
            ]),
                (this.developerToken = n),
                (this.apiBase = "https://api.music.apple.com/v1"),
                (this.iTunesBuyBase = Ne),
                (this.meParameters = {}),
                (this.persist = "localstorage"),
                (this.playBase = je),
                (this.prefix = "music"),
                (this.realm = e.SKRealm.MUSIC),
                (this.storage = getLocalStorage()),
                (this._authorizationStatus = Ie.NOT_DETERMINED),
                (this._disableLogoutURL = !1),
                (this._dispatchedSubscribeView = !1),
                (this._me = null),
                (this._cids = {}),
                (this._restrictedEnabledOverridden = !1),
                (this._dynamicUserToken = getCookie(ge.USER_TOKEN)),
                he.info("StoreKit initialized"),
                d &&
                    (d.apiBase && (this.apiBase = d.apiBase),
                    d.deeplink && (this.deeplinkParameters = d.deeplink),
                    d.meParameters && (this.meParameters = d.meParameters),
                    d.persist && (this.persist = d.persist),
                    d.prefix && (this.prefix = d.prefix),
                    void 0 !== d.realm && (this.realm = d.realm),
                    (this.bundleId = be[this.realm])),
                (this.cidNamespace = _e[this.realm]),
                (this._developerToken = new DeveloperToken(n)),
                (this._serviceSetupView = new ServiceSetupView(n, {
                    authenticateMethod: d && d.authenticateMethod,
                    iconURL: d && d.iconURL,
                    deeplinkParameters: this.deeplinkParameters
                })),
                (this.storagePrefix = `${this.prefix}.${this._developerToken.teamId}`.toLocaleLowerCase()),
                this.updateUserTokenFromStorage(),
                this.developerToken && this.userTokenIsValid && (this._restrictedEnabled = this.restrictedEnabled),
                (this._storefrontCountryCode = this.storefrontCountryCode),
                (this.whenAuthCompleted = Promise.resolve()),
                isNodeEnvironment$1() ||
                    (this._processLocationHash(window.location.hash),
                    "cookie" !== this.persist ||
                        (null == d ? void 0 : d.disableAuthBridge) ||
                        ((this.authBridgeApp = new AuthBridgeApp()),
                        (this.authBridgeApp.authClearedFromOtherFrame = this.revokeUserToken.bind(this)),
                        (this.whenAuthCompleted = this.authBridgeApp.whenAuthCompleted.then(() => {
                            this.updateUserTokenFromStorage()
                        }))))
        }
    }
    xe(
        [
            (
                (e = 300) =>
                (n, d, h) => {
                    if (void 0 === h || "function" != typeof h.value)
                        throw new TypeError(
                            `Only methods can be decorated with @CachedResult, but ${d} is not a method.`
                        )
                    return {
                        configurable: !0,
                        get() {
                            const n = h.value,
                                p = 1e3 * e
                            let y,
                                m = -1
                            function cachedResultMethod() {
                                return _cachedResultMethod.apply(this, arguments)
                            }
                            function _cachedResultMethod() {
                                return (_cachedResultMethod = _asyncToGenerator$17(function* (...e) {
                                    const d = Date.now()
                                    return (
                                        (void 0 === y || -1 === m || (m > 0 && d > m + p)) &&
                                            ((m = d), (y = yield n.apply(this, e))),
                                        y
                                    )
                                })).apply(this, arguments)
                            }
                            return (
                                (cachedResultMethod.updateCache = function (e) {
                                    ;(m = Date.now()), (y = e)
                                }),
                                (cachedResultMethod.getCachedValue = () => y),
                                Object.defineProperty(this, d, {
                                    value: cachedResultMethod,
                                    configurable: !0,
                                    writable: !0
                                }),
                                cachedResultMethod
                            )
                        }
                    }
                }
            )(900),
            Le("design:type", Function),
            Le("design:paramtypes", [])
        ],
        StoreKit.prototype,
        "_getIsActiveSubscription",
        null
    )
    var Ue =
        "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
            ? window
            : void 0 !== n
            ? n
            : "undefined" != typeof self
            ? self
            : {}
    function unwrapExports(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
    }
    function createCommonjsModule(e, n) {
        return e((n = { exports: {} }), n.exports), n.exports
    }
    var $e = createCommonjsModule(function (e) {
            var n = (e.exports =
                "undefined" != typeof window && window.Math == Math
                    ? window
                    : "undefined" != typeof self && self.Math == Math
                    ? self
                    : Function("return this")())
            "number" == typeof __g && (__g = n)
        }),
        Ge = createCommonjsModule(function (e) {
            var n = (e.exports = { version: "2.6.12" })
            "number" == typeof __e && (__e = n)
        })
    Ge.version
    var _isObject = function (e) {
            return "object" == typeof e ? null !== e : "function" == typeof e
        },
        _anObject = function (e) {
            if (!_isObject(e)) throw TypeError(e + " is not an object!")
            return e
        },
        _fails = function (e) {
            try {
                return !!e()
            } catch (Mr) {
                return !0
            }
        },
        Be = !_fails(function () {
            return (
                7 !=
                Object.defineProperty({}, "a", {
                    get: function () {
                        return 7
                    }
                }).a
            )
        }),
        Fe = $e.document,
        Ke = _isObject(Fe) && _isObject(Fe.createElement),
        Ve =
            !Be &&
            !_fails(function () {
                return (
                    7 !=
                    Object.defineProperty(((e = "div"), Ke ? Fe.createElement(e) : {}), "a", {
                        get: function () {
                            return 7
                        }
                    }).a
                )
                var e
            }),
        He = Object.defineProperty,
        qe = {
            f: Be
                ? Object.defineProperty
                : function (e, n, d) {
                      if (
                          (_anObject(e),
                          (n = (function (e, n) {
                              if (!_isObject(e)) return e
                              var d, h
                              if (n && "function" == typeof (d = e.toString) && !_isObject((h = d.call(e)))) return h
                              if ("function" == typeof (d = e.valueOf) && !_isObject((h = d.call(e)))) return h
                              if (!n && "function" == typeof (d = e.toString) && !_isObject((h = d.call(e)))) return h
                              throw TypeError("Can't convert object to primitive value")
                          })(n, !0)),
                          _anObject(d),
                          Ve)
                      )
                          try {
                              return He(e, n, d)
                          } catch (Mr) {}
                      if ("get" in d || "set" in d) throw TypeError("Accessors not supported!")
                      return "value" in d && (e[n] = d.value), e
                  }
        },
        We = Be
            ? function (e, n, d) {
                  return qe.f(
                      e,
                      n,
                      (function (e, n) {
                          return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n }
                      })(1, d)
                  )
              }
            : function (e, n, d) {
                  return (e[n] = d), e
              },
        Ye = {}.hasOwnProperty,
        _has = function (e, n) {
            return Ye.call(e, n)
        },
        ze = 0,
        Qe = Math.random(),
        _uid = function (e) {
            return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++ze + Qe).toString(36))
        },
        Je = createCommonjsModule(function (e) {
            var n = $e["__core-js_shared__"] || ($e["__core-js_shared__"] = {})
            ;(e.exports = function (e, d) {
                return n[e] || (n[e] = void 0 !== d ? d : {})
            })("versions", []).push({
                version: Ge.version,
                mode: "global",
                copyright: "漏 2020 Denis Pushkarev (zloirock.ru)"
            })
        }),
        Xe = Je("native-function-to-string", Function.toString),
        Ze = createCommonjsModule(function (e) {
            var n = _uid("src"),
                d = ("" + Xe).split("toString")
            ;(Ge.inspectSource = function (e) {
                return Xe.call(e)
            }),
                (e.exports = function (e, h, p, y) {
                    var m = "function" == typeof p
                    m && (_has(p, "name") || We(p, "name", h)),
                        e[h] !== p &&
                            (m && (_has(p, n) || We(p, n, e[h] ? "" + e[h] : d.join(String(h)))),
                            e === $e ? (e[h] = p) : y ? (e[h] ? (e[h] = p) : We(e, h, p)) : (delete e[h], We(e, h, p)))
                })(Function.prototype, "toString", function () {
                    return ("function" == typeof this && this[n]) || Xe.call(this)
                })
        }),
        _ctx = function (e, n, d) {
            if (
                ((function (e) {
                    if ("function" != typeof e) throw TypeError(e + " is not a function!")
                })(e),
                void 0 === n)
            )
                return e
            switch (d) {
                case 1:
                    return function (d) {
                        return e.call(n, d)
                    }
                case 2:
                    return function (d, h) {
                        return e.call(n, d, h)
                    }
                case 3:
                    return function (d, h, p) {
                        return e.call(n, d, h, p)
                    }
            }
            return function () {
                return e.apply(n, arguments)
            }
        },
        $export = function (e, n, d) {
            var h,
                p,
                y,
                m,
                g = e & $export.F,
                b = e & $export.G,
                _ = e & $export.S,
                T = e & $export.P,
                S = e & $export.B,
                P = b ? $e : _ ? $e[n] || ($e[n] = {}) : ($e[n] || {}).prototype,
                E = b ? Ge : Ge[n] || (Ge[n] = {}),
                k = E.prototype || (E.prototype = {})
            for (h in (b && (d = n), d))
                (y = ((p = !g && P && void 0 !== P[h]) ? P : d)[h]),
                    (m = S && p ? _ctx(y, $e) : T && "function" == typeof y ? _ctx(Function.call, y) : y),
                    P && Ze(P, h, y, e & $export.U),
                    E[h] != y && We(E, h, m),
                    T && k[h] != y && (k[h] = y)
        }
    ;($e.core = Ge),
        ($export.F = 1),
        ($export.G = 2),
        ($export.S = 4),
        ($export.P = 8),
        ($export.B = 16),
        ($export.W = 32),
        ($export.U = 64),
        ($export.R = 128)
    var et,
        tt,
        rt = $export,
        nt = {}.toString,
        it = Object("z").propertyIsEnumerable(0)
            ? Object
            : function (e) {
                  return "String" ==
                      (function (e) {
                          return nt.call(e).slice(8, -1)
                      })(e)
                      ? e.split("")
                      : Object(e)
              },
        _defined = function (e) {
            if (null == e) throw TypeError("Can't call method on  " + e)
            return e
        },
        _toIobject = function (e) {
            return it(_defined(e))
        },
        at = Math.ceil,
        st = Math.floor,
        _toInteger = function (e) {
            return isNaN((e = +e)) ? 0 : (e > 0 ? st : at)(e)
        },
        ot = Math.min,
        ct = Math.max,
        lt = Math.min,
        ut = Je("keys"),
        dt =
            ((et = !1),
            function (e, n, d) {
                var h,
                    p,
                    y = _toIobject(e),
                    m = (h = y.length) > 0 ? ot(_toInteger(h), 9007199254740991) : 0,
                    g = (function (e, n) {
                        return (e = _toInteger(e)) < 0 ? ct(e + n, 0) : lt(e, n)
                    })(d, m)
                if (et && n != n) {
                    for (; m > g; ) if ((p = y[g++]) != p) return !0
                } else for (; m > g; g++) if ((et || g in y) && y[g] === n) return et || g || 0
                return !et && -1
            }),
        ht = ut[(tt = "IE_PROTO")] || (ut[tt] = _uid(tt)),
        pt = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),
        yt =
            Object.keys ||
            function (e) {
                return (function (e, n) {
                    var d,
                        h = _toIobject(e),
                        p = 0,
                        y = []
                    for (d in h) d != ht && _has(h, d) && y.push(d)
                    for (; n.length > p; ) _has(h, (d = n[p++])) && (~dt(y, d) || y.push(d))
                    return y
                })(e, pt)
            },
        ft = { f: Object.getOwnPropertySymbols },
        mt = { f: {}.propertyIsEnumerable },
        _toObject = function (e) {
            return Object(_defined(e))
        },
        gt = Object.assign,
        vt =
            !gt ||
            _fails(function () {
                var e = {},
                    n = {},
                    d = Symbol(),
                    h = "abcdefghijklmnopqrst"
                return (
                    (e[d] = 7),
                    h.split("").forEach(function (e) {
                        n[e] = e
                    }),
                    7 != gt({}, e)[d] || Object.keys(gt({}, n)).join("") != h
                )
            })
                ? function (e, n) {
                      for (var d = _toObject(e), h = arguments.length, p = 1, y = ft.f, m = mt.f; h > p; )
                          for (
                              var g, b = it(arguments[p++]), _ = y ? yt(b).concat(y(b)) : yt(b), T = _.length, S = 0;
                              T > S;

                          )
                              (g = _[S++]), (Be && !m.call(b, g)) || (d[g] = b[g])
                      return d
                  }
                : gt
    rt(rt.S + rt.F, "Object", { assign: vt }), Ge.Object.assign
    var bt =
            ("undefined" != typeof globalThis && globalThis) ||
            ("undefined" != typeof self && self) ||
            (void 0 !== bt && bt),
        _t = "URLSearchParams" in bt,
        Tt = "Symbol" in bt && "iterator" in Symbol,
        St =
            "FileReader" in bt &&
            "Blob" in bt &&
            (function () {
                try {
                    return new Blob(), !0
                } catch (Mr) {
                    return !1
                }
            })(),
        Pt = "FormData" in bt,
        Et = "ArrayBuffer" in bt
    if (Et)
        var kt = [
                "[object Int8Array]",
                "[object Uint8Array]",
                "[object Uint8ClampedArray]",
                "[object Int16Array]",
                "[object Uint16Array]",
                "[object Int32Array]",
                "[object Uint32Array]",
                "[object Float32Array]",
                "[object Float64Array]"
            ],
            wt =
                ArrayBuffer.isView ||
                function (e) {
                    return e && kt.indexOf(Object.prototype.toString.call(e)) > -1
                }
    function normalizeName(e) {
        if (("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e) || "" === e))
            throw new TypeError('Invalid character in header field name: "' + e + '"')
        return e.toLowerCase()
    }
    function normalizeValue(e) {
        return "string" != typeof e && (e = String(e)), e
    }
    function iteratorFor(e) {
        var n = {
            next: function () {
                var n = e.shift()
                return { done: void 0 === n, value: n }
            }
        }
        return (
            Tt &&
                (n[Symbol.iterator] = function () {
                    return n
                }),
            n
        )
    }
    function Headers$1(e) {
        ;(this.map = {}),
            e instanceof Headers$1
                ? e.forEach(function (e, n) {
                      this.append(n, e)
                  }, this)
                : Array.isArray(e)
                ? e.forEach(function (e) {
                      this.append(e[0], e[1])
                  }, this)
                : e &&
                  Object.getOwnPropertyNames(e).forEach(function (n) {
                      this.append(n, e[n])
                  }, this)
    }
    function consumed(e) {
        if (e.bodyUsed) return Promise.reject(new TypeError("Already read"))
        e.bodyUsed = !0
    }
    function fileReaderReady(e) {
        return new Promise(function (n, d) {
            ;(e.onload = function () {
                n(e.result)
            }),
                (e.onerror = function () {
                    d(e.error)
                })
        })
    }
    function readBlobAsArrayBuffer(e) {
        var n = new FileReader(),
            d = fileReaderReady(n)
        return n.readAsArrayBuffer(e), d
    }
    function bufferClone(e) {
        if (e.slice) return e.slice(0)
        var n = new Uint8Array(e.byteLength)
        return n.set(new Uint8Array(e)), n.buffer
    }
    function Body() {
        return (
            (this.bodyUsed = !1),
            (this._initBody = function (e) {
                var n
                ;(this.bodyUsed = this.bodyUsed),
                    (this._bodyInit = e),
                    e
                        ? "string" == typeof e
                            ? (this._bodyText = e)
                            : St && Blob.prototype.isPrototypeOf(e)
                            ? (this._bodyBlob = e)
                            : Pt && FormData.prototype.isPrototypeOf(e)
                            ? (this._bodyFormData = e)
                            : _t && URLSearchParams.prototype.isPrototypeOf(e)
                            ? (this._bodyText = e.toString())
                            : Et && St && (n = e) && DataView.prototype.isPrototypeOf(n)
                            ? ((this._bodyArrayBuffer = bufferClone(e.buffer)),
                              (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                            : Et && (ArrayBuffer.prototype.isPrototypeOf(e) || wt(e))
                            ? (this._bodyArrayBuffer = bufferClone(e))
                            : (this._bodyText = e = Object.prototype.toString.call(e))
                        : (this._bodyText = ""),
                    this.headers.get("content-type") ||
                        ("string" == typeof e
                            ? this.headers.set("content-type", "text/plain;charset=UTF-8")
                            : this._bodyBlob && this._bodyBlob.type
                            ? this.headers.set("content-type", this._bodyBlob.type)
                            : _t &&
                              URLSearchParams.prototype.isPrototypeOf(e) &&
                              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
            }),
            St &&
                ((this.blob = function () {
                    var e = consumed(this)
                    if (e) return e
                    if (this._bodyBlob) return Promise.resolve(this._bodyBlob)
                    if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                    if (this._bodyFormData) throw new Error("could not read FormData body as blob")
                    return Promise.resolve(new Blob([this._bodyText]))
                }),
                (this.arrayBuffer = function () {
                    if (this._bodyArrayBuffer) {
                        var e = consumed(this)
                        return (
                            e ||
                            (ArrayBuffer.isView(this._bodyArrayBuffer)
                                ? Promise.resolve(
                                      this._bodyArrayBuffer.buffer.slice(
                                          this._bodyArrayBuffer.byteOffset,
                                          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                                      )
                                  )
                                : Promise.resolve(this._bodyArrayBuffer))
                        )
                    }
                    return this.blob().then(readBlobAsArrayBuffer)
                })),
            (this.text = function () {
                var e,
                    n,
                    d,
                    h = consumed(this)
                if (h) return h
                if (this._bodyBlob)
                    return (e = this._bodyBlob), (n = new FileReader()), (d = fileReaderReady(n)), n.readAsText(e), d
                if (this._bodyArrayBuffer)
                    return Promise.resolve(
                        (function (e) {
                            for (var n = new Uint8Array(e), d = new Array(n.length), h = 0; h < n.length; h++)
                                d[h] = String.fromCharCode(n[h])
                            return d.join("")
                        })(this._bodyArrayBuffer)
                    )
                if (this._bodyFormData) throw new Error("could not read FormData body as text")
                return Promise.resolve(this._bodyText)
            }),
            Pt &&
                (this.formData = function () {
                    return this.text().then(decode)
                }),
            (this.json = function () {
                return this.text().then(JSON.parse)
            }),
            this
        )
    }
    ;(Headers$1.prototype.append = function (e, n) {
        ;(e = normalizeName(e)), (n = normalizeValue(n))
        var d = this.map[e]
        this.map[e] = d ? d + ", " + n : n
    }),
        (Headers$1.prototype.delete = function (e) {
            delete this.map[normalizeName(e)]
        }),
        (Headers$1.prototype.get = function (e) {
            return (e = normalizeName(e)), this.has(e) ? this.map[e] : null
        }),
        (Headers$1.prototype.has = function (e) {
            return this.map.hasOwnProperty(normalizeName(e))
        }),
        (Headers$1.prototype.set = function (e, n) {
            this.map[normalizeName(e)] = normalizeValue(n)
        }),
        (Headers$1.prototype.forEach = function (e, n) {
            for (var d in this.map) this.map.hasOwnProperty(d) && e.call(n, this.map[d], d, this)
        }),
        (Headers$1.prototype.keys = function () {
            var e = []
            return (
                this.forEach(function (n, d) {
                    e.push(d)
                }),
                iteratorFor(e)
            )
        }),
        (Headers$1.prototype.values = function () {
            var e = []
            return (
                this.forEach(function (n) {
                    e.push(n)
                }),
                iteratorFor(e)
            )
        }),
        (Headers$1.prototype.entries = function () {
            var e = []
            return (
                this.forEach(function (n, d) {
                    e.push([d, n])
                }),
                iteratorFor(e)
            )
        }),
        Tt && (Headers$1.prototype[Symbol.iterator] = Headers$1.prototype.entries)
    var It = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"]
    function Request(e, n) {
        if (!(this instanceof Request))
            throw new TypeError(
                'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
            )
        var d,
            h,
            p = (n = n || {}).body
        if (e instanceof Request) {
            if (e.bodyUsed) throw new TypeError("Already read")
            ;(this.url = e.url),
                (this.credentials = e.credentials),
                n.headers || (this.headers = new Headers$1(e.headers)),
                (this.method = e.method),
                (this.mode = e.mode),
                (this.signal = e.signal),
                p || null == e._bodyInit || ((p = e._bodyInit), (e.bodyUsed = !0))
        } else this.url = String(e)
        if (
            ((this.credentials = n.credentials || this.credentials || "same-origin"),
            (!n.headers && this.headers) || (this.headers = new Headers$1(n.headers)),
            (this.method = ((d = n.method || this.method || "GET"), (h = d.toUpperCase()), It.indexOf(h) > -1 ? h : d)),
            (this.mode = n.mode || this.mode || null),
            (this.signal = n.signal || this.signal),
            (this.referrer = null),
            ("GET" === this.method || "HEAD" === this.method) && p)
        )
            throw new TypeError("Body not allowed for GET or HEAD requests")
        if (
            (this._initBody(p),
            !(("GET" !== this.method && "HEAD" !== this.method) || ("no-store" !== n.cache && "no-cache" !== n.cache)))
        ) {
            var y = /([?&])_=[^&]*/
            if (y.test(this.url)) this.url = this.url.replace(y, "$1_=" + new Date().getTime())
            else {
                this.url += (/\?/.test(this.url) ? "&" : "?") + "_=" + new Date().getTime()
            }
        }
    }
    function decode(e) {
        var n = new FormData()
        return (
            e
                .trim()
                .split("&")
                .forEach(function (e) {
                    if (e) {
                        var d = e.split("="),
                            h = d.shift().replace(/\+/g, " "),
                            p = d.join("=").replace(/\+/g, " ")
                        n.append(decodeURIComponent(h), decodeURIComponent(p))
                    }
                }),
            n
        )
    }
    function Response(e, n) {
        if (!(this instanceof Response))
            throw new TypeError(
                'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
            )
        n || (n = {}),
            (this.type = "default"),
            (this.status = void 0 === n.status ? 200 : n.status),
            (this.ok = this.status >= 200 && this.status < 300),
            (this.statusText = void 0 === n.statusText ? "" : "" + n.statusText),
            (this.headers = new Headers$1(n.headers)),
            (this.url = n.url || ""),
            this._initBody(e)
    }
    ;(Request.prototype.clone = function () {
        return new Request(this, { body: this._bodyInit })
    }),
        Body.call(Request.prototype),
        Body.call(Response.prototype),
        (Response.prototype.clone = function () {
            return new Response(this._bodyInit, {
                status: this.status,
                statusText: this.statusText,
                headers: new Headers$1(this.headers),
                url: this.url
            })
        }),
        (Response.error = function () {
            var e = new Response(null, { status: 0, statusText: "" })
            return (e.type = "error"), e
        })
    var Ot = [301, 302, 303, 307, 308]
    Response.redirect = function (e, n) {
        if (-1 === Ot.indexOf(n)) throw new RangeError("Invalid status code")
        return new Response(null, { status: n, headers: { location: e } })
    }
    var At = bt.DOMException
    try {
        new At()
    } catch (Ic) {
        ;((At = function (e, n) {
            ;(this.message = e), (this.name = n)
            var d = Error(e)
            this.stack = d.stack
        }).prototype = Object.create(Error.prototype)),
            (At.prototype.constructor = At)
    }
    function fetch$1(e, n) {
        return new Promise(function (d, h) {
            var p = new Request(e, n)
            if (p.signal && p.signal.aborted) return h(new At("Aborted", "AbortError"))
            var y = new XMLHttpRequest()
            function abortXhr() {
                y.abort()
            }
            ;(y.onload = function () {
                var e,
                    n,
                    h = {
                        status: y.status,
                        statusText: y.statusText,
                        headers:
                            ((e = y.getAllResponseHeaders() || ""),
                            (n = new Headers$1()),
                            e
                                .replace(/\r?\n[\t ]+/g, " ")
                                .split("\r")
                                .map(function (e) {
                                    return 0 === e.indexOf("\n") ? e.substr(1, e.length) : e
                                })
                                .forEach(function (e) {
                                    var d = e.split(":"),
                                        h = d.shift().trim()
                                    if (h) {
                                        var p = d.join(":").trim()
                                        n.append(h, p)
                                    }
                                }),
                            n)
                    }
                h.url = "responseURL" in y ? y.responseURL : h.headers.get("X-Request-URL")
                var p = "response" in y ? y.response : y.responseText
                setTimeout(function () {
                    d(new Response(p, h))
                }, 0)
            }),
                (y.onerror = function () {
                    setTimeout(function () {
                        h(new TypeError("Network request failed"))
                    }, 0)
                }),
                (y.ontimeout = function () {
                    setTimeout(function () {
                        h(new TypeError("Network request failed"))
                    }, 0)
                }),
                (y.onabort = function () {
                    setTimeout(function () {
                        h(new At("Aborted", "AbortError"))
                    }, 0)
                }),
                y.open(
                    p.method,
                    (function (e) {
                        try {
                            return "" === e && bt.location.href ? bt.location.href : e
                        } catch (Mr) {
                            return e
                        }
                    })(p.url),
                    !0
                ),
                "include" === p.credentials
                    ? (y.withCredentials = !0)
                    : "omit" === p.credentials && (y.withCredentials = !1),
                "responseType" in y &&
                    (St
                        ? (y.responseType = "blob")
                        : Et &&
                          p.headers.get("Content-Type") &&
                          -1 !== p.headers.get("Content-Type").indexOf("application/octet-stream") &&
                          (y.responseType = "arraybuffer")),
                !n || "object" != typeof n.headers || n.headers instanceof Headers$1
                    ? p.headers.forEach(function (e, n) {
                          y.setRequestHeader(n, e)
                      })
                    : Object.getOwnPropertyNames(n.headers).forEach(function (e) {
                          y.setRequestHeader(e, normalizeValue(n.headers[e]))
                      }),
                p.signal &&
                    (p.signal.addEventListener("abort", abortXhr),
                    (y.onreadystatechange = function () {
                        4 === y.readyState && p.signal.removeEventListener("abort", abortXhr)
                    })),
                y.send(void 0 === p._bodyInit ? null : p._bodyInit)
        })
    }
    ;(fetch$1.polyfill = !0),
        bt.fetch || ((bt.fetch = fetch$1), (bt.Headers = Headers$1), (bt.Request = Request), (bt.Response = Response))
    const Rt = new Logger("player"),
        Ct = new Logger("paf"),
        Mt = new Logger("services"),
        Dt = StringDevFlag.register("mkLoggingLevels"),
        xt = BooleanDevFlag.register("mkConsoleLogging"),
        Lt = O.ERROR
    let Nt = Lt
    const jt = new Logger("mk", {
        level: Nt,
        handlers: {
            console: new (class {
                get hasConsole() {
                    return void 0 !== typeof console
                }
                process(e) {
                    if (!this.enabled || !this.hasConsole) return
                    let n = "log"
                    if (this.mapLevels) {
                        const h = this.levelMapping.get(e.level)
                        void 0 !== (d = h) && d in console && (n = h)
                    }
                    var d, h
                    const p = null !== (h = e.args) && void 0 !== h ? h : [],
                        y = this.format(e)
                    console[n](y, ...p)
                }
                constructor(e = {}) {
                    var n, d, h, p
                    ;(this.enabled = null === (n = e.enabled) || void 0 === n || n),
                        (this.mapLevels = null === (d = e.mapLevels) || void 0 === d || d),
                        (this.levelMapping = null !== (h = e.levelMapping) && void 0 !== h ? h : x),
                        (this.format = null !== (p = e.formatter) && void 0 !== p ? p : L)
                }
            })({ enabled: !1 }),
            external: new CallbackHandler(() => {})
        }
    })
    function applyLoggingLevels(e) {
        !(function (e, n) {
            walk(e, function (e) {
                let d
                const h = e.namespace
                e.clearLevel(),
                    void 0 === e.parent && void 0 !== n["*"]
                        ? (d = getLoggingLevel(n["*"]))
                        : void 0 !== n[h] && (d = getLoggingLevel(n[h])),
                    void 0 !== d && e.setLevel(d)
            })
        })(
            jt,
            (function (e) {
                const n = getLoggingLevel(e.trim(), { allowShorthands: !0 })
                if (void 0 !== n) return { "*": n }
                const d = {},
                    h = e.split(",").filter((e) => "" !== e.trim())
                for (const b of h) {
                    var p, y
                    const e = b.split("=", 2)
                    if (2 !== e.length) continue
                    var m
                    const n =
                        null !== (m = null === (p = e[0]) || void 0 === p ? void 0 : p.trim()) && void 0 !== m ? m : ""
                    var g
                    const h = getLoggingLevel(
                        null !== (g = null === (y = e[1]) || void 0 === y ? void 0 : y.trim()) && void 0 !== g ? g : "",
                        { allowShorthands: !0 }
                    )
                    "" !== n && void 0 !== h && (d[n] = h)
                }
                return d
            })(e)
        )
    }
    function clearLoggingLevels() {
        jt.setLevel(Nt),
            (function (e, n = { includeRoot: !0 }) {
                walk(e, function (e) {
                    ;(void 0 !== e.parent || n.includeRoot) && e.clearLevel()
                })
            })(jt, { includeRoot: !1 })
    }
    function setConsoleOutput(e) {
        jt.handlers.console.enabled = null != e && e
    }
    function setRootLoggingLevel(e) {
        var n
        Nt = null !== (n = getLoggingLevel(e)) && void 0 !== n ? n : Nt
    }
    const Ut = {
        getLogger: (e = "*") => jt.getByNamespace(null != e ? e : "*"),
        setConsoleOutput(e) {
            !0 === e
                ? (xt.enable(), setConsoleOutput(!0), jt.info("Console output is enabled with level " + jt.levelName))
                : (xt.disable(), setConsoleOutput(!1))
        },
        setLoggingLevels(e, n) {
            "" !== e.trim()
                ? (Dt.set(e), applyLoggingLevels(e), Ut.setConsoleOutput(null == n || n))
                : Ut.clearLoggingLevels(null != n && n)
        },
        clearLoggingLevels(e = !1) {
            Ut.setConsoleOutput(e), Dt.clear(), clearLoggingLevels()
        }
    }
    xt.enabled && Ut.setConsoleOutput(xt.enabled), void 0 !== Dt.value && Ut.setLoggingLevels(Dt.value, xt.enabled)
    const $t = isNodeEnvironment$1()
    class Browser {
        static supportsEs6() {
            if ("undefined" == typeof Symbol) return !1
            try {
                new Function('"use strict";class Foo {}')(), new Function('"use strict";var bar = (x) => x+1')()
            } catch (Mr) {
                return !1
            }
            return !0
        }
        constructor(e) {
            var n
            e ||
                (e =
                    "undefined" != typeof window &&
                    (null === window || void 0 === window || null === (n = window.navigator) || void 0 === n
                        ? void 0
                        : n.userAgent)
                        ? window.navigator.userAgent
                        : "")
            const d = e.toLowerCase()
            ;(this.isEdge = /\sedge\//.test(d)),
                (this.isChrome = !this.isEdge && /chrome/.test(d)),
                (this.isSafari = !this.isEdge && !this.isChrome && /safari/.test(d)),
                (this.isFirefox = !this.isEdge && !this.isChrome && !this.isSafari && /firefox/.test(d)),
                (this.isIE =
                    !this.isEdge && !this.isChrome && !this.isSafari && !this.isFirefox && /trident|msie/.test(d)),
                (this.isMobile = /mobile/.test(d)),
                (this.isAndroid = /android/.test(d)),
                (this.isiOS = this.isMobile && /iphone|ipad|ipod/.test(d)),
                (this.isMacOs = !this.isMobile && /macintosh/.test(d)),
                (this.isWebView =
                    /(webview|(iphone|ipod|ipad)(?!.*safari\/)|android.*(wv|\.0\.0\.0)|\bfb[\w_]+\/(?:messenger)?|\binstagram|\btwitter)/.test(
                        d
                    )),
                this.isEdge
                    ? (this.engineVersion = d.match(/(?:edge).(\d+)/))
                    : ((this.version = d.match(/(?:chrome|version|firefox|msie|rv).(\d+)\.(\d+)/)),
                      (this.engineVersion = d.match(/(?:applewebkit|gecko|trident).(\d+)/))),
                this.version &&
                    ((this.majorVersion = parseInt(this.version[1], 10)),
                    (this.minorVersion = parseInt(this.version[2], 10))),
                this.engineVersion && (this.engineMajorVersion = parseInt(this.engineVersion[1], 10))
        }
    }
    const Gt = new Browser()
    var Bt
    !(function (e) {
        ;(e.NONE = "none"),
            (e.FAIRPLAY = "com.apple.fps"),
            (e.PLAYREADY = "com.microsoft.playready"),
            (e.WIDEVINE = "com.widevine.alpha")
    })(Bt || (Bt = {}))
    const Ft = { app: {}, features: {}, urls: {} },
        Kt = "mk-player-tsid",
        Vt = 'audio/mp4;codecs="mp4a.40.2"',
        Ht = document.createElement("video"),
        qt = [],
        Wt = []
    function deferPlayback() {
        fillAvailableElements("audio", Wt),
            fillAvailableElements("video", qt),
            Rt.debug(
                `dom-helpers: defer playback called.  There are ${qt.length} available video elements and ${Wt.length} available audio elements.`
            )
    }
    function fillAvailableElements(e, n) {
        let d = 100 - n.length
        for (; d > 0; ) {
            const h = document.createElement(e)
            h.load(), n.push(h), d--
        }
    }
    var Yt, zt, Qt
    function asyncGeneratorStep$12(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$12(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$12(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$12(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function findMediaKeySystemAccess(e, n) {
        return _findMediaKeySystemAccess.apply(this, arguments)
    }
    function _findMediaKeySystemAccess() {
        return (_findMediaKeySystemAccess = _asyncToGenerator$12(function* (e, n) {
            for (let d = 0; d < e.length; d++)
                try {
                    const h = e[d]
                    return [h, yield navigator.requestMediaKeySystemAccess(h, n)]
                } catch (Mr) {}
            return []
        })).apply(this, arguments)
    }
    !(function (e) {
        ;(e.playbackLicenseError = "playbackLicenseError"),
            (e.playbackSessionError = "playbackSessionError"),
            (e.manifestParsed = "manifestParsed"),
            (e.audioCodecIdentified = "audioCodecIdentified"),
            (e.audioTracksSwitched = "audioTracksSwitched"),
            (e.audioTracksUpdated = "audioTracksUpdated"),
            (e.textTracksSwitched = "textTracksSwitched"),
            (e.textTracksUpdated = "textTracksUpdated"),
            (e.inlineStylesParsed = "inlineStylesParsed"),
            (e.levelUpdated = "levelUpdated")
    })(Yt || (Yt = {})),
        (function (e) {
            ;(e.MP4 = "audio/mp4"), (e.AVC1 = "video/mp4")
        })(zt || (zt = {})),
        (function (e) {
            ;(e.WIDEVINE = "urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"),
                (e.PLAYREADY = "com.microsoft.playready"),
                (e.FAIRPLAY = "com.apple.streamingkeydelivery")
        })(Qt || (Qt = {}))
    let Jt
    const { NONE: Xt, FAIRPLAY: Zt, WIDEVINE: er, PLAYREADY: tr } = Bt
    function supportsDrm() {
        if (!Jt) throw new Error("findKeySystemPreference has not been invoked")
        return Jt !== Xt
    }
    function potentialKeySystemsForAccess() {
        return (function () {
            const e = getSessionStorage()
            return !!e && "true" === e.getItem("mk-playready-cbcs-unsupported")
        })()
            ? [er]
            : Ft.features["prefer-playready"]
            ? [tr, er]
            : [er, tr]
    }
    function findKeySystemPreference() {
        return _findKeySystemPreference.apply(this, arguments)
    }
    function _findKeySystemPreference() {
        return (_findKeySystemPreference = _asyncToGenerator$12(function* () {
            var e, n
            if (!$t) {
                if (
                    null === (e = window.WebKitMediaKeys) || void 0 === e
                        ? void 0
                        : e.isTypeSupported(Zt + ".1_0", zt.AVC1)
                )
                    Jt = Zt
                else if (null === (n = window.MSMediaKeys) || void 0 === n ? void 0 : n.isTypeSupported(tr, zt.AVC1))
                    Jt = tr
                else {
                    const e = Ht
                    if (hasMediaKeySupport() && e.canPlayType('video/mp4;codecs="avc1.42E01E"') && e.canPlayType(Vt)) {
                        const e = [
                                {
                                    initDataTypes: ["keyids", "cenc"],
                                    distinctiveIdentifier: "optional",
                                    persistentState: "required",
                                    videoCapabilities: [
                                        {
                                            contentType: 'video/mp4;codecs="avc1.42E01E"',
                                            robustness: "SW_SECURE_CRYPTO"
                                        }
                                    ],
                                    audioCapabilities: [{ contentType: Vt }]
                                }
                            ],
                            n = potentialKeySystemsForAccess(),
                            [d] = yield findMediaKeySystemAccess(n, e)
                        Jt = d
                    }
                }
                return (Jt = null != Jt ? Jt : Xt), Jt
            }
            Jt = Xt
        })).apply(this, arguments)
    }
    function hasMediaKeySupport() {
        return !!(navigator && navigator.requestMediaKeySystemAccess && window.MediaKeys && window.MediaKeySystemAccess)
    }
    const AsyncDebounce =
            (e = 100, n) =>
            (d, h, p) => {
                const y = p.value,
                    m = asyncDebounce(y, e, n)
                p.value = m
            },
        asyncDebounce = (e, n = 250, d = { isImmediate: !1 }) => {
            let h, p
            function fulfill(e) {
                return null == e ? void 0 : e.resolve(d.cancelledValue)
            }
            const clearLastPromise = () => {
                    h && (h.resolved || (fulfill(h), h.timeoutId && clearTimeout(h.timeoutId)), (h = void 0))
                },
                invokeFn = (n, d, p, y) => {
                    e.apply(n, y)
                        .then((e) => {
                            d(e), h && (h.resolved = !0)
                        })
                        .catch(p)
                }
            return d.isImmediate
                ? function (...e) {
                      const d = Date.now(),
                          y = this
                      return (
                          p && d >= p && clearLastPromise(),
                          (p = Date.now() + n),
                          h
                              ? fulfill(Promise)
                              : new Promise((n, d) => {
                                    ;(h = { resolve: n, reject: d }), invokeFn(y, n, d, e)
                                })
                      )
                  }
                : function (...e) {
                      const d = this
                      return (
                          h && clearLastPromise(),
                          new Promise(function (p, y) {
                              const m = setTimeout(invokeFn.bind(void 0, d, p, y, e), n)
                              h = { resolve: p, reject: y, timeoutId: m }
                          })
                      )
                  }
        },
        rr = {
            AFG: "143610",
            AGO: "143564",
            AIA: "143538",
            ALB: "143575",
            AND: "143611",
            ARE: "143481",
            ARG: "143505",
            ARM: "143524",
            ATG: "143540",
            AUS: "143460",
            AUT: "143445",
            AZE: "143568",
            BEL: "143446",
            BEN: "143576",
            BFA: "143578",
            BGD: "143490",
            BGR: "143526",
            BHR: "143559",
            BHS: "143539",
            BIH: "143612",
            BLR: "143565",
            BLZ: "143555",
            BMU: "143542",
            BOL: "143556",
            BRA: "143503",
            BRB: "143541",
            BRN: "143560",
            BTN: "143577",
            BWA: "143525",
            CAF: "143623",
            CAN: "143455",
            CHE: "143459",
            CHL: "143483",
            CHN: "143465",
            CIV: "143527",
            CMR: "143574",
            COD: "143613",
            COG: "143582",
            COL: "143501",
            CPV: "143580",
            CRI: "143495",
            CYM: "143544",
            CYP: "143557",
            CZE: "143489",
            DEU: "143443",
            DMA: "143545",
            DNK: "143458",
            DOM: "143508",
            DZA: "143563",
            ECU: "143509",
            EGY: "143516",
            ESP: "143454",
            EST: "143518",
            ETH: "143569",
            FIN: "143447",
            FJI: "143583",
            FRA: "143442",
            FSM: "143591",
            GAB: "143614",
            GBR: "143444",
            GEO: "143615",
            GHA: "143573",
            GIN: "143616",
            GMB: "143584",
            GNB: "143585",
            GRC: "143448",
            GRD: "143546",
            GTM: "143504",
            GUY: "143553",
            HKG: "143463",
            HND: "143510",
            HRV: "143494",
            HUN: "143482",
            IDN: "143476",
            IND: "143467",
            IRL: "143449",
            IRQ: "143617",
            ISL: "143558",
            ISR: "143491",
            ITA: "143450",
            JAM: "143511",
            JOR: "143528",
            JPN: "143462",
            KAZ: "143517",
            KEN: "143529",
            KGZ: "143586",
            KHM: "143579",
            KNA: "143548",
            KOR: "143466",
            KWT: "143493",
            LAO: "143587",
            LBN: "143497",
            LBR: "143588",
            LBY: "143567",
            LCA: "143549",
            LIE: "143522",
            LKA: "143486",
            LTU: "143520",
            LUX: "143451",
            LVA: "143519",
            MAC: "143515",
            MAR: "143620",
            MCO: "143618",
            MDA: "143523",
            MDG: "143531",
            MDV: "143488",
            MEX: "143468",
            MKD: "143530",
            MLI: "143532",
            MLT: "143521",
            MMR: "143570",
            MNE: "143619",
            MNG: "143592",
            MOZ: "143593",
            MRT: "143590",
            MSR: "143547",
            MUS: "143533",
            MWI: "143589",
            MYS: "143473",
            NAM: "143594",
            NER: "143534",
            NGA: "143561",
            NIC: "143512",
            NLD: "143452",
            NOR: "143457",
            NPL: "143484",
            NRU: "143606",
            NZL: "143461",
            OMN: "143562",
            PAK: "143477",
            PAN: "143485",
            PER: "143507",
            PHL: "143474",
            PLW: "143595",
            PNG: "143597",
            POL: "143478",
            PRT: "143453",
            PRY: "143513",
            PSE: "143596",
            QAT: "143498",
            ROU: "143487",
            RUS: "143469",
            RWA: "143621",
            SAU: "143479",
            SEN: "143535",
            SGP: "143464",
            SLB: "143601",
            SLE: "143600",
            SLV: "143506",
            SRB: "143500",
            STP: "143598",
            SUR: "143554",
            SVK: "143496",
            SVN: "143499",
            SWE: "143456",
            SWZ: "143602",
            SYC: "143599",
            TCA: "143552",
            TCD: "143581",
            THA: "143475",
            TJK: "143603",
            TKM: "143604",
            TON: "143608",
            TTO: "143551",
            TUN: "143536",
            TUR: "143480",
            TWN: "143470",
            TZA: "143572",
            UGA: "143537",
            UKR: "143492",
            URY: "143514",
            USA: "143441",
            UZB: "143566",
            VCT: "143550",
            VEN: "143502",
            VGB: "143543",
            VNM: "143471",
            VUT: "143609",
            WSM: "143607",
            XKX: "143624",
            YEM: "143571",
            ZAF: "143472",
            ZMB: "143622",
            ZWE: "143605"
        }
    let isMergeableObject = function (e) {
        return (
            (function (e) {
                return !!e && "object" == typeof e
            })(e) &&
            !(function (e) {
                let n = Object.prototype.toString.call(e)
                return (
                    "[object RegExp]" === n ||
                    "[object Date]" === n ||
                    (function (e) {
                        return e.$$typeof === nr
                    })(e)
                )
            })(e)
        )
    }
    let nr = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103
    function cloneUnlessOtherwiseSpecified(e, n) {
        return !1 !== n.clone && n.isMergeableObject(e) ? deepmerge(((d = e), Array.isArray(d) ? [] : {}), e, n) : e
        var d
    }
    function defaultArrayMerge(e, n, d) {
        return e.concat(n).map(function (e) {
            return cloneUnlessOtherwiseSpecified(e, d)
        })
    }
    function getKeys(e) {
        return Object.keys(e).concat(
            (function (e) {
                return Object.getOwnPropertySymbols
                    ? Object.getOwnPropertySymbols(e).filter(function (n) {
                          return e.propertyIsEnumerable(n)
                      })
                    : []
            })(e)
        )
    }
    function mergeObject(e, n, d) {
        let h = {}
        return (
            d.isMergeableObject(e) &&
                getKeys(e).forEach(function (n) {
                    h[n] = cloneUnlessOtherwiseSpecified(e[n], d)
                }),
            getKeys(n).forEach(function (p) {
                d.isMergeableObject(n[p]) && e[p]
                    ? (h[p] = (function (e, n) {
                          if (!n.customMerge) return deepmerge
                          let d = n.customMerge(e)
                          return "function" == typeof d ? d : deepmerge
                      })(p, d)(e[p], n[p], d))
                    : (h[p] = cloneUnlessOtherwiseSpecified(n[p], d))
            }),
            h
        )
    }
    function deepmerge(e, n, d) {
        ;((d = d || {}).arrayMerge = d.arrayMerge || defaultArrayMerge),
            (d.isMergeableObject = d.isMergeableObject || isMergeableObject)
        let h = Array.isArray(n)
        return h === Array.isArray(e)
            ? h
                ? d.arrayMerge(e, n, d)
                : mergeObject(e, n, d)
            : cloneUnlessOtherwiseSpecified(n, d)
    }
    function _defineProperty$F(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$F(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$F(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$q(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function _objectWithoutProperties$4(e, n) {
        if (null == e) return {}
        var d,
            h,
            p = (function (e, n) {
                if (null == e) return {}
                var d,
                    h,
                    p = {},
                    y = Object.keys(e)
                for (h = 0; h < y.length; h++) (d = y[h]), n.indexOf(d) >= 0 || (p[d] = e[d])
                return p
            })(e, n)
        if (Object.getOwnPropertySymbols) {
            var y = Object.getOwnPropertySymbols(e)
            for (h = 0; h < y.length; h++)
                (d = y[h]), n.indexOf(d) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, d) && (p[d] = e[d]))
        }
        return p
    }
    var ir
    ;(deepmerge.all = function (e, n) {
        if (!Array.isArray(e)) throw new Error("first argument should be an array")
        return e.reduce(function (e, d) {
            return deepmerge(e, d, n)
        }, {})
    }),
        (function (e) {
            ;(e.dataRecordDidDelete = "dataRecordDidDelete"),
                (e.dataRecordWillDelete = "dataRecordWillDelete"),
                (e.dataRecordDidMaterialize = "dataRecordDidMaterialize"),
                (e.dataRecordDidPopulate = "dataRecordDidPopulate"),
                (e.dataRecordWillPopulate = "dataRecordWillPopulate")
        })(ir || (ir = {}))
    const isDataRecord = (e) =>
        !(
            !e ||
            "function" != typeof e.hasAttributes ||
            "function" != typeof e.hasRelationships ||
            "function" != typeof e.hasViews ||
            "function" != typeof e.serialize
        )
    class DataRecord {
        hasProperties(e) {
            return (
                !e ||
                (e.attributes || e.relationships || e.views
                    ? !(e.attributes && !this.hasAttributes(e.attributes)) &&
                      !(e.relationships && !this.hasRelationships(e.relationships)) &&
                      !(e.views && !this.hasViews(e.views))
                    : this.hasAttributes() || this.hasRelationships() || this.hasViews())
            )
        }
        hasAttributes(e) {
            return this._hasProperties(this._mjs.attributes, e)
        }
        hasRelationships(e) {
            return this._hasProperties(this._mjs.relationships, e)
        }
        hasViews(e) {
            return this._hasProperties(this._mjs.views, e)
        }
        meta(e) {
            return e ? this._meta[e] : this._meta
        }
        serialize(e = !0, n = {}, d = {}) {
            const h = { id: this.id, type: this.type }
            return n[`${this.type}-${this.id}`] && !d.allowFullDuplicateSerializations
                ? h
                : ((n[`${this.type}-${this.id}`] = !0),
                  this.hasAttributes() &&
                      (h.attributes = this._mjs.attributes.reduce((e, n) => ((e[n] = this[n]), e), {})),
                  this._mjs.relationships.length > 0 &&
                      (h.relationships = this._serializeRelatedData(this._mjs.relationships, n, d)),
                  this._mjs.views.length > 0 && (h.views = this._serializeRelatedData(this._mjs.views, n, d)),
                  e ? { data: h } : h)
        }
        setProperty(e, n, d = "attributes", h = {}) {
            function isMergeableObject(e) {
                return !(!e || "object" != typeof e || e instanceof DataRecord)
            }
            hasOwn(this, e) || (this._mjs[d] || (this._mjs[d] = []), this._mjs[d].push(e))
            const setDescriptor = (e) => ({ value: e, writable: !0, configurable: !0, enumerable: !0 })
            this[e] && n && "object" == typeof this[e] && "object" == typeof n
                ? "attributes" === d
                    ? Object.defineProperty(
                          this,
                          e,
                          setDescriptor(
                              deepmerge(this[e], n, {
                                  arrayMerge: function (e, n, d) {
                                      return n
                                  },
                                  isMergeableObject: isMergeableObject
                              })
                          )
                      )
                    : "relationships" === d && Array.isArray(this[e]) && h.extendRelationships
                    ? Object.defineProperty(
                          this,
                          e,
                          setDescriptor(deepmerge(this[e], n, { isMergeableObject: isMergeableObject }))
                      )
                    : Object.defineProperty(this, e, setDescriptor(n))
                : Object.defineProperty(this, e, setDescriptor(n))
        }
        removeRelative(e, n) {
            this[e] && (Array.isArray(this[e]) ? (this[e] = this[e].filter((e) => e.id !== n)) : delete this[e])
        }
        setParent(e) {
            const n = this._mjs.parents,
                d = n && n.length > 0
            this._mjs.parents = d ? n.concat(e) : e
        }
        _hasProperties(e, n) {
            return !!e && (n ? ensureArray(n).every((n) => e.includes(n)) : e.length > 0)
        }
        _serializeRelatedData(e, n = {}, d = {}) {
            return e.reduce((e, h) => {
                if (d.excludeRelationships && d.excludeRelationships.has(h)) return e
                if (d.includeRelationships && !d.includeRelationships.has(h)) return e
                const p = this[h]
                return (
                    Array.isArray(p)
                        ? (e[h] = {
                              data: p.map((e) => ("function" == typeof e.serialize ? e.serialize(!1, n, d) : e))
                          })
                        : (e[h] = p && "function" == typeof p.serialize ? p.serialize(!1, n, d) : p),
                    e
                )
            }, {})
        }
        constructor(e, n, d = {}) {
            ;(this.type = e),
                (this.id = n),
                (this._mjs = { attributes: [], relationships: [], views: [] }),
                (this._meta = {}),
                (this._mjs = _objectSpread$F({}, this._mjs, d))
        }
    }
    class DataStore extends Notifications {
        get mapping() {
            return this._mapping
        }
        set mapping(e) {
            this._mapping = e
        }
        clear() {
            ;(this._records = {}), (this._expiryRecords = new Set())
        }
        peek(e, n, d) {
            if ((this._checkForExpiredRecords(), !this._records[e])) return n ? null : []
            if (!n) return Object.values(this._records[e])
            if (Array.isArray(n))
                return n.map((n) => {
                    const h = this._records[e][n]
                    if (h && h.hasProperties(d)) return h
                })
            const h = this._records[e][n]
            return h && h.hasProperties(d) ? h : null
        }
        populateDataRecords(e, n = {}, d = {}) {
            if (!e.data) return []
            if (!Array.isArray(e.data)) return this.populateDataRecord(e.data, n, d)
            const h = []
            return (
                e.data.forEach((e, p) => {
                    const y = _objectSpreadProps$q(_objectSpread$F({}, d), {
                        parents: d.parents
                            ? [_objectSpreadProps$q(_objectSpread$F({}, d.parents[0]), { position: p })]
                            : []
                    })
                    d.parents && (d.parents[0].position = p)
                    const m = this.populateDataRecord(e, n, y)
                    h.push(m)
                }),
                h
            )
        }
        populateDataRecord(e, n = {}, d) {
            const h = d.filter || this.filter,
                p = d.mapping || this.mapping
            if (h && !h(e)) return
            if (p) {
                let n = "function" == typeof p ? p(e) : transform$8(p, e)
                Object.assign(e, n)
            }
            this._shouldDisableRecordReuse && (n = {})
            const y = this._materializeRecord(n, _objectSpread$F({ id: e.id, type: e.type }, d))
            return (
                e.meta && (y._meta = e.meta),
                e.attributes &&
                    e.attributes.cachingPolicy &&
                    e.attributes.cachingPolicy.maxAge &&
                    ((y._mjs.expiration = Date.now() + 1e3 * e.attributes.cachingPolicy.maxAge),
                    this._removeOnExpiration && this._expiryRecords.add(y)),
                this._populateDataAttributes(e, y),
                "object" == typeof e.relationships &&
                    Object.keys(e.relationships).forEach((h) => {
                        let m = e.relationships[h]
                        m &&
                            "data" in m &&
                            ((m = this.populateDataRecords(m, n, {
                                mapping: p,
                                parents: [{ relationshipName: h, parentType: y.type, parentId: y.id }]
                            })),
                            y.setProperty(h, m, "relationships", d))
                    }),
                "object" == typeof e.views &&
                    Object.keys(e.views).forEach((d) => {
                        const h = e.views[d]
                        if (h.attributes || h.data) {
                            const e = new DataRecord("view", d)
                            if ((this._populateDataAttributes(h, e), h.data)) {
                                const d = this.populateDataRecords(h, n, p)
                                e.setProperty("data", d, "relationships")
                            }
                            y.setProperty(d, e, "views")
                        }
                    }),
                y
            )
        }
        query(e, n) {
            this._checkForExpiredRecords()
            let includeRecord = (e) => !1
            return (
                "string" == typeof e && n
                    ? (includeRecord = (d) => (null == d ? void 0 : d[e]) === n)
                    : "function" == typeof e
                    ? (includeRecord = (n) => {
                          try {
                              return e(n)
                          } catch (Mr) {
                              return !1
                          }
                      })
                    : "object" == typeof e &&
                      (includeRecord = (n) => {
                          const d = Object.keys(e)
                          let h = 0
                          return (
                              d.forEach((d) => {
                                  ;(null == n ? void 0 : n[d]) === e[d] && h++
                              }),
                              d.length === h
                          )
                      }),
                Object.values(this._records).reduce(
                    (e, n) => (
                        Object.values(n).forEach((n) => {
                            includeRecord(n) && e.push(n)
                        }),
                        e
                    ),
                    []
                )
            )
        }
        remove(e, n) {
            setTimeout(this._checkForExpiredRecords.bind(this), 0)
            if (!hasOwn(this._records, e)) return
            const d = this.peek(e, n)
            d &&
                (this.dispatchEvent(ir.dataRecordWillDelete, [e, n]),
                d._mjs.parents &&
                    d._mjs.parents.length > 0 &&
                    d._mjs.parents.forEach(({ relationshipName: e, parentType: n, parentId: h }) => {
                        this.peek(n, h).removeRelative(e, d.id)
                    }),
                delete this._records[e][n],
                this.dispatchEvent(ir.dataRecordDidDelete, [e, n]))
        }
        save(e, n = {}) {
            return setTimeout(this._checkForExpiredRecords.bind(this), 0), this.populateDataRecords(e, this._records, n)
        }
        _populateDataAttributes(e, n) {
            "object" == typeof e.attributes &&
                (this.dispatchEvent(ir.dataRecordWillPopulate, [n.type, n.id]),
                Object.keys(e.attributes).forEach((d) => {
                    n.setProperty(d, e.attributes[d], "attributes")
                }),
                this.dispatchEvent(ir.dataRecordDidPopulate, [n.type, n.id]))
        }
        _materializeRecord(e, n) {
            const { type: d, id: h } = n,
                p = _objectWithoutProperties$4(n, ["type", "id"])
            return (
                (e[d] = e[d] || {}),
                e[d][h] ? e[d][h].setParent(p.parents || []) : (e[d][h] = new DataRecord(d, h, p)),
                this.dispatchEvent(ir.dataRecordDidMaterialize, [d, h]),
                e[d][h]
            )
        }
        _checkForExpiredRecords() {
            const e = []
            this._expiryRecords.forEach((n) => {
                Date.now() > n._mjs.expiration && (e.push([n.type, n.id]), this._expiryRecords.delete(n))
            }),
                e.forEach((e) => {
                    this.remove(...e)
                })
        }
        constructor(e = {}) {
            super([
                ir.dataRecordDidDelete,
                ir.dataRecordWillDelete,
                ir.dataRecordDidMaterialize,
                ir.dataRecordWillPopulate,
                ir.dataRecordDidPopulate
            ]),
                (this._removeOnExpiration = !1),
                (this._shouldDisableRecordReuse = !0),
                (this._records = {}),
                (this._expiryRecords = new Set()),
                (this._removeOnExpiration = !!e.removeOnExpiration),
                (this._mapping = e.mapping),
                (this._shouldDisableRecordReuse = !!e.shouldDisableRecordReuse),
                (this.filter = e.filter)
        }
    }
    const ar = {
        AW: "ABW",
        AF: "AFG",
        AO: "AGO",
        AI: "AIA",
        AX: "ALA",
        AL: "ALB",
        AD: "AND",
        AE: "ARE",
        AR: "ARG",
        AM: "ARM",
        AS: "ASM",
        AQ: "ATA",
        TF: "ATF",
        AG: "ATG",
        AU: "AUS",
        AT: "AUT",
        AZ: "AZE",
        BI: "BDI",
        BE: "BEL",
        BJ: "BEN",
        BQ: "BES",
        BF: "BFA",
        BD: "BGD",
        BG: "BGR",
        BH: "BHR",
        BS: "BHS",
        BA: "BIH",
        BL: "BLM",
        BY: "BLR",
        BZ: "BLZ",
        BM: "BMU",
        BO: "BOL",
        BR: "BRA",
        BB: "BRB",
        BN: "BRN",
        BT: "BTN",
        BV: "BVT",
        BW: "BWA",
        CF: "CAF",
        CA: "CAN",
        CC: "CCK",
        CH: "CHE",
        CL: "CHL",
        CN: "CHN",
        CI: "CIV",
        CM: "CMR",
        CD: "COD",
        CG: "COG",
        CK: "COK",
        CO: "COL",
        KM: "COM",
        CV: "CPV",
        CR: "CRI",
        CU: "CUB",
        CW: "CUW",
        CX: "CXR",
        KY: "CYM",
        CY: "CYP",
        CZ: "CZE",
        DE: "DEU",
        DJ: "DJI",
        DM: "DMA",
        DK: "DNK",
        DO: "DOM",
        DZ: "DZA",
        EC: "ECU",
        EG: "EGY",
        ER: "ERI",
        EH: "ESH",
        ES: "ESP",
        EE: "EST",
        ET: "ETH",
        FI: "FIN",
        FJ: "FJI",
        FK: "FLK",
        FR: "FRA",
        FO: "FRO",
        FM: "FSM",
        GA: "GAB",
        GB: "GBR",
        GE: "GEO",
        GG: "GGY",
        GH: "GHA",
        GI: "GIB",
        GN: "GIN",
        GP: "GLP",
        GM: "GMB",
        GW: "GNB",
        GQ: "GNQ",
        GR: "GRC",
        GD: "GRD",
        GL: "GRL",
        GT: "GTM",
        GF: "GUF",
        GU: "GUM",
        GY: "GUY",
        HK: "HKG",
        HM: "HMD",
        HN: "HND",
        HR: "HRV",
        HT: "HTI",
        HU: "HUN",
        ID: "IDN",
        IM: "IMN",
        IN: "IND",
        IO: "IOT",
        IE: "IRL",
        IR: "IRN",
        IQ: "IRQ",
        IS: "ISL",
        IL: "ISR",
        IT: "ITA",
        JM: "JAM",
        JE: "JEY",
        JO: "JOR",
        JP: "JPN",
        KZ: "KAZ",
        KE: "KEN",
        KG: "KGZ",
        KH: "KHM",
        KI: "KIR",
        KN: "KNA",
        KR: "KOR",
        KW: "KWT",
        LA: "LAO",
        LB: "LBN",
        LR: "LBR",
        LY: "LBY",
        LC: "LCA",
        LI: "LIE",
        LK: "LKA",
        LS: "LSO",
        LT: "LTU",
        LU: "LUX",
        LV: "LVA",
        MO: "MAC",
        MF: "MAF",
        MA: "MAR",
        MC: "MCO",
        MD: "MDA",
        MG: "MDG",
        MV: "MDV",
        MX: "MEX",
        MH: "MHL",
        MK: "MKD",
        ML: "MLI",
        MT: "MLT",
        MM: "MMR",
        ME: "MNE",
        MN: "MNG",
        MP: "MNP",
        MZ: "MOZ",
        MR: "MRT",
        MS: "MSR",
        MQ: "MTQ",
        MU: "MUS",
        MW: "MWI",
        MY: "MYS",
        YT: "MYT",
        NA: "NAM",
        NC: "NCL",
        NE: "NER",
        NF: "NFK",
        NG: "NGA",
        NI: "NIC",
        NU: "NIU",
        NL: "NLD",
        NO: "NOR",
        NP: "NPL",
        NR: "NRU",
        NZ: "NZL",
        OM: "OMN",
        PK: "PAK",
        PA: "PAN",
        PN: "PCN",
        PE: "PER",
        PH: "PHL",
        PW: "PLW",
        PG: "PNG",
        PL: "POL",
        PR: "PRI",
        KP: "PRK",
        PT: "PRT",
        PY: "PRY",
        PS: "PSE",
        PF: "PYF",
        QA: "QAT",
        RE: "REU",
        RO: "ROU",
        RU: "RUS",
        RW: "RWA",
        SA: "SAU",
        SD: "SDN",
        SN: "SEN",
        SG: "SGP",
        GS: "SGS",
        SH: "SHN",
        SJ: "SJM",
        SB: "SLB",
        SL: "SLE",
        SV: "SLV",
        SM: "SMR",
        SO: "SOM",
        PM: "SPM",
        RS: "SRB",
        SS: "SSD",
        ST: "STP",
        SR: "SUR",
        SK: "SVK",
        SI: "SVN",
        SE: "SWE",
        SZ: "SWZ",
        SX: "SXM",
        SC: "SYC",
        SY: "SYR",
        TC: "TCA",
        TD: "TCD",
        TG: "TGO",
        TH: "THA",
        TJ: "TJK",
        TK: "TKL",
        TM: "TKM",
        TL: "TLS",
        TO: "TON",
        TT: "TTO",
        TN: "TUN",
        TR: "TUR",
        TV: "TUV",
        TW: "TWN",
        TZ: "TZA",
        UG: "UGA",
        UA: "UKR",
        UM: "UMI",
        UY: "URY",
        US: "USA",
        UZ: "UZB",
        VA: "VAT",
        VC: "VCT",
        VE: "VEN",
        VG: "VGB",
        VI: "VIR",
        VN: "VNM",
        VU: "VUT",
        WF: "WLF",
        WS: "WSM",
        XK: "XKX",
        YE: "YEM",
        ZA: "ZAF",
        ZM: "ZMB",
        ZW: "ZWE"
    }
    class PubSub {
        publish(e, n) {
            const d = this.getSubscribersForType(e)
            void 0 !== d &&
                d.forEach((d) => {
                    d(e, n)
                })
        }
        subscribe(e, n) {
            this.getSubscribersForType(e, !0).push(n)
        }
        subscribeOnce(e, n) {
            const onceCallback = (e, d) => {
                this.unsubscribe(e, onceCallback), n(e, d)
            }
            this.subscribe(e, onceCallback)
        }
        unsubscribe(e, n) {
            const d = this.getSubscribersForType(e)
            if (void 0 !== d)
                for (const h in d)
                    if (d[h] === n) {
                        delete d[h]
                        break
                    }
        }
        clear(e) {
            void 0 === e ? (this.events = {}) : delete this.events[e]
        }
        getSubscribersForType(e, n = !1) {
            return !this.events.hasOwnProperty(e) && n && (this.events[e] = []), this.events[e]
        }
        constructor() {
            this.events = {}
        }
    }
    function asyncGeneratorStep$11(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$11(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$11(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$11(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const sr = {},
        SerialAsync = (e) => {
            let n = Promise.resolve()
            return (d, h, p) => {
                const y = p.value
                return (
                    (p.value = _asyncToGenerator$11(function* (...d) {
                        return (
                            e &&
                                (n = ((e) => {
                                    let n = sr[e]
                                    return n || ((n = Promise.resolve()), (sr[e] = n)), n
                                })(e)),
                            (n = n.catch(() => {}).then(() => y.apply(this, d))),
                            e && (sr[e] = n),
                            n
                        )
                    })),
                    p
                )
            }
        }
    var or, cr, lr
    ;(e.PlaybackBitrate = void 0),
        ((or = e.PlaybackBitrate || (e.PlaybackBitrate = {}))[(or.STANDARD = 64)] = "STANDARD"),
        (or[(or.HIGH = 256)] = "HIGH"),
        (function (e) {
            ;(e.apiStorefrontChanged = "apiStorefrontChanged"),
                (e.hlsLevelUpdated = "hlsLevelUpdated"),
                (e.mediaContentComplete = "mediaContentComplete"),
                (e.playbackPause = "playbackPause"),
                (e.playbackPlay = "playbackPlay"),
                (e.playbackScrub = "playbackScrub"),
                (e.playbackSeek = "playbackSeek"),
                (e.playbackSkip = "playbackSkip"),
                (e.playbackStop = "playbackStop"),
                (e.lyricsPlay = "lyricsPlay"),
                (e.lyricsStop = "lyricsStop"),
                (e.playerActivate = "playerActivate"),
                (e.playerExit = "playerExit"),
                (e.queueModified = "queueModified"),
                (e.userActivityIntent = "userActivityIntent"),
                (e.applicationActivityIntent = "applicationActivityIntent")
        })(cr || (cr = {})),
        (function (e) {
            ;(e[(e.ACCURATE = 0)] = "ACCURATE"), (e[(e.ROUND = 1)] = "ROUND")
        })(lr || (lr = {}))
    class TimingAccuracy {
        time(e = 0) {
            return this.mode === lr.ROUND ? Math.round(e) : e
        }
        constructor(e = !1) {
            this.mode = e ? lr.ACCURATE : lr.ROUND
        }
    }
    const ur = {
        audioTrackAdded: "audioTrackAdded",
        audioTrackChanged: "audioTrackChanged",
        audioTrackRemoved: "audioTrackRemoved",
        bufferedProgressDidChange: "bufferedProgressDidChange",
        drmUnsupported: "drmUnsupported",
        forcedTextTrackChanged: "forcedTextTrackChanged",
        mediaCanPlay: "mediaCanPlay",
        mediaElementCreated: "mediaElementCreated",
        mediaPlaybackError: "mediaPlaybackError",
        nowPlayingItemDidChange: "nowPlayingItemDidChange",
        nowPlayingItemWillChange: "nowPlayingItemWillChange",
        metadataDidChange: "metadataDidChange",
        playbackBitrateDidChange: "playbackBitrateDidChange",
        playbackDurationDidChange: "playbackDurationDidChange",
        playbackProgressDidChange: "playbackProgressDidChange",
        playbackRateDidChange: "playbackRateDidChange",
        playbackStateDidChange: "playbackStateDidChange",
        playbackStateWillChange: "playbackStateWillChange",
        playbackTargetAvailableDidChange: "playbackTargetAvailableDidChange",
        playbackTargetIsWirelessDidChange: "playbackTargetIsWirelessDidChange",
        playbackTimeDidChange: "playbackTimeDidChange",
        playbackVolumeDidChange: "playbackVolumeDidChange",
        playerTypeDidChange: "playerTypeDidChange",
        presentationModeDidChange: "presentationModeDidChange",
        primaryPlayerDidChange: "primaryPlayerDidChange",
        textTrackAdded: "textTrackAdded",
        textTrackChanged: "textTrackChanged",
        textTrackRemoved: "textTrackRemoved",
        timedMetadataDidChange: "timedMetadataDidChange"
    }
    class BitrateCalculator {
        get bitrate() {
            return this._bitrate
        }
        set bitrate(e) {
            this._bitrate !== e &&
                ((this._bitrate = e), this._dispatcher.publish(ur.playbackBitrateDidChange, { bitrate: e }))
        }
        _calculateAverageDownlink() {
            return 0 === this._downlinkSamples.length
                ? 0
                : this._downlinkSamples.reduce((e, n) => e + n, 0) / this._downlinkSamples.length || 0
        }
        _recalculateBitrate(n) {
            Rt.debug("_recalculateBitrate", n), this._downlinkSamples.push(n)
            this._calculateAverageDownlink() > e.PlaybackBitrate.STANDARD
                ? (Rt.debug("setting bitrate to", e.PlaybackBitrate.HIGH), (this.bitrate = e.PlaybackBitrate.HIGH))
                : (Rt.debug("setting bitrate to", e.PlaybackBitrate.STANDARD),
                  (this.bitrate = e.PlaybackBitrate.STANDARD))
        }
        constructor(n, d = e.PlaybackBitrate.STANDARD) {
            var h, p
            ;(this._downlinkSamples = []),
                (this._bitrate = d),
                (this._dispatcher = n),
                void 0 !==
                    (null === window ||
                    void 0 === window ||
                    null === (h = window.navigator) ||
                    void 0 === h ||
                    null === (p = h.connection) ||
                    void 0 === p
                        ? void 0
                        : p.downlink) && this._recalculateBitrate(100 * (window.navigator.connection.downlink || 0))
        }
    }
    var dr, hr, pr, yr, fr, mr, gr
    !(function (e) {
        ;(e.MUSICKIT = "music_kit-integration"),
            (e.OTHER = "other"),
            (e.MINI = "mini"),
            (e.SONG = "song"),
            (e.ALBUM = "album"),
            (e.ALBUM_CLASSICAL = "album-classical"),
            (e.ARTIST = "artist"),
            (e.COMPILATION = "compilation"),
            (e.COMPILATION_CLASSICAL = "compilation-classical"),
            (e.PLAYLIST = "playlist"),
            (e.PLAYLIST_CLASSICAL = "playlist-classical"),
            (e.RADIO = "radio"),
            (e.SEARCH = "search"),
            (e.STATION = "station")
    })(dr || (dr = {})),
        (function (e) {
            ;(e[(e.UNKNOWN = 0)] = "UNKNOWN"),
                (e[(e.RADIO = 1)] = "RADIO"),
                (e[(e.PLAYLIST = 2)] = "PLAYLIST"),
                (e[(e.ALBUM = 3)] = "ALBUM"),
                (e[(e.ARTIST = 4)] = "ARTIST")
        })(hr || (hr = {})),
        (e.PlayActivityEndReasonType = void 0),
        ((pr = e.PlayActivityEndReasonType || (e.PlayActivityEndReasonType = {}))[(pr.NOT_APPLICABLE = 0)] =
            "NOT_APPLICABLE"),
        (pr[(pr.OTHER = 1)] = "OTHER"),
        (pr[(pr.TRACK_SKIPPED_FORWARDS = 2)] = "TRACK_SKIPPED_FORWARDS"),
        (pr[(pr.PLAYBACK_MANUALLY_PAUSED = 3)] = "PLAYBACK_MANUALLY_PAUSED"),
        (pr[(pr.PLAYBACK_SUSPENDED = 4)] = "PLAYBACK_SUSPENDED"),
        (pr[(pr.MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM = 5)] = "MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM"),
        (pr[(pr.PLAYBACK_PAUSED_DUE_TO_INACTIVITY = 6)] = "PLAYBACK_PAUSED_DUE_TO_INACTIVITY"),
        (pr[(pr.NATURAL_END_OF_TRACK = 7)] = "NATURAL_END_OF_TRACK"),
        (pr[(pr.PLAYBACK_STOPPED_DUE_TO_SESSION_TIMEOUT = 8)] = "PLAYBACK_STOPPED_DUE_TO_SESSION_TIMEOUT"),
        (pr[(pr.TRACK_BANNED = 9)] = "TRACK_BANNED"),
        (pr[(pr.FAILED_TO_LOAD = 10)] = "FAILED_TO_LOAD"),
        (pr[(pr.PAUSED_ON_TIMEOUT = 11)] = "PAUSED_ON_TIMEOUT"),
        (pr[(pr.SCRUB_BEGIN = 12)] = "SCRUB_BEGIN"),
        (pr[(pr.SCRUB_END = 13)] = "SCRUB_END"),
        (pr[(pr.TRACK_SKIPPED_BACKWARDS = 14)] = "TRACK_SKIPPED_BACKWARDS"),
        (pr[(pr.NOT_SUPPORTED_BY_CLIENT = 15)] = "NOT_SUPPORTED_BY_CLIENT"),
        (pr[(pr.QUICK_PLAY = 16)] = "QUICK_PLAY"),
        (pr[(pr.EXITED_APPLICATION = 17)] = "EXITED_APPLICATION"),
        (function (e) {
            ;(e[(e.Manual = 0)] = "Manual"), (e[(e.Interval = 1)] = "Interval"), (e[(e.SkipIntro = 2)] = "SkipIntro")
        })(yr || (yr = {})),
        (function (e) {
            ;(e[(e.UNKNOWN = 0)] = "UNKNOWN"),
                (e[(e.NO_RIGHTS = 1)] = "NO_RIGHTS"),
                (e[(e.PURCHASED = 2)] = "PURCHASED"),
                (e[(e.UPLOADED = 3)] = "UPLOADED"),
                (e[(e.MATCHED = 4)] = "MATCHED"),
                (e[(e.ADDED = 5)] = "ADDED"),
                (e[(e.SUBSCRIBED = 6)] = "SUBSCRIBED"),
                (e[(e.NOT_SUPPORTED = 7)] = "NOT_SUPPORTED")
        })(fr || (fr = {})),
        (function (e) {
            ;(e[(e.NO_SELECTION_PLAY = 0)] = "NO_SELECTION_PLAY"),
                (e[(e.RESUME_LAST_PLAYED_SONG = 1)] = "RESUME_LAST_PLAYED_SONG"),
                (e[(e.RESUME_CURRENT_DEVICE_POSITION = 2)] = "RESUME_CURRENT_DEVICE_POSITION")
        })(mr || (mr = {})),
        (function (e) {
            ;(e[(e.NOT_APPLICABLE = 0)] = "NOT_APPLICABLE"),
                (e[(e.SIMILARITIES = 1)] = "SIMILARITIES"),
                (e[(e.ESSENTIALS = 2)] = "ESSENTIALS"),
                (e[(e.USER_LIBRARY = 3)] = "USER_LIBRARY"),
                (e[(e.ALGO_HEATSEEKER = 4)] = "ALGO_HEATSEEKER"),
                (e[(e.SEED_TRACK = 5)] = "SEED_TRACK"),
                (e[(e.GN_1M_TEMPORARY = 6)] = "GN_1M_TEMPORARY"),
                (e[(e.VECTOR = 8)] = "VECTOR"),
                (e[(e.ARTIST_SIMILARITIES = 9)] = "ARTIST_SIMILARITIES"),
                (e[(e.STORY_ALBUM_LISTENERS_ALSO_BOUGHT = 10)] = "STORY_ALBUM_LISTENERS_ALSO_BOUGHT"),
                (e[(e.STORY_ALBUM_SALES_LEADER = 11)] = "STORY_ALBUM_SALES_LEADER"),
                (e[(e.STORY_BILLBOARD = 12)] = "STORY_BILLBOARD"),
                (e[(e.STORY_COMPLETE_MY_ALBUM = 13)] = "STORY_COMPLETE_MY_ALBUM"),
                (e[(e.STORY_CRITICAL_PICK = 14)] = "STORY_CRITICAL_PICK"),
                (e[(e.STORY_ITUNES_ESSENTIAL = 15)] = "STORY_ITUNES_ESSENTIAL"),
                (e[(e.STORY_HEATSEEKER = 16)] = "STORY_HEATSEEKER"),
                (e[(e.STORY_IDENTITY = 17)] = "STORY_IDENTITY"),
                (e[(e.STORY_POWER_SONG = 18)] = "STORY_POWER_SONG"),
                (e[(e.STORY_SONG_SALES_LEADER = 20)] = "STORY_SONG_SALES_LEADER"),
                (e[(e.GENRE_SIMILARITIES = 21)] = "GENRE_SIMILARITIES"),
                (e[(e.STORY_IMIX = 22)] = "STORY_IMIX"),
                (e[(e.STORY_OTHER_MIX = 23)] = "STORY_OTHER_MIX"),
                (e[(e.EDITORIAL = 24)] = "EDITORIAL"),
                (e[(e.TOP_SONGS = 25)] = "TOP_SONGS"),
                (e[(e.SUBFORMAT_SONGS = 26)] = "SUBFORMAT_SONGS"),
                (e[(e.CRITICAL_PICKS = 27)] = "CRITICAL_PICKS"),
                (e[(e.US_ARTIST_SIMS = 28)] = "US_ARTIST_SIMS"),
                (e[(e.HEAVY_ROTATION = 29)] = "HEAVY_ROTATION"),
                (e[(e.STORY_FORMAT_STATION_HEAVY_ROTATION = 30)] = "STORY_FORMAT_STATION_HEAVY_ROTATION"),
                (e[(e.ARTIST_BASED_CORE_SIMILAR_ARTISTS = 31)] = "ARTIST_BASED_CORE_SIMILAR_ARTISTS"),
                (e[(e.ARTIST_BASED_FAMILIAR_SIMILAR_ARTISTS = 32)] = "ARTIST_BASED_FAMILIAR_SIMILAR_ARTISTS"),
                (e[(e.ARTIST_BASED_DISCOVERIES = 33)] = "ARTIST_BASED_DISCOVERIES"),
                (e[(e.ARTIST_BASED_HOT_SONGS = 34)] = "ARTIST_BASED_HOT_SONGS"),
                (e[(e.ARTIST_BASED_SEED_ARTIST = 35)] = "ARTIST_BASED_SEED_ARTIST"),
                (e[(e.ARTIST_BASED_COMPOSER = 36)] = "ARTIST_BASED_COMPOSER"),
                (e[(e.EDITORIAL_STATION_INTRO = 37)] = "EDITORIAL_STATION_INTRO"),
                (e[(e.EDITORIAL_RELATIVE_REPEAT = 38)] = "EDITORIAL_RELATIVE_REPEAT"),
                (e[(e.EDITORIAL_ABSOLUTE_REPEAT = 39)] = "EDITORIAL_ABSOLUTE_REPEAT"),
                (e[(e.EDITORIAL_SCHEDULED = 40)] = "EDITORIAL_SCHEDULED"),
                (e[(e.EDITORIAL_SUGGESTED_ARTIST = 41)] = "EDITORIAL_SUGGESTED_ARTIST"),
                (e[(e.FOR_YOU_FAMILIAR = 42)] = "FOR_YOU_FAMILIAR"),
                (e[(e.FOR_YOU_RECOMMENDED = 43)] = "FOR_YOU_RECOMMENDED"),
                (e[(e.FOR_YOU_FAVORITE_ARTIST = 44)] = "FOR_YOU_FAVORITE_ARTIST"),
                (e[(e.FOR_YOU_RECOMMENDED_ARTIST = 45)] = "FOR_YOU_RECOMMENDED_ARTIST"),
                (e[(e.EDITORIAL_POSITIONAL = 46)] = "EDITORIAL_POSITIONAL"),
                (e[(e.SIMILAR_SONGS = 47)] = "SIMILAR_SONGS"),
                (e[(e.SONG_ATTRIBUTE_FAVORITE_ARTIST = 48)] = "SONG_ATTRIBUTE_FAVORITE_ARTIST"),
                (e[(e.SONG_ATTRIBUTE_FAVORITE_ARTIST_DERIVED = 49)] = "SONG_ATTRIBUTE_FAVORITE_ARTIST_DERIVED"),
                (e[(e.SONG_ATTRIBUTE_FAVORITE_ARTIST_EDITORIAL = 50)] = "SONG_ATTRIBUTE_FAVORITE_ARTIST_EDITORIAL"),
                (e[(e.SONG_ATTRIBUTE_RECOMMENDED = 51)] = "SONG_ATTRIBUTE_RECOMMENDED"),
                (e[(e.SONG_ATTRIBUTE_RECOMMENDED_DERIVED = 52)] = "SONG_ATTRIBUTE_RECOMMENDED_DERIVED"),
                (e[(e.SONG_ATTRIBUTE_RECOMMENDED_EDITORIAL = 53)] = "SONG_ATTRIBUTE_RECOMMENDED_EDITORIAL"),
                (e[(e.SONG_ATTRIBUTE_NON_PERSONALIZED = 54)] = "SONG_ATTRIBUTE_NON_PERSONALIZED"),
                (e[(e.SONG_ATTRIBUTE_NON_PERSONALIZED_DERIVED = 55)] = "SONG_ATTRIBUTE_NON_PERSONALIZED_DERIVED"),
                (e[(e.SONG_ATTRIBUTE_NON_PERSONALIZED_EDITORIAL = 56)] = "SONG_ATTRIBUTE_NON_PERSONALIZED_EDITORIAL"),
                (e[(e.PERSONAL_STATION = 57)] = "PERSONAL_STATION"),
                (e[(e.PERSONAL_STATION_FAVORITE_ARTIST = 58)] = "PERSONAL_STATION_FAVORITE_ARTIST"),
                (e[(e.PERSONAL_STATION_RECOMMENDED = 59)] = "PERSONAL_STATION_RECOMMENDED"),
                (e[(e.NEW_MUSIC_STATION = 60)] = "NEW_MUSIC_STATION"),
                (e[(e.NEW_MUSIC_STATION_FAVORITE_ARTIST = 61)] = "NEW_MUSIC_STATION_FAVORITE_ARTIST"),
                (e[(e.NEW_MUSIC_STATION_RECOMMENDED = 62)] = "NEW_MUSIC_STATION_RECOMMENDED")
        })(gr || (gr = {}))
    var vr, br, _r, Tr, Sr, Pr, Er, kr, wr, Ir, Or, Ar, Rr, Cr
    /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
    function t(e, n) {
        var d = "function" == typeof Symbol && e[Symbol.iterator]
        if (!d) return e
        var h,
            p,
            y = d.call(e),
            m = []
        try {
            for (; (void 0 === n || n-- > 0) && !(h = y.next()).done; ) m.push(h.value)
        } catch (g) {
            p = { error: g }
        } finally {
            try {
                h && !h.done && (d = y.return) && d.call(y)
            } finally {
                if (p) throw p.error
            }
        }
        return m
    }
    !(function (e) {
        ;(e[(e.UNKNOWN_FORMAT = 0)] = "UNKNOWN_FORMAT"),
            (e[(e.STEREO = 1)] = "STEREO"),
            (e[(e.SPATIAL = 2)] = "SPATIAL"),
            (e[(e.PREFERENCE_FORMAT_UNSUPPORTED = 3)] = "PREFERENCE_FORMAT_UNSUPPORTED")
    })(vr || (vr = {})),
        (function (e) {
            ;(e[(e.UNKNOWN_QUALITY = 0)] = "UNKNOWN_QUALITY"),
                (e[(e.HIGH_EFFICIENCY = 1)] = "HIGH_EFFICIENCY"),
                (e[(e.HIGH_QUALITY = 2)] = "HIGH_QUALITY"),
                (e[(e.LOSSLESS = 3)] = "LOSSLESS"),
                (e[(e.HIGH_RESOLUTION_LOSSLESS = 4)] = "HIGH_RESOLUTION_LOSSLESS"),
                (e[(e.PREFERENCE_QUALITY_UNSUPPORTED = 5)] = "PREFERENCE_QUALITY_UNSUPPORTED")
        })(br || (br = {})),
        (function (e) {
            ;(e[(e.UNSPECIFIED = 0)] = "UNSPECIFIED"),
                (e[(e.STATIC = 1)] = "STATIC"),
                (e[(e.LINE_BY_LINE = 2)] = "LINE_BY_LINE"),
                (e[(e.WORD_BY_WORD = 3)] = "WORD_BY_WORD")
        })(_r || (_r = {})),
        (function (e) {
            ;(e[(e.REPEAT_UNKNOWN = 0)] = "REPEAT_UNKNOWN"),
                (e[(e.REPEAT_OFF = 1)] = "REPEAT_OFF"),
                (e[(e.REPEAT_ONE = 2)] = "REPEAT_ONE"),
                (e[(e.REPEAT_ALL = 3)] = "REPEAT_ALL")
        })(Tr || (Tr = {})),
        (function (e) {
            ;(e[(e.SHUFFLE_UNKNOWN = 0)] = "SHUFFLE_UNKNOWN"),
                (e[(e.SHUFFLE_OFF = 1)] = "SHUFFLE_OFF"),
                (e[(e.SHUFFLE_ON = 2)] = "SHUFFLE_ON")
        })(Sr || (Sr = {})),
        (function (e) {
            ;(e[(e.AUTO_UNKNOWN = 0)] = "AUTO_UNKNOWN"),
                (e[(e.AUTO_OFF = 1)] = "AUTO_OFF"),
                (e[(e.AUTO_ON = 2)] = "AUTO_ON"),
                (e[(e.AUTO_ON_CONTENT_UNSUPPORTED = 3)] = "AUTO_ON_CONTENT_UNSUPPORTED")
        })(Pr || (Pr = {})),
        (function (e) {
            ;(e[(e.NOT_SPECIFIED = 0)] = "NOT_SPECIFIED"), (e[(e.CONTAINER_CHANGED = 1)] = "CONTAINER_CHANGED")
        })(Er || (Er = {})),
        (function (e) {
            ;(e[(e.PLAY_END = 0)] = "PLAY_END"),
                (e[(e.PLAY_START = 1)] = "PLAY_START"),
                (e[(e.LYRIC_DISPLAY = 2)] = "LYRIC_DISPLAY")
        })(kr || (kr = {})),
        (function (e) {
            ;(e[(e.INVALID = 0)] = "INVALID"),
                (e[(e.ITUNES_STORE_CONTENT = 1)] = "ITUNES_STORE_CONTENT"),
                (e[(e.NON_SONG_CLIP = 2)] = "NON_SONG_CLIP"),
                (e[(e.AD = 3)] = "AD"),
                (e[(e.STREAM = 4)] = "STREAM"),
                (e[(e.AUDIO_AD = 5)] = "AUDIO_AD"),
                (e[(e.VIDEO_AD = 6)] = "VIDEO_AD"),
                (e[(e.TIMED_METADATA_PING = 7)] = "TIMED_METADATA_PING"),
                (e[(e.ARTIST_UPLOADED_CONTENT = 8)] = "ARTIST_UPLOADED_CONTENT"),
                (e[(e.AGGREGATE_NON_CATALOG_PLAY_TIME = 9)] = "AGGREGATE_NON_CATALOG_PLAY_TIME"),
                (e[(e.ORIGINAL_CONTENT_MOVIES = 10)] = "ORIGINAL_CONTENT_MOVIES"),
                (e[(e.ORIGINAL_CONTENT_SHOWS = 11)] = "ORIGINAL_CONTENT_SHOWS")
        })(wr || (wr = {})),
        (function (e) {
            ;(e[(e.AUDIO = 0)] = "AUDIO"), (e[(e.VIDEO = 1)] = "VIDEO")
        })(Ir || (Ir = {})),
        (function (e) {
            ;(e[(e.AUTO = 0)] = "AUTO"), (e[(e.MANUAL = 1)] = "MANUAL")
        })(Or || (Or = {})),
        (function (e) {
            ;(e[(e.ORIGINATING_DEVICE = 0)] = "ORIGINATING_DEVICE"),
                (e[(e.PAIRED_WATCH = 1)] = "PAIRED_WATCH"),
                (e[(e.SONOS = 2)] = "SONOS"),
                (e[(e.CAR_PLAY = 3)] = "CAR_PLAY"),
                (e[(e.WEB_AUC = 4)] = "WEB_AUC"),
                (e[(e.TWITTER_AUC = 5)] = "TWITTER_AUC"),
                (e[(e.MUSIC_SDK = 6)] = "MUSIC_SDK"),
                (e[(e.ATV_REMOTE = 7)] = "ATV_REMOTE"),
                (e[(e.WEBPLAYER = 8)] = "WEBPLAYER"),
                (e[(e.WHOLE_HOUSE_AUDIO = 9)] = "WHOLE_HOUSE_AUDIO"),
                (e[(e.MUSICKIT = 10)] = "MUSICKIT"),
                (e[(e.VW = 11)] = "VW"),
                (e[(e.UNKNOWN_SOURCE_TYPE = 12)] = "UNKNOWN_SOURCE_TYPE"),
                (e[(e.AMAZON = 13)] = "AMAZON"),
                (e[(e.PORSCHE = 14)] = "PORSCHE"),
                (e[(e.CHROMECAST = 15)] = "CHROMECAST"),
                (e[(e.WEB_APP = 16)] = "WEB_APP"),
                (e[(e.MERCEDES_BENZ = 17)] = "MERCEDES_BENZ"),
                (e[(e.THIRD_PARTY_TV = 18)] = "THIRD_PARTY_TV"),
                (e[(e.SAMSUNG = 18)] = "SAMSUNG"),
                (e[(e.SEAT = 19)] = "SEAT"),
                (e[(e.CUPRA = 20)] = "CUPRA")
        })(Ar || (Ar = {})),
        (function (e) {
            ;(e[(e.EPISODE = 1)] = "EPISODE"), (e[(e.SHOUTCAST = 2)] = "SHOUTCAST")
        })(Rr || (Rr = {})),
        (function (e) {
            ;(e[(e.NotStarted = 0)] = "NotStarted"), (e[(e.Running = 1)] = "Running"), (e[(e.Stopped = 2)] = "Stopped")
        })(Cr || (Cr = {}))
    var Mr = { type: "xstate.init" }
    function r(e) {
        return void 0 === e ? [] : [].concat(e)
    }
    function o(e) {
        return { type: "xstate.assign", assignment: e }
    }
    function i(e, n) {
        return "string" == typeof (e = "string" == typeof e && n && n[e] ? n[e] : e)
            ? { type: e }
            : "function" == typeof e
            ? { type: e.name, exec: e }
            : e
    }
    function a(e) {
        return function (n) {
            return e === n
        }
    }
    function u(e) {
        return "string" == typeof e ? { type: e } : e
    }
    function c(e, n) {
        return { value: e, context: n, actions: [], changed: !1, matches: a(e) }
    }
    function f(e, n, d) {
        var h = n,
            p = !1
        return [
            e.filter(function (e) {
                if ("xstate.assign" === e.type) {
                    p = !0
                    var n = Object.assign({}, h)
                    return (
                        "function" == typeof e.assignment
                            ? (n = e.assignment(h, d))
                            : Object.keys(e.assignment).forEach(function (p) {
                                  n[p] = "function" == typeof e.assignment[p] ? e.assignment[p](h, d) : e.assignment[p]
                              }),
                        (h = n),
                        !1
                    )
                }
                return !0
            }),
            h,
            p
        ]
    }
    function s(e, n) {
        void 0 === n && (n = {})
        var d = t(
                f(
                    r(e.states[e.initial].entry).map(function (e) {
                        return i(e, n.actions)
                    }),
                    e.context,
                    Mr
                ),
                2
            ),
            h = d[0],
            p = d[1],
            y = {
                config: e,
                _options: n,
                initialState: { value: e.initial, actions: h, context: p, matches: a(e.initial) },
                transition: function (n, d) {
                    var h,
                        p,
                        m = "string" == typeof n ? { value: n, context: e.context } : n,
                        g = m.value,
                        b = m.context,
                        _ = u(d),
                        T = e.states[g]
                    if (T.on) {
                        var S = r(T.on[_.type])
                        try {
                            for (
                                var P = (function (e) {
                                        var n = "function" == typeof Symbol && Symbol.iterator,
                                            d = n && e[n],
                                            h = 0
                                        if (d) return d.call(e)
                                        if (e && "number" == typeof e.length)
                                            return {
                                                next: function () {
                                                    return (
                                                        e && h >= e.length && (e = void 0),
                                                        { value: e && e[h++], done: !e }
                                                    )
                                                }
                                            }
                                        throw new TypeError(
                                            n ? "Object is not iterable." : "Symbol.iterator is not defined."
                                        )
                                    })(S),
                                    E = P.next();
                                !E.done;
                                E = P.next()
                            ) {
                                var k = E.value
                                if (void 0 === k) return c(g, b)
                                var w = "string" == typeof k ? { target: k } : k,
                                    I = w.target,
                                    O = w.actions,
                                    A = void 0 === O ? [] : O,
                                    R = w.cond,
                                    C =
                                        void 0 === R
                                            ? function () {
                                                  return !0
                                              }
                                            : R,
                                    M = void 0 === I,
                                    D = null != I ? I : g,
                                    x = e.states[D]
                                if (C(b, _)) {
                                    var L = t(
                                            f(
                                                (M
                                                    ? r(A)
                                                    : [].concat(T.exit, A, x.entry).filter(function (e) {
                                                          return e
                                                      })
                                                ).map(function (e) {
                                                    return i(e, y._options.actions)
                                                }),
                                                b,
                                                _
                                            ),
                                            3
                                        ),
                                        N = L[0],
                                        j = L[1],
                                        U = L[2],
                                        $ = null != I ? I : g
                                    return {
                                        value: $,
                                        context: j,
                                        actions: N,
                                        changed: I !== g || N.length > 0 || U,
                                        matches: a($)
                                    }
                                }
                            }
                        } catch (G) {
                            h = { error: G }
                        } finally {
                            try {
                                E && !E.done && (p = P.return) && p.call(P)
                            } finally {
                                if (h) throw h.error
                            }
                        }
                    }
                    return c(g, b)
                }
            }
        return y
    }
    var l = function (e, n) {
        return e.actions.forEach(function (d) {
            var h = d.exec
            return h && h(e.context, n)
        })
    }
    function v(e) {
        var n = e.initialState,
            d = Cr.NotStarted,
            h = new Set(),
            p = {
                _machine: e,
                send: function (p) {
                    d === Cr.Running &&
                        ((n = e.transition(n, p)),
                        l(n, u(p)),
                        h.forEach(function (e) {
                            return e(n)
                        }))
                },
                subscribe: function (e) {
                    return (
                        h.add(e),
                        e(n),
                        {
                            unsubscribe: function () {
                                return h.delete(e)
                            }
                        }
                    )
                },
                start: function (h) {
                    if (h) {
                        var y = "object" == typeof h ? h : { context: e.config.context, value: h }
                        n = { value: y.value, actions: [], context: y.context, matches: a(y.value) }
                    }
                    return (d = Cr.Running), l(n, Mr), p
                },
                stop: function () {
                    return (d = Cr.Stopped), h.clear(), p
                },
                get state() {
                    return n
                },
                get status() {
                    return d
                }
            }
        return p
    }
    const Dr = /(?:st|ra)\.([0-9]+)/,
        xr = /st\.([0-9]+)/
    function asyncGeneratorStep$10(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$E(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$E(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$E(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$p(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function _objectWithoutProperties$3(e, n) {
        if (null == e) return {}
        var d,
            h,
            p = (function (e, n) {
                if (null == e) return {}
                var d,
                    h,
                    p = {},
                    y = Object.keys(e)
                for (h = 0; h < y.length; h++) (d = y[h]), n.indexOf(d) >= 0 || (p[d] = e[d])
                return p
            })(e, n)
        if (Object.getOwnPropertySymbols) {
            var y = Object.getOwnPropertySymbols(e)
            for (h = 0; h < y.length; h++)
                (d = y[h]), n.indexOf(d) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, d) && (p[d] = e[d]))
        }
        return p
    }
    const toTimeMeasuredData = (e) => {
        var { timestamp: n } = e
        return _objectSpreadProps$p(_objectSpread$E({}, _objectWithoutProperties$3(e, ["timestamp"])), {
            "milliseconds-since-play": Date.now() - n
        })
    }
    class PlayActivitySender {
        get accessToken() {
            return invoke(this._accessToken)
        }
        get musicUserToken() {
            return invoke(this._musicUserToken)
        }
        get url() {
            return this._isQA
                ? "https://universal-activity-service.itunes.apple.com/qa/play"
                : "https://universal-activity-service.itunes.apple.com/play"
        }
        send(e) {
            var n,
                d = this
            return ((n = function* () {
                const n = {
                    client_id: d._clientId,
                    event_type: d._eventType,
                    data: ensureArray(e).map(toTimeMeasuredData)
                }
                if (0 === n.data.length) throw new Error("send() called without any data")
                const h = d._generateFetchOptions({ method: "POST", body: JSON.stringify(n), headers: d.headers() })
                return (
                    yield d._fetch(d.url, h),
                    d._logInfo && console.info("play activity:", d._sourceType === Ar.AMAZON ? JSON.stringify(n) : n),
                    n
                )
            }),
            function () {
                var e = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = n.apply(e, d)
                    function _next(e) {
                        asyncGeneratorStep$10(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$10(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        baseHeaders() {
            var e, n
            const d =
                null !== (n = null === (e = this._fetchOptions) || void 0 === e ? void 0 : e.headers) && void 0 !== n
                    ? n
                    : {}
            return d instanceof this._headersClass
                ? new this._headersClass(Array.from(d.entries()))
                : new this._headersClass(d)
        }
        headers() {
            const e = this._preferDSID ? "X-Dsid" : "media-user-token",
                n = this.baseHeaders()
            return (
                n.set("Authorization", "Bearer " + this.accessToken),
                n.set("Content-Type", "application/json"),
                n.set(e, "" + this.musicUserToken),
                this._isQA && void 0 !== this._traceTag && n.set("Data-Trace-Tag", this._traceTag),
                n
            )
        }
        _generateFetchOptions(e) {
            return _objectSpread$E({}, this._fetchOptions, e)
        }
        constructor(e) {
            var n, d, h, p
            ;(this.mode = Or.AUTO),
                (this._isQA = !1),
                (this._logInfo = !1),
                (this._preferDSID = !1),
                (this._accessToken = e.accessToken),
                (this._clientId = e.clientId),
                (this._eventType = e.eventType),
                (this._fetch = null !== (n = e.fetch) && void 0 !== n ? n : fetch),
                (this._fetchOptions = null !== (d = e.fetchOptions) && void 0 !== d ? d : {}),
                (this._headersClass = null !== (h = e.headersClass) && void 0 !== h ? h : Headers),
                (this._isQA = null !== (p = e.isQA) && void 0 !== p && p),
                (this._logInfo = e.logInfo || this._isQA),
                (this._musicUserToken = e.musicUserToken),
                (this._preferDSID = e.preferDSID),
                (this._sourceType = e.sourceType),
                (this._traceTag = e.traceTag)
        }
    }
    const fullAppId = (e, n) => {
            if (void 0 === (null == n ? void 0 : n.name)) return "MusicKitApp/1.0"
            if (void 0 !== e) return e
            return `${(function (e) {
                return e
                    .toLowerCase()
                    .replace(/[-_]+/g, " ")
                    .replace(/[^\w\s]/g, "")
                    .replace(/\b./g, (e) => e.toUpperCase())
                    .replace(/\s/g, "")
            })(n.name)}/${(null == n ? void 0 : n.version) || "1.0"}`
        },
        os = (e) => {
            var n, d
            const h = e.toLowerCase()
            let p,
                y = "Unidentified OS"
            const m = /mobile/.test(h)
            var g
            m && /android|adr/.test(h)
                ? ((y = "Android"), (p = h.match(/(?:android|adr)\ ((\d+[._])+\d+)/)))
                : m && /iphone|ipad|ipod/.test(h)
                ? ((y = "iOS"), (p = h.match(/os\ ((\d+[._])+\d+)\ like\ mac\ os\ x/)))
                : /tizen/.test(h)
                ? ((y = "Tizen"), (p = h.match(/tizen (.*)/)))
                : /web0s|webos/.test(h)
                ? ((y = "WebOS"), (p = h.match(/[web0s|webos] (.*)/)))
                : !m && /cros/.test(h)
                ? (y = "ChromeOS")
                : !m && /macintosh/.test(h)
                ? ((y = "macOS"), (p = h.match(/os\ x\ ((\d+[._])+\d+)\b/)))
                : !m && /linux/.test(h)
                ? (y = "Linux")
                : !m && /windows/.test(h) && ((y = "Windows"), (p = h.match(/windows ([^\)]*)/)))
            return `${y}/${
                null !==
                    (g =
                        null == p || null === (n = p[1]) || void 0 === n || null === (d = n.replace) || void 0 === d
                            ? void 0
                            : d.call(n, /_/g, ".")) && void 0 !== g
                    ? g
                    : "0.0"
            }`
        },
        model = (e) => "model/" + ((null == e ? void 0 : e.platform) || "Unavailable"),
        build = (e) => {
            const n = null == e ? void 0 : e.build
            return void 0 === n || "" === n ? "build/0.0.0" : "build/" + n
        }
    function asyncGeneratorStep$$(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$D(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$D(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$D(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$o(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const Lr = { platform: "", userAgent: "" }
    class PlayActivityBase {
        get accessToken() {
            return invoke(this._accessToken)
        }
        get appID() {
            return void 0 === this._appId && (this._appId = fullAppId(this._appId, this._appInfo)), this._appId
        }
        get deviceName() {
            return this._deviceName
        }
        get musicUserToken() {
            return invoke(this._musicUserToken)
        }
        get navigator() {
            var e
            return null !== (e = this._navigator) && void 0 !== e ? e : "undefined" == typeof navigator ? Lr : navigator
        }
        get storefrontId() {
            return invoke(this._storefrontId)
        }
        get userAgent() {
            var e
            return null !== (e = this._userAgent) && void 0 !== e ? e : this.navigator.userAgent
        }
        get userIsSubscribed() {
            return invoke(this._userIsSubscribed)
        }
        get allowReportingId() {
            return invoke(this._allowReportingId)
        }
        get utcOffsetInSeconds() {
            if (void 0 === this._utcOffsetInSeconds && void 0 !== this._utcOffset && !isNaN(this._utcOffset)) {
                const e = 60 * this._utcOffset
                this._utcOffsetInSeconds = e <= 0 ? Math.abs(e) : -e
            }
            return void 0 === this._utcOffsetInSeconds || isNaN(this._utcOffsetInSeconds)
                ? -1
                : this._utcOffsetInSeconds
        }
        send(e) {
            var n,
                d = this
            return ((n = function* () {
                return d.sender.send(e)
            }),
            function () {
                var e = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = n.apply(e, d)
                    function _next(e) {
                        asyncGeneratorStep$$(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$$(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        buildDescriptorForPlayParams(e, n, d, h, p) {
            const y = "stream" === e.format ? wr.STREAM : wr.ITUNES_STORE_CONTENT
            return _objectSpread$D(
                _objectSpreadProps$o(_objectSpread$D({}, e), {
                    container: d,
                    duration: null != h ? h : 0,
                    eventType: n,
                    itemType: y
                }),
                p
            )
        }
        buildForPlayParams(e, n, d, h = 0, p = {}, y = !1) {
            return this.build(this.buildDescriptorForPlayParams(e, n, d, h, p), y)
        }
        constructor(e, n, d, h) {
            var p, y, m, g
            ;((this._accessToken = e),
            (this._musicUserToken = n),
            (this._storefrontId = d),
            (this.privateEnabled = !1),
            (this.siriInitiated = !1),
            (this.clientId = "JSCLIENT"),
            (this.eventType = "JSPLAY"),
            (this.internalBuild = !1),
            (this.preferDSID = !1),
            (this.sourceType = Ar.MUSICKIT),
            (this._utcOffset = new Date().getTimezoneOffset()),
            (this._userIsSubscribed = !0),
            (this._allowReportingId = !1),
            h) &&
                ((this._appInfo = h.app),
                (this._navigator = h.navigator),
                (this._userAgent = h.userAgent),
                hasOwn(h, "utcOffset") && isNaN(h.utcOffset)
                    ? (this._utcOffsetInSeconds = -1)
                    : hasOwn(h, "utcOffset") && (this._utcOffset = h.utcOffset),
                (this.clientId = h.clientId || "JSCLIENT"),
                (this._deviceName = h.deviceName),
                (this.guid = h.guid),
                (this.metricsClientId = h.metricsClientId),
                (this.preferDSID = null !== (y = h.preferDSID) && void 0 !== y && y),
                (this.sourceType =
                    void 0 !== h.sourceType && "number" == typeof h.sourceType ? h.sourceType : Ar.MUSICKIT),
                (this._userIsSubscribed = null === (m = h.userIsSubscribed) || void 0 === m || m),
                (this._allowReportingId = null !== (g = h.allowReportingId) && void 0 !== g && g))
            ;(this.buildVersion = ((e, n, d, h) => [fullAppId(e, n), os(h), model(d), build(n)].join(" "))(
                this._appId,
                this._appInfo,
                this.navigator,
                this.userAgent
            )),
                (this.sender = new PlayActivitySender({
                    accessToken: this._accessToken,
                    clientId: this.clientId,
                    eventType: this.eventType,
                    fetch: null == h ? void 0 : h.fetch,
                    fetchOptions: null == h ? void 0 : h.fetchOptions,
                    headersClass: null == h || null === (p = h.fetch) || void 0 === p ? void 0 : p.Headers,
                    isQA: null == h ? void 0 : h.isQA,
                    logInfo: null == h ? void 0 : h.logInfo,
                    musicUserToken: this._musicUserToken,
                    preferDSID: this.preferDSID,
                    sourceType: this.sourceType,
                    traceTag: null == h ? void 0 : h.traceTag
                }))
        }
    }
    const DEFAULT_CACHE_KEY_FUNCTION = (e, n) => `${n}${e}`
    class NetworkCache {
        getItem(e) {
            const n = this.cacheKeyForPath(e),
                d = this.storage.getItem(n)
            if (null !== d) {
                const { x: e, d: h } = JSON.parse(d)
                if (e > Date.now()) return h
                this.storage.removeItem(n)
            }
        }
        setItem(e, n, d = this.ttl) {
            const h = this.cacheKeyForPath(e)
            this.storage.setItem(h, JSON.stringify({ x: Date.now() + d, d: n }))
        }
        removeItem(e) {
            const n = this.cacheKeyForPath(e)
            this.storage.removeItem(n)
        }
        removeItemsMatching(e, n = !0) {
            const d = this.cacheKeyForPath(e)
            this.removeItemsMatchingCacheKey(d, n)
        }
        clear() {
            this.removeItemsMatchingCacheKey(this.prefix, !1)
        }
        removeItemsMatchingCacheKey(e, n) {
            const d = new RegExp(`^${e}${n ? "$" : ""}`)
            ;(this.storage instanceof GenericStorage ? this.storage.keys : Object.keys(this.storage)).forEach((e) => {
                e && d.test(e) && this.storage.removeItem(e)
            })
        }
        cacheKeyForPath(e) {
            return this.cacheKeyFunction(e, this.prefix)
        }
        constructor(e = {}) {
            ;(this.storage = e.storage || new GenericStorage()),
                (this.prefix = e.prefix || "铮�"),
                (this.ttl = e.ttl || 3e5),
                (this.cacheKeyFunction = e.cacheKeyFunction || DEFAULT_CACHE_KEY_FUNCTION)
        }
    }
    function asyncGeneratorStep$_(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$C(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$C(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$C(e, n, d[n])
                })
        }
        return e
    }
    var Nr
    !(function (e) {
        ;(e.JSON = "application/json"), (e.FORM = "application/x-www-form-urlencoded")
    })(Nr || (Nr = {}))
    const jr = Date.now()
    var Ur
    const $r = isNodeEnvironment$1()
            ? () => {
                  const [e, n] = process.hrtime()
                  return Math.floor(1e3 * e + 1e-6 * n)
              }
            : () => {
                  var e
                  return null !==
                      (Ur =
                          null === performance ||
                          void 0 === performance ||
                          null === (e = performance.now) ||
                          void 0 === e
                              ? void 0
                              : e.call(performance)) && void 0 !== Ur
                      ? Ur
                      : Date.now() - jr
              },
        formatByte = (e) => ("0" + (255 & e).toString(16)).slice(-2),
        Gr = new Map([
            ["play", kr.PLAY_START],
            ["playbackstarted", kr.PLAY_START],
            ["stop", kr.PLAY_END],
            ["playbackstopped", kr.PLAY_END]
        ])
    function mapEventTypeString(e) {
        return "number" == typeof e ? e : null !== (n = Gr.get(e)) && void 0 !== n ? n : kr.PLAY_END
        var n
    }
    const Br = new Map([
        ["exit", e.PlayActivityEndReasonType.EXITED_APPLICATION],
        ["next", e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS],
        ["pause", e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED],
        ["playbackfinished", e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK],
        ["playbackstopped", e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED],
        ["previous", e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS],
        ["scrub_begin", e.PlayActivityEndReasonType.SCRUB_BEGIN],
        ["scrub_end", e.PlayActivityEndReasonType.SCRUB_END],
        ["stop", e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK]
    ])
    function normalizePlayActivityDescriptor(e) {
        const n = deepClone(e),
            d = (function (e) {
                var n
                const d = null !== (n = e.eventType) && void 0 !== n ? n : kr.PLAY_START
                if ("number" == typeof d) return { eventType: d }
                return { eventTypeString: d, eventType: mapEventTypeString(d) }
            })(e)
        return (
            (n.eventType = d.eventType),
            (n.eventTypeString = d.eventTypeString),
            void 0 === n.endReasonType &&
                void 0 !== d.eventTypeString &&
                (n.endReasonType = (function (e) {
                    if (void 0 !== e) return Br.get(e)
                })(d.eventTypeString)),
            !1 !== n.reporting && (n.reporting = !0),
            n
        )
    }
    function _defineProperty$B(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$n(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const createHelper = (e, n) => (d, h, p) => {
        const { helpers: y } = p.cache
        return e in y || (y[e] = n(d, h, p)), y[e]
    }
    const returnAsField =
            (e, n) =>
            (...d) =>
                (function (e, n) {
                    if (void 0 !== n) return { [e]: n }
                })(e, n(...d)),
        createFieldFn = (e, n) => (d, h, p) => {
            const { fields: y } = p.cache
            var m
            return (
                e in y ||
                    (p.cache.fields = _objectSpreadProps$n(
                        (function (e) {
                            for (var n = 1; n < arguments.length; n++) {
                                var d = null != arguments[n] ? arguments[n] : {},
                                    h = Object.keys(d)
                                "function" == typeof Object.getOwnPropertySymbols &&
                                    (h = h.concat(
                                        Object.getOwnPropertySymbols(d).filter(function (e) {
                                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                                        })
                                    )),
                                    h.forEach(function (n) {
                                        _defineProperty$B(e, n, d[n])
                                    })
                            }
                            return e
                        })({}, y),
                        { [e]: ((m = n(d, h, p)), null == m ? void 0 : { [e]: m }) }
                    )),
                p.cache.fields[e]
            )
        },
        createClientFieldFn = (e, n) => createFieldFn(e, (e, d, { client: h }) => h[n]),
        Fr = createFieldFn("event-type", (e, n, d) => {
            return void 0 === e.eventType
                ? kr.PLAY_START
                : e.itemType === wr.TIMED_METADATA_PING && void 0 !== e.timedMetadata
                ? kr.PLAY_END
                : null !== (h = e.eventType) && void 0 !== h
                ? h
                : kr.PLAY_START
            var h
        }),
        Kr = createHelper("should-include-audio-quality", (e, n, d) => {
            var h, p
            const y = e.userPreference
            return (
                Fr(e, n, d)["event-type"] === kr.PLAY_END &&
                void 0 !== (null === (h = e.audioQuality) || void 0 === h ? void 0 : h.provided) &&
                void 0 !== (null === (p = e.audioQuality) || void 0 === p ? void 0 : p.targeted) &&
                void 0 !== (null == y ? void 0 : y.audioQuality) &&
                void 0 !== (null == y ? void 0 : y.playbackFormat)
            )
        }),
        Vr = createFieldFn("audio-quality-provided", (e, n, d) => {
            if (!Kr(e, n, d)) return
            const h = e.audioQuality
            if (void 0 === (null == h ? void 0 : h.provided)) return
            const { provided: p } = h
            var y, m, g
            return {
                "audio-sample-rate-in-hz": null !== (y = p.audioSampleRateHz) && void 0 !== y ? y : 0,
                "audio-bit-depth": null !== (m = p.audioBitDepth) && void 0 !== m ? m : 0,
                "bit-rate-in-bps": null !== (g = p.bitRateBps) && void 0 !== g ? g : 0,
                codec: p.codec,
                "audio-channel-type": p.audioChannelType,
                "playback-format": p.playbackFormat
            }
        }),
        Hr = createFieldFn("audio-quality-targeted", (e, n, d) => {
            if (!Kr(e, n, d)) return
            const h = e.audioQuality
            if (void 0 === (null == h ? void 0 : h.targeted)) return
            const { targeted: p } = h
            var y, m, g
            return {
                "audio-sample-rate-in-hz": null !== (y = p.audioSampleRateHz) && void 0 !== y ? y : 0,
                "audio-bit-depth": null !== (m = p.audioBitDepth) && void 0 !== m ? m : 0,
                "bit-rate-in-bps": null !== (g = p.bitRateBps) && void 0 !== g ? g : 0,
                codec: p.codec,
                "audio-channel-type": p.audioChannelType,
                "playback-format": p.playbackFormat
            }
        }),
        qr = createClientFieldFn("build-version", "buildVersion"),
        Wr = ["uploadedVideo", "uploadedAudio", "uploaded-videos", "uploaded-audios"],
        Yr = createHelper("is-auc", ({ kind: e }) => void 0 !== e && Wr.includes(e)),
        zr = createHelper(
            "should-send-timed-metadata",
            ({ endReasonType: n, eventType: d, itemType: h, timedMetadata: p }) =>
                void 0 !== p &&
                (h === wr.TIMED_METADATA_PING ||
                    d === kr.PLAY_START ||
                    n === e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED)
        ),
        Qr = createFieldFn("type", (e, n, d) => {
            const { id: h, reporting: p } = e
            var y
            if ("-1" === h || !p)
                switch (null === (y = Fr(e, n, d)) || void 0 === y ? void 0 : y["event-type"]) {
                    case kr.PLAY_END:
                        return wr.AGGREGATE_NON_CATALOG_PLAY_TIME
                    case kr.PLAY_START:
                        if ("-1" === h) return wr.INVALID
                }
            const { format: m, itemType: g } = e
            return zr(e, n, d)
                ? g === wr.TIMED_METADATA_PING
                    ? g
                    : wr.STREAM
                : "stream" === m
                ? wr.STREAM
                : Yr(e, n, d)
                ? wr.ARTIST_UPLOADED_CONTENT
                : null != g
                ? g
                : wr.ITUNES_STORE_CONTENT
        }),
        Jr = createFieldFn("container-type", (e, n, d) => {
            var h
            if ((null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME)
                return
            const { container: p } = e
            if (void 0 === p) return hr.UNKNOWN
            var y
            const m = null !== (y = p.type) && void 0 !== y ? y : p.kind
            if ("number" == typeof m) return m
            switch (m) {
                case "album":
                case "albums":
                case "library-albums":
                    return hr.ALBUM
                case "artist":
                case "artists":
                case "library-artists":
                    return hr.ARTIST
                case "playlist":
                case "playlists":
                case "library-playlists":
                    return hr.PLAYLIST
                case "radio":
                case "radioStation":
                case "station":
                case "stations":
                    return hr.RADIO
                default:
                    return hr.UNKNOWN
            }
        })
    function _defineProperty$A(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    const Xr = [
            returnAsField("album-adam-id", (e, n, d) => {
                var h
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.ALBUM) return
                const { container: p } = e,
                    y = null == p ? void 0 : p.id
                return void 0 === y || S(y) ? void 0 : y
            }),
            returnAsField("cloud-album-id", (e, n, d) => {
                var h
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.ALBUM) return
                const { container: p } = e,
                    y = null == p ? void 0 : p.id
                return void 0 !== y && S(y) ? y : void 0
            }),
            returnAsField("global-playlist-id", (e, n, d) => {
                var h
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.PLAYLIST) return
                const { container: p } = e
                var y
                const m =
                    null !== (y = null == p ? void 0 : p.catalogId) && void 0 !== y
                        ? y
                        : null == p
                        ? void 0
                        : p.globalId
                return (null == p ? void 0 : p.isLibrary) && m
                    ? m
                    : S(null == p ? void 0 : p.id) || null == p
                    ? void 0
                    : p.id
            }),
            returnAsField("playlist-version-hash", (e, n, d) => {
                var h
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.PLAYLIST) return
                const { container: p } = e,
                    y = null == p ? void 0 : p.versionHash
                return void 0 !== y && "" !== y ? y : void 0
            }),
            returnAsField("station-hash", (e, n, d) => {
                var h, p
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.RADIO) return
                const y = null === (p = e.container) || void 0 === p ? void 0 : p.stationHash
                return void 0 !== y && "" !== y ? y : void 0
            }),
            returnAsField("station-id", (e, n, d) => {
                var h, p
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) === hr.RADIO)
                    return null === (p = e.container) || void 0 === p ? void 0 : p.id
            }),
            returnAsField("station-personalized-id", (e, n, d) => {
                var h, p
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.RADIO) return
                const y = null === (p = e.container) || void 0 === p ? void 0 : p.id
                return void 0 !== y && xr.test(y) ? parseInt(y.replace(xr, "$1"), 10) : void 0
            }),
            returnAsField("universal-library-id", (e, n, d) => {
                var h
                if ((null === (h = Jr(e, n, d)) || void 0 === h ? void 0 : h["container-type"]) !== hr.PLAYLIST) return
                const { container: p } = e
                var y
                const m =
                        null !== (y = null == p ? void 0 : p.catalogId) && void 0 !== y
                            ? y
                            : null == p
                            ? void 0
                            : p.globalId,
                    g = null == p ? void 0 : p.id
                if (void 0 !== g)
                    if ((null == p ? void 0 : p.isLibrary) && m) {
                        if ("" !== g) return g
                    } else if (S(g)) return g
            })
        ],
        Zr = createFieldFn("container-ids", (e, n, d) => {
            var h
            if ((null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME)
                return
            const p = Xr.reduce(
                (h, p) =>
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$A(e, n, d[n])
                                })
                        }
                        return e
                    })({}, h, p(e, n, d)),
                Object.create(null)
            )
            return isEmpty(p) ? void 0 : p
        }),
        en = createClientFieldFn("developer-token", "accessToken"),
        tn = createClientFieldFn("device-name", "deviceName"),
        rn = createFieldFn("display-type", (e, n, d) => {
            var h, p
            if ((null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.LYRIC_DISPLAY)
                return null === (p = e.lyricDescriptor) || void 0 === p ? void 0 : p.displayType
        }),
        nn = createHelper(
            "initial-start-position-in-milliseconds",
            ({ position: e = 0, startPositionInMilliseconds: n }) => n || Math.round(1e3 * e)
        ),
        an = createFieldFn("end-position-in-milliseconds", (e, n, d) => {
            var h
            switch (null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) {
                case kr.LYRIC_DISPLAY:
                    var p
                    if (void 0 === (null === (p = e.lyricDescriptor) || void 0 === p ? void 0 : p.duration)) return
                    return Math.round(e.lyricDescriptor.duration)
                case kr.PLAY_START:
                    return
                default:
                    if (n && void 0 === n.position) return
                    return e.endPositionInMilliseconds || nn(e, n, d)
            }
        }),
        sn = createHelper("is-private", ({ id: e, reporting: n }) => "-1" === e || !n),
        on = createFieldFn("end-reason-type", (n, d, h) => {
            var p
            if (!d || void 0 !== (null == d ? void 0 : d.position))
                return ((null === (p = Qr(n, d, h)) || void 0 === p ? void 0 : p.type) === wr.TIMED_METADATA_PING &&
                    void 0 !== n.timedMetadata) ||
                    (sn(n, d, h) && n.eventType === kr.PLAY_END)
                    ? e.PlayActivityEndReasonType.NOT_APPLICABLE
                    : n.endReasonType
        }),
        { CONTAINER_CHANGED: cn, NOT_SPECIFIED: ln } = Er,
        un = createFieldFn("event-reason-hint-type", (e, n, d) => {
            var h, p
            if ((null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) !== kr.PLAY_START) return
            const y = e.container
            return void 0 === y
                ? ln
                : !1 === n
                ? d.isAlexa
                    ? ln
                    : cn
                : (null == n || null === (p = n.container) || void 0 === p ? void 0 : p.id) !== y.id
                ? cn
                : ln
        }),
        dn = createFieldFn("feature-name", (e, n, d) => {
            var h, p, y
            if ((null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME)
                return
            return (
                "" +
                (null !== (y = null === (p = e.container) || void 0 === p ? void 0 : p.name) && void 0 !== y
                    ? y
                    : dr.MUSICKIT)
            )
        }),
        hn = createClientFieldFn("guid", "guid"),
        pn = createHelper("should-have-auc-adam-id", Yr),
        yn = createHelper(
            "should-have-radio-adam-id",
            ({ id: e, container: n }) => Dr.test(e) || "radioStation" === (null == n ? void 0 : n.kind)
        ),
        fn = createHelper("is-library-item-or-library-type", ({ id: e, isLibrary: n }, d, h) => n || S(e)),
        mn = createHelper("catalog-id", ({ catalogId: e, container: n }) =>
            null != e ? e : null == n ? void 0 : n.catalogId
        ),
        gn = createHelper("is-library-item-with-catalog-id", (e, n, d) => e.isLibrary && !!mn(e, n, d))
    function _defineProperty$z(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    const vn = [
            returnAsField("auc-adam-id", (e, n, d) => {
                if (!sn(e, n, d) && !yn(e, n, d)) return pn(e, n, d) ? e.id : void 0
            }),
            returnAsField("cloud-id", (e, n, d) => {
                var h
                const { id: p } = e,
                    y = void 0 !== p && "" !== p
                return sn(e, n, d) &&
                    (null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.PLAY_START &&
                    y &&
                    "-1" !== p
                    ? p
                    : yn(e, n, d) || pn(e, n, d)
                    ? e.cloudId
                    : (gn(e, n, d) && y) || fn(e, n, d)
                    ? p
                    : e.cloudId
            }),
            returnAsField("lyric-id", (e, n, d) => {
                var h, p
                if ((null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.LYRIC_DISPLAY)
                    return null === (p = e.lyricDescriptor) || void 0 === p ? void 0 : p.id
            }),
            returnAsField("purchased-adam-id", (e, n, d) => e.purchasedId),
            returnAsField("reporting-adam-id", (e, n, d) => {
                if (!0 !== d.client.allowReportingId) return
                var h
                return (
                    (null !== (h = Fr(e, n, d)) && void 0 !== h ? h : {})["event-type"],
                    fn(e, n, d) ? e.reportingId : void 0
                )
            }),
            returnAsField("radio-adam-id", (e, n, d) => {
                if (sn(e, n, d)) return
                const { container: h, id: p } = e
                return Dr.test(p) || "radioStation" === (null == h ? void 0 : h.kind)
                    ? parseInt(("" + p).replace(Dr, "$1"), 10)
                    : void 0
            }),
            returnAsField("subscription-adam-id", (e, n, d) => {
                if (!(sn(e, n, d) || yn(e, n, d) || pn(e, n, d))) {
                    if (gn(e, n, d)) return mn(e, n, d)
                    if (!fn(e, n, d)) return e.id
                }
            })
        ],
        bn = createFieldFn("ids", (e, n, d) => {
            var h
            if ((null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME)
                return
            const p = vn.reduce(
                (h, p) =>
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$z(e, n, d[n])
                                })
                        }
                        return e
                    })({}, h, p(e, n, d)),
                Object.create(null)
            )
            return isEmpty(p) ? void 0 : p
        }),
        _n = createClientFieldFn("internal-build", "internalBuild"),
        Tn = createFieldFn("lyric-language", (e, n, d) => {
            var h, p
            if ((null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.LYRIC_DISPLAY)
                return null === (p = e.lyricDescriptor) || void 0 === p ? void 0 : p.language
        }),
        Sn = createHelper("has-episode-streaming-kind", ({ streamingKind: e }, n, d) => e === Rr.EPISODE),
        Pn = createHelper("is-stream", (e, n, d) => {
            var h
            return (null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.STREAM
        }),
        En = createHelper("is-live-stream", (e, n, d) => Pn(e, n, d) && !Sn(e, n, d)),
        kn = createFieldFn("media-duration-in-milliseconds", (e, n, d) => {
            var h
            const p = null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]
            if (p === kr.LYRIC_DISPLAY) return 0
            if (En(e, n, d)) return 0
            const y = Math.round(1e3 * e.duration)
            if (p === kr.PLAY_START) return y
            var m, g
            const b =
                null !== (g = e.startPositionInMilliseconds) && void 0 !== g
                    ? g
                    : Math.round(1e3 * (null !== (m = e.position) && void 0 !== m ? m : 0))
            return b > 1e3 * e.duration ? b : y
        }),
        { AUDIO: wn, VIDEO: In } = Ir,
        On = createFieldFn("media-type", (e, n, d) => {
            var h
            if ((null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.LYRIC_DISPLAY) return wn
            const { kind: p, mediaType: y } = e
            if ("number" == typeof y) return y
            const m = "string" == typeof y ? y : p
            return m && /video/i.test(m) ? In : wn
        }),
        An = createClientFieldFn("metrics-client-id", "metricsClientId"),
        Rn = createFieldFn("offline", () => !1),
        Cn = createFieldFn("persistent-id", () => generateUUID()),
        Mn = createFieldFn("play-mode", (e, n, d) => {
            var h, p, y, m, g
            if (
                (null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) === kr.LYRIC_DISPLAY ||
                (null === (p = Qr(e, n, d)) || void 0 === p ? void 0 : p.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME
            )
                return {
                    "auto-play-mode": null !== (y = Mn.autoplayMode) && void 0 !== y ? y : 0,
                    "repeat-play-mode": null !== (m = Mn.repeatPlayMode) && void 0 !== m ? m : 0,
                    "shuffle-play-mode": null !== (g = Mn.shufflePlayMode) && void 0 !== g ? g : 0
                }
            const b = invoke(e.playMode)
            var _, T, S
            return void 0 !== b
                ? {
                      "auto-play-mode": null !== (_ = b.autoplayMode) && void 0 !== _ ? _ : 0,
                      "repeat-play-mode": null !== (T = b.repeatPlayMode) && void 0 !== T ? T : 0,
                      "shuffle-play-mode": null !== (S = b.shufflePlayMode) && void 0 !== S ? S : 0
                  }
                : void 0
        }),
        Dn = createClientFieldFn("private-enabled", "privateEnabled"),
        xn = createFieldFn("reco-data", (e, n, d) => {
            var h, p
            if (
                (null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]) !== kr.LYRIC_DISPLAY &&
                (null === (p = Qr(e, n, d)) || void 0 === p ? void 0 : p.type) !== wr.AGGREGATE_NON_CATALOG_PLAY_TIME
            )
                return e.recoData
        }),
        Ln = createClientFieldFn("sb-enabled", "userIsSubscribed"),
        Nn = createClientFieldFn("siri-initiated", "siriInitiated"),
        jn = createClientFieldFn("source-type", "sourceType"),
        Un = createFieldFn("start-position-in-milliseconds", (e, n, d) => {
            var h, p
            const y = null === (h = Fr(e, n, d)) || void 0 === h ? void 0 : h["event-type"]
            return y === kr.LYRIC_DISPLAY ||
                (null === (p = Qr(e, n, d)) || void 0 === p ? void 0 : p.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME ||
                En(e, n, d)
                ? 0
                : y === kr.PLAY_START
                ? nn(e, n, d)
                : null !==
                      (g = null !== (m = e.startPositionInMilliseconds) && void 0 !== m ? m : previousPosition(n)) &&
                  void 0 !== g
                ? g
                : 0
            var m, g
        }),
        previousPosition = (e) => (e && void 0 !== e.position ? Math.round(1e3 * e.position) : 0),
        $n = createClientFieldFn("store-front", "storefrontId"),
        Gn = createFieldFn("timed-metadata", (e, n, d) => {
            const h = e.timedMetadata
            if (void 0 !== h && shouldSendTimedMetadata(e, n, d))
                return ((e, n = 8) => {
                    if (!(e instanceof Uint8Array)) return ""
                    const d = Array.prototype.map.call(e, formatByte).join("")
                    return 0 === n ? d : d.replace(new RegExp(`(.{1,${n}})`, "g"), "$1 ").trim()
                })(h, 0)
        }),
        shouldSendTimedMetadata = (e, n, d) => {
            var h, p
            return (
                (null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.TIMED_METADATA_PING ||
                (null === (p = Fr(e, n, d)) || void 0 === p ? void 0 : p["event-type"]) !== kr.LYRIC_DISPLAY
            )
        },
        Bn = createFieldFn("timestamp", ({ timestamp: e }, n, d) => (null != e ? e : Date.now())),
        Fn = createClientFieldFn("user-agent", "userAgent"),
        Kn = createFieldFn("user-preference-audio-quality", (e, n, d) => {
            var h
            if (Kr(e, n, d)) return null === (h = e.userPreference) || void 0 === h ? void 0 : h.audioQuality
        }),
        Vn = createFieldFn("user-preference-playback-format", (e, n, d) => {
            var h
            if (Kr(e, n, d)) return null === (h = e.userPreference) || void 0 === h ? void 0 : h.playbackFormat
        }),
        Hn = createFieldFn("user-token", (e, n, { client: d }) => {
            if (!d.preferDSID) return d.musicUserToken
        }),
        qn = createFieldFn("utc-offset-in-seconds", (e, n, d) => {
            var h
            return (null === (h = Qr(e, n, d)) || void 0 === h ? void 0 : h.type) === wr.AGGREGATE_NON_CATALOG_PLAY_TIME
                ? 0
                : d.client.utcOffsetInSeconds
        }),
        Wn = {
            "audio-quality-provided": Vr,
            "audio-quality-targeted": Hr,
            "build-version": qr,
            "container-ids": Zr,
            "container-type": Jr,
            "developer-token": en,
            "device-name": tn,
            "display-type": rn,
            "end-position-in-milliseconds": an,
            "end-reason-type": on,
            "event-reason-hint-type": un,
            "event-type": Fr,
            "feature-name": dn,
            guid: hn,
            ids: bn,
            "internal-build": _n,
            "lyric-language": Tn,
            "media-duration-in-milliseconds": kn,
            "media-type": On,
            "metrics-client-id": An,
            offline: Rn,
            "persistent-id": Cn,
            "play-mode": Mn,
            "private-enabled": Dn,
            "reco-data": xn,
            "sb-enabled": Ln,
            "siri-initiated": Nn,
            "source-type": jn,
            "start-position-in-milliseconds": Un,
            "store-front": $n,
            "timed-metadata": Gn,
            timestamp: Bn,
            type: Qr,
            "user-agent": Fn,
            "user-preference-audio-quality": Kn,
            "user-preference-playback-format": Vn,
            "user-token": Hn,
            "utc-offset-in-seconds": qn
        }
    function _defineProperty$y(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$y(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$y(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$m(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    let Yn = 0
    function _defineProperty$x(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$l(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const buildPlayActivityData$1 = (e, n, d, h = !1) => {
        const p = ((e, ...n) =>
            _objectSpreadProps$m(_objectSpread$y({}, e, Object.assign({}, ...n)), {
                cache: {
                    fields: Object.assign(
                        {},
                        ...n.map((e) => {
                            var n
                            return null == e || null === (n = e.cache) || void 0 === n ? void 0 : n.fields
                        })
                    ),
                    helpers: Object.assign(
                        {},
                        ...n.map((e) => {
                            var n
                            return null == e || null === (n = e.cache) || void 0 === n ? void 0 : n.helpers
                        })
                    )
                }
            }))(
            "boolean" == typeof h
                ? ((e = {}, n) => _objectSpread$y({ id: (Yn++).toFixed(0), client: n, isAlexa: !1 }, e))(
                      { isAlexa: h },
                      e
                  )
                : _objectSpreadProps$l(
                      (function (e) {
                          for (var n = 1; n < arguments.length; n++) {
                              var d = null != arguments[n] ? arguments[n] : {},
                                  h = Object.keys(d)
                              "function" == typeof Object.getOwnPropertySymbols &&
                                  (h = h.concat(
                                      Object.getOwnPropertySymbols(d).filter(function (e) {
                                          return Object.getOwnPropertyDescriptor(d, e).enumerable
                                      })
                                  )),
                                  h.forEach(function (n) {
                                      _defineProperty$x(e, n, d[n])
                                  })
                          }
                          return e
                      })({}, h),
                      { client: e }
                  )
        )
        return (
            (n = normalizePlayActivityDescriptor(n)),
            d && (d = normalizePlayActivityDescriptor(d)),
            Object.assign(Object.create(null), ...Object.values(Wn).map((e) => (null == e ? void 0 : e(n, d, p))))
        )
    }
    function _defineProperty$w(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$w(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$w(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$k(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function _defineProperty$v(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$v(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$v(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$j(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function asyncGeneratorStep$Z(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$Z(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$Z(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$Z(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$u(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$i(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    class LyricsPlayActivity extends PlayActivityBase {
        get state() {
            return this._machine.state.value
        }
        play(e) {
            var n = this
            return _asyncToGenerator$Z(function* () {
                var d
                if ("playing" === n.state)
                    throw Error("lyrics are already being displayed. Did you forget to stop them?")
                if (void 0 === e) throw Error("Missing descriptor for lyrics play")
                Ct.info(
                    `Staring tracking: lyricsId=${
                        null === (d = e.lyricDescriptor) || void 0 === d ? void 0 : d.id
                    }, itemId=${e.id}, catalogId=${e.catalogId}`
                ),
                    (n.startDescriptor = e),
                    n._machine.send({ type: "play" })
            })()
        }
        stop() {
            var e = this
            return _asyncToGenerator$Z(function* () {
                var n
                if ("playing" !== e.state)
                    throw Error("lyrics are not being displayed. Did you forget to display them?")
                if (void 0 === e.startDescriptor) throw Error("Missing start descriptor for lyrics stop")
                Ct.info(
                    `Stopping tracking: lyricsId=${
                        null === (n = e.startDescriptor.lyricDescriptor) || void 0 === n ? void 0 : n.id
                    }, itemId=${e.startDescriptor.id}, catalogId=${e.startDescriptor.catalogId}`
                ),
                    e._machine.send({ type: "stop" })
                const d = e._machine.state.context.duration,
                    h = JSON.parse(JSON.stringify(e.startDescriptor))
                ;(h.lyricDescriptor = _objectSpreadProps$i(
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$u(e, n, d[n])
                                })
                        }
                        return e
                    })({}, h.lyricDescriptor),
                    { duration: Math.round(d) }
                )),
                    Ct.debug("Clearing tracked descriptor"),
                    (e.startDescriptor = void 0)
                const p = e.build(h, !1)
                try {
                    Ct.debug("Sending PAF request with data payload"),
                        yield e.send(p),
                        Ct.debug("Done sending PAF request")
                } catch (Y) {
                    console.error("Error sending Lyrics PAF request: " + Y.message),
                        Ct.error("Error sending Lyrics PAF request: " + Y.message)
                }
            })()
        }
        exit() {
            return _asyncToGenerator$Z(function* () {})()
        }
        build(e, n) {
            return ((e, n, d) => {
                if (void 0 === n) throw new Error("called without a play activity descriptor")
                const h = _objectSpreadProps$k(_objectSpread$w({}, n), { eventType: kr.LYRIC_DISPLAY })
                return ((e, ...n) => n.reduce((e, n) => n(e), e))(
                    _objectSpreadProps$k(_objectSpread$w({}, buildPlayActivityData$1(e, h, d, !1)), {
                        "media-duration-in-milliseconds": 0,
                        "media-type": Ir.AUDIO,
                        "start-position-in-milliseconds": 0,
                        "play-mode": { "auto-play-mode": 0, "repeat-play-mode": 0, "shuffle-play-mode": 0 }
                    }),
                    (e) => exceptFields(e, "character-display-count", "event-reason-hint-type", "reco-data")
                )
            })(this, e, n)
        }
        constructor(e, n, d, h) {
            super(e, n, d, h),
                (this._machine = v(
                    s({
                        id: "lpaf",
                        initial: "idle",
                        context: { initialShowTime: -1, duration: -1 },
                        states: {
                            idle: {
                                entry: o((e) =>
                                    _objectSpreadProps$j(_objectSpread$v({}, e), {
                                        initialShowTime: void 0,
                                        duration: $r() - e.initialShowTime
                                    })
                                ),
                                on: { play: "playing" }
                            },
                            playing: {
                                entry: o((e) =>
                                    _objectSpreadProps$j(_objectSpread$v({}, e), { initialShowTime: $r() })
                                ),
                                on: { stop: "idle" }
                            }
                        }
                    })
                ).start())
        }
    }
    var zn
    !(function (e) {
        e[(e.ALEXA = 13)] = "ALEXA"
    })(zn || (zn = {}))
    const createCookieJar = (e) => {
            switch ((void 0 === e && (e = "browser"), e)) {
                case "browser":
                    return { get: getCookie, set: setCookie }
                case "memory":
                    return ((e = {}) => ({
                        get(n) {
                            if (void 0 !== n) return e[n]
                        },
                        set(n, d) {
                            e[n] = d
                        }
                    }))()
                default:
                    return e
            }
        },
        empty = (e, n) => write(e, n, [], "/", 0),
        read = (e, n) => {
            const d = e.get(n)
            if (void 0 === d || "" === d) return []
            return ensureArray(JSON.parse(atob(d)))
        },
        write = (e, n, d, h, p, y) => e.set(n, btoa(JSON.stringify(d)), h, p, y)
    function asyncGeneratorStep$Y(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$Y(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$Y(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$Y(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const { AUTO: Qn } = Or
    class PlayActivityBatchableSender {
        flush() {
            var e = this
            return _asyncToGenerator$Y(function* () {
                const n = read(e.jar, "amupaee")
                if (void 0 !== n && 0 !== n.length)
                    try {
                        yield e.sender.send(n), empty(e.jar, "amupaee")
                    } catch ({ message: d }) {
                        throw new Error("flush: " + d)
                    }
            })()
        }
        send(n) {
            var d = this
            return _asyncToGenerator$Y(function* () {
                if (
                    d.mode === Qn &&
                    (Array.isArray(n) || n["end-reason-type"] !== e.PlayActivityEndReasonType.EXITED_APPLICATION)
                )
                    return d.sender.send(n)
                var h, p, y, m, g, b
                ;(h = d.jar), (y = n), (m = "/"), write(h, (p = "amupaee"), [...read(h, p), y], m, g, b)
            })()
        }
        constructor(e, n) {
            ;(this.sender = e), (this.jar = n), (this.mode = Qn)
        }
    }
    function asyncGeneratorStep$X(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$X(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$X(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$X(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class Timeline {
        get events() {
            return this._events
        }
        get first() {
            return this.at(0)
        }
        get keys() {
            return this._keys
        }
        get last() {
            return this.at(this.length - 1)
        }
        get length() {
            return this._keys.length
        }
        get second() {
            return this.at(1)
        }
        at(e) {
            if (e > this.length - 1) throw new Error("Invalid timeline index")
            const n = this._keys[e]
            return this._events[n]
        }
        before(e) {
            if ("number" != typeof e) {
                const n = []
                for (const e in this._events) hasOwn(this._events, e) && n.push(this._events[e])
                e = this._keys[n.indexOf(e)]
            }
            const n = this._keys.indexOf(e)
            if (-1 === n) throw new Error("Key not found")
            if (n > 0) return this._events[this._keys[n - 1]]
        }
        drain() {
            const e = this._keys.map((e) => this._events[e])
            return this.reset(), e
        }
        reset() {
            ;(this._events = {}), (this._keys = [])
        }
        pop() {
            var e = this
            return _asyncToGenerator$X(function* () {
                const n = e._keys.pop()
                if (void 0 === n) return Promise.reject("TIMELINE IS EMPTY")
                const d = e._events[n]
                return delete e._events[n], Promise.resolve(d)
            })()
        }
        add(e, n) {
            var d = this
            return _asyncToGenerator$X(function* () {
                return d.push(e, n)
            })()
        }
        push(e, n = Date.now()) {
            var d = this
            return _asyncToGenerator$X(function* () {
                for (; -1 !== d._keys.indexOf(n); ) n++
                return (d._events[n] = e), d._keys.push(n), Promise.resolve(n)
            })()
        }
        shift() {
            var e = this
            return _asyncToGenerator$X(function* () {
                const n = e._keys.shift()
                if (void 0 === n) return Promise.reject("TIMELINE IS EMPTY")
                const d = e._events[n]
                return delete e._events[n], Promise.resolve(d)
            })()
        }
        unshift(e, n = Date.now()) {
            var d = this
            return _asyncToGenerator$X(function* () {
                for (; -1 !== d._keys.indexOf(n); ) n++
                return (d._events[n] = e), d._keys.unshift(n), Promise.resolve(n)
            })()
        }
        constructor() {
            ;(this._events = {}), (this._keys = [])
        }
    }
    function asyncGeneratorStep$W(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    class TimedMetadataTracker {
        get currentValue() {
            return this._currentValue
        }
        clear() {
            this._currentValue = void 0
        }
        ping(e, n) {
            var d,
                h = this
            return ((d = function* () {
                h.timedMetadataChanged(e) &&
                    (void 0 !== h._currentValue && (yield h.client.pingTimedMetadata(n, h._currentValue)),
                    (h._currentValue = void 0 === e ? void 0 : e.slice(0)))
            }),
            function () {
                var e = this,
                    n = arguments
                return new Promise(function (h, p) {
                    var y = d.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$W(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$W(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        timedMetadataChanged(e) {
            const { _currentValue: n } = this
            return void 0 === n ? void 0 !== e : void 0 === e || e.length !== n.length || n.some((n, d) => n !== e[d])
        }
        constructor(e, n) {
            ;(this.client = e), (this._currentValue = n)
        }
    }
    const transitionEvent = (e) => ({ type: e })
    function deriveTransitionEvent(n) {
        if (n.itemType === wr.TIMED_METADATA_PING) return !1
        if (
            (function (e) {
                return e.eventType === kr.PLAY_START
            })(n)
        )
            return transitionEvent("play")
        if (
            (function (e) {
                if (e.eventType !== kr.PLAY_END) return !1
                if (void 0 === e.endReasonType)
                    throw new Error("PLAY_END activity descriptor requires an endReasonType value")
                return !0
            })(n)
        ) {
            const d = n.endReasonType
            if (d === e.PlayActivityEndReasonType.SCRUB_BEGIN) return transitionEvent("scrubBegin")
            if (d === e.PlayActivityEndReasonType.SCRUB_END) return transitionEvent("scrubEnd")
            if (d === e.PlayActivityEndReasonType.EXITED_APPLICATION) return !1
        }
        return transitionEvent("stop")
    }
    function _defineProperty$t(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$t(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$t(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$h(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function _objectWithoutProperties$2(e, n) {
        if (null == e) return {}
        var d,
            h,
            p = (function (e, n) {
                if (null == e) return {}
                var d,
                    h,
                    p = {},
                    y = Object.keys(e)
                for (h = 0; h < y.length; h++) (d = y[h]), n.indexOf(d) >= 0 || (p[d] = e[d])
                return p
            })(e, n)
        if (Object.getOwnPropertySymbols) {
            var y = Object.getOwnPropertySymbols(e)
            for (h = 0; h < y.length; h++)
                (d = y[h]), n.indexOf(d) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, d) && (p[d] = e[d]))
        }
        return p
    }
    class MPAFStateMachine {
        get currentState() {
            return this.machineService.state
        }
        get currentStateName() {
            return this.currentState.value
        }
        matches(e) {
            return this.machineService.state.matches(e)
        }
        transition(e, n) {
            const d = deriveTransitionEvent(e)
            if (!1 === d) return this.currentStateName
            if ((this.machineService.send(d), this.matches("error")))
                throw new Error(this.machineService.state.context.errorMessage)
            return this.currentStateName
        }
        constructor() {
            ;(this.machine = s(
                {
                    id: "mpaf",
                    initial: "idle",
                    context: {},
                    states: {
                        error: {},
                        idle: {
                            on: {
                                play: "playing",
                                stop: "idle",
                                scrubBegin: {
                                    target: "scrubbing",
                                    actions: o((e) =>
                                        _objectSpreadProps$h(_objectSpread$t({}, e), { stateBeforeScrub: "idle" })
                                    )
                                },
                                scrubEnd: { target: "error", actions: ["clearStateBeforeScrub", "setScrubEndError"] }
                            }
                        },
                        playing: {
                            on: {
                                scrubBegin: {
                                    target: "scrubbing",
                                    actions: o((e) =>
                                        _objectSpreadProps$h(_objectSpread$t({}, e), { stateBeforeScrub: "playing" })
                                    )
                                },
                                stop: "idle",
                                scrubEnd: { target: "error", actions: ["clearStateBeforeScrub", "setScrubEndError"] }
                            }
                        },
                        scrubbing: {
                            on: {
                                scrubEnd: [
                                    {
                                        target: "idle",
                                        cond: ({ stateBeforeScrub: e }) => "idle" === e,
                                        actions: ["clearStateBeforeScrub"]
                                    },
                                    { target: "playing", actions: ["clearStateBeforeScrub"] }
                                ]
                            }
                        }
                    }
                },
                {
                    actions: {
                        clearStateBeforeScrub: o((e) => _objectWithoutProperties$2(e, ["stateBeforeScrub"])),
                        setScrubEndError: o((e) =>
                            _objectSpreadProps$h(_objectSpread$t({}, e), {
                                errorMessage:
                                    "The scrub() method was called with the SCRUB_END action without a previous SCRUB_START descriptor"
                            })
                        )
                    }
                }
            )),
                (this.machineService = v(this.machine).start())
        }
    }
    function asyncGeneratorStep$V(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$V(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$V(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$V(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$s(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$s(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$s(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$g(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    class StatelessPlayActivity extends PlayActivityBase {
        build(e, n) {
            return buildPlayActivityData$1(this, e, n, "JSCLIENT" !== this.clientId)
        }
        constructor(e, n, d, h) {
            super(e, n, d, h)
        }
    }
    class PlayActivity {
        get mode() {
            return this.sender.mode
        }
        set mode(e) {
            this.sender.mode = e
        }
        get privateEnabled() {
            return this._paf.privateEnabled
        }
        set privateEnabled(e) {
            this._paf.privateEnabled = e
        }
        get timedMetadata() {
            return this._timedMetadataTracker.currentValue
        }
        clearTimedMetadata() {
            return this._timedMetadataTracker.clear()
        }
        setTimedMetadata(e, n) {
            var d = this
            return _asyncToGenerator$V(function* () {
                yield d._timedMetadataTracker.ping(e, n)
            })()
        }
        activate(n = !1) {
            var d = this
            return _asyncToGenerator$V(function* () {
                if (n)
                    try {
                        yield d.flush()
                    } catch (p) {
                        if (
                            !((e) =>
                                ((e) => {
                                    switch (typeof e) {
                                        case "string":
                                            return e
                                        case "object":
                                            return e.message ? ("string" != typeof e.message ? "" : e.message) : ""
                                        default:
                                            return ""
                                    }
                                })(e).includes("send() called without any data"))(p)
                        )
                            throw p
                    }
                const h = d.timeline.last
                if (h && h.endReasonType === e.PlayActivityEndReasonType.EXITED_APPLICATION) return d.timeline.pop()
            })()
        }
        exit(n = 0) {
            var d = this
            return _asyncToGenerator$V(function* () {
                yield d.stop(n, e.PlayActivityEndReasonType.EXITED_APPLICATION)
            })()
        }
        pause(n = 0) {
            var d = this
            return _asyncToGenerator$V(function* () {
                yield d.stop(n, e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED)
            })()
        }
        pingTimedMetadata(n, d, h = this.previousDescriptor) {
            var p = this
            return _asyncToGenerator$V(function* () {
                yield p._addToTimeline(
                    _objectSpreadProps$g(_objectSpread$s({}, h), {
                        position: n,
                        endReasonType: e.PlayActivityEndReasonType.NOT_APPLICABLE,
                        eventType: kr.PLAY_END,
                        itemType: wr.TIMED_METADATA_PING,
                        timedMetadata: d
                    })
                )
            })()
        }
        play(e, n = 0) {
            var d = this
            return _asyncToGenerator$V(function* () {
                const h = d.timeline.length > 0
                if (void 0 === e) {
                    if (!h) return
                    const e = d.previousDescriptor
                    return (
                        e.eventType === kr.PLAY_END && delete e.endReasonType,
                        void (yield d._addToTimeline(
                            _objectSpreadProps$g(_objectSpread$s({}, d.sanitizePreviousDescriptor(e)), {
                                eventType: kr.PLAY_START
                            })
                        ))
                    )
                }
                if (h) {
                    const e = d.previousDescriptor
                    if (
                        d._machine.matches("playing") &&
                        !(({ id: e, reporting: n = !0, eventType: d }) => ("-1" === e || !n) && d === kr.PLAY_END)(e)
                    )
                        return Promise.reject(
                            new Error("The play() method was called without a previous stop() or pause() call.")
                        )
                }
                yield d._addToTimeline(
                    _objectSpreadProps$g(_objectSpread$s({}, e), { eventType: kr.PLAY_START, position: n })
                )
            })()
        }
        scrub(n = 0, d = e.PlayActivityEndReasonType.SCRUB_BEGIN) {
            var h = this
            return _asyncToGenerator$V(function* () {
                yield h._addToTimeline(
                    _objectSpreadProps$g(_objectSpread$s({}, h.sanitizePreviousDescriptor(h.previousDescriptor)), {
                        eventType: kr.PLAY_END,
                        endReasonType: d,
                        position: n
                    })
                )
            })()
        }
        skip(n, d = e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS, h = 0) {
            var p = this
            return _asyncToGenerator$V(function* () {
                yield p.stop(h, d), yield p.play(n)
            })()
        }
        stop(n = 0, d = e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK) {
            var h = this
            return _asyncToGenerator$V(function* () {
                let p = h.previousDescriptor
                if (
                    (p.endReasonType === e.PlayActivityEndReasonType.EXITED_APPLICATION &&
                        (yield h.timeline.pop(), empty(h._cookieJar, "amupaee"), (p = h.previousDescriptor)),
                    h._machine.matches("playing"))
                ) {
                    const e = _objectSpreadProps$g(_objectSpread$s({}, h.sanitizePreviousDescriptor(p)), {
                        eventType: kr.PLAY_END,
                        endReasonType: d,
                        position: n,
                        timedMetadata: h._timedMetadataTracker.currentValue
                    })
                    yield h._addToTimeline(e)
                }
            })()
        }
        build(e, n) {
            if (
                (void 0 === e &&
                    void 0 === n &&
                    Ct.warn(
                        "You are calling build() from a stateful PAF client. Please, use a stateless client or exit(), pause(), play(), scrub(), skip() or stop() instead."
                    ),
                void 0 === e)
            ) {
                if (0 === this.timeline.length) throw new Error("build() called without a play activity descriptor")
                e = this.timeline.last
            }
            if (void 0 === n) {
                if (void 0 === (n = this.timeline.before(e)) && e.eventType === kr.PLAY_END)
                    throw new Error("Cannot build() for PLAY_END descriptors without previous descriptors")
                n = null != n && n
            }
            return this._paf.build(
                _objectSpreadProps$g(_objectSpread$s({}, e), { timedMetadata: this.timedMetadata }),
                n
            )
        }
        addForPlayParams(e, n, d, h = 0, p = {}) {
            var y = this
            return _asyncToGenerator$V(function* () {
                yield y._addToTimeline(y.buildDescriptorForPlayParams(e, n, d, h, p))
            })()
        }
        buildDescriptorForPlayParams(e, n, d, h = 0, p = {}) {
            const y = "stream" === e.format ? wr.STREAM : wr.ITUNES_STORE_CONTENT
            return normalizePlayActivityDescriptor(
                _objectSpread$s(
                    _objectSpreadProps$g(_objectSpread$s({}, e), {
                        container: d,
                        duration: h,
                        eventType: n,
                        itemType: y
                    }),
                    p
                )
            )
        }
        flush() {
            return this.sender.flush()
        }
        _addToTimeline(e) {
            var n = this
            return _asyncToGenerator$V(function* () {
                e = _objectSpreadProps$g(_objectSpread$s({}, e), { timestamp: Date.now() })
                const d = n.timeline.length > 0 && n.timeline.last
                yield n.timeline.add(e)
                const h = n.build(e, d)
                yield n.send(h, e)
            })()
        }
        get previousDescriptor() {
            const e = this.timeline.last
            if (void 0 === e) throw new Error("A method was called without a previous descriptor")
            return exceptFields(e, "timestamp")
        }
        buildForPlayParams(e, n, d, h = 0, p = {}, y = !1) {
            return (
                Ct.warn(
                    "You are using buildsForPlayParams from a stateful PlayActivity. Please, use StatelessPlayActivity instead"
                ),
                this._paf.buildForPlayParams(e, n, d, h, p, y)
            )
        }
        send(e, n) {
            e = ensureArray(e)
            const d = normalizePlayActivityDescriptor(n)
            return e.forEach((e) => this._machine.transition(d, e)), this.sender.send(e)
        }
        sanitizePreviousDescriptor(e) {
            let n = deepClone(e)
            return n.itemType === wr.TIMED_METADATA_PING && (n = exceptFields(n, "itemType")), n
        }
        constructor(e, n, d, h) {
            ;(this.timeline = new Timeline()),
                (this._paf = new StatelessPlayActivity(e, n, d, h)),
                (this._cookieJar = createCookieJar(null == h ? void 0 : h.cookieJar)),
                (this.sender = new PlayActivityBatchableSender(this._paf.sender, this._cookieJar)),
                (this._machine = new MPAFStateMachine()),
                (this._timedMetadataTracker = new TimedMetadataTracker(this))
        }
    }
    const Bind = () => (e, n, d) => {
            if (void 0 === d || "function" != typeof d.value)
                throw new TypeError(`Only methods can be decorated with @Bind, but ${n} is not a method.`)
            return {
                configurable: !0,
                get() {
                    const e = d.value.bind(this)
                    return Object.defineProperty(this, n, { value: e, configurable: !0, writable: !0 }), e
                }
            }
        },
        Jn = ["exitFullscreen", "webkitExitFullscreen", "mozCancelFullScreen", "msExitFullscreen"],
        Xn = ["fullscreenElement", "webkitFullscreenElement", "mozFullScreenElement", "msFullscreenElement"],
        Zn = ["requestFullscreen", "webkitRequestFullscreen", "mozRequestFullScreen", "msRequestFullscreen"],
        noop = () => Promise.resolve(),
        ei = ((e) => {
            if (void 0 === e) return noop
            const n = Jn.find((n) => "function" == typeof e.prototype[n])
            return "string" != typeof n
                ? noop
                : (e = self.document) => {
                      var d
                      return null == e || null === (d = e[n]) || void 0 === d ? void 0 : d.call(e)
                  }
        })(HTMLDocument),
        ti = ((e) => {
            if (void 0 === e) return () => !1
            const n = Xn.find((n) => n in e.prototype)
            return "string" != typeof n ? () => !1 : (e = self.document) => !!e[n]
        })(HTMLDocument),
        ri = ((e) => {
            if (void 0 === e) return noop
            const n = Zn.find((n) => "function" == typeof e.prototype[n])
            return "string" != typeof n ? noop : (e) => (null == e ? void 0 : e[n]())
        })(HTMLElement)
    function asyncGeneratorStep$U(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$U(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$U(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$U(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class Fullscreen {
        exit() {
            var e = this
            return _asyncToGenerator$U(function* () {
                if (e.isInFullscreen()) return e.stopDispatchingEvents(() => e.exitFullscreen())
            })()
        }
        request(e) {
            var n = this
            return _asyncToGenerator$U(function* () {
                if (void 0 !== e) return n.stopDispatchingEvents(() => n.requestFullscreenForElement(e))
            })()
        }
        stopDispatchingEvents(e) {
            var n = this
            return _asyncToGenerator$U(function* () {
                return n.player.windowHandlers.stopListeningToVisibilityChanges(e)
            })()
        }
        exitFullscreen() {
            return ei()
        }
        isInFullscreen() {
            return ti()
        }
        requestFullscreenForElement(e) {
            return ri(e)
        }
        constructor(e) {
            this.player = e
        }
    }
    function asyncGeneratorStep$T(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    class UnsupportedSeeker {
        start() {
            Rt.warn("seeker.start is not supported in this playback method")
        }
        end() {
            Rt.warn("seeker.end is not supported in this playback method")
        }
        seekToTime(e) {
            return Rt.warn("seekToTime is not supported in this playback method"), Promise.resolve()
        }
        constructor() {
            this.ended = !1
        }
    }
    class PlayerSeeker {
        get ended() {
            return this._ended
        }
        get isEngagedInPlayback() {
            return this._player.isEngagedInPlayback
        }
        get stillPlayingSameItem() {
            return this._currentItem === this._player.nowPlayingItem
        }
        end() {
            Rt.debug("seeker: end"),
                -1 !== this._startTime
                    ? this._ended
                        ? Rt.warn("seeker: Cannot end the same seeker twice.")
                        : (this.dispatchStartEvent(), this.dispatchEndEvent())
                    : Rt.warn("seeker: Cannot end a seeker before starting it.")
        }
        seekToTime(e) {
            var n,
                d = this
            return ((n = function* () {
                if ((Rt.debug("seeker: seekToTime", e), !d.ended))
                    return (
                        d.stillPlayingSameItem || ((d._currentItem = d._player.nowPlayingItem), (d._startTime = 0)),
                        (d._lastSeekedTime = e),
                        d._player.seekToTime(e)
                    )
                Rt.warn("seeker: Cannot seek once the seeker has ended")
            }),
            function () {
                var e = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = n.apply(e, d)
                    function _next(e) {
                        asyncGeneratorStep$T(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$T(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        start() {
            Rt.debug("seeker: start"),
                -1 === this._startTime
                    ? ((this._currentItem = this._player.nowPlayingItem),
                      (this._startTime = this._player.currentPlaybackTime),
                      (this._lastSeekedTime = this._startTime))
                    : Rt.warn("seeker: Cannot start same seeker twice")
        }
        dispatch(e, n) {
            this.isEngagedInPlayback
                ? (Rt.debug("seeker: dispatch", e), this._player.dispatch(e, n))
                : Rt.debug("seeker: do not dispatch because isEngagedInPlayback", this.isEngagedInPlayback)
        }
        dispatchStartEvent() {
            this.stillPlayingSameItem || ((this._startTime = 0), (this._lastSeekedTime = 0)),
                this.dispatch(cr.playbackScrub, { item: this._currentItem, position: this._startTime })
        }
        dispatchEndEvent() {
            ;(this._ended = !0),
                this.dispatch(cr.playbackScrub, {
                    item: this._currentItem,
                    position: this._lastSeekedTime,
                    endReasonType: e.PlayActivityEndReasonType.SCRUB_END
                })
        }
        constructor(e) {
            ;(this._ended = !1),
                (this._lastSeekedTime = -1),
                (this._startTime = -1),
                Rt.debug("seeker: new"),
                (this._player = e)
        }
    }
    function asyncGeneratorStep$S(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    var ni =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ii =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const {
        visibilityChangeEvent: ai,
        visibilityState: si,
        unloadEventName: oi
    } = (() => {
        let e = "visibilitychange",
            n = "visibilityState"
        void 0 !== document.mozHidden
            ? ((e = "mozvisibilitychange"), (n = "mozVisibilityState"))
            : void 0 !== document.msHidden
            ? ((e = "msvisibilitychange"), (n = "msVisibilityState"))
            : document.webkitHidden && ((e = "webkitvisibilitychange"), (n = "webkitVisibilityState"))
        return {
            visibilityChangeEvent: e,
            visibilityState: n,
            unloadEventName: "onpagehide" in window ? "pagehide" : "unload"
        }
    })()
    class WindowHandlers {
        activate(e = self, n = self.document) {
            n.addEventListener(ai, this.visibilityChanged),
                e.addEventListener("storage", this.storage, !1),
                e.addEventListener(oi, this.windowUnloaded)
        }
        deactivate() {
            document.removeEventListener(ai, this.visibilityChanged),
                window.removeEventListener("storage", this.storage),
                window.addEventListener(oi, this.windowUnloaded)
        }
        stopListeningToVisibilityChanges(e) {
            var n,
                d = this
            return ((n = function* () {
                d.dispatchVisibilityChanges = !1
                const n = yield e()
                return (d.dispatchVisibilityChanges = !0), n
            }),
            function () {
                var e = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = n.apply(e, d)
                    function _next(e) {
                        asyncGeneratorStep$S(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$S(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        dispatch(e, n = {}) {
            this.player.dispatch(e, n)
        }
        storage({ key: e, newValue: n }) {
            e === Kt && this.player.tsidChanged(n)
        }
        visibilityChanged(e) {
            const n = e.target[si]
            Rt.info("dc visibilityState", n, e, ti()),
                this.browser.isiOS &&
                    this.dispatchVisibilityChanges &&
                    ("hidden" === n
                        ? this.dispatch(cr.playerExit, {
                              item: this.player.nowPlayingItem,
                              position: this.player.currentPlaybackTime
                          })
                        : "visible" === n && this.dispatch(cr.playerActivate))
        }
        windowUnloaded() {
            this.player.isPlaying &&
                this.dispatch(cr.playerExit, {
                    item: this.player.nowPlayingItem,
                    position: this.player.currentPlaybackTime
                })
        }
        constructor(e, n = Gt) {
            ;(this.dispatchVisibilityChanges = !0), (this.player = e), (this.browser = n)
        }
    }
    function asyncGeneratorStep$R(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$R(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$R(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$R(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$r(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$r(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$r(e, n, d[n])
                })
        }
        return e
    }
    ni(
        [Bind(), ii("design:type", Function), ii("design:paramtypes", [void 0])],
        WindowHandlers.prototype,
        "storage",
        null
    ),
        ni(
            [
                Bind(),
                ii("design:type", Function),
                ii("design:paramtypes", ["undefined" == typeof Event ? Object : Event])
            ],
            WindowHandlers.prototype,
            "visibilityChanged",
            null
        ),
        ni(
            [Bind(), ii("design:type", Function), ii("design:paramtypes", [])],
            WindowHandlers.prototype,
            "windowUnloaded",
            null
        )
    var ci =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        li =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const {
            bufferedProgressDidChange: ui,
            mediaCanPlay: di,
            mediaElementCreated: hi,
            mediaPlaybackError: pi,
            nowPlayingItemDidChange: yi,
            nowPlayingItemWillChange: fi,
            metadataDidChange: mi,
            primaryPlayerDidChange: gi,
            playbackDurationDidChange: vi,
            playbackProgressDidChange: bi,
            playbackStateDidChange: _i,
            playbackRateDidChange: Ti,
            playbackStateWillChange: Si,
            playbackTargetAvailableDidChange: Pi,
            playbackTargetIsWirelessDidChange: Ei,
            playbackTimeDidChange: ki,
            playbackVolumeDidChange: wi
        } = ur,
        Ii = [
            "canplay",
            "durationchange",
            "ended",
            "error",
            "loadedmetadata",
            "loadstart",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "seeked",
            "seeking",
            "timeupdate",
            "volumechange",
            "waiting"
        ],
        Oi = ["NotAllowedError", "NotSupportedError"],
        { ended: Ai, loading: Ri, paused: Ci, playing: Mi, seeking: Di, stopped: xi, waiting: Li } = e.PlaybackStates
    class BasePlayer {
        get bitrate() {
            return this._bitrateCalculator.bitrate
        }
        get currentBufferedProgress() {
            return this._currentBufferedProgress
        }
        get _currentDuration() {
            return this._targetElement.duration
        }
        get _currentTime() {
            const e = this._targetElement.currentTime,
                n = this._buffer
            var d
            return e - (null !== (d = null == n ? void 0 : n.currentTimestampOffset) && void 0 !== d ? d : 0)
        }
        get currentPlaybackDuration() {
            const n = this.nowPlayingItem
            if (!n) return 0
            const d =
                    n.playbackType === e.PlaybackType.encryptedFull ||
                    n.playbackType === e.PlaybackType.unencryptedFull,
                h = n.playbackDuration
            return d && h ? this.calculateTime(h / 1e3) : this.calculateTime(this._currentDuration)
        }
        get currentPlaybackTime() {
            return this.calculateTime(this._currentTime)
        }
        calculateTime(e) {
            return this._timing.time(e)
        }
        get currentPlaybackTimeRemaining() {
            return this.currentPlaybackDuration - this.currentPlaybackTime
        }
        get currentPlaybackProgress() {
            return this._currentPlaybackProgress || 0
        }
        get hasMediaElement() {
            return this._targetElement instanceof HTMLElement && null !== this._targetElement.parentNode
        }
        get isEngagedInPlayback() {
            return !this._stopped && !this.isPaused()
        }
        get isPlaying() {
            return this.playbackState === Mi
        }
        get isPrimaryPlayer() {
            return this._isPrimaryPlayer
        }
        set isPrimaryPlayer(e) {
            var n
            e !== this._isPrimaryPlayer &&
                ((this._isPrimaryPlayer = e),
                this._isPrimaryPlayer
                    ? null === (n = getLocalStorage()) || void 0 === n || n.setItem(Kt, this._serial)
                    : (this._dispatcher.publish(gi, { target: this }), this.pause({ userInitiated: !1 })))
        }
        get isReady() {
            return 0 !== this._targetElement.readyState
        }
        get nowPlayingItem() {
            return this._nowPlayingItem
        }
        set nowPlayingItem(e) {
            const n = this._dispatcher
            if (void 0 === e)
                return n.publish(fi, { item: e }), (this._nowPlayingItem = e), void n.publish(yi, { item: e })
            const d = this._nowPlayingItem,
                h = this._buffer
            ;(null == d ? void 0 : d.isEqual(e)) ||
                (n.publish(fi, { item: e }),
                this.isPlaying && (null == h ? void 0 : h.currentItem) !== e && this._pauseMedia(),
                d &&
                    (Rt.debug("setting state to ended on ", d.title),
                    (d.state = $.ended),
                    d.endMonitoringStateDidChange(),
                    d.endMonitoringStateWillChange()),
                (this._nowPlayingItem = e),
                Rt.debug("setting state to playing on ", e.title),
                (e.state = $.playing),
                e && e.info && this._setTargetElementTitle(e.info),
                n.publish(yi, { item: e }),
                n.publish(vi, {
                    currentTarget: this._targetElement,
                    duration: this.currentPlaybackDuration,
                    target: this._targetElement,
                    type: "durationchange"
                }))
        }
        get playbackRate() {
            return this._targetElement.playbackRate
        }
        set playbackRate(e) {
            this._targetElement.playbackRate = e
        }
        get playbackState() {
            return this._playbackState
        }
        setPlaybackState(e, n) {
            const d = this._playbackState
            if (e === d) return
            const h = { oldState: d, state: e, nowPlayingItem: n }
            Rt.debug("BasePlayer.playbackState is changing", h),
                this._dispatcher.publish(Si, h),
                (this._playbackState = e),
                this._dispatcher.publish(_i, h)
        }
        get playbackTargetAvailable() {
            return void 0 !== window.WebKitPlaybackTargetAvailabilityEvent && this._playbackTargetAvailable
        }
        set playbackTargetAvailable(e) {
            e !== this._playbackTargetAvailable &&
                ((this._playbackTargetAvailable = e), this._dispatcher.publish(Pi, { available: e }))
        }
        get playbackTargetIsWireless() {
            return void 0 !== window.WebKitPlaybackTargetAvailabilityEvent && this._playbackTargetIsWireless
        }
        set playbackTargetIsWireless(e) {
            e !== this._playbackTargetIsWireless &&
                ((this._playbackTargetIsWireless = e), this._dispatcher.publish(Ei, { playing: e }))
        }
        get volume() {
            return this._targetElement.volume
        }
        set volume(e) {
            this._targetElement.volume = e
        }
        get isDestroyed() {
            return this._isDestroyed
        }
        clearNextManifest() {
            var e
            null === (e = this._buffer) || void 0 === e || e.clearNextManifest()
        }
        initialize() {
            var e = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("BasePlayer.initialize"),
                    e.isPlayerSupported()
                        ? (yield e.initializeMediaElement(),
                          yield e.initializeExtension(),
                          e.initializeEventHandlers(),
                          e._dispatcher.publish(hi, e._targetElement))
                        : Rt.warn("{this.constructor.name} not supported")
            })()
        }
        initializeEventHandlers() {
            if ((this.windowHandlers.activate(), !this.hasMediaElement)) return
            const e = this._targetElement
            window.WebKitPlaybackTargetAvailabilityEvent &&
                (e.addEventListener("webkitplaybacktargetavailabilitychanged", (e) => {
                    this.playbackTargetAvailable = "available" === e.availability
                }),
                e.addEventListener("webkitcurrentplaybacktargetiswirelesschanged", (e) => {
                    this.playbackTargetIsWireless = e.target === this._targetElement && !this.playbackTargetIsWireless
                })),
                Ii.forEach((n) => e.addEventListener(n, this)),
                this._dispatcher.publish(cr.playerActivate)
        }
        removeEventHandlers() {
            Ii.forEach((e) => this._targetElement.removeEventListener(e, this)), this.windowHandlers.deactivate()
        }
        isPaused() {
            return this._paused
        }
        exitFullscreen() {
            return this.fullscreen.exit()
        }
        requestFullscreen(e) {
            return this.fullscreen.request(e)
        }
        newSeeker() {
            var e
            return (
                null === (e = this._seeker) || void 0 === e || e.end(),
                (this._seeker = new PlayerSeeker(this)),
                this._seeker
            )
        }
        stop(e) {
            var n = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("BasePlayer.stop", e),
                    yield n._waitForPendingPlay(),
                    n.isPlaying &&
                        (Rt.debug("BasePlayer.play dispatching playbackStop"),
                        n.dispatch(
                            cr.playbackStop,
                            _objectSpread$r(
                                {
                                    item: n.nowPlayingItem,
                                    position: n.currentPlaybackTime,
                                    startPosition: n.initialBufferPosition,
                                    playingDate: n.currentPlayingDate,
                                    startPlayingDate: n.initialPlayingDate
                                },
                                e
                            )
                        )),
                    yield n.stopMediaAndCleanup()
            })()
        }
        stopMediaAndCleanup(e = xi) {
            var n = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("stopMediaAndCleanup"), yield n._stopMediaElement(), (n._stopped = !0), (n._paused = !1)
                const d = n.nowPlayingItem
                ;(n.nowPlayingItem = void 0),
                    (n.initialBufferPosition = void 0),
                    (n.initialPlayingDate = void 0),
                    n.setPlaybackState(e, d)
            })()
        }
        onPlaybackError(n, d) {
            this.resetDeferredPlay(),
                this.stop({ endReasonType: e.PlayActivityEndReasonType.FAILED_TO_LOAD, userInitiated: !1 })
        }
        calculatePlaybackProgress() {
            const e = Math.round(100 * (this.currentPlaybackTime / this.currentPlaybackDuration || 0)) / 100
            this._currentPlaybackProgress !== e &&
                ((this._currentPlaybackProgress = e),
                this._dispatcher.publish(bi, { progress: this._currentPlaybackProgress }))
        }
        calculateBufferedProgress(e) {
            const n = Math.round((e / this.currentPlaybackDuration) * 100)
            this._currentBufferedProgress !== n &&
                ((this._currentBufferedProgress = n), this._dispatcher.publish(ui, { progress: n }))
        }
        destroy() {
            var e, n
            if (
                (Rt.debug("BasePlayer.destroy"),
                (this._isDestroyed = !0),
                this._dispatcher.unsubscribe(pi, this.onPlaybackError),
                !this.hasMediaElement)
            )
                return
            const d = this._targetElement
            null === (e = this.extension) || void 0 === e || e.destroy(d),
                this.removeEventHandlers(),
                this.cleanupElement(),
                null === (n = d.parentNode) || void 0 === n || n.removeChild(d)
        }
        handleEvent(n) {
            var d = this
            return _asyncToGenerator$R(function* () {
                "timeupdate" !== n.type && Rt.debug("BasePlayer.handleEvent: ", n.type, n, d.isPaused(), d._stopped)
                const { nowPlayingItem: h } = d
                switch (n.type) {
                    case "canplay":
                        d._dispatcher.publish(di, n),
                            d._playbackState !== Li || d._targetElement.paused || d.setPlaybackState(Mi, h)
                        break
                    case "durationchange":
                        d._targetElement.duration !== 1 / 0 &&
                            ((n.duration = d.currentPlaybackDuration),
                            d._dispatcher.publish(vi, n),
                            d.calculatePlaybackProgress())
                        break
                    case "ended": {
                        var p
                        if (
                            (Rt.debug('media element "ended" event'),
                            null === (p = d.nowPlayingItem) || void 0 === p ? void 0 : p.isLinearStream)
                        )
                            return void Rt.warn("ignoring ended event for linear stream", n)
                        if (d.isElementCleaned()) {
                            Rt.debug('media element already cleaned, ignoring "ended" event')
                            break
                        }
                        const h = d.nowPlayingItem,
                            y = d.currentPlaybackTime,
                            m = d.currentPlayingDate
                        d.dispatch(cr.playbackStop, {
                            item: h,
                            position: y,
                            playingDate: m,
                            endReasonType: e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK
                        }),
                            yield d.stopMediaAndCleanup(Ai)
                        break
                    }
                    case "error":
                        Rt.error("Playback Error", n, d._targetElement.error),
                            d._dispatcher.publish(pi, new MKError(MKError.MEDIA_PLAYBACK, "Playback Error"))
                        break
                    case "loadedmetadata":
                        d._dispatcher.publish(mi, n)
                        break
                    case "loadstart":
                        d.setPlaybackState(Ri, h)
                        break
                    case "pause":
                        d.setPlaybackState(d._stopped ? xi : Ci, h)
                        break
                    case "play":
                    case "playing":
                        ;(d._paused = !1), (d._stopped = !1), (d.isPrimaryPlayer = !0), d.setPlaybackState(Mi, h)
                        break
                    case "progress": {
                        const e = d._targetElement.buffered
                        d.handleBufferStart(),
                            1 === e.length && 0 === e.start(0) && d.calculateBufferedProgress(e.end(0))
                        break
                    }
                    case "ratechange":
                        d._dispatcher.publish(Ti, n)
                        break
                    case "seeked":
                        d._stopped
                            ? d.setPlaybackState(xi, h)
                            : d._paused
                            ? d.setPlaybackState(Ci, h)
                            : d.playbackState !== Ai && d.setPlaybackState(Mi, h)
                        break
                    case "seeking":
                        d.playbackState === Ci ? (d._paused = !0) : d.playbackState === xi && (d._stopped = !0),
                            d.playbackState !== Ai && d.setPlaybackState(Di, h)
                        break
                    case "timeupdate": {
                        d._dispatcher.publish(ki, {
                            currentPlaybackDuration: d.currentPlaybackDuration,
                            currentPlaybackTime: d.currentPlaybackTime,
                            currentPlaybackTimeRemaining: d.currentPlaybackTimeRemaining
                        }),
                            d.calculatePlaybackProgress()
                        const e = d._buffer
                        e && (e.currentTime = d.currentPlaybackTime)
                        break
                    }
                    case "volumechange":
                        d._dispatcher.publish(wi, n)
                        break
                    case "waiting":
                        d.setPlaybackState(Li, h)
                }
            })()
        }
        handleBufferStart() {
            const { _targetElement: e } = this
            void 0 !== this.initialBufferPosition ||
                e.paused ||
                0 === e.buffered.length ||
                ((this.initialBufferPosition = e.buffered.start(0)),
                (this.initialPlayingDate = this.currentPlayingDate),
                Rt.debug("BasePlayer.handleBufferStart: setting initial buffer position ", this.initialBufferPosition))
        }
        pause(e = {}) {
            var n = this
            return _asyncToGenerator$R(function* () {
                yield n._waitForPendingPlay(),
                    n.isPlaying &&
                        (yield n._pauseMedia(),
                        (n._paused = !0),
                        n.dispatch(
                            cr.playbackPause,
                            _objectSpread$r(
                                {
                                    item: n.nowPlayingItem,
                                    position: n.currentPlaybackTime,
                                    playingDate: n.currentPlayingDate
                                },
                                e
                            )
                        ))
            })()
        }
        play(e = !0) {
            var n = this
            return _asyncToGenerator$R(function* () {
                if ((Rt.debug("BasePlayer.play()"), n.nowPlayingItem))
                    try {
                        yield n._playMedia(),
                            Rt.debug("BasePlayer.play dispatching playbackPlay"),
                            n.dispatch(cr.playbackPlay, {
                                userInitiated: e,
                                item: n.nowPlayingItem,
                                position: n.currentPlaybackTime,
                                playingDate: n.currentPlayingDate
                            })
                    } catch (Mr) {
                        if (
                            (Mr && Oi.includes(Mr.name) && Rt.error("BasePlayer.play() rejected due to", Mr),
                            "NotAllowedError" === (null == Mr ? void 0 : Mr.name))
                        )
                            throw new MKError(
                                MKError.USER_INTERACTION_REQUIRED,
                                "Playback of media content requires user interaction first and cannot be automatically started on page load."
                            )
                    }
            })()
        }
        preload() {
            return this._loadMedia()
        }
        showPlaybackTargetPicker() {
            this.playbackTargetAvailable && this._targetElement.webkitShowPlaybackTargetPicker()
        }
        dispatch(e, n) {
            void 0 === n.item && (n.item = this.nowPlayingItem),
                hasOwn(n, "isPlaying") || (n.isPlaying = this.isPlaying),
                this._dispatcher.publish(e, n)
        }
        tsidChanged(e) {
            void 0 !== e && "" !== e && (this.isPrimaryPlayer = e === this._serial)
        }
        _waitForPendingPlay() {
            var e = this
            return _asyncToGenerator$R(function* () {
                e._deferredPlay && (yield e._deferredPlay.promise, (e._deferredPlay = void 0))
            })()
        }
        _loadMedia() {
            var e = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("BasePlayer._loadMedia", e._targetElement), e._targetElement.load()
            })()
        }
        _pauseMedia() {
            var e = this
            return _asyncToGenerator$R(function* () {
                e._targetElement.pause()
            })()
        }
        _playAssetURL(e, n) {
            var d = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("BasePlayer._playAssetURL", e), (d._targetElement.src = e)
                const h = d._loadMedia()
                if (n) return Rt.debug("BasePlayer.loadOnly"), void (yield h)
                yield d._playMedia()
            })()
        }
        playItemFromUnencryptedSource(e, n, d) {
            var h = this
            return _asyncToGenerator$R(function* () {
                return (
                    (null == d ? void 0 : d.startTime) && (e += "#t=" + d.startTime),
                    n || h.startPlaybackSequence(),
                    yield h._playAssetURL(e, n),
                    h.finishPlaybackSequence()
                )
            })()
        }
        _playMedia() {
            var e = this
            return _asyncToGenerator$R(function* () {
                Rt.debug("BasePlayer._playMedia", e._targetElement, e.extension)
                try {
                    yield e._targetElement.play(), (e._playbackDidStart = !0)
                } catch (Y) {
                    throw (Rt.error("BasePlayer._playMedia: targetElement.play() rejected", Y), Y)
                }
            })()
        }
        _setTargetElementTitle(e) {
            this.hasMediaElement && (this._targetElement.title = e)
        }
        resetDeferredPlay() {
            this._deferredPlay = void 0
        }
        _stopMediaElement() {
            var e = this
            return _asyncToGenerator$R(function* () {
                e.hasMediaElement && (e._targetElement.pause(), e.cleanupElement())
            })()
        }
        cleanupElement() {
            const e = this._targetElement
            e && !this.isElementCleaned() && ((e.currentTime = 0), e.removeAttribute("src"), e.removeAttribute("title"))
        }
        isElementCleaned() {
            const e = this._targetElement
            return !e || (0 === e.currentTime && "" === e.src && "" === e.title)
        }
        finishPlaybackSequence() {
            var e
            Rt.debug("BasePlayer.finishPlaybackSequence", this._deferredPlay)
            const n = null === (e = this._deferredPlay) || void 0 === e ? void 0 : e.resolve(void 0)
            return (this._deferredPlay = void 0), n
        }
        startPlaybackSequence() {
            return (
                Rt.debug("BasePlayer.startPlaybackSequence", this._deferredPlay),
                this._deferredPlay &&
                    (Rt.warn("Previous playback sequence not cleared"), this.finishPlaybackSequence()),
                (this._deferredPlay = (function () {
                    let e, n
                    return {
                        promise: new Promise(function (d, h) {
                            ;(e = d), (n = h)
                        }),
                        resolve(n) {
                            null == e || e(n)
                        },
                        reject(e) {
                            null == n || n(e)
                        }
                    }
                })()),
                this._deferredPlay.promise
            )
        }
        constructor(n) {
            var d
            ;(this.privateEnabled = !1),
                (this.siriInitiated = !1),
                (this._currentBufferedProgress = 0),
                (this._paused = !1),
                (this._playbackState = e.PlaybackStates.none),
                (this._stopped = !1),
                (this._playbackDidStart = !1),
                (this._currentPlaybackProgress = 0),
                (this._isPrimaryPlayer = !0),
                (this._playbackTargetAvailable = !1),
                (this._playbackTargetIsWireless = !1),
                (this._serial = Date.now().toString()),
                (this._isDestroyed = !1),
                (this._dispatcher = n.services.dispatcher),
                (this._timing = n.services.timing),
                (this._context = n.context || {}),
                (this.privateEnabled = n.privateEnabled || !1),
                (this.siriInitiated = n.siriInitiated || !1),
                (this._bitrateCalculator = n.services.bitrateCalculator),
                (this.windowHandlers = new WindowHandlers(this)),
                (this.fullscreen = new Fullscreen(this)),
                null === (d = getLocalStorage()) || void 0 === d || d.setItem(Kt, this._serial),
                this._dispatcher.subscribe(pi, this.onPlaybackError)
        }
    }
    function generateAssetUrl(e, n) {
        if ("Preview" === e.type && isStringNotEmpty(e.previewURL)) return e.previewURL
        let d = e.assetURL
        if (!d) throw new Error("Cannot generate asset URL")
        return (
            n &&
                (n.startOver && (d = addQueryParamsToURL(d, { startOver: !0 })),
                n.bingeWatching && (d = addQueryParamsToURL(d, { bingeWatching: !0 }))),
            e.supportsLinearScrubbing && (d = addQueryParamsToURL(d, { linearScrubbingSupported: !0 })),
            d.match(/xapsub=accepts-css/) || (d = addQueryParamsToURL(d, { xapsub: "accepts-css" })),
            d
        )
    }
    function restoreSelectedTrack(e, n) {
        Rt.debug("MEDIA_TRACKS restoreSelectedTrack")
        const d = e.getPersistedTrack(),
            h = e.fields,
            p = n.currentTrack
        if (!d) return void Rt.debug("MEDIA_TRACKS no persisted track")
        if (p && trackEquals(p, d, h))
            return void Rt.debug("MEDIA_TRACKS persisted track is equal to current track, not setting")
        const y = n.tracks
        if (y && y.length)
            for (let m = 0; m < y.length; m++) {
                const e = y[m]
                if (
                    (Rt.debug(`MEDIA_TRACKS testing track ${e.label} against persisted track ${JSON.stringify(d)}`),
                    trackEquals(e, d, h))
                ) {
                    Rt.debug("MEDIA_TRACKS found matching track " + e.label), (n.currentTrack = e)
                    break
                }
            }
    }
    function trackEquals(e, n, d) {
        let h = !0
        for (let p = 0; p < d.length; p++) {
            const y = d[p]
            if (e[y] !== n[y]) {
                h = !1
                break
            }
        }
        return h
    }
    ci(
        [Bind(), li("design:type", Function), li("design:paramtypes", [String, void 0 === MKError ? Object : MKError])],
        BasePlayer.prototype,
        "onPlaybackError",
        null
    )
    class TrackPersistence {
        getPersistedTrack() {
            var e
            if (!hasLocalStorage()) return !1
            const n = (null === (e = getLocalStorage()) || void 0 === e ? void 0 : e.getItem(this.storageKey)) || ""
            try {
                return JSON.parse(n)
            } catch (Mr) {
                return Rt.warn("MEDIA_TRACK could not parse persisted value " + n), !1
            }
        }
        setPersistedTrack(e) {
            var n, d
            if (!hasLocalStorage()) return
            if (
                (Rt.debug(`MEDIA_TRACK setPersistedTrack ${e.language},${e.label},${e.kind} with keys ${this.fields}`),
                !e)
            )
                return void (null === (d = getLocalStorage()) || void 0 === d || d.setItem(this.storageKey, ""))
            const h = JSON.stringify(this.extractFieldValuesFromTrack(e))
            Rt.debug("MEDIA_TRACK Extracted values " + h),
                null === (n = getLocalStorage()) || void 0 === n || n.setItem(this.storageKey, h)
        }
        extractFieldValuesFromTrack(e) {
            const n = {}
            return (
                this.fields.forEach((d) => {
                    const h = e[d]
                    null == h && Rt.warn(`MEDIA_TRACK No value for field ${d} on track ${JSON.stringify(e)}`),
                        (n[d] = h)
                }),
                n
            )
        }
        constructor(e, n) {
            ;(this.storageKey = e), (this.fields = n)
        }
    }
    var Ni
    !(function (e) {
        ;(e.Home = "com.apple.amp.appletv.home-team-radio"), (e.Away = "com.apple.amp.appletv.away-team-radio")
    })(Ni || (Ni = {}))
    class TrackManagerStub {
        get currentTrack() {
            return {}
        }
        set currentTrack(e) {}
        get tracks() {
            return []
        }
        destroy() {}
        restoreSelectedTrack() {}
    }
    const { audioTrackAdded: ji, audioTrackChanged: Ui, audioTrackRemoved: $i } = ur,
        { audioTracksSwitched: Gi, audioTracksUpdated: Bi } = Yt
    class AudioTrackManager {
        get currentTrack() {
            return this.tracks.find((e) => e.enabled)
        }
        set currentTrack(e) {
            e &&
                (Rt.debug("MEDIA_TRACK Setting audio track " + e.label),
                this.extensionTracks
                    ? (Rt.debug(`MEDIA_TRACK Setting track on extension ${e.id}-${e.label}`),
                      (this.extensionTracks.audioTrack = e))
                    : (Rt.debug("MEDIA_TRACK disabling all audio tracks"),
                      Array.from(this.mediaElement.audioTracks).forEach((n) => {
                          n !== e && (n.enabled = !1)
                      }),
                      Rt.debug("MEDIA_TRACK enabling", e),
                      (e.enabled = !0)),
                (function (e) {
                    return (
                        void 0 !== e.characteristics &&
                        e.characteristics.includes("com.apple.amp.appletv.home-team-radio")
                    )
                })(e) ||
                    (function (e) {
                        return (
                            void 0 !== e.characteristics &&
                            e.characteristics.includes("com.apple.amp.appletv.away-team-radio")
                        )
                    })(e) ||
                    this.trackPersistence.setPersistedTrack(e))
        }
        get tracks() {
            return this.extensionTracks
                ? this._extensionTracks || this.extensionTracks.audioTracks || []
                : Array.from(this.mediaElement.audioTracks)
        }
        destroy() {
            if (this.extensionTracks) {
                const e = this.extensionTracks
                e.removeEventListener(Bi, this.onExtensionAudioTracksUpdated),
                    e.removeEventListener(Gi, this.onExtensionAudioTrackSwitched)
            } else {
                if (!this.mediaElement.audioTracks) return
                this.mediaElement.audioTracks.removeEventListener("addtrack", this.onAudioTrackAdded),
                    this.mediaElement.audioTracks.removeEventListener("change", this.onAudioTrackChanged),
                    this.mediaElement.audioTracks.removeEventListener("removetrack", this.onAudioTrackRemoved)
            }
        }
        restoreSelectedTrack() {
            return restoreSelectedTrack(this.trackPersistence, this)
        }
        onExtensionAudioTracksUpdated(e) {
            Rt.debug("MEDIA_TRACK Extension audio tracks updated " + JSON.stringify(e)),
                (this._extensionTracks = e),
                this.restoreSelectedTrack(),
                this.dispatcher.publish(ji, e)
        }
        onExtensionAudioTrackSwitched(e) {
            if ((Rt.debug("MEDIA_TRACK Extension audio track switched " + JSON.stringify(e)), this._extensionTracks)) {
                const preserveSelectedTrack = (n) => {
                    n.enabled = e.selectedId === n.id
                }
                this._extensionTracks.forEach(preserveSelectedTrack)
            }
            this.dispatcher.publish(Ui, e)
        }
        onAudioTrackAdded(e) {
            !(function (e, n, d) {
                const h = n.getPersistedTrack()
                h &&
                    trackEquals(e, h, n.fields) &&
                    (Rt.debug("MEDIA_TRACK onTrackAdded with track that matches persisted track " + e.label),
                    (d.currentTrack = e))
            })(e.track, this.trackPersistence, this),
                this.dispatcher.publish(ji, e)
        }
        onAudioTrackChanged(e) {
            this.dispatcher.publish(Ui, e)
        }
        onAudioTrackRemoved(e) {
            this.dispatcher.publish($i, e)
        }
        constructor(e, n, d) {
            if (
                ((this.mediaElement = e),
                (this.dispatcher = n),
                (this.extensionTracks = d),
                (this._extensionTracks = []),
                (this.trackPersistence = new TrackPersistence("mk-audio-track", ["label", "language", "kind"])),
                this.extensionTracks)
            ) {
                Rt.debug("MEDIA_TRACK Initializing audio track manager for hls track events"),
                    (this.onExtensionAudioTracksUpdated = this.onExtensionAudioTracksUpdated.bind(this)),
                    (this.onExtensionAudioTrackSwitched = this.onExtensionAudioTrackSwitched.bind(this))
                const e = this.extensionTracks
                e.addEventListener(Bi, this.onExtensionAudioTracksUpdated),
                    e.addEventListener(Gi, this.onExtensionAudioTrackSwitched)
            } else {
                if (!e.audioTracks) return
                Rt.debug("MEDIA_TRACK Initializing audio track manager for native track events"),
                    (this.onAudioTrackAdded = this.onAudioTrackAdded.bind(this)),
                    (this.onAudioTrackChanged = this.onAudioTrackChanged.bind(this)),
                    (this.onAudioTrackRemoved = this.onAudioTrackRemoved.bind(this)),
                    e.audioTracks.addEventListener("addtrack", this.onAudioTrackAdded),
                    e.audioTracks.addEventListener("change", this.onAudioTrackChanged),
                    e.audioTracks.addEventListener("removetrack", this.onAudioTrackRemoved)
            }
        }
    }
    const Fi = BooleanDevFlag.register("mk-load-manifest-once"),
        shouldLoadManifestOnce = () => !!Fi.configured && Fi.enabled
    var Ki = createCommonjsModule(function (e, n) {
        Object.defineProperty(n, "__esModule", { value: !0 }),
            (n.isValidScrollSetting =
                n.isValidPositionAlignSetting =
                n.isValidLineAlignSetting =
                n.isValidLineAndPositionSetting =
                n.isValidDirectionSetting =
                n.isValidAlignSetting =
                n.isValidPercentValue =
                    void 0),
            (n.isValidPercentValue = function (e) {
                return "number" == typeof e && e >= 0 && e <= 100
            }),
            (n.isValidAlignSetting = function (e) {
                return "string" == typeof e && ["start", "center", "end", "left", "right", "middle"].includes(e)
            }),
            (n.isValidDirectionSetting = function (e) {
                return "string" == typeof e && ["", "rl", "lr"].includes(e)
            }),
            (n.isValidLineAndPositionSetting = function (e) {
                return "number" == typeof e || "auto" === e
            }),
            (n.isValidLineAlignSetting = function (e) {
                return "string" == typeof e && ["start", "center", "end"].includes(e)
            }),
            (n.isValidPositionAlignSetting = function (e) {
                return (
                    "string" == typeof e &&
                    ["line-left", "center", "line-right", "auto", "left", "start", "middle", "end", "right"].includes(e)
                )
            }),
            (n.isValidScrollSetting = function (e) {
                return ["", "up"].includes(e)
            })
    })
    unwrapExports(Ki),
        Ki.isValidScrollSetting,
        Ki.isValidPositionAlignSetting,
        Ki.isValidLineAlignSetting,
        Ki.isValidLineAndPositionSetting,
        Ki.isValidDirectionSetting,
        Ki.isValidAlignSetting,
        Ki.isValidPercentValue
    var Vi = createCommonjsModule(function (e, n) {
        Object.defineProperty(n, "__esModule", { value: !0 })
        const d = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&lrm;": "鈥�", "&rlm;": "鈥�", "&nbsp;": "聽" },
            h = { c: "span", i: "i", b: "b", u: "u", ruby: "ruby", rt: "rt", v: "span", lang: "span" },
            p = { v: "title", lang: "lang" },
            y = { rt: "ruby" },
            m = { "text-combine-upright": "-webkit-text-combine:horizontal; text-orientation: mixed;" }
        class ParserUtility {
            static parseTimeStamp(e) {
                function computeSeconds(e) {
                    const [n, d, h, p] = e.map((e) => (e ? parseInt("" + e) : 0))
                    return 3600 * n + 60 * d + h + p / 1e3
                }
                const n = /^(\d+):(\d{2})(:\d{2})?\.(\d{3})/.exec(e)
                return n
                    ? n[3]
                        ? computeSeconds([n[1], n[2], n[3].substring(1), n[4]])
                        : parseInt(n[1]) > 59
                        ? computeSeconds([n[1], n[2], null, n[4]])
                        : computeSeconds([null, n[1], n[2], n[4]])
                    : null
            }
            static parseContent(e, n, g) {
                let b = n.text
                function nextToken() {
                    if (!b) return null
                    const e = /^([^<]*)(<[^>]+>?)?/.exec(b)
                    return (n = e[1] ? e[1] : e[2]), (b = b.substr(n.length)), n
                    var n
                }
                function unescape1(e) {
                    return d[e]
                }
                function unescape(e) {
                    return e.replace(/&(amp|lt|gt|lrm|rlm|nbsp);/g, unescape1)
                }
                function shouldAdd(e, n) {
                    return !y[n.dataset.localName] || y[n.dataset.localName] === e.dataset.localName
                }
                function createElement(n, d, y) {
                    const b = h[n]
                    if (!b) return null
                    const _ = e.document.createElement(b)
                    _.dataset.localName = b
                    const T = p[n]
                    if ((T && y && (_[T] = y.trim()), d))
                        if (g[d]) {
                            const e = (function (e) {
                                let n = ""
                                for (const d in e) n += m[d] ? m[d] : d + ":" + e[d] + ";"
                                return n
                            })(g[d])
                            _.setAttribute("style", e)
                        } else console.info(`WebVTT: parseContent: Style referenced, but no style defined for '${d}'!`)
                    return _
                }
                const _ = e.document.createElement("div"),
                    T = []
                let S,
                    P,
                    E = _
                for (; null !== (S = nextToken()); )
                    if ("<" !== S[0]) E.appendChild(e.document.createTextNode(unescape(S)))
                    else {
                        if ("/" === S[1]) {
                            T.length &&
                                T[T.length - 1] === S.substr(2).replace(">", "") &&
                                (T.pop(), (E = E.parentNode))
                            continue
                        }
                        const n = ParserUtility.parseTimeStamp(S.substr(1, S.length - 2))
                        let d
                        if (n) {
                            ;(d = e.document.createProcessingInstruction("timestamp", n.toString())), E.appendChild(d)
                            continue
                        }
                        if (((P = /^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/.exec(S)), !P)) continue
                        if (((d = createElement(P[1], P[2], P[3])), !d)) continue
                        if (!shouldAdd(E, d)) continue
                        P[2], T.push(P[1]), E.appendChild(d), (E = d)
                    }
                return _
            }
        }
        n.default = ParserUtility
    })
    unwrapExports(Vi)
    var Hi = createCommonjsModule(function (e, n) {
        var d =
            (Ue && Ue.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            }
        Object.defineProperty(n, "__esModule", { value: !0 }), (n.VTTCue = void 0)
        let h = class {
            get id() {
                return this._id
            }
            set id(e) {
                this._id = "" + e
            }
            get pauseOnExit() {
                return this._pauseOnExit
            }
            set pauseOnExit(e) {
                this._pauseOnExit = !!e
            }
            get startTime() {
                return this._startTime
            }
            set startTime(e) {
                if ("number" != typeof e) throw new TypeError("Start time must be set to a number: " + e)
                ;(this._startTime = e), (this.hasBeenReset = !0)
            }
            get endTime() {
                return this._endTime
            }
            set endTime(e) {
                if ("number" != typeof e) throw new TypeError("End time must be set to a number: " + e)
                ;(this._endTime = e), (this.hasBeenReset = !0)
            }
            get text() {
                return this._text
            }
            set text(e) {
                ;(this._text = "" + e), (this.hasBeenReset = !0)
            }
            get region() {
                return this._region
            }
            set region(e) {
                ;(this._region = e), (this.hasBeenReset = !0)
            }
            get vertical() {
                return this._vertical
            }
            set vertical(e) {
                if (!Ki.isValidDirectionSetting(e))
                    throw new SyntaxError("An invalid or illegal string was specified for vertical: " + e)
                ;(this._vertical = e), (this.hasBeenReset = !0)
            }
            get snapToLines() {
                return this._snapToLines
            }
            set snapToLines(e) {
                ;(this._snapToLines = !!e), (this.hasBeenReset = !0)
            }
            get line() {
                return this._line
            }
            set line(e) {
                if (!Ki.isValidLineAndPositionSetting(e))
                    throw new SyntaxError("An invalid number or illegal string was specified for line: " + e)
                ;(this._line = e), (this.hasBeenReset = !0)
            }
            get lineAlign() {
                return this._lineAlign
            }
            set lineAlign(e) {
                if (!Ki.isValidLineAlignSetting(e))
                    throw new SyntaxError("An invalid or illegal string was specified for lineAlign: " + e)
                ;(this._lineAlign = e), (this.hasBeenReset = !0)
            }
            get position() {
                return this._position
            }
            set position(e) {
                if (!Ki.isValidLineAndPositionSetting(e))
                    throw new Error("Position must be between 0 and 100 or auto: " + e)
                ;(this._position = e), (this.hasBeenReset = !0)
            }
            get positionAlign() {
                return this._positionAlign
            }
            set positionAlign(e) {
                if (!Ki.isValidPositionAlignSetting(e))
                    throw new SyntaxError("An invalid or illegal string was specified for positionAlign: " + e)
                ;(this._positionAlign = e), (this.hasBeenReset = !0)
            }
            get size() {
                return this._size
            }
            set size(e) {
                if (e < 0 || e > 100) throw new Error("Size must be between 0 and 100: " + e)
                ;(this._size = e), (this.hasBeenReset = !0)
            }
            get align() {
                return this._align
            }
            set align(e) {
                if (!Ki.isValidAlignSetting(e))
                    throw new SyntaxError("An invalid or illegal string was specified for align: " + e)
                ;(this._align = e), (this.hasBeenReset = !0)
            }
            getCueAsHTML() {
                return Vi.default.parseContent(window, this, {})
            }
            static create(e) {
                if (!e.hasOwnProperty("startTime") || !e.hasOwnProperty("endTime") || !e.hasOwnProperty("text"))
                    throw new Error("You must at least have start time, end time, and text.")
                const n = new this(e.startTime, e.endTime, e.text)
                return (
                    Object.keys(e).forEach((d) => {
                        n.hasOwnProperty(d) && (n[d] = e[d])
                    }),
                    n
                )
            }
            static fromJSON(e) {
                return this.create(JSON.parse(e))
            }
            toJSON() {
                const e = {}
                return (
                    Object.keys(this).forEach((n) => {
                        this.hasOwnProperty(n) &&
                            "getCueAsHTML" !== n &&
                            "hasBeenReset" !== n &&
                            "displayState" !== n &&
                            (e[n] = this[n])
                    }),
                    e
                )
            }
            constructor(e, n, d) {
                ;(this._id = ""),
                    (this._pauseOnExit = !1),
                    (this._region = null),
                    (this._vertical = ""),
                    (this._snapToLines = !0),
                    (this._line = "auto"),
                    (this._lineAlign = "start"),
                    (this._position = "auto"),
                    (this._positionAlign = "auto"),
                    (this._size = 100),
                    (this._align = "center"),
                    (this.hasBeenReset = !1),
                    (this._startTime = e),
                    (this._endTime = n),
                    (this._text = d)
            }
        }
        ;(h = d(
            [
                function (e) {
                    let n = e
                    "undefined" != typeof window &&
                        null != window.VTTCue &&
                        ((n = window.VTTCue),
                        (n.create = e.create),
                        (n.fromJSON = e.fromJSON),
                        (n.prototype.toJSON = e.prototype.toJSON))
                    return n
                }
            ],
            h
        )),
            (n.VTTCue = h)
    })
    unwrapExports(Hi), Hi.VTTCue
    var qi = createCommonjsModule(function (e, n) {
        var d =
            (Ue && Ue.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            }
        Object.defineProperty(n, "__esModule", { value: !0 }), (n.VTTRegion = void 0)
        let h = class {
            get id() {
                return this._id
            }
            set id(e) {
                if ("string" != typeof e) throw new Error("ID must be a string.")
                this._id = e
            }
            get lines() {
                return this._lines
            }
            set lines(e) {
                if ("number" != typeof e) throw new TypeError("Lines must be set to a number.")
                this._lines = e
            }
            get regionAnchorX() {
                return this._regionAnchorX
            }
            set regionAnchorX(e) {
                if (!Ki.isValidPercentValue(e)) throw new TypeError("RegionAnchorX must be between 0 and 100.")
                this._regionAnchorX = e
            }
            get regionAnchorY() {
                return this._regionAnchorY
            }
            set regionAnchorY(e) {
                if (!Ki.isValidPercentValue(e)) throw new TypeError("RegionAnchorY must be between 0 and 100.")
                this._regionAnchorY = e
            }
            get scroll() {
                return this._scroll
            }
            set scroll(e) {
                if ("string" == typeof e) {
                    const n = e.toLowerCase()
                    if (Ki.isValidScrollSetting(n)) return void (this._scroll = n)
                }
                throw new SyntaxError("An invalid or illegal string was specified.")
            }
            get viewportAnchorX() {
                return this._viewportAnchorX
            }
            set viewportAnchorX(e) {
                if (!Ki.isValidPercentValue(e)) throw new TypeError("ViewportAnchorX must be between 0 and 100.")
                this._viewportAnchorX = e
            }
            get viewportAnchorY() {
                return this._viewportAnchorY
            }
            set viewportAnchorY(e) {
                if (!Ki.isValidPercentValue(e)) throw new TypeError("ViewportAnchorY must be between 0 and 100.")
                this._viewportAnchorY = e
            }
            get width() {
                return this._width
            }
            set width(e) {
                if (!Ki.isValidPercentValue(e)) throw new TypeError("Width must be between 0 and 100.")
                this._lines = e
            }
            toJSON() {
                const e = {}
                return (
                    Object.keys(this).forEach((n) => {
                        this.hasOwnProperty(n) && (e[n] = this[n])
                    }),
                    e
                )
            }
            static create(e) {
                const n = new this()
                return (
                    Object.keys(e).forEach((d) => {
                        n.hasOwnProperty(d) && (n[d] = e[d])
                    }),
                    n
                )
            }
            static fromJSON(e) {
                return this.create(JSON.parse(e))
            }
            constructor() {
                ;(this._id = ""),
                    (this._lines = 3),
                    (this._regionAnchorX = 0),
                    (this._regionAnchorY = 100),
                    (this._scroll = ""),
                    (this._viewportAnchorX = 0),
                    (this._viewportAnchorY = 100),
                    (this._width = 100)
            }
        }
        ;(h = d(
            [
                function (e) {
                    let n = e
                    "undefined" != typeof window &&
                        null != window.VTTRegion &&
                        ((n = window.VTTRegion),
                        (n.create = e.create),
                        (n.fromJSON = e.fromJSON),
                        (n.prototype.toJSON = e.prototype.toJSON))
                    return n
                }
            ],
            h
        )),
            (n.VTTRegion = h)
    })
    unwrapExports(qi), qi.VTTRegion
    var Wi = createCommonjsModule(function (e, n) {
        Object.defineProperty(n, "__esModule", { value: !0 })
    })
    unwrapExports(Wi)
    var Yi = createCommonjsModule(function (e, n) {
        var d =
                (Ue && Ue.__createBinding) ||
                (Object.create
                    ? function (e, n, d, h) {
                          void 0 === h && (h = d),
                              Object.defineProperty(e, h, {
                                  enumerable: !0,
                                  get: function () {
                                      return n[d]
                                  }
                              })
                      }
                    : function (e, n, d, h) {
                          void 0 === h && (h = d), (e[h] = n[d])
                      }),
            h =
                (Ue && Ue.__exportStar) ||
                function (e, n) {
                    for (var h in e) "default" === h || n.hasOwnProperty(h) || d(n, e, h)
                }
        Object.defineProperty(n, "__esModule", { value: !0 }),
            (n.VTTRegion = n.VTTCue = n.WebVTTParser = n.ParsingError = void 0),
            Object.defineProperty(n, "VTTCue", {
                enumerable: !0,
                get: function () {
                    return Hi.VTTCue
                }
            }),
            Object.defineProperty(n, "VTTRegion", {
                enumerable: !0,
                get: function () {
                    return qi.VTTRegion
                }
            })
        class ParsingError extends Error {
            constructor(e, n) {
                super(),
                    (this.name = "ParsingError"),
                    (this.code = "number" == typeof e ? e : e.code),
                    n ? (this.message = n) : e instanceof ParsingError && (this.message = e.message)
            }
        }
        ;(n.ParsingError = ParsingError),
            (ParsingError.Errors = {
                BadSignature: new ParsingError(0, "Malformed WebVTT signature."),
                BadTimeStamp: new ParsingError(1, "Malformed time stamp.")
            })
        class Settings {
            set(e, n) {
                this.get(e) || "" === n || (this.values[e] = n)
            }
            get(e, n, d) {
                return "object" == typeof n && "string" == typeof d
                    ? this.has(e)
                        ? this.values[e]
                        : n[d]
                    : this.has(e)
                    ? this.values[e]
                    : n
            }
            has(e) {
                return e in this.values
            }
            alt(e, n, d) {
                for (let h = 0; h < d.length; ++h)
                    if (n === d[h]) {
                        this.set(e, n)
                        break
                    }
            }
            integer(e, n) {
                ;/^-?\d+$/.test(n) && this.set(e, parseInt(n, 10))
            }
            percent(e, n) {
                if (n.match(/^([\d]{1,3})(\.[\d]*)?%$/))
                    try {
                        const d = parseFloat(n)
                        if (d >= 0 && d <= 100) return this.set(e, d), !0
                    } catch (Ic) {
                        return !1
                    }
                return !1
            }
            constructor() {
                this.values = {}
            }
        }
        class WebVTTParser {
            static StringDecoder() {
                return {
                    decode: (e) => {
                        if (!e) return ""
                        if ("string" != typeof e) throw new Error("Error - expected string data.")
                        return decodeURIComponent(encodeURIComponent(e))
                    }
                }
            }
            reportOrThrowError(e) {
                if (!(e instanceof ParsingError && "function" == typeof this.onparsingerror)) throw e
                this.onparsingerror(e)
            }
            parseOptions(e, n, d, h) {
                const p = h ? e.split(h) : [e]
                for (const y of p) {
                    if ("string" != typeof y) continue
                    const e = y.split(d)
                    if (2 !== e.length) continue
                    n(e[0], e[1])
                }
            }
            parseCue(e, n, d) {
                const h = e,
                    consumeTimeStamp = () => {
                        const n = Vi.default.parseTimeStamp(e)
                        if (null === n)
                            throw new ParsingError(ParsingError.Errors.BadTimeStamp, "Malformed timestamp: " + h)
                        return (e = e.replace(/^[^\sa-zA-Z-]+/, "")), n
                    },
                    skipWhitespace = () => {
                        e = e.replace(/^\s+/, "")
                    }
                if (
                    (skipWhitespace(),
                    (n.startTime = consumeTimeStamp()),
                    skipWhitespace(),
                    "--\x3e" !== e.substr(0, 3))
                )
                    throw new ParsingError(
                        ParsingError.Errors.BadTimeStamp,
                        "Malformed time stamp (time stamps must be separated by '--\x3e'): " + h
                    )
                ;(e = e.substr(3)),
                    skipWhitespace(),
                    (n.endTime = consumeTimeStamp()),
                    skipWhitespace(),
                    ((e, n) => {
                        const h = new Settings()
                        this.parseOptions(
                            e,
                            (e, n) => {
                                let p, y
                                switch (e) {
                                    case "region":
                                        for (let p = d.length - 1; p >= 0; p--)
                                            if (d[p].id === n) {
                                                h.set(e, d[p].region)
                                                break
                                            }
                                        break
                                    case "vertical":
                                        h.alt(e, n, ["rl", "lr"])
                                        break
                                    case "line":
                                        ;(p = n.split(",")),
                                            (y = p[0]),
                                            h.integer(e, y),
                                            h.percent(e, y) && h.set("snapToLines", !1),
                                            h.alt(e, y, ["auto"]),
                                            2 === p.length &&
                                                h.alt("lineAlign", p[1], ["start", "middle", "center", "end"])
                                        break
                                    case "position":
                                        if (((p = n.split(",")), h.percent(e, p[0]), 2 === p.length)) {
                                            let e = [
                                                "line-left",
                                                "line-right",
                                                "center",
                                                "auto",
                                                "left",
                                                "start",
                                                "middle",
                                                "end",
                                                "right"
                                            ]
                                            h.alt("positionAlign", p[1], e)
                                        }
                                        break
                                    case "size":
                                        h.percent(e, n)
                                        break
                                    case "align":
                                        let m = ["start", "center", "end", "left", "right", "middle"]
                                        h.alt(e, n, m)
                                }
                            },
                            /:/,
                            /\s/
                        ),
                            (n.region = h.get("region", null)),
                            (n.vertical = h.get("vertical", "")),
                            (n.line = h.get("line", void 0 === n.line ? "auto" : n.line))
                        const p = h.get("lineAlign", "start")
                        ;(n.lineAlign = "center" === p || "middle" === p ? this.middleOrCenter : p),
                            (n.snapToLines = h.get("snapToLines", !0)),
                            (n.size = h.get("size", 100))
                        const y = h.get("align", "center")
                        ;(n.align = "center" === y || "middle" === y ? this.middleOrCenter : y),
                            (n.position = h.get("position", "auto"))
                        let m = h.get(
                            "positionAlign",
                            {
                                start: "start",
                                left: "start",
                                center: "center",
                                middle: "middle",
                                right: "end",
                                end: "end"
                            },
                            n.align
                        )
                        n.positionAlign =
                            "center" === m || "middle" === m
                                ? this.middleOrCenter
                                : {
                                      start: "start",
                                      "line-left": "start",
                                      left: "start",
                                      center: "center",
                                      middle: "middle",
                                      "line-right": "end",
                                      right: "end",
                                      end: "end"
                                  }[m]
                    })(e, n)
            }
            parseRegion(e) {
                const n = new Settings()
                if (
                    (this.parseOptions(
                        e,
                        (e, d) => {
                            switch (e) {
                                case "id":
                                    n.set(e, d)
                                    break
                                case "width":
                                    n.percent(e, d)
                                    break
                                case "lines":
                                    n.integer(e, d)
                                    break
                                case "regionanchor":
                                case "viewportanchor": {
                                    const h = d.split(",")
                                    if (2 !== h.length) break
                                    const p = new Settings()
                                    if ((p.percent("x", h[0]), p.percent("y", h[1]), !p.has("x") || !p.has("y"))) break
                                    n.set(e + "X", p.get("x")), n.set(e + "Y", p.get("y"))
                                    break
                                }
                                case "scroll":
                                    n.alt(e, d, ["up"])
                            }
                        },
                        /=/,
                        /\s/
                    ),
                    n.has("id"))
                ) {
                    const e = new qi.VTTRegion()
                    ;(e.width = n.get("width", 100)),
                        (e.lines = n.get("lines", 3)),
                        (e.regionAnchorX = n.get("regionanchorX", 0)),
                        (e.regionAnchorY = n.get("regionanchorY", 100)),
                        (e.viewportAnchorX = n.get("viewportanchorX", 0)),
                        (e.viewportAnchorY = n.get("viewportanchorY", 100)),
                        (e.scroll = n.get("scroll", "")),
                        this.onregion && this.onregion(e),
                        this.regionList.push({ id: n.get("id"), region: e })
                }
            }
            parseStyle(e) {
                const parseStyles = (e) => {
                        const n = {},
                            d = e.split(";")
                        for (let h = 0; h < d.length; h++)
                            if (d[h].includes(":")) {
                                const e = d[h].split(":", 2),
                                    p = e[0].trim(),
                                    y = e[1].trim()
                                "" !== p && "" !== y && (n[p] = y)
                            }
                        return n
                    },
                    n = e.split("}")
                n.pop()
                for (const d of n) {
                    let e = null,
                        n = null
                    const h = d.split("{")
                    h[0] && (e = h[0].trim()), h[1] && (n = parseStyles(h[1])), e && n && (this._styles[e] = n)
                }
                this.onStylesParsedCallback && this.onStylesParsedCallback(this._styles)
            }
            parseHeader(e) {
                this.parseOptions(
                    e,
                    function (e, n) {
                        switch (e) {
                            case "Region":
                                this.parseRegion(n)
                        }
                    },
                    /:/
                )
            }
            parse(e) {
                e && (this.buffer += this.decoder.decode(e, { stream: !0 }))
                const collectNextLine = () => {
                    const e = this.buffer
                    let n = 0
                    const calculateBreakPosition = (e, n) => {
                        const d = { start: -1, length: -1 }
                        if ("\r" === e[n]) (d.start = n), (d.length = 1)
                        else if ("\n" === e[n]) (d.start = n), (d.length = 1)
                        else if (
                            "<" === e[n] &&
                            n + 1 < e.length &&
                            "b" === e[n + 1] &&
                            n + 2 < e.length &&
                            "r" === e[n + 2]
                        ) {
                            let h = n + 2
                            for (; h < e.length && ">" !== e[h++]; );
                            ;(d.start = n), (d.length = h - n)
                        }
                        return d
                    }
                    let d = { start: e.length, length: 0 }
                    for (; n < e.length; ) {
                        const h = calculateBreakPosition(e, n)
                        if (h.length > 0) {
                            d = h
                            break
                        }
                        ++n
                    }
                    const h = e.substr(0, d.start)
                    return (this.buffer = e.substr(d.start + d.length)), h
                }
                try {
                    let e
                    if ("INITIAL" === this.state) {
                        if (!/\r\n|\n/.test(this.buffer)) return this
                        ;(this.alreadyCollectedLine = ""), (e = collectNextLine())
                        const n = /^(茂禄驴)?WEBVTT([ \t].*)?$/.exec(e)
                        if (!n || !n[0]) throw new ParsingError(ParsingError.Errors.BadSignature)
                        this.state = "HEADER"
                    }
                    for (; this.buffer; ) {
                        if (!/\r\n|\n/.test(this.buffer)) return this
                        switch (
                            (this.alreadyCollectedLine
                                ? ((e = this.alreadyCollectedLine), (this.alreadyCollectedLine = ""))
                                : (e = collectNextLine()),
                            this.state)
                        ) {
                            case "HEADER":
                                e.includes(":") ? this.parseHeader(e) : e || (this.state = "ID")
                                continue
                            case "NOTE":
                                e || (this.state = "ID")
                                continue
                            case "STYLE":
                                e
                                    ? (this.styleCollector += e)
                                    : (this.parseStyle(this.styleCollector),
                                      (this.state = "ID"),
                                      (this.styleCollector = ""))
                                continue
                            case "ID":
                                if (/^NOTE($|[ \t])/.test(e)) {
                                    this.state = "NOTE"
                                    break
                                }
                                if (/^STYLE($|[ \t])/.test(e)) {
                                    this.state = "STYLE"
                                    break
                                }
                                if (!e) continue
                                if (
                                    ((this.cue = new Hi.VTTCue(0, 0, "")), (this.state = "CUE"), !e.includes("--\x3e"))
                                ) {
                                    this.cue.id = e
                                    continue
                                }
                            case "CUE":
                                try {
                                    this.parseCue(e, this.cue, this.regionList)
                                } catch (Mr) {
                                    this.reportOrThrowError(Mr), (this.cue = null), (this.state = "BADCUE")
                                    continue
                                }
                                this.state = "CUETEXT"
                                continue
                            case "CUETEXT": {
                                const n = e.includes("--\x3e")
                                if (!e || n) {
                                    ;(this.alreadyCollectedLine = e),
                                        this.oncue && this.oncue(this.cue),
                                        (this.cue = null),
                                        (this.state = "ID")
                                    continue
                                }
                                this.cue.text && (this.cue.text += "\n"), (this.cue.text += e)
                                continue
                            }
                            case "BADCUE":
                                e || (this.state = "ID")
                                continue
                        }
                    }
                } catch (n) {
                    this.reportOrThrowError(n),
                        "CUETEXT" === this.state && this.cue && this.oncue && this.oncue(this.cue),
                        (this.cue = null),
                        (this.state = "INITIAL" === this.state ? "BADWEBVTT" : "BADCUE")
                }
                return this
            }
            flush() {
                try {
                    if (
                        ((this.buffer += this.decoder.decode()),
                        (this.cue || "HEADER" === this.state) && ((this.buffer += "\n\n"), this.parse()),
                        "INITIAL" === this.state)
                    )
                        throw new ParsingError(ParsingError.Errors.BadSignature)
                } catch (Mr) {
                    this.reportOrThrowError(Mr)
                }
                return this.onflush && this.onflush(), this
            }
            styles() {
                return this._styles
            }
            constructor(e, n, d) {
                ;(this.window = e),
                    (this.state = "INITIAL"),
                    (this.styleCollector = ""),
                    (this.buffer = ""),
                    (this.decoder = n || new TextDecoder("utf8")),
                    (this.regionList = []),
                    (this.alreadyCollectedLine = ""),
                    (this.onStylesParsedCallback = d),
                    (this._styles = {}),
                    (this.middleOrCenter = "center")
                const h = new Hi.VTTCue(0, 0, "middleOrCenter")
                try {
                    ;(h.align = "center"), "center" !== h.align && (this.middleOrCenter = "middle")
                } catch (Mr) {
                    this.middleOrCenter = "middle"
                }
            }
        }
        ;(n.default = WebVTTParser), (n.WebVTTParser = WebVTTParser), h(Wi, n)
    })
    unwrapExports(Yi), Yi.VTTRegion, Yi.VTTCue, Yi.WebVTTParser, Yi.ParsingError
    var zi = createCommonjsModule(function (e, n) {
        var d =
                (Ue && Ue.__createBinding) ||
                (Object.create
                    ? function (e, n, d, h) {
                          void 0 === h && (h = d),
                              Object.defineProperty(e, h, {
                                  enumerable: !0,
                                  get: function () {
                                      return n[d]
                                  }
                              })
                      }
                    : function (e, n, d, h) {
                          void 0 === h && (h = d), (e[h] = n[d])
                      }),
            h =
                (Ue && Ue.__exportStar) ||
                function (e, n) {
                    for (var h in e) "default" === h || n.hasOwnProperty(h) || d(n, e, h)
                }
        Object.defineProperty(n, "__esModule", { value: !0 }),
            (n.VTTCue = n.WebVTTRenderer = n.BoxPosition = n.CueStyleBox = n.StyleBox = void 0),
            Object.defineProperty(n, "VTTCue", {
                enumerable: !0,
                get: function () {
                    return Hi.VTTCue
                }
            })
        const p = [/^(::cue\()(\..*)(\))/, /^(::cue\()(#.*)(\))/, /^(::cue\()(c|i|b|u|ruby|rt|v|lang)(\))/],
            y = [
                [1470, 1470],
                [1472, 1472],
                [1475, 1475],
                [1478, 1478],
                [1488, 1514],
                [1520, 1524],
                [1544, 1544],
                [1547, 1547],
                [1549, 1549],
                [1563, 1563],
                [1566, 1610],
                [1645, 1647],
                [1649, 1749],
                [1765, 1766],
                [1774, 1775],
                [1786, 1805],
                [1807, 1808],
                [1810, 1839],
                [1869, 1957],
                [1969, 1969],
                [1984, 2026],
                [2036, 2037],
                [2042, 2042],
                [2048, 2069],
                [2074, 2074],
                [2084, 2084],
                [2088, 2088],
                [2096, 2110],
                [2112, 2136],
                [2142, 2142],
                [2208, 2208],
                [2210, 2220],
                [8207, 8207],
                [64285, 64285],
                [64287, 64296],
                [64298, 64310],
                [64312, 64316],
                [64318, 64318],
                [64320, 64321],
                [64323, 64324],
                [64326, 64449],
                [64467, 64829],
                [64848, 64911],
                [64914, 64967],
                [65008, 65020],
                [65136, 65140],
                [65142, 65276],
                [67584, 67589],
                [67592, 67592],
                [67594, 67637],
                [67639, 67640],
                [67644, 67644],
                [67647, 67669],
                [67671, 67679],
                [67840, 67867],
                [67872, 67897],
                [67903, 67903],
                [67968, 68023],
                [68030, 68031],
                [68096, 68096],
                [68112, 68115],
                [68117, 68119],
                [68121, 68147],
                [68160, 68167],
                [68176, 68184],
                [68192, 68223],
                [68352, 68405],
                [68416, 68437],
                [68440, 68466],
                [68472, 68479],
                [68608, 68680],
                [126464, 126467],
                [126469, 126495],
                [126497, 126498],
                [126500, 126500],
                [126503, 126503],
                [126505, 126514],
                [126516, 126519],
                [126521, 126521],
                [126523, 126523],
                [126530, 126530],
                [126535, 126535],
                [126537, 126537],
                [126539, 126539],
                [126541, 126543],
                [126545, 126546],
                [126548, 126548],
                [126551, 126551],
                [126553, 126553],
                [126555, 126555],
                [126557, 126557],
                [126559, 126559],
                [126561, 126562],
                [126564, 126564],
                [126567, 126570],
                [126572, 126578],
                [126580, 126583],
                [126585, 126588],
                [126590, 126590],
                [126592, 126601],
                [126603, 126619],
                [126625, 126627],
                [126629, 126633],
                [126635, 126651],
                [1114109, 1114109]
            ]
        class StyleBox {
            applyStyles(e, n) {
                n = n || this.div
                for (const d in e) e.hasOwnProperty(d) && (n.style[d] = e[d])
            }
            formatStyle(e, n) {
                return 0 === e ? "0" : e + n
            }
        }
        n.StyleBox = StyleBox
        class CueStyleBox extends StyleBox {
            determineBidi(e) {
                let n,
                    d = [],
                    h = ""
                if (!e || !e.childNodes) return "ltr"
                function pushNodes(e, n) {
                    for (let d = n.childNodes.length - 1; d >= 0; d--) e.push(n.childNodes[d])
                }
                function nextTextNode(e) {
                    if (!e || !e.length) return null
                    let n = e.pop(),
                        d = n.textContent || n.innerText
                    if (d) {
                        const n = /^.*(\n|\r)/.exec(d)
                        return n ? ((e.length = 0), n[0]) : d
                    }
                    return "ruby" === n.tagName
                        ? nextTextNode(e)
                        : n.childNodes
                        ? (pushNodes(e, n), nextTextNode(e))
                        : void 0
                }
                function isContainedInCharacterList(e, n) {
                    for (const d of n) if (e >= d[0] && e <= d[1]) return !0
                    return !1
                }
                for (pushNodes(d, e); (h = nextTextNode(d)); )
                    for (let e = 0; e < h.length; e++)
                        if (((n = h.charCodeAt(e)), isContainedInCharacterList(n, y))) return "rtl"
                return "ltr"
            }
            parseOpacity(e) {
                if (!e || "string" != typeof e) return null
                const n = (e = e.replace(/ /g, "").replace("rgba(", "").replace(")", "")).split(",")
                return n && n.length >= 4 ? n[3] : null
            }
            directionSettingToWritingMode(e) {
                return "" === e ? "horizontal-tb" : "lr" === e ? "vertical-lr" : "vertical-rl"
            }
            move(e) {
                this.applyStyles({
                    top: this.formatStyle(e.top, "px"),
                    bottom: this.formatStyle(e.bottom, "px"),
                    left: this.formatStyle(e.left, "px"),
                    right: this.formatStyle(e.right, "px"),
                    height: this.formatStyle(e.height, "px"),
                    width: this.formatStyle(e.width, "px")
                })
            }
            constructor(e, n, d, h, p) {
                super(), (this.cue = n)
                let y =
                    {
                        start: "left",
                        "line-left": "left",
                        left: "left",
                        center: "center",
                        middle: "center",
                        "line-right": "right",
                        right: "right",
                        end: "right"
                    }[n.positionAlign] || n.align
                "middle" === y && (y = "center")
                let m = { textAlign: y, whiteSpace: "pre-line", position: "absolute" }
                ;(m.direction = this.determineBidi(this.cueDiv)),
                    (m.writingMode = this.directionSettingToWritingMode(n.vertical)),
                    (m.unicodeBidi = "plaintext"),
                    (this.div = e.document.createElement("div")),
                    this.applyStyles(m),
                    (m = { backgroundColor: h.backgroundColor, display: "inline-block" }),
                    this.parseOpacity(m.backgroundColor) && ((m.padding = "5px"), (m.borderRadius = "5px")),
                    (this.backgroundDiv = e.document.createElement("div")),
                    this.applyStyles(m, this.backgroundDiv),
                    (m = {
                        color: d.color,
                        backgroundColor: d.backgroundColor,
                        textShadow: d.textShadow,
                        fontSize: d.fontSize,
                        fontFamily: d.fontFamily,
                        position: "relative",
                        left: "0",
                        right: "0",
                        top: "0",
                        bottom: "0",
                        display: "inline-block",
                        textOrientation: "upright"
                    }),
                    (m.writingMode = this.directionSettingToWritingMode(n.vertical)),
                    (m.unicodeBidi = "plaintext"),
                    (this.cueDiv = Vi.default.parseContent(e, n, p)),
                    this.applyStyles(m, this.cueDiv),
                    this.backgroundDiv.appendChild(this.cueDiv),
                    this.div.appendChild(this.backgroundDiv)
                let g = 0
                if ("number" == typeof n.position) {
                    let e = n.positionAlign || n.align
                    if (e)
                        switch (e) {
                            case "start":
                            case "left":
                                g = n.position
                                break
                            case "center":
                            case "middle":
                                g = n.position - n.size / 2
                                break
                            case "end":
                            case "right":
                                g = n.position - n.size
                        }
                }
                "" === n.vertical
                    ? this.applyStyles({ left: this.formatStyle(g, "%"), width: this.formatStyle(n.size, "%") })
                    : this.applyStyles({ top: this.formatStyle(g, "%"), height: this.formatStyle(n.size, "%") })
            }
        }
        n.CueStyleBox = CueStyleBox
        class BoxPosition {
            calculateNewLines(e) {
                let n = 1
                for (let d = 0; d < e.length; d++) "\n" === e[d] && n++
                return n
            }
            move(e, n) {
                switch (((n = void 0 !== n ? n : this.singleLineHeight), e)) {
                    case "+x":
                        ;(this.left += n), (this.right += n)
                        break
                    case "-x":
                        ;(this.left -= n), (this.right -= n)
                        break
                    case "+y":
                        ;(this.top += n), (this.bottom += n)
                        break
                    case "-y":
                        ;(this.top -= n), (this.bottom -= n)
                }
            }
            overlaps(e) {
                return this.left < e.right && this.right > e.left && this.top < e.bottom && this.bottom > e.top
            }
            overlapsAny(e) {
                for (const n of e) if (this.overlaps(n)) return !0
                return !1
            }
            within(e) {
                return this.top >= e.top && this.bottom <= e.bottom && this.left >= e.left && this.right <= e.right
            }
            moveIfOutOfBounds(e, n) {
                switch (n) {
                    case "+x":
                        this.left < e.left && ((this.left = e.left), (this.right = this.left + this.width))
                        break
                    case "-x":
                        this.right > e.right && ((this.right = e.right), (this.left = this.right - this.width))
                        break
                    case "+y":
                        this.top < e.top && ((this.top = e.top), (this.bottom = this.top + this.height))
                        break
                    case "-y":
                        this.bottom > e.bottom && ((this.bottom = e.bottom), (this.top = this.bottom - this.height))
                }
            }
            toCSSCompatValues(e) {
                return {
                    top: this.top - e.top,
                    bottom: e.bottom - this.bottom,
                    left: this.left - e.left,
                    right: e.right - this.right,
                    height: this.height,
                    width: this.width
                }
            }
            static getSimpleBoxPosition(e) {
                let n = null
                e instanceof StyleBox && e.div ? (n = e.div) : e instanceof HTMLElement && (n = e)
                let d = n.offsetHeight || 0,
                    h = n.offsetWidth || 0,
                    p = n.offsetTop || 0,
                    y = p + d,
                    m = n.getBoundingClientRect()
                const { left: g, right: b } = m
                return (
                    m.top && (p = m.top),
                    m.height && (d = m.height),
                    m.width && (h = m.width),
                    m.bottom && (y = m.bottom),
                    { left: g, right: b, top: p, height: d, bottom: y, width: h }
                )
            }
            static getBoxPosition(e, n) {
                if (e && e.length > 0) {
                    let d = 0,
                        h = e[0][n]
                    for (let p = 0; p < e.length; p++)
                        n in ["top", "right"]
                            ? e[p][n] > h && ((d = p), (h = e[p][n]))
                            : n in ["bottom", "left"] && e[p][n] < h && ((d = p), (h = e[p][n]))
                    return e[d]
                }
                return null
            }
            static moveToMinimumDistancePlacement(e, n, d) {
                "height" === e.property
                    ? "+y" === n
                        ? ((e.top = d.topMostBoxPosition.bottom + 0), (e.bottom = e.top + e.height))
                        : "-y" === n && ((e.bottom = d.bottomMostBoxPosition.top - 0), (e.top = e.bottom - e.height))
                    : "width" === e.property &&
                      ("+x" === n
                          ? ((e.left = d.rightMostBoxPosition.right + 0), (e.right = e.left + e.width))
                          : "-x" === n && ((e.right = d.leftMostBoxPosition.left - 0), (e.left = e.right - e.width)))
            }
            static moveBoxToLinePosition(e, n, d) {
                const h = e.cue
                let p,
                    y = new BoxPosition(e),
                    m = (function (e) {
                        if ("number" == typeof e.line && (e.snapToLines || (e.line >= 0 && e.line <= 100)))
                            return e.line
                        if (!e.track || !e.track.textTrackList || !e.track.textTrackList.mediaElement) return -1
                        let n = 0
                        const d = e.track,
                            h = d.textTrackList
                        for (let p = 0; p < h.length && h[p] !== d; p++) "showing" === h[p].mode && n++
                        return -1 * ++n
                    })(h),
                    g = []
                if (h.snapToLines) {
                    let e = 0
                    switch (h.vertical) {
                        case "":
                            ;(g = ["+y", "-y"]), (p = "height")
                            break
                        case "rl":
                            ;(g = ["+x", "-x"]), (p = "width")
                            break
                        case "lr":
                            ;(g = ["-x", "+x"]), (p = "width")
                    }
                    const d = y.lineHeight,
                        b = n[p] + d,
                        _ = g[0]
                    if (m < 0) {
                        let p = 0
                        switch (h.vertical) {
                            case "":
                                p = n.height - d - 0.05 * n.height
                                break
                            case "rl":
                            case "lr":
                                p = -n.width + d + 0.05 * n.width
                        }
                        ;(e = p), (g = g.reverse())
                    } else {
                        switch (h.vertical) {
                            case "":
                                e = d * Math.round(m)
                                break
                            case "rl":
                                e = n.width - d * Math.round(m)
                                break
                            case "lr":
                                e = d * Math.round(m)
                        }
                        Math.abs(e) > b && ((e = e < 0 ? -1 : 1), (e *= Math.ceil(b / d) * d))
                    }
                    y.move(_, e)
                } else {
                    const d = "" === h.vertical ? n.height : n.width,
                        p = (y.lineHeight / d) * 100
                    switch (h.lineAlign) {
                        case "center":
                        case "middle":
                            m -= p / 2
                            break
                        case "end":
                            m -= p
                    }
                    switch (h.vertical) {
                        case "":
                            e.applyStyles({ top: e.formatStyle(m, "%") })
                            break
                        case "rl":
                            e.applyStyles({ right: e.formatStyle(m, "%") })
                            break
                        case "lr":
                            e.applyStyles({ left: e.formatStyle(m, "%") })
                    }
                    ;(g = ["+y", "-y", "+x", "-x"]),
                        "+y" === h.axis
                            ? (g = ["+y", "-y", "+x", "-x"])
                            : "-y" === h.axis && (g = ["-y", "+y", "+x", "-x"]),
                        (y = new BoxPosition(e))
                }
                const b = (function (e, h) {
                    let p
                    for (let y = 0; y < h.length; y++) {
                        e.moveIfOutOfBounds(n, h[y])
                        let m = 0,
                            g = !1
                        for (; e.overlapsAny(d) && !(m > 9); )
                            g
                                ? e.move(h[y])
                                : (d &&
                                      d.length > 0 &&
                                      (p ||
                                          (p = {
                                              topMostBoxPosition: BoxPosition.getBoxPosition(d, "top"),
                                              bottomMostBoxPosition: BoxPosition.getBoxPosition(d, "bottom"),
                                              leftMostBoxPosition: BoxPosition.getBoxPosition(d, "left"),
                                              rightMostBoxPosition: BoxPosition.getBoxPosition(d, "right")
                                          }),
                                      BoxPosition.moveToMinimumDistancePlacement(e, h[y], p)),
                                  (g = !0)),
                                m++
                    }
                    return e
                })(y, g)
                e.move(b.toCSSCompatValues(n))
            }
            constructor(e) {
                var n
                let d, h, p, y, m, g
                if (
                    (e instanceof CueStyleBox && e.cue
                        ? (n = e.cue) && "" !== n.vertical
                            ? (this.property = "width")
                            : (this.property = "height")
                        : e instanceof BoxPosition && (this.property = e.property || "height"),
                    e instanceof CueStyleBox && e.div)
                ) {
                    ;(p = e.div.offsetHeight), (y = e.div.offsetWidth), (m = e.div.offsetTop)
                    const n = e.div.firstChild
                    if (
                        ((g = n ? n.getBoundingClientRect() : e.div.getBoundingClientRect()),
                        (d = (g && g[this.property]) || null),
                        n && n.firstChild)
                    ) {
                        const e = n.firstChild
                        if (e && "string" == typeof e.textContent) {
                            h = d / this.calculateNewLines(e.textContent)
                        }
                    }
                } else e instanceof BoxPosition && (g = e)
                ;(this.left = g.left),
                    (this.right = g.right),
                    (this.top = g.top || m),
                    (this.height = g.height || p),
                    (this.bottom = g.bottom || m + (g.height || p)),
                    (this.width = g.width || y),
                    (this.lineHeight = null !== d ? d : g.lineHeight),
                    (this.singleLineHeight = null !== h ? h : g.singleLineHeight),
                    this.singleLineHeight || (this.singleLineHeight = 41)
            }
        }
        n.BoxPosition = BoxPosition
        class WebVTTRenderer {
            initSubtitleCSS() {
                const e = [new Hi.VTTCue(0, 0, "String to init CSS - Won't be visible to user")]
                ;(this.paddedOverlay.style.opacity = "0"),
                    this.processCues(e),
                    this.processCues([]),
                    (this.paddedOverlay.style.opacity = "1")
            }
            convertCueToDOMTree(e) {
                return e ? Vi.default.parseContent(this.window, e, this.globalStyleCollection) : null
            }
            setStyles(e) {
                function applyStyles(e, n, d) {
                    for (const h in n)
                        n.hasOwnProperty(h) && ((!0 === d && void 0 !== e[h]) || !1 === d) && (e[h] = n[h])
                }
                for (const n in e) {
                    let d = !1,
                        h = null
                    "::cue" === n
                        ? ((h = this.foregroundStyleOptions), (d = !0))
                        : "::-webkit-media-text-track-display" === n && ((h = this.backgroundStyleOptions), (d = !0))
                    const y = e[n]
                    if (!0 === d) applyStyles(h, y, d)
                    else
                        for (let e = 0; e < p.length; e++) {
                            const h = p[e].exec(n)
                            if (h && 4 === h.length) {
                                const e = h[2],
                                    n = {}
                                applyStyles(n, y, d), (this.globalStyleCollection[e] = n)
                            }
                        }
                }
                this.initSubtitleCSS(),
                    this.loggingEnabled &&
                        (console.log(
                            "WebVTTRenderer setStyles foregroundStyleOptions: " +
                                JSON.stringify(this.foregroundStyleOptions)
                        ),
                        console.log(
                            "WebVTTRenderer setStyles backgroundStyleOptions: " +
                                JSON.stringify(this.backgroundStyleOptions)
                        ),
                        console.log(
                            "WebVTTRenderer setStyles globalStyleCollection: " +
                                JSON.stringify(this.globalStyleCollection)
                        ))
            }
            processCues(e) {
                if (!e) return
                for (; this.paddedOverlay.firstChild; ) this.paddedOverlay.removeChild(this.paddedOverlay.firstChild)
                if (
                    !(function (e) {
                        for (let n = 0; n < e.length; n++) if (e[n].hasBeenReset || !e[n].displayState) return !0
                        return !1
                    })(e)
                ) {
                    for (let n = 0; n < e.length; n++) this.paddedOverlay.appendChild(e[n].displayState)
                    return
                }
                const n = [],
                    d = BoxPosition.getSimpleBoxPosition(this.paddedOverlay)
                e.length > 1 &&
                    (e = (function (e) {
                        const n = []
                        let d = 0
                        for (let h = 0; h < e.length; h++) {
                            let p = e[h]
                            if ("number" != typeof p.line) return e
                            ;(d += p.line), n.push(p)
                        }
                        return (
                            (d /= e.length),
                            d > 50
                                ? (n.forEach(function (e) {
                                      e.axis = "-y"
                                  }),
                                  n.sort((e, n) => n.line - e.line))
                                : (n.forEach(function (e) {
                                      e.axis = "+y"
                                  }),
                                  n.sort((e, n) => e.line - n.line)),
                            n
                        )
                    })(e))
                for (let h = 0; h < e.length; h++) {
                    let p = e[h],
                        y = new CueStyleBox(
                            this.window,
                            p,
                            this.foregroundStyleOptions,
                            this.backgroundStyleOptions,
                            this.globalStyleCollection
                        )
                    this.paddedOverlay.appendChild(y.div),
                        BoxPosition.moveBoxToLinePosition(y, d, n),
                        (p.displayState = y.div),
                        n.push(BoxPosition.getSimpleBoxPosition(y))
                }
            }
            setSize(e, n) {
                e && (this.overlay.style.width = e + "px"), n && (this.overlay.style.height = n + "px")
            }
            getOverlay() {
                return this.overlay
            }
            constructor(e, n, d = !0) {
                if (!e) return null
                ;(this.window = e),
                    (this.overlay = n),
                    (this.loggingEnabled = d),
                    (this.foregroundStyleOptions = {
                        fontFamily: "Helvetica",
                        fontSize: "36px",
                        color: "rgba(255, 255, 255, 1)",
                        textShadow: "",
                        backgroundColor: "rgba(0, 0, 0, 0)"
                    }),
                    (this.backgroundStyleOptions = { backgroundColor: "rgba(0, 0, 0, 0.5)" }),
                    (this.globalStyleCollection = {})
                const h = e.document.createElement("div")
                ;(h.style.position = "absolute"),
                    (h.style.left = "0"),
                    (h.style.right = "0"),
                    (h.style.top = "0"),
                    (h.style.bottom = "0"),
                    (h.style.margin = "1.5%"),
                    (this.paddedOverlay = h),
                    n.appendChild(this.paddedOverlay),
                    this.initSubtitleCSS()
            }
        }
        ;(n.default = WebVTTRenderer), (n.WebVTTRenderer = WebVTTRenderer), h(Wi, n)
    })
    unwrapExports(zi), zi.VTTCue, zi.WebVTTRenderer, zi.BoxPosition, zi.CueStyleBox, zi.StyleBox
    var Qi = createCommonjsModule(function (e, n) {
        var d =
                (Ue && Ue.__createBinding) ||
                (Object.create
                    ? function (e, n, d, h) {
                          void 0 === h && (h = d),
                              Object.defineProperty(e, h, {
                                  enumerable: !0,
                                  get: function () {
                                      return n[d]
                                  }
                              })
                      }
                    : function (e, n, d, h) {
                          void 0 === h && (h = d), (e[h] = n[d])
                      }),
            h =
                (Ue && Ue.__exportStar) ||
                function (e, n) {
                    for (var h in e) "default" === h || n.hasOwnProperty(h) || d(n, e, h)
                }
        Object.defineProperty(n, "__esModule", { value: !0 }), h(Yi, n), h(zi, n)
    })
    unwrapExports(Qi)
    var Ji = Qi.WebVTTRenderer
    const {
            audioTrackAdded: Xi,
            audioTrackChanged: Zi,
            forcedTextTrackChanged: ea,
            textTrackAdded: ta,
            textTrackChanged: ra,
            textTrackRemoved: na
        } = ur,
        { textTracksSwitched: ia, textTracksUpdated: aa, inlineStylesParsed: sa } = Yt
    class TextTrackManager {
        get currentTrack() {
            return this.tracks.find((e) => "showing" === e.mode)
        }
        set currentTrack(e) {
            if (!e) return
            let n
            this.trackPersistence.setPersistedTrack(e),
                this.extensionTracks
                    ? (Rt.debug("MEDIA_TRACK Setting track on extension " + e.label),
                      "Off" === e.label
                          ? (this.clearCurrentlyPlayingTrack(),
                            (n = this.extensionTracks.selectForcedTrack()),
                            void 0 === n && this.onExtensionTextTrackSwitched({ track: e }))
                          : (this.extensionTracks.textTrack = e))
                    : (Rt.debug("MEDIA_TRACK Setting track on element " + e.label),
                      this._tracks.forEach((n) => {
                          n !== e && "showing" === n.mode && (n.mode = "disabled")
                      }),
                      e &&
                          (Rt.debug("MEDIA_TRACK setting track mode to showing for " + e.label),
                          this.isTrackOff(e)
                              ? ((this._tracks[0].mode = "showing"),
                                (n = this.selectNativeForcedTrack(this.mediaElement.audioTracks)))
                              : (e.mode = "showing"))),
                this.dispatcher.publish(ur.forcedTextTrackChanged, n)
        }
        get tracks() {
            return this._tracks
        }
        destroy() {
            if ((this.clearCurrentlyPlayingTrack(), this.extensionTracks)) {
                const e = this.extensionTracks
                e.removeEventListener(aa, this.onExtensionTextTracksAdded),
                    e.removeEventListener(ia, this.onExtensionTextTrackSwitched),
                    e.removeEventListener(sa, this.onExtensionInlineStylesParsed)
            } else this.mediaElement.textTracks.removeEventListener("addtrack", this.onTextTrackAdded), this.mediaElement.textTracks.removeEventListener("change", this.onTextTrackChanged), this.mediaElement.textTracks.removeEventListener("removetrack", this.onTextTrackRemoved), this.mediaElement.removeEventListener("playing", this.onPlayStart)
            this.dispatcher.unsubscribe(Zi, this.onAudioTrackAddedOrChanged),
                this.dispatcher.unsubscribe(Xi, this.onAudioTrackAddedOrChanged)
        }
        restoreSelectedTrack() {
            return restoreSelectedTrack(this.trackPersistence, this)
        }
        onExtensionInlineStylesParsed(e) {
            Rt.debug("MEDIA_TRACK Extension inline styles parsed", e), this.renderer.setStyles(e.styles)
        }
        onExtensionTextTracksAdded(e) {
            Rt.debug("MEDIA_TRACK Extension text tracks updated " + JSON.stringify(e)),
                this._tracks.push(...e),
                this.restoreSelectedTrack(),
                this.dispatcher.publish(ta, e)
        }
        onExtensionTextTrackSwitched(e) {
            Rt.debug("MEDIA_TRACKS Extension text track switched " + e), this.handleVTT(e)
            const n = e.track
            if (this._tracks) {
                const preserveSelectedTrack = (d) => {
                    e.track
                        ? (n.forced && "Off" === d.label) || ("Off" === n.label && "Off" === d.label)
                            ? (d.mode = "showing")
                            : (d.mode = e.track.persistentID === d.id ? "showing" : "disabled")
                        : (d.mode = "Off" === d.label ? "showing" : "disabled")
                }
                this._tracks.forEach(preserveSelectedTrack)
            }
            this.dispatcher.publish(ra, e)
        }
        handleVTT(e) {
            const n = e && e.track && e.track.id
            if (void 0 !== n && n >= 0) {
                const e = this.filterSelectableTextTracks(this.mediaElement.textTracks)[n]
                this.onNativeTrackChange(e)
            } else this.clearCurrentlyPlayingTrack()
        }
        onAudioTrackAddedOrChanged(e, n) {
            if ((Rt.debug("MEDIA_TRACKS text track manager detects audio track change"), this.shouldForceSubtitle()))
                if (this.extensionTracks) {
                    Rt.debug("MEDIA_TRACKS selecting forced text track via extension")
                    const e = this.extensionTracks.selectForcedTrack()
                    e ? this.dispatcher.publish(ea, e) : this.clearCurrentlyPlayingTrack()
                } else
                    Rt.debug("MEDIA_TRACKS selecting forced text track natively"), (this.currentTrack = this._tracks[0])
        }
        onTextTrackAdded(e) {
            this._tracks.push(e.track), this.dispatcher.publish(ta, e)
        }
        onPlayStart() {
            this.restoreSelectedTrack()
        }
        onTextTrackRemoved(e) {
            this.dispatcher.publish(na, e)
        }
        onTextTrackChanged(e) {
            const n = this.findNativeSelectedTextTrack()
            let d = this.trackPersistence.getPersistedTrack()
            if ((d || (d = this._tracks[0]), n && !trackEquals(n, d, this.trackPersistence.fields)))
                if (this.isTrackOff(d) && "forced" !== n.kind) this.currentTrack = d
                else {
                    const e = this.findNativeTrack(d)
                    e && (this.currentTrack = e)
                }
            else this.dispatcher.publish(ra, e)
        }
        findNativeSelectedTextTrack() {
            for (let e = 0; e < this.mediaElement.textTracks.length; e++) {
                const n = this.mediaElement.textTracks[e]
                if ("showing" === n.mode) return n
            }
        }
        findNativeTrack(e) {
            for (let n = 0; n < this.mediaElement.textTracks.length; n++) {
                const d = this.mediaElement.textTracks[n]
                if (trackEquals(d, e, this.trackPersistence.fields)) return d
            }
        }
        selectNativeForcedTrack(e) {
            for (let n = 0; n < e.length; n++) {
                const d = e[n]
                if (d.enabled) {
                    const e = this.findNativeForcedTrack(d)
                    return e && "showing" !== e.mode && (e.mode = "showing"), e
                }
            }
        }
        findNativeForcedTrack(e) {
            const n = this.mediaElement.textTracks
            for (let d = 0; d < n.length; d++) {
                const h = n[d]
                if ("forced" === h.kind && h.language === e.language) return h
            }
        }
        onNativeTrackChange(e) {
            this.clearCurrentlyPlayingTrack(),
                (this._currentlyPlayingTrack = e),
                e.addEventListener("cuechange", this.onCueChange)
        }
        clearCurrentlyPlayingTrack() {
            var e
            void 0 !== this._currentlyPlayingTrack &&
                "string" == typeof (e = this._currentlyPlayingTrack).id &&
                "removeEventListener" in e &&
                (this._currentlyPlayingTrack.removeEventListener("cuechange", this.onCueChange),
                this.renderer.processCues({}),
                delete this._currentlyPlayingTrack)
        }
        onCueChange(e) {
            const n = e && e.target && e.target.activeCues
            n && this.renderer.processCues(n)
        }
        filterSelectableTextTracks(e) {
            const n = []
            for (let d = 0; d < e.length; d++) {
                const h = e[d]
                ;("captions" === h.kind ||
                    "subtitles" === h.kind ||
                    ("metadata" === h.kind && h.customTextTrackCueRenderer)) &&
                    n.push(h)
            }
            return n
        }
        shouldForceSubtitle() {
            Rt.debug("MEDIA_TRACKS Determining whether to select forced text track")
            const e = this.trackPersistence.getPersistedTrack()
            return !e || this.isTrackOff(e)
        }
        isTrackOff(e) {
            return "Off" === e.label || "Auto" === e.label
        }
        constructor(e, n, d) {
            ;(this.mediaElement = e),
                (this.dispatcher = n),
                (this.extensionTracks = d),
                (this._tracks = []),
                (this.trackPersistence = new TrackPersistence("mk-text-track", ["label", "language", "kind"]))
            const h = this.trackPersistence.getPersistedTrack()
            if (
                (this._tracks.push({
                    id: -2,
                    label: "Off",
                    language: "",
                    kind: "subtitles",
                    mode: !h || this.isTrackOff(h) ? "showing" : "disabled"
                }),
                this.extensionTracks)
            ) {
                Rt.debug("MEDIA_TRACK Initializing text track manager for HLS.js track events")
                const n = e.parentElement
                ;(this.renderer = new Ji(window, n, !1)),
                    this.renderer.setStyles({ "::cue": { fontSize: "calc(1vw + 1em)" } }),
                    (this.onExtensionTextTracksAdded = this.onExtensionTextTracksAdded.bind(this)),
                    (this.onExtensionTextTrackSwitched = this.onExtensionTextTrackSwitched.bind(this)),
                    (this.onExtensionInlineStylesParsed = this.onExtensionInlineStylesParsed.bind(this)),
                    (this.onCueChange = this.onCueChange.bind(this))
                const d = this.extensionTracks
                d.addEventListener(aa, this.onExtensionTextTracksAdded),
                    d.addEventListener(ia, this.onExtensionTextTrackSwitched),
                    d.addEventListener(sa, this.onExtensionInlineStylesParsed)
            } else Rt.debug("MEDIA_TRACK Initializing text track manager for native track events"), (this.onTextTrackAdded = this.onTextTrackAdded.bind(this)), (this.onTextTrackChanged = this.onTextTrackChanged.bind(this)), (this.onTextTrackRemoved = this.onTextTrackRemoved.bind(this)), (this.onPlayStart = this.onPlayStart.bind(this)), e.textTracks.addEventListener("addtrack", this.onTextTrackAdded), e.textTracks.addEventListener("change", this.onTextTrackChanged), e.textTracks.addEventListener("removetrack", this.onTextTrackRemoved), e.addEventListener("playing", this.onPlayStart)
            ;(this.onAudioTrackAddedOrChanged = debounce(this.onAudioTrackAddedOrChanged.bind(this))),
                n.subscribe(Zi, this.onAudioTrackAddedOrChanged),
                n.subscribe(Xi, this.onAudioTrackAddedOrChanged)
        }
    }
    function asyncGeneratorStep$Q(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$Q(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$Q(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$Q(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$q(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    var oa =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ca =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const la = { "picture-in-picture": e.PresentationMode.pictureinpicture, inline: e.PresentationMode.inline },
        ua = {}
    ;(ua[e.PresentationMode.pictureinpicture] = "picture-in-picture"), (ua[e.PresentationMode.inline] = "inline")
    const { presentationModeDidChange: da } = ur,
        { playbackLicenseError: ha } = Yt,
        { stopped: pa } = e.PlaybackStates
    class VideoPlayer extends BasePlayer {
        get audioTracks() {
            return this._audioTrackManager.tracks
        }
        get containerElement() {
            return this._context.videoContainerElement
                ? this._context.videoContainerElement
                : document.getElementById("apple-music-video-container")
        }
        get currentAudioTrack() {
            return this._audioTrackManager.currentTrack
        }
        set currentAudioTrack(e) {
            this._audioTrackManager.currentTrack = e
        }
        get currentTextTrack() {
            return this._textTrackManager.currentTrack
        }
        set currentTextTrack(e) {
            this._textTrackManager.currentTrack = e
        }
        get _targetElement() {
            return (
                this.video ||
                (function (e) {
                    for (var n = 1; n < arguments.length; n++) {
                        var d = null != arguments[n] ? arguments[n] : {},
                            h = Object.keys(d)
                        "function" == typeof Object.getOwnPropertySymbols &&
                            (h = h.concat(
                                Object.getOwnPropertySymbols(d).filter(function (e) {
                                    return Object.getOwnPropertyDescriptor(d, e).enumerable
                                })
                            )),
                            h.forEach(function (n) {
                                _defineProperty$q(e, n, d[n])
                            })
                    }
                    return e
                })({}, document.createElement("video"))
            )
        }
        get textTracks() {
            return this._textTrackManager.tracks
        }
        initializeExtension() {
            var e = this
            return _asyncToGenerator$Q(function* () {
                e.restrictPlatforms && Gt.isAndroid
                    ? Rt.warn("videoPlayer.initializeExtension Not supported on the current platform")
                    : e.video || Rt.warn("videoPlayer.initializeExtension No video element, not initializing extension")
            })()
        }
        onPlaybackLicenseError(e) {
            this.resetDeferredPlay(), this._dispatcher.publish(ha, e)
        }
        setupTrackManagers(e) {
            var n, d, h, p
            null === (n = this._textTrackManager) ||
                void 0 === n ||
                null === (d = n.destroy) ||
                void 0 === d ||
                d.call(n),
                (this._textTrackManager = new TextTrackManager(this._targetElement, this._dispatcher, e)),
                null === (h = this._audioTrackManager) ||
                    void 0 === h ||
                    null === (p = h.destroy) ||
                    void 0 === p ||
                    p.call(h),
                (this._audioTrackManager = new AudioTrackManager(this._targetElement, this._dispatcher, e))
        }
        destroy() {
            this.finishPlaybackSequence(),
                this._textTrackManager.destroy(),
                this._audioTrackManager.destroy(),
                super.destroy()
        }
        initializeEventHandlers() {
            var e = this,
                _superprop_get_initializeEventHandlers = () => super.initializeEventHandlers
            return _asyncToGenerator$Q(function* () {
                _superprop_get_initializeEventHandlers().call(e),
                    e.hasMediaElement &&
                        (e._targetElement.addEventListener("webkitpresentationmodechanged", e.pipEventHandler),
                        e._targetElement.addEventListener("enterpictureinpicture", e.pipEventHandler),
                        e._targetElement.addEventListener("leavepictureinpicture", e.pipEventHandler))
            })()
        }
        removeEventHandlers() {
            if ((super.removeEventHandlers(), !this.hasMediaElement)) return
            const { _targetElement: e } = this
            e.removeEventListener("webkitpresentationmodechanged", this.pipEventHandler),
                e.removeEventListener("enterpictureinpicture", this.pipEventHandler),
                e.removeEventListener("leavepictureinpicture", this.pipEventHandler)
        }
        initializeMediaElement() {
            var e = this
            return _asyncToGenerator$Q(function* () {
                Rt.debug("videoPlayer.initializeMediaElement Initializing media element")
                const n = e.containerElement
                n
                    ? ((e.video = (function () {
                          let e = qt.pop()
                          return (
                              e
                                  ? Rt.debug(`dom-helpers: retrieving video tag, ${qt.length} remain`)
                                  : (Rt.debug("dom-helpers: no available video tags, creating one"),
                                    (e = document.createElement("video"))),
                              e
                          )
                      })()),
                      (e.video.autoplay = !1),
                      (e.video.controls = !1),
                      (e.video.playsInline = !0),
                      (e.video.id = "apple-music-video-player"),
                      n.appendChild(e.video))
                    : Rt.warn("videoPlayer.initializeMediaElement No video element; no container defined")
            })()
        }
        isPlayerSupported() {
            return Browser.supportsEs6()
        }
        _stopMediaElement() {
            var e = this,
                _superprop_get__stopMediaElement = () => super._stopMediaElement
            return _asyncToGenerator$Q(function* () {
                yield _superprop_get__stopMediaElement().call(e), e.destroy()
            })()
        }
        pipEventHandler(n) {
            switch (n.type) {
                case "enterpictureinpicture":
                    this._dispatcher.publish(da, { mode: e.PresentationMode.pictureinpicture })
                    break
                case "leavepictureinpicture":
                    this._dispatcher.publish(da, { mode: e.PresentationMode.inline })
                    break
                case "webkitpresentationmodechanged": {
                    const e = this._targetElement
                    this._dispatcher.publish(da, {
                        mode: this._translateStringToPresentationMode(e.webkitPresentationMode)
                    })
                    break
                }
            }
        }
        playItemFromEncryptedSource(n, d = !1, h = {}) {
            var p = this
            return _asyncToGenerator$Q(function* () {
                if ((Rt.debug("videoPlayer.playItemFromEncryptedSource", n, d), p.playbackState === pa))
                    return void Rt.debug(
                        "video-player.playItemFromEncryptedSource aborting playback because player is stopped"
                    )
                ;(n.playbackType = e.PlaybackType.encryptedFull),
                    (p.nowPlayingItem = n),
                    (n.state = $.loading),
                    (p.userInitiated = d)
                const y = generateAssetUrl(n, h)
                yield p.playHlsStream(y, n, h)
            })()
        }
        playItemFromUnencryptedSource(e, n, d) {
            var h = this
            return _asyncToGenerator$Q(function* () {
                if ((Rt.debug("videoPlayer.playItemFromUnencryptedSource", e, n), h.playbackState === pa))
                    return void Rt.debug(
                        "videoPlayer.playItemFromUnencryptedSource aborting playback because player is stopped"
                    )
                const [d] = e.split("?")
                d.endsWith("m3u") || d.endsWith("m3u8") ? yield h.playHlsStream(e) : yield h._playAssetURL(e, n)
            })()
        }
        setPresentationMode(n) {
            var d = this
            return _asyncToGenerator$Q(function* () {
                const h = d._targetElement
                if (h.webkitSupportsPresentationMode && "function" == typeof h.webkitSetPresentationMode)
                    return h.webkitSetPresentationMode(d._translatePresentationModeToString(n))
                if (h.requestPictureInPicture && document.exitPictureInPicture) {
                    if (n === e.PresentationMode.pictureinpicture) return h.requestPictureInPicture()
                    if (n === e.PresentationMode.inline) return document.exitPictureInPicture()
                }
            })()
        }
        _translateStringToPresentationMode(n) {
            let d = la[n]
            return (
                void 0 === d &&
                    (Rt.warn(
                        `videoPlayer._translateStringToPresentationMode ${n} is not a valid presentation mode, setting to inline`
                    ),
                    (d = e.PresentationMode.inline)),
                d
            )
        }
        _translatePresentationModeToString(e) {
            let n = ua[e]
            return (
                void 0 === n &&
                    (Rt.warn(
                        `videoPlayer._translatePresentationModeToString ${e} is not a valid presentation mode, setting to inline`
                    ),
                    (n = "inline")),
                n
            )
        }
        setNextSeamlessItem(e) {
            return _asyncToGenerator$Q(function* () {})()
        }
        constructor(e) {
            super(e),
                (this.mediaPlayerType = "video"),
                (this._textTrackManager = new TrackManagerStub()),
                (this._audioTrackManager = new TrackManagerStub()),
                (this._shouldLoadManifestsOnce = !1),
                (this.userInitiated = !1),
                (this.restrictPlatforms = !("restrict-platforms" in Ft.features) || Ft.features["restrict-platforms"]),
                (this.pipEventHandler = this.pipEventHandler.bind(this)),
                (this._shouldLoadManifestsOnce = shouldLoadManifestOnce())
        }
    }
    oa(
        [Bind(), ca("design:type", Function), ca("design:paramtypes", [void 0])],
        VideoPlayer.prototype,
        "onPlaybackLicenseError",
        null
    )
    const decayingOperation = (e, n, d, h = 0) =>
        e().catch((p) => {
            const y = h + 1
            function possiblyRetry(h) {
                if (h && y < 3) {
                    const h = 1e3 * y
                    return new Promise((p, m) => {
                        setTimeout(() => {
                            decayingOperation(e, n, d, y).then(p, m)
                        }, h)
                    })
                }
                throw p
            }
            const m = n(p)
            return "boolean" == typeof m ? possiblyRetry(m) : m.then(possiblyRetry)
        })
    let ya = { developerToken: "developerTokenNotSet", musicUserToken: "musicUserTokenNotSet", cid: "cidNotSet" }
    function asyncGeneratorStep$P(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$P(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$P(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$P(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$p(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$p(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$p(e, n, d[n])
                })
        }
        return e
    }
    function createHlsOffersLicenseChallengeBody(e) {
        return { "adam-id": e.id, id: 1 }
    }
    function createStreamingKeysLicenseChallengeBody(e, n, d = 0) {
        var h
        return _objectSpread$p(
            { id: d, "lease-action": n },
            null !== (h = e.keyServerQueryParameters) && void 0 !== h ? h : {}
        )
    }
    function createLicenseChallengeBody(e, n, d, h, p, y, m) {
        let g
        const b = { challenge: h.challenge || ke(h.licenseChallenge), "key-system": p, uri: h.keyuri }
        return (
            m && (b["extended-lease"] = m),
            (g = d.isUTS
                ? e.startsWith("https://play.itunes.apple.com/WebObjects/MZPlay.woa/web/video/subscription/license")
                    ? _objectSpread$p(
                          {},
                          b,
                          (function (e, n = "start") {
                              return { "extra-server-parameters": e.keyServerQueryParameters, "license-action": n }
                          })(d, n)
                      )
                    : {
                          "streaming-request": {
                              version: 1,
                              "streaming-keys": [_objectSpread$p({}, b, createStreamingKeysLicenseChallengeBody(d, n))]
                          }
                      }
                : d.isLiveRadioStation
                ? _objectSpread$p(
                      {},
                      b,
                      (function (e) {
                          return { event: e.isLiveAudioStation ? "beats1" : "amtv" }
                      })(d)
                  )
                : d.hasOffersHlsUrl
                ? { "license-requests": [_objectSpread$p({}, b, createHlsOffersLicenseChallengeBody(d))] }
                : _objectSpread$p(
                      {},
                      b,
                      (function (e, n = !1) {
                          return { adamId: e.songId, isLibrary: e.isCloudItem, "user-initiated": n }
                      })(d, y)
                  )),
            g
        )
    }
    class License {
        fetch(e) {
            const n = {
                Authorization: "Bearer " + ya.developerToken,
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Apple-Music-User-Token": "" + ya.musicUserToken
            }
            this.keySystem === Bt.WIDEVINE && (n["X-Apple-Renewal"] = !0)
            const d = new Headers(n)
            return decayingOperation(
                () => fetch(this.licenseUrl, { method: "POST", body: JSON.stringify(e), headers: d }),
                (e) => e instanceof TypeError,
                "license fetch"
            )
        }
        reset() {
            ;(this.licenseUrl = void 0),
                (this.playableItem = void 0),
                (this.data = void 0),
                (this.initiated = void 0),
                (this.keySystem = void 0),
                (this.startResponse = void 0)
        }
        start(e, n, d, h, p = !1, y = !1) {
            var m = this
            return _asyncToGenerator$P(function* () {
                ;(m.licenseUrl = e), (m.playableItem = n), (m.data = d), (m.keySystem = h), (m.initiated = p)
                const g = d.isRenewalRequest ? "renew" : "start",
                    b = createLicenseChallengeBody(e, g, n, d, h, p, y)
                n.hasOffersHlsUrl && (m.licenseUrl += "/" + g), (m.startResponse = m.fetch(b))
                try {
                    var _, T, S
                    const e = yield m.startResponse
                    if (!e.ok) {
                        let n
                        try {
                            n = yield e.json()
                        } catch (Mr) {}
                        m.processJsonError(n)
                    }
                    const n = yield e.json()
                    let d = n
                    var P
                    return (
                        (
                            null == n ||
                            null === (_ = n["streaming-response"]) ||
                            void 0 === _ ||
                            null === (T = _["streaming-keys"]) ||
                            void 0 === T
                                ? void 0
                                : T.length
                        )
                            ? (d = n["streaming-response"]["streaming-keys"][0])
                            : (null == n || null === (S = n["license-responses"]) || void 0 === S
                                  ? void 0
                                  : S.length) && (d = n["license-responses"][0]),
                        (d.status = null !== (P = d.status) && void 0 !== P ? P : d.errorCode),
                        0 !== d.status && m.processJsonError(d),
                        d
                    )
                } catch (Y) {
                    throw ((m.startResponse = void 0), Y)
                }
            })()
        }
        processJsonError(e) {
            let n = new MKError(MKError.MEDIA_LICENSE, "Error acquiring license")
            if (
                ((null == e ? void 0 : e.errorCode) && (e.status = e.errorCode),
                -1021 === (null == e ? void 0 : e.status) && (e.status = 190121),
                e && 0 !== e.status)
            ) {
                if (!e.message)
                    switch (e.status) {
                        case -1004:
                            e.message = MKError.DEVICE_LIMIT
                            break
                        case -1017:
                            e.message = MKError.GEO_BLOCK
                            break
                        default:
                            e.message = MKError.MEDIA_LICENSE
                    }
                ;(n = MKError.serverError(e)),
                    (n.data = e),
                    n.errorCode === MKError.PLAYREADY_CBC_ENCRYPTION_ERROR &&
                        (function () {
                            const e = getSessionStorage()
                            e && e.setItem("mk-playready-cbcs-unsupported", "true")
                        })()
            }
            throw n
        }
        stop() {
            var e = this
            return _asyncToGenerator$P(function* () {
                if (e.startResponse)
                    try {
                        yield e.startResponse
                    } catch (Y) {}
                if (!e.playableItem || !e.data || !e.licenseUrl) return
                if (!e.playableItem.isUTS) return
                const n = createLicenseChallengeBody(
                        e.licenseUrl,
                        "stop",
                        e.playableItem,
                        e.data,
                        e.keySystem,
                        e.initiated
                    ),
                    d = e.fetch(n)
                e.reset()
                try {
                    yield d
                } catch (h) {
                    Rt.warn("license.stop request error", h)
                }
            })()
        }
    }
    function asyncGeneratorStep$O(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$O(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$O(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$O(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    var fa =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ma =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class KeySession extends Notifications {
        get extID() {
            if (this.extURI) return this.extURI.replace("data:;base64,", "")
        }
        get isFairplay() {
            return this.keySystem === Bt.FAIRPLAY
        }
        get isPlayReady() {
            return this.keySystem === Bt.PLAYREADY
        }
        get isWidevine() {
            return this.keySystem === Bt.WIDEVINE
        }
        acquirePlaybackLicense(e, n, d, h) {
            var p = this
            return _asyncToGenerator$O(function* () {
                if (!p.keyServerURL || !p.developerToken || !p.userToken) return
                const { keyServerURL: d, keySystem: y } = p,
                    m = h.item
                try {
                    return yield p.license.start(
                        d,
                        m,
                        { challenge: n, keyuri: e },
                        y,
                        p.initiated,
                        p.isLegacyEme && m.isUTS
                    )
                } catch (Mr) {
                    p.dispatchEvent(Yt.playbackLicenseError, Mr)
                }
            })()
        }
        startLicenseSession(e) {
            var n = this
            return _asyncToGenerator$O(function* () {
                let d
                Rt.debug("Starting License Session", e)
                const { message: h, target: p, messageType: y } = e
                if (n.keySystem !== Bt.FAIRPLAY && "license-request" !== y)
                    return void Rt.debug("not making license request for", y)
                if (n.isPlayReady) {
                    const e = String.fromCharCode.apply(null, new Uint16Array(h.buffer || h))
                    d = new DOMParser().parseFromString(e, "application/xml").getElementsByTagName("Challenge")[0]
                        .childNodes[0].nodeValue
                } else d = ke(new Uint8Array(h))
                const m = p.extURI || n.extURI,
                    g = n.mediaKeySessions[m]
                if (!g) return void Rt.debug("no key session info, aborting license request")
                const b = n.acquirePlaybackLicense(m, d, n.initiated, g)
                if (g.delayCdmUpdate) g["license-json"] = b
                else {
                    const e = yield b
                    yield n.handleLicenseJson(e, p, m)
                }
            })()
        }
        setKeyURLs(e) {
            ;(this.keyCertURL = e[this.isFairplay ? "hls-key-cert-url" : "widevine-cert-url"]),
                (this.keyServerURL = e["hls-key-server-url"])
        }
        dispatchKeyError(e) {
            var n, d
            this.isFairplay &&
            4294955417 ===
                (null == e || null === (n = e.target) || void 0 === n || null === (d = n.error) || void 0 === d
                    ? void 0
                    : d.systemCode)
                ? Rt.error("Ignoring error", e)
                : (console.error(MKError.MEDIA_KEY + " error in dispatchKeyError:", e),
                  this.dispatchEvent(Yt.playbackSessionError, new MKError(MKError.MEDIA_KEY, e)))
        }
        dispatchSessionError(e) {
            this.dispatchEvent(Yt.playbackSessionError, new MKError(MKError.MEDIA_SESSION, e))
        }
        loadCertificateBuffer() {
            var e = this
            return _asyncToGenerator$O(function* () {
                if (!e.keyCertURL) return Promise.reject(new MKError(MKError.MEDIA_SESSION, "No certificate URL"))
                const n = yield fetch(`${e.keyCertURL}?t=${Date.now()}`),
                    d = yield n.arrayBuffer(),
                    h = String.fromCharCode.apply(String, new Uint8Array(d))
                return /^\<\?xml/.test(h)
                    ? Promise.reject(new MKError(MKError.MEDIA_CERTIFICATE, "Invalid certificate."))
                    : d
            })()
        }
        handleSessionCreation(e) {
            var n = this
            return _asyncToGenerator$O(function* () {
                return n.createSession(e).catch((e) => {
                    n.dispatchSessionError(e)
                })
            })()
        }
        handleLicenseJson(e, n, d) {
            var h = this
            return _asyncToGenerator$O(function* () {
                if ((Rt.debug(`updating session ${d} with license response`, e), null == e ? void 0 : e.license)) {
                    const d = Se(e.license)
                    try {
                        yield n.update(d)
                    } catch (Mr) {
                        Rt.error("Failed to updated media keys", Mr), h.dispatchKeyError(Mr)
                    }
                }
            })()
        }
        addMediaKeySessionInfo(e, n, d, h = !1) {
            const p = this.mediaKeySessions[e]
            p
                ? (Rt.debug(
                      `keySession info exists for ${d.title}, making existing session ${p.session.sessionId} the old session`
                  ),
                  (p.oldSession = p.session),
                  (p.session = n))
                : (Rt.debug("creating key session info for " + d.title),
                  (this.mediaKeySessions[e] = { session: n, item: d, delayCdmUpdate: h }))
        }
        stopLicenseSession() {
            Rt.info("key session sending license stop"), this.license.stop()
        }
        constructor() {
            super([Yt.playbackLicenseError, Yt.playbackSessionError]),
                (this.initiated = !0),
                (this.isLibrary = !1),
                (this.keySystem = Bt.FAIRPLAY),
                (this.isLegacyEme = !1),
                (this.mediaKeySessions = {}),
                (this.boundDispatchKeyError = this.dispatchKeyError.bind(this)),
                (this.boundDispatchSessionError = this.dispatchSessionError.bind(this)),
                (this.boundHandleSessionCreation = this.handleSessionCreation.bind(this)),
                (this.boundStartLicenseSession = this.startLicenseSession.bind(this)),
                (this.license = new License())
        }
    }
    function asyncGeneratorStep$N(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$N(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$N(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$N(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    fa(
        [Bind(), ma("design:type", Function), ma("design:paramtypes", [void 0])],
        KeySession.prototype,
        "startLicenseSession",
        null
    )
    var ga =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        va =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class FairplayEncryptedSession extends KeySession {
        attachMedia(e, n) {
            var d = this
            return _asyncToGenerator$N(function* () {
                ;(d.keySystem = n.keySystem),
                    (d._keySystemAccess = n),
                    e.addEventListener("encrypted", d.boundHandleSessionCreation, !1)
            })()
        }
        detachMedia(e) {
            e.removeEventListener("encrypted", this.boundHandleSessionCreation)
            const n = this._mediaKeySessions,
                d = this._mediaKeySessionRenewals
            Object.values(n).forEach((e) => {
                e.removeEventListener("message", this.boundStartLicenseSession), asAsync(e.close())
            }),
                (this._mediaKeySessions = {}),
                Object.values(d).forEach((e) => clearTimeout(e)),
                (this._mediaKeySessionRenewals = {})
        }
        createSession(e) {
            var n = this
            return _asyncToGenerator$N(function* () {
                Rt.debug("fairplay eme:  createSession", e)
                const d = n._keySystemAccess
                if (!d) return
                const { initData: h, target: p, initDataType: y } = e
                var m
                n._mediaKeysPromise ||
                    (n._mediaKeysPromise = new Promise(
                        ((m = _asyncToGenerator$N(function* (e, h) {
                            const y = yield d.createMediaKeys()
                            try {
                                yield p.setMediaKeys(y), (n._mediaKeys = y)
                                const e = yield n.loadCertificateBuffer()
                                yield y.setServerCertificate(e)
                            } catch (Y) {
                                n.dispatchKeyError(Y), h(Y)
                            }
                            e(y)
                        })),
                        function (e, n) {
                            return m.apply(this, arguments)
                        })
                    ))
                const g = yield n._mediaKeysPromise,
                    b = new Uint8Array(h),
                    _ = String.fromCharCode.apply(void 0, Array.from(b))
                if (n.mediaKeySessions[_]) return void Rt.error("fairplay eme: not creating new session for extURI", _)
                const T = g.createSession()
                Rt.debug("fairplay eme: creating new key session for", _),
                    n.addMediaKeySessionInfo(_, T, n.item),
                    T.addEventListener("message", n.startFairplayLicenseSession),
                    (T.extURI = _),
                    yield T.generateRequest(y, h),
                    (n._mediaKeySessions[T.sessionId] = T),
                    Rt.debug("fairplay eme: created session", T)
            })()
        }
        startFairplayLicenseSession(e) {
            const { message: n, target: d } = e,
                h = ke(new Uint8Array(n)),
                p = d.extURI || this.extURI,
                y = this.mediaKeySessions[p]
            if (y)
                return this.acquirePlaybackLicense(p, h, this.initiated, y).then((e) => this.handleLicenseJson(e, d, p))
            Rt.debug("fairplay eme: no key session info, aborting license request", p)
        }
        handleLicenseJson(e, n, d) {
            var h = this,
                _superprop_get_handleLicenseJson = () => super.handleLicenseJson
            return _asyncToGenerator$N(function* () {
                if (!e) return
                const p = h.mediaKeySessions[d]
                if (!p) return void Rt.debug("fairplay eme: media key session does not exist, not updating")
                const y = e["renew-after"]
                if (e.license && y) {
                    Rt.debug("fairplay eme: got renew after value", y, d)
                    const e = h._mediaKeySessionRenewals,
                        m = e[n.sessionId]
                    m && clearTimeout(m), (e[n.sessionId] = setTimeout(() => h._renewMediaKeySession(p, d), 1e3 * y))
                }
                yield _superprop_get_handleLicenseJson().call(h, e, n, d)
            })()
        }
        _renewMediaKeySession(e, n) {
            delete this._mediaKeySessionRenewals[e.session.sessionId],
                Rt.debug("fairplay eme: renewing session", e),
                e.session.update(Pe("renew"))
        }
        applyDelayedCdmUpdates() {}
        loadKeys(e) {
            return _asyncToGenerator$N(function* () {})()
        }
        clearSessions() {
            return _asyncToGenerator$N(function* () {})()
        }
        constructor(...e) {
            super(...e), (this._mediaKeySessions = {}), (this._mediaKeySessionRenewals = {})
        }
    }
    function asyncGeneratorStep$M(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$M(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$M(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$M(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    ga(
        [Bind(), va("design:type", Function), va("design:paramtypes", [void 0])],
        FairplayEncryptedSession.prototype,
        "startFairplayLicenseSession",
        null
    )
    const ba = /^(?:.*)(skd:\/\/.+)$/i
    class WebKitSession extends KeySession {
        attachMedia(e, n) {
            return (
                (this.target = e),
                e.addEventListener("webkitneedkey", this.boundHandleSessionCreation, !1),
                e.addEventListener("webkitkeyerror", this.boundDispatchKeyError),
                e
            )
        }
        detachMedia(e) {
            e &&
                (e.removeEventListener("webkitneedkey", this.boundHandleSessionCreation, !1),
                e.removeEventListener("webkitkeyerror", this.boundDispatchKeyError))
        }
        destroy() {
            Rt.debug("FPS destroy"),
                this.detachMedia(this.target),
                this.session &&
                    (this.session.removeEventListener("webkitkeyerror", this.boundDispatchKeyError),
                    this.session.removeEventListener("webkitkeymessage", this.boundStartLicenseSession))
        }
        createSession(e) {
            Rt.debug("FPS createSession", e)
            const { initData: n, target: d } = e,
                { item: h } = this
            if (!h) return Rt.error("Cannot createSession without item"), Promise.resolve()
            const p = this._extractAssetId(n)
            if ((Rt.debug("extURI", p), !d.webkitKeys && window.WebKitMediaKeys)) {
                const e = new window.WebKitMediaKeys(this.keySystem)
                d.webkitSetMediaKeys(e)
            }
            return this.loadCertificateBuffer().then((e) => {
                const y = this._concatInitDataIdAndCertificate(n, p, e),
                    m = "VIDEO" === d.tagName ? zt.AVC1 : zt.MP4,
                    g = d.webkitKeys.createSession(m, y)
                this.addMediaKeySessionInfo(p, g, h),
                    (this.session = g),
                    (g.extURI = p),
                    g.addEventListener("webkitkeyerror", this.boundDispatchKeyError),
                    g.addEventListener("webkitkeymessage", this.boundStartLicenseSession)
            })
        }
        _extractAssetId(e) {
            let n = String.fromCharCode.apply(null, new Uint16Array(e.buffer || e))
            const d = n.match(ba)
            return d && d.length >= 2 && (n = d[1]), Rt.debug("Extracted assetId from EXT-X-KEY URI", n), n
        }
        _concatInitDataIdAndCertificate(e, n, d) {
            "string" == typeof n && (n = Ee(n)), (d = new Uint8Array(d))
            let h = 0
            const p = new ArrayBuffer(e.byteLength + 4 + n.byteLength + 4 + d.byteLength),
                y = new DataView(p)
            new Uint8Array(p, h, e.byteLength).set(e), (h += e.byteLength), y.setUint32(h, n.byteLength, !0), (h += 4)
            const m = new Uint8Array(p, h, n.byteLength)
            m.set(n), (h += m.byteLength), y.setUint32(h, d.byteLength, !0), (h += 4)
            return new Uint8Array(p, h, d.byteLength).set(d), new Uint8Array(p, 0, p.byteLength)
        }
        applyDelayedCdmUpdates() {}
        loadKeys(e) {
            return _asyncToGenerator$M(function* () {})()
        }
        clearSessions() {
            return _asyncToGenerator$M(function* () {})()
        }
        constructor(...e) {
            super(...e), (this.isLegacyEme = !0)
        }
    }
    function asyncGeneratorStep$L(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$L(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$L(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$L(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class MSSession extends KeySession {
        attachMedia(e, n) {
            return (
                (this.keySystem = n.keySystem),
                e.addEventListener("msneedkey", this.boundHandleSessionCreation, !1),
                e.addEventListener("mskeyerror", this.boundDispatchKeyError),
                e
            )
        }
        detachMedia(e) {
            e.removeEventListener("msneedkey", this.boundHandleSessionCreation, !1),
                e.removeEventListener("mskeyerror", this.boundDispatchKeyError)
        }
        createSession(e) {
            const { initData: n, target: d } = e
            if (!d.msKeys) {
                const e = new MSMediaKeys(this.keySystem)
                d.msSetMediaKeys(e)
            }
            const h = d.msKeys.createSession(zt.MP4, n)
            return (
                h.addEventListener("mskeyerror", this.dispatchKeyError),
                h.addEventListener("mskeymessage", this.startLicenseSession.bind(this)),
                h
            )
        }
        applyDelayedCdmUpdates() {}
        loadKeys(e) {
            return _asyncToGenerator$L(function* () {})()
        }
        clearSessions() {
            return _asyncToGenerator$L(function* () {})()
        }
    }
    const _a = { [Bt.WIDEVINE]: Qt.WIDEVINE, [Bt.FAIRPLAY]: Qt.FAIRPLAY, [Bt.PLAYREADY]: Qt.PLAYREADY },
        Ta = [
            0, 0, 1, 222, 112, 115, 115, 104, 0, 0, 0, 0, 154, 4, 240, 121, 152, 64, 66, 134, 171, 146, 230, 91, 224,
            136, 95, 149, 0, 0, 1, 190
        ],
        Sa = [190, 1, 0, 0, 1, 0, 1, 0, 180, 1]
    function concatenate(e, ...n) {
        let d = 0
        for (const y of n) d += y.length
        const h = new e(d)
        let p = 0
        for (const y of n) h.set(y, p), (p += y.length)
        return h
    }
    const { WIDEVINE: Pa, PLAYREADY: Ea } = Bt,
        ka = {}
    ;(ka[Pa] = (e) => {
        Rt.debug("generating Widevine pssh for keyId")
        const n = new Uint8Array([
            0, 0, 0, 52, 112, 115, 115, 104, 0, 0, 0, 0, 237, 239, 139, 169, 121, 214, 74, 206, 163, 200, 39, 220, 213,
            29, 33, 237, 0, 0, 0, 20, 8, 1, 18, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ])
        for (let d = 0; d < e.length; d++) n[n.length - 16 + d] = e[d]
        return Rt.debug("generatePSSH", n), n
    }),
        (ka[Ea] = (e) => {
            Rt.debug("generating Playready pssh for keyId"),
                ((e) => {
                    const swap = (e, n, d) => {
                        const h = e[n]
                        ;(e[n] = e[d]), (e[d] = h)
                    }
                    swap(e, 0, 3), swap(e, 1, 2), swap(e, 4, 5), swap(e, 6, 7)
                })(e)
            const n = ke(e),
                d =
                    '<WRMHEADER xmlns="http://schemas.microsoft.com/DRM/2007/03/PlayReadyHeader" version="4.3.0.0"><DATA><PROTECTINFO><KIDS><KID ALGID="AESCTR" VALUE="[KEYID]"></KID></KIDS></PROTECTINFO></DATA></WRMHEADER>'.replace(
                        "[KEYID]",
                        n
                    ),
                h = Ee(d),
                p = new Uint8Array(h.buffer, h.byteOffset, h.byteLength)
            return concatenate(Uint8Array, Ta, Sa, p)
        })
    function asyncGeneratorStep$K(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$K(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$K(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$K(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class PreloadingEncryptedSession extends KeySession {
        attachMedia(e, n) {
            ;(this.keySystem = n.keySystem), (this._keySystemAccess = n), (this._target = e)
        }
        detachMedia() {
            asAsync(this.clearSessions())
        }
        createSession(e) {
            return _asyncToGenerator$K(function* () {})()
        }
        _mediaKeysSetup() {
            var e = this
            return _asyncToGenerator$K(function* () {
                const n = e._keySystemAccess
                var d
                n &&
                    (e._mediaKeysPromise ||
                        (e._mediaKeysPromise = new Promise(
                            ((d = _asyncToGenerator$K(function* (d, h) {
                                const p = yield n.createMediaKeys()
                                try {
                                    var y
                                    yield null === (y = e._target) || void 0 === y ? void 0 : y.setMediaKeys(p),
                                        (e._mediaKeys = p)
                                } catch (Y) {
                                    e.dispatchKeyError(Y), h(Y)
                                }
                                if (e.isWidevine) {
                                    const n = yield e.loadCertificateBuffer()
                                    yield p.setServerCertificate(n)
                                }
                                d(p)
                            })),
                            function (e, n) {
                                return d.apply(this, arguments)
                            })
                        )),
                    yield e._mediaKeysPromise)
            })()
        }
        createSessionAndGenerateRequest(e, n, d) {
            var h = this
            return _asyncToGenerator$K(function* () {
                var p
                const y = !!(null == d ? void 0 : d.isRenewal),
                    m = !!(null == d ? void 0 : d.delayCdmUpdate)
                if (!y && h.mediaKeySessions[e]) return
                Rt.debug(`createSessionAndGenerateRequest for item ${n.title}, isRenewal ${y}`)
                const g = null === (p = h._mediaKeys) || void 0 === p ? void 0 : p.createSession(),
                    { keySystem: b } = h
                if (!g) return
                h.addMediaKeySessionInfo(e, g, n, m)
                const _ = ((e) => {
                        if (e.includes("data")) {
                            const [n, d] = e.split(",")
                            return d
                        }
                        return e
                    })(e),
                    T = Se(_),
                    S = (h.isWidevine && n.isSong) || 16 === T.length
                let P
                var E
                return (
                    Rt.debug("extracted uri", e),
                    h.isPlayReady && !S
                        ? (Rt.debug("handling Playready object"),
                          (g.extURI = e),
                          (E = T),
                          (P = concatenate(Uint8Array, new Uint8Array(Ta), E)))
                        : S
                        ? (Rt.debug("handling keyId only initData"),
                          (g.extURI = "data:;base64," + ke(T)),
                          (P = ((e, n) => {
                              const d = ka[n]
                              if (!d) return Rt.warn("No pssh generator for ", n), e
                              return d(Uint8Array.from(e))
                          })(T, b)))
                        : (Rt.debug("handling pssh initData"), (g.extURI = e), (P = T)),
                    g.addEventListener("message", h.startLicenseSession),
                    g.generateRequest("cenc", P).catch((e) => {
                        if (e.message.match(/generateRequest.*\(75\)/)) return g.generateRequest("cenc", P)
                        throw e
                    })
                )
            })()
        }
        handleLicenseJson(e, n, d) {
            var h = this,
                _superprop_get_handleLicenseJson = () => super.handleLicenseJson
            return _asyncToGenerator$K(function* () {
                var p
                if (!e) return
                const y = h.mediaKeySessions[d]
                if (!y) return void Rt.debug("media key session does not exist, not updating")
                const m = e["renew-after"]
                if (e.license && m) {
                    Rt.debug("Got renew after value", m, d)
                    const e = h._mediaKeySessionRenewals,
                        p = e[n.sessionId]
                    p && clearTimeout(p), (e[n.sessionId] = setTimeout(() => h._renewMediaKeySession(y, d), 1e3 * m))
                }
                yield _superprop_get_handleLicenseJson().call(h, e, n, d)
                const g = null === (p = h.mediaKeySessions[d]) || void 0 === p ? void 0 : p.oldSession
                g &&
                    (Rt.debug("removing old key session after updating", d),
                    yield h._removeAndCloseSession(g),
                    delete h.mediaKeySessions[d].oldSession,
                    delete h._mediaKeySessionRenewals[g.sessionId])
            })()
        }
        _renewMediaKeySession(e, n) {
            delete this._mediaKeySessionRenewals[e.session.sessionId],
                asAsync(this.createSessionAndGenerateRequest(n, e.item, { isRenewal: !0 }))
        }
        applyDelayedCdmUpdates() {
            var e = this
            return _asyncToGenerator$K(function* () {
                Rt.debug("applying delayed CDM updates")
                const n = Object.entries(e.mediaKeySessions)
                for (const d of n) {
                    const [n, h] = d
                    if (h.delayCdmUpdate) {
                        const d = yield h["license-json"]
                        Rt.debug("delayed update of license", d),
                            yield e.handleLicenseJson(d, h.session, n),
                            (h.delayCdmUpdate = !1)
                    }
                }
            })()
        }
        loadKeys(e, n, d) {
            var h = this
            return _asyncToGenerator$K(function* () {
                yield h._mediaKeysSetup()
                const p = h.filterKeyValues(e)
                for (const e of p) {
                    const { dataUri: p } = e
                    yield h.createSessionAndGenerateRequest(p, n, d)
                }
                if (null == n ? void 0 : n.isLiveAudioStation) {
                    const e = Object.keys(h.mediaKeySessions),
                        n = p.reduce((e, n) => ((e[n.dataUri] = !0), e), {})
                    for (const d of e) n[d] || (yield h._scheduleRemoveSession(d))
                }
            })()
        }
        filterKeyValues(e) {
            let n
            if (1 === e.length) n = e
            else {
                const d = _a[this.keySystem]
                n = e.filter((e) => e.keyFormat === d)
            }
            return n
        }
        clearSessions(e) {
            var n = this
            return _asyncToGenerator$K(function* () {
                const d = n.mediaKeySessions
                if (null == e ? void 0 : e.length) {
                    const d = n.filterKeyValues(e)
                    for (const e of d) {
                        const d = e.dataUri
                        clearTimeout(n._sessionRemovalTimeouts[d]), yield n._removeSessionImmediately(d)
                    }
                } else {
                    Object.values(n._sessionRemovalTimeouts).forEach((e) => clearTimeout(e)),
                        Rt.debug("clearing key sessions", d)
                    for (const e of Object.keys(d)) yield n._removeSessionImmediately(e)
                }
            })()
        }
        _scheduleRemoveSession(e) {
            var n = this
            return _asyncToGenerator$K(function* () {
                if (!n.mediaKeySessions[e]) return void Rt.warn("no session for dataUri, not scheduling remove", e)
                if (n._sessionRemovalTimeouts[e]) return
                const d = setTimeout(() => {
                    asAsync(n._removeSessionImmediately(e))
                }, 6e4)
                Rt.debug("deferring removal of keysession for dataUri", e), (n._sessionRemovalTimeouts[e] = d)
            })()
        }
        _removeSessionImmediately(e) {
            var n = this
            return _asyncToGenerator$K(function* () {
                const d = n.mediaKeySessions[e]
                if (!d) return void Rt.warn("no session for dataUri, not removing", e)
                Rt.debug("removing keysession for", e)
                const { session: h, oldSession: p } = d
                n._clearSessionRenewal(h),
                    delete n.mediaKeySessions[e],
                    yield n._removeAndCloseSession(h),
                    p && (yield n._removeAndCloseSession(p))
            })()
        }
        _removeAndCloseSession(e) {
            var n = this
            return _asyncToGenerator$K(function* () {
                e.removeEventListener("message", n.startLicenseSession), Rt.debug("tearing down session", e.sessionId)
                try {
                    yield e.remove()
                } catch (Mr) {
                    Rt.warn("Error invoking session.remove()", Mr)
                } finally {
                    try {
                        yield e.close()
                    } catch (d) {
                        Rt.warn("Error invoking session.close()", d)
                    }
                }
            })()
        }
        _clearSessionRenewal(e) {
            const n = this._mediaKeySessionRenewals[e.sessionId]
            n &&
                (Rt.debug("clearing scheduled license renewal for session", e.sessionId),
                clearTimeout(n),
                delete this._mediaKeySessionRenewals[e.sessionId])
        }
        constructor(...e) {
            super(...e), (this._sessionRemovalTimeouts = {}), (this._mediaKeySessionRenewals = {})
        }
    }
    function asyncGeneratorStep$J(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$J(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$J(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$J(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const wa = BooleanDevFlag.register("mk-safari-modern-eme")
    class MediaExtension extends Notifications {
        get hasMediaKeySupport() {
            return hasMediaKeySupport()
        }
        get hasMediaSession() {
            return void 0 !== this._session
        }
        get isFairplay() {
            return this._session.isFairplay
        }
        set extURI(e) {
            this._session.extURI = e
        }
        set initiated(e) {
            this._session.initiated = e
        }
        get session() {
            return this._session
        }
        clearSessions(e) {
            var n = this
            return _asyncToGenerator$J(function* () {
                var d
                return null === (d = n.session) || void 0 === d ? void 0 : d.clearSessions(e)
            })()
        }
        initializeKeySystem() {
            var e = this
            return _asyncToGenerator$J(function* () {
                yield e._attachSession()
                const { _session: n } = e
                n &&
                    [Yt.playbackLicenseError, Yt.playbackSessionError].forEach((d) => {
                        n.addEventListener(d, (n) => {
                            e.dispatchEvent(d, n)
                        })
                    })
            })()
        }
        _requestModernFairplayAccess() {
            var e = this
            return _asyncToGenerator$J(function* () {
                const { contentType: n } = e,
                    d = [
                        {
                            initDataTypes: ["skd"],
                            audioCapabilities: [{ contentType: n, robustness: "" }],
                            videoCapabilities: [{ contentType: n, robustness: "" }],
                            distinctiveIdentifier: "not-allowed",
                            persistentState: "not-allowed",
                            sessionTypes: ["temporary"]
                        }
                    ],
                    [, h] = yield findMediaKeySystemAccess([Bt.FAIRPLAY], d)
                return h
            })()
        }
        _attachSession() {
            var e = this
            return _asyncToGenerator$J(function* () {
                var n, d
                const { mediaElement: h, contentType: p } = e
                if (
                    null === (n = window.WebKitMediaKeys) || void 0 === n
                        ? void 0
                        : n.isTypeSupported(Bt.FAIRPLAY + ".1_0", zt.MP4)
                ) {
                    let n
                    wa.enabled && e.hasMediaKeySupport && (n = yield e._requestModernFairplayAccess()),
                        n
                            ? (Rt.warn("media-extension: Using Fairplay modern EME"),
                              (e._session = new FairplayEncryptedSession()),
                              e._session.attachMedia(h, n))
                            : (Rt.warn("media-extension: Using Fairplay legacy EME"),
                              (e._session = new WebKitSession()),
                              e._session.attachMedia(h, { keySystem: Bt.FAIRPLAY }))
                } else if (
                    null === (d = window.MSMediaKeys) || void 0 === d ? void 0 : d.isTypeSupported(Bt.PLAYREADY, zt.MP4)
                )
                    (e._session = new MSSession()), e._session.attachMedia(h, { keySystem: Bt.PLAYREADY })
                else if (e.hasMediaKeySupport && h.canPlayType(p)) {
                    e._session = new PreloadingEncryptedSession()
                    const n = [
                            {
                                initDataTypes: ["cenc", "keyids"],
                                audioCapabilities: [{ contentType: p }],
                                distinctiveIdentifier: "optional",
                                persistentState: "required"
                            }
                        ],
                        d = potentialKeySystemsForAccess(),
                        [, m] = yield findMediaKeySystemAccess(d, n)
                    var y
                    if (m) null === (y = e._session) || void 0 === y || y.attachMedia(h, m)
                    else Rt.warn("media-extension: No keysystem detected!")
                }
            })()
        }
        setMediaItem(e) {
            !(function (e, n) {
                n.keyURLs &&
                    ((e.developerToken = ya.developerToken),
                    (e.userToken = ya.musicUserToken),
                    (e.item = n),
                    (e.adamId = n.songId),
                    (e.isLibrary = n.isCloudItem),
                    e.setKeyURLs(n.keyURLs))
            })(this._session, e)
        }
        destroy(e) {
            var n
            null === (n = this._session) || void 0 === n || n.detachMedia(e)
        }
        constructor(e, n) {
            super([Yt.playbackLicenseError, Yt.playbackSessionError]), (this.mediaElement = e), (this.contentType = n)
        }
    }
    const Ia = BooleanDevFlag.register("mk-force-audio-mse"),
        shouldForceAudioMse = () => Ia.enabled
    function asyncGeneratorStep$I(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    class ByteRangeSegment {
        load() {
            var e,
                n = this
            return ((e = function* () {
                const { url: e, range: d } = n
                if (!e) return new Uint8Array()
                const h = new Headers()
                h.append("Range", d)
                const p = yield fetch(e, { headers: h }),
                    y = yield p.arrayBuffer()
                return new Uint8Array(y)
            }),
            function () {
                var n = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = e.apply(n, d)
                    function _next(e) {
                        asyncGeneratorStep$I(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$I(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        constructor({ url: e, startByte: n, length: d, isInitSegment: h = !1 }) {
            ;(this.url = e),
                (this.isInitSegment = h),
                (this.startByte = parseInt(n, 10)),
                (this.length = parseInt(d, 10)),
                (this.endByte = this.startByte + this.length - 1),
                (this.range = `bytes=${this.startByte}-${this.endByte}`)
        }
    }
    function asyncGeneratorStep$H(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    class ContinuousSegment {
        load() {
            var e,
                n = this
            return ((e = function* () {
                const { url: e } = n
                if (!e) return new Uint8Array()
                const d = yield fetch(e),
                    h = yield d.arrayBuffer()
                return new Uint8Array(h)
            }),
            function () {
                var n = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = e.apply(n, d)
                    function _next(e) {
                        asyncGeneratorStep$H(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$H(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        constructor(e, n = !1) {
            ;(this.url = e), (this.isInitSegment = n)
        }
    }
    const Oa = /^#EXT-X-BYTERANGE:([^\n]+)\n/gim,
        Aa = /^#EXT-X-MAP:([^\n]+)\n/im,
        Ra = /#EXTINF:\d*\.\d*\,[\n](.+)|^#EXT-X-MAP:URI="([^"]*)"/gim,
        Ca = /#EXTINF:\d*\.\d*,\s*#EXT-X-BITRATE:\d{1,3}[\n](.+)|^#EXT-X-MAP:URI="([^"]*)"/gim
    class SegmentList {
        get segments() {
            return this._segments
        }
        addSegment(e, n) {
            this._addedSegments[n] ||
                (Rt.debug("Adding segment", n), this._segments.push(e), (this._addedSegments[n] = !0))
        }
        extractLiveRadioSegments(e, n) {
            this._extractContinuousSegments(Ra, e, n)
        }
        extractHlsOffersSegments(e, n) {
            this._extractContinuousSegments(Ca, e, n)
        }
        _extractContinuousSegments(e, n, d) {
            if (!n || !e.test(n)) return
            let h
            for (e.lastIndex = 0; (h = e.exec(n)); ) {
                const e = h[0].startsWith("#EXT-X-MAP") ? h[2] : h[1],
                    n = rewriteLastUrlPath(d, e),
                    p = h[0].startsWith("#EXT-X-MAP")
                this.addSegment(new ContinuousSegment(n, p), e)
            }
        }
        extractByteRangeSegments(e, n) {
            if (!e || !Oa.test(e)) return
            const d = (function (e) {
                if (!e || !Aa.test(e)) return
                const [, n] = e.match(Aa)
                return n.split(",").reduce((e, n) => {
                    const [d, h] = n.split("=")
                    return (e[d.toLowerCase()] = h.replace(/\"/gi, "")), e
                }, {})
            })(e)
            var h
            const p = null !== (h = n.split("/").pop()) && void 0 !== h ? h : "",
                y = n.replace(p, d.uri),
                [m, g] = d.byterange.split("@"),
                b = new ByteRangeSegment({ url: y, startByte: g, length: m })
            var _
            this.addSegment(b, b.range),
                (null !== (_ = e.match(Oa)) && void 0 !== _ ? _ : []).forEach((e) => {
                    const [, n, d] = e.match(/^#EXT-X-BYTERANGE:(\d+)@(\d+)\n/),
                        h = new ByteRangeSegment({ url: y, startByte: d, length: n })
                    this.addSegment(h, h.range)
                })
        }
        constructor() {
            ;(this._segments = []), (this._addedSegments = {})
        }
    }
    var Ma
    function asyncGeneratorStep$G(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$G(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$G(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$G(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    !(function (e) {
        e.keysParsed = "keysParsed"
    })(Ma || (Ma = {}))
    var Da =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        xa =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const La = /^#EXT-X-TARGETDURATION:(\d+)/im,
        Na = /^#EXT-X-KEY:[^\n]+URI="([^"]+)"/im,
        ja = /^#EXT-X-KEY:[^\n]+URI="([^"]+)",KEYFORMAT="([^"]+)"/gim
    function loadManifestData(e) {
        return _loadManifestData.apply(this, arguments)
    }
    function _loadManifestData() {
        return (_loadManifestData = _asyncToGenerator$G(function* (e) {
            return (yield fetch(e)).text()
        })).apply(this, arguments)
    }
    class Manifest extends Notifications {
        parse() {
            const e = this._item,
                n = this._data
            if (Jt !== Bt.FAIRPLAY || shouldForceAudioMse())
                if ((this._detectKeyTags(), e.hasOffersHlsUrl))
                    this._segmentList.extractHlsOffersSegments(n, e.assetURL)
                else if (e.isLiveRadioStation) {
                    this._segmentList.extractLiveRadioSegments(n, e.assetURL)
                    const [, d] = this._data.match(La)
                    Rt.debug(`manifest: setting up manifest refresh interval at ${d} seconds`)
                    const h = 1e3 * parseInt(d, 10)
                    this._manifestRefreshInterval = setInterval(this.liveRadioRefresh, h)
                } else this._segmentList.extractByteRangeSegments(n, e.assetURL)
        }
        static load(e, n = !0) {
            var d = this
            return _asyncToGenerator$G(function* () {
                Rt.debug("loading manifest for item", e.title)
                const h = e.assetURL
                let p
                const y = getSessionStorage(),
                    m = !!y && n
                if (m && ((p = null == y ? void 0 : y.getItem(h)), p)) return new d(p, e)
                const g = new Date().getTime()
                p = yield loadManifestData(h)
                const b = new d(p, e)
                return (
                    (b.downlink = (function (e, n) {
                        return (8 * n.length) / ((new Date().getTime() - e) / 1e3) / 1024
                    })(g, p)),
                    m && (null == y || y.setItem(h, p)),
                    Promise.resolve(b)
                )
            })()
        }
        get downlink() {
            return this._downlink
        }
        set downlink(e) {
            this._downlink = e
        }
        get mediaItem() {
            return this._item
        }
        liveRadioRefresh() {
            var e = this
            return _asyncToGenerator$G(function* () {
                const n = yield loadManifestData(e._url)
                ;(e._data = n),
                    e._detectKeyTags(),
                    e._segmentList.extractLiveRadioSegments(n, e._url),
                    e.dispatchEvent(Yt.manifestParsed)
            })()
        }
        segmentsForTimeRange(e) {
            const n = Math.floor(e.start / 10) + 1,
                d = Math.floor(e.end / 10) + 1,
                { segments: h } = this
            return [h[0], ...h.slice(n, d + 1)]
        }
        get segments() {
            return this._segmentList.segments
        }
        get extURI() {
            if (!this._extURI) {
                const e = this._data.match(Na)
                Rt.debug("manifest: EXT_X_KEY_URI matches", e), (this._extURI = (e && e[1]) || void 0)
            }
            return this._extURI
        }
        get keyValues() {
            let e = this._modernKeys
            return e.length || (e = this._legacyKeys), e
        }
        _detectKeyTags() {
            const e = this.keyValues
            e.length && this.dispatchEvent(Ma.keysParsed, { item: this.mediaItem, keys: e })
        }
        get _legacyKeys() {
            const e = this._data.match(Na)
            Rt.debug("manifest: EXT_X_KEY_URI matches", e)
            const n = (e && e[1]) || void 0
            this._extURI = n
            const d = []
            return n && d.push({ keyFormat: Qt.WIDEVINE, dataUri: n }), d
        }
        get _modernKeys() {
            let e
            ja.lastIndex = 0
            const n = []
            for (; (e = ja.exec(this._data)); ) {
                const [d, h, p] = e
                n.push({ keyFormat: p, dataUri: h })
            }
            return n
        }
        stop() {
            this._manifestRefreshInterval && clearInterval(this._manifestRefreshInterval)
        }
        constructor(e, n) {
            super([Yt.manifestParsed, Ma.keysParsed]),
                (this._downlink = 0),
                (this._segmentList = new SegmentList()),
                (this._data = e),
                (this._item = n),
                (this._url = n.assetURL)
        }
    }
    Da([Bind(), xa("design:type", Function), xa("design:paramtypes", [])], Manifest.prototype, "liveRadioRefresh", null)
    const Ua = "seamlessAudioTransition",
        $a = "bufferTimedMetadataDidChange",
        Ga = isNodeEnvironment$1() ? require("util").TextDecoder : self.TextDecoder
    function encodedArrayToString(e, n = "utf-8") {
        if ("iso-8859-1" === n) return String.fromCharCode(...e)
        return new Ga(n).decode(e)
    }
    function readNullTerminatedString(e, n = 0, d) {
        const h = []
        d = null != d ? d : e.length
        for (let p = n; p < d; p++) {
            const n = e[p]
            if ("\0" === String.fromCharCode(n)) break
            h.push(String.fromCharCode(n))
        }
        return [h.join(""), h.length]
    }
    function isBitAtPositionOn(e, n) {
        return 0 != (e & (1 << n))
    }
    class BaseMp4Box {
        get size() {
            return this.end - this.start
        }
        get rawBytes() {
            return this.data.slice(this.start, this.end)
        }
        constructor(e, n, d, h) {
            ;(this.id = e), (this.data = n), (this.start = d), (this.end = h)
        }
    }
    const Ba = [237, 239, 139, 169, 121, 214, 74, 206, 163, 200, 39, 220, 213, 29, 33, 237]
    class PsshBox extends BaseMp4Box {
        get systemId() {
            const { data: e, start: n } = this,
                d = n + 12
            return e.slice(d, d + 16)
        }
        get dataSize() {
            return this.view.getUint32(28)
        }
        get psshData() {
            const { data: e, start: n, dataSize: d } = this,
                h = n + 32
            return e.slice(h, h + d)
        }
        get keyBytes() {
            const { psshData: e } = this
            return e.slice(2, 18)
        }
        get isWidevine() {
            return arrayEquals(this.systemId, Ba)
        }
        constructor(e, n, d) {
            super("pssh", e, n, d), (this.view = new DataView(e.buffer, n))
        }
    }
    class TencBox extends BaseMp4Box {
        get isProtected() {
            const { data: e, start: n } = this
            return e[n + 14]
        }
        get defaultKeyId() {
            const { data: e, start: n } = this
            return e.slice(n + 16, n + 32)
        }
        set defaultKeyId(e) {
            const { data: n, start: d } = this
            for (let h = 0; h < e.length; h++) n[h + d + 16] = e[h]
        }
        constructor(e, n, d) {
            super("tenc", e, n, d), (this.data = e), (this.start = n), (this.end = d)
        }
    }
    function findBox(e, n, d = []) {
        for (let h = n; h < e.length; ) {
            if (0 === d.length) return
            const n = new DataView(e.buffer, h).getUint32(0),
                p = encodedArrayToString(e.subarray(h + 4, h + 8)),
                y = h + n
            if (1 === d.length && p === d[0]) return new BaseMp4Box(p, e, h, y)
            if (p === d[0]) return findBox(e, h + 8, d.slice(1))
            h += n
        }
    }
    const rewriteDefaultKid = (e) => {
        const [n] = (function (e) {
            const n = findBox(e, 0, ["moov", "trak", "mdia", "minf", "stbl", "stsd"]),
                d = []
            if (!n) return d
            for (let h = n.start + 16; h < n.end; ) {
                let p = findBox(e, h, ["enca"]),
                    y = 36
                if ((p || ((p = findBox(e, h, ["encv"])), (y = 86)), !p)) return d
                const m = findBox(e, p.start + y, ["sinf", "schi", "tenc"])
                m ? (d.push(new TencBox(m.data, m.start, m.end)), (h = m.end)) : (h = n.end)
            }
            return d
        })(e)
        if (!n) return
        const d = (function (e) {
            const n = findBox(e, 0, ["moov"]),
                d = []
            if (!n) return d
            const h = new DataView(e.buffer, 0)
            for (let p = n.start + 8; p < n.size; ) {
                const n = h.getUint32(p)
                "pssh" === encodedArrayToString(e.subarray(p + 4, p + 8)) && d.push(new PsshBox(e, p, p + n)), (p += n)
            }
            return d
        })(e).find((e) => e.isWidevine)
        d && (n.defaultKeyId = d.keyBytes)
    }
    function readSynchSafeUint32(e) {
        return 2097152 * (127 & e[0]) + 16384 * (127 & e[1]) + 128 * (127 & e[2]) + (127 & e[3])
    }
    const Fa = { 0: "iso-8859-1", 1: "utf-16", 2: "utf-16be", 3: "utf-8" },
        Ka = { TPE1: !0, TIT2: !0, WXXX: !0, PRIV: !0, TALB: !0, CHAP: !0 }
    class ID3 {
        _parseID3Flags(e) {
            ;(this.unsynchronized = isBitAtPositionOn(e, 7)),
                (this.hasExtendedHeader = isBitAtPositionOn(e, 6)),
                (this.isExperimental = isBitAtPositionOn(e, 5)),
                (this.hasFooter = isBitAtPositionOn(e, 4))
        }
        _parseID3Frames(e, n, d, h) {
            const p = new DataView(n.buffer, 0, h),
                { minor: y } = this
            for (; d + 8 <= h; ) {
                const m = Te(n.subarray(d, d + 4))
                d += 4
                const g = 4 === y ? readSynchSafeUint32(n.subarray(d, d + 4)) : p.getUint32(d)
                if (((d += 4), n[d++], n[d++], Ka[m])) {
                    const p = d,
                        y = this._extractID3FramePayload(n, m, g, p, h)
                    if (y) {
                        const n = this.decodeID3Frame(y)
                        n && e.frames.push(n)
                    }
                    d += g
                } else d += g
            }
        }
        _extractID3FramePayload(e, n, d, h, p) {
            const y = h + d
            let m
            return y <= p && (m = { type: n, size: d, data: e.slice(h, y) }), m
        }
        decodeID3Frame(e) {
            if ("TXXX" !== e.type)
                return "WXXX" === e.type
                    ? this.decodeWxxxFrame(e)
                    : "PRIV" === e.type
                    ? this.decodePrivFrame(e)
                    : "CHAP" === e.type
                    ? this.decodeChapFrame(e)
                    : "T" === e.type[0]
                    ? this.decodeTextFrame(e)
                    : { key: e.type, data: e.data }
        }
        decodeChapFrame(e) {
            const { data: n } = e,
                d = new DataView(n.buffer),
                h = { key: "CHAP", frames: [] }
            let [p, y] = readNullTerminatedString(n, 0, n.length)
            return (
                (h.id = p),
                y++,
                (h.startTime = d.getUint32(y)),
                (y += 4),
                (h.endTime = d.getUint32(y)),
                (y += 4),
                (y += 4),
                (y += 4),
                this._parseID3Frames(h, n, y, n.length),
                h
            )
        }
        decodeTextFrame(e) {
            const { data: n } = e,
                d = Fa[n[0]],
                h = encodedArrayToString(n.subarray(1), d)
            return { key: e.type, text: h }
        }
        decodeWxxxFrame(e) {
            const { data: n } = e,
                d = Fa[n[0]]
            let h = 1
            const p = encodedArrayToString(n.subarray(h), d)
            h += p.length + 1
            return { key: "WXXX", description: p, text: encodedArrayToString(n.subarray(h)) }
        }
        decodePrivFrame(e) {
            const n = encodedArrayToString(e.data)
            if (!n) return
            return { key: "PRIV", info: n, data: e.data.slice(n.length + 1) }
        }
        constructor(e) {
            ;(this.frames = []),
                (this.unsynchronized = !1),
                (this.hasExtendedHeader = !1),
                (this.hasFooter = !1),
                (this.isExperimental = !1)
            let n = 0
            const d = Te(e.subarray(n, n + 3))
            if (((n += 3), "ID3" !== d)) return
            ;(this.minor = e[n++]), (this.revision = e[n++])
            const h = e[n++]
            this._parseID3Flags(h)
            const p = readSynchSafeUint32(e.subarray(n, n + 4))
            ;(n += 4), (this.frameLength = p)
            const y = n + p
            if (((this.endPos = y), this.hasExtendedHeader)) {
                n += readSynchSafeUint32(e.subarray(n, n + 4))
            }
            this.minor > 2 && this._parseID3Frames(this, e, n, y)
        }
    }
    var Va
    function checkBoxName(e, n, d) {
        return !(n + 4 > e.length) && e[n] === d[0] && e[n + 1] === d[1] && e[n + 2] === d[2] && e[n + 3] === d[3]
    }
    function findEmsgs(e) {
        const n = e.length,
            d = []
        if (
            (function (e) {
                return (null == e ? void 0 : e.length) >= 8 && checkBoxName(e, 4, [102, 116, 121, 112])
            })(e)
        )
            return d
        for (let h = 0; h < n; h++) {
            if (checkBoxName(e, h, [109, 111, 111, 102])) return d
            if (checkBoxName(e, h, [101, 109, 115, 103])) {
                const n = h - 4,
                    p = new DataView(e.buffer, n).getUint32(0),
                    y = e.subarray(n, n + p)
                ;(h = h + p - 1), d.push(y)
            }
        }
        return d
    }
    !(function (e) {
        ;(e[(e.THREE = 51)] = "THREE"),
            (e[(e.C_A = 65)] = "C_A"),
            (e[(e.C_C = 67)] = "C_C"),
            (e[(e.C_D = 68)] = "C_D"),
            (e[(e.C_H = 72)] = "C_H"),
            (e[(e.C_I = 73)] = "C_I"),
            (e[(e.C_P = 80)] = "C_P"),
            (e[(e.A = 97)] = "A"),
            (e[(e.C = 99)] = "C"),
            (e[(e.D = 100)] = "D"),
            (e[(e.E = 101)] = "E"),
            (e[(e.F = 102)] = "F"),
            (e[(e.G = 103)] = "G"),
            (e[(e.H = 104)] = "H"),
            (e[(e.I = 105)] = "I"),
            (e[(e.K = 107)] = "K"),
            (e[(e.M = 109)] = "M"),
            (e[(e.O = 111)] = "O"),
            (e[(e.P = 112)] = "P"),
            (e[(e.S = 115)] = "S"),
            (e[(e.T = 116)] = "T"),
            (e[(e.V = 118)] = "V"),
            (e[(e.Y = 121)] = "Y")
    })(Va || (Va = {}))
    const Ha = { TALB: "album", TIT2: "title", TPE1: "performer" },
        qa = ["performer", "title", "album"]
    class TimedMetadata {
        resolveAdamIdFromStorefront(e) {
            const n = this.storefrontToIds[e]
            this._adamId = n
        }
        get adamId() {
            return this._adamId
        }
        equals(e) {
            if (!qa.every((n) => this[n] === e[n])) return !1
            const { links: n } = this,
                d = e.links
            if (n.length !== d.length) return !1
            for (let h = 0; h < n.length; h++) {
                const e = n[h].description === d[h].description,
                    p = n[h].url === d[h].url
                if (!e || !p) return !1
            }
            return !0
        }
        constructor(e) {
            ;(this.links = []),
                (this.storefrontToIds = {}),
                e.forEach((e) => {
                    const { key: n } = e,
                        d = Ha[n]
                    var h
                    if (d) this[d] = null === (h = e.text) || void 0 === h ? void 0 : h.replace(/\0/g, "")
                    else if ("WXXX" === e.key) {
                        if (e.description) {
                            const [n, d] = e.description.split("\0")
                            this.links.push({ description: n, url: d })
                        }
                    } else if ("PRIV" === e.key) {
                        var p
                        const n = null === (p = e.info) || void 0 === p ? void 0 : p.split("\0")
                        if (n && n.length && n[0].startsWith("com.apple.radio.adamid")) {
                            n[1].split(",").forEach((e) => {
                                const [n, d] = e.split(":")
                                n && d && "0" !== d && !hasOwn(this.storefrontToIds, n) && (this.storefrontToIds[n] = d)
                            })
                        }
                    }
                })
        }
    }
    class Emsg {
        get length() {
            return this.data.length
        }
        get elementPresentationTime() {
            const { presentationTime: e, timeScale: n } = this
            return e && n ? Math.round(e / n) : NaN
        }
        get timedMetadata() {
            var e
            if (this._timedMetadata) return this._timedMetadata
            const n = null === (e = this.id3) || void 0 === e ? void 0 : e.frames
            return n ? ((this._timedMetadata = new TimedMetadata(n)), this._timedMetadata) : void 0
        }
        constructor(e) {
            this.data = e
            const n = new DataView(e.buffer)
            let d = 8
            if (1 !== e[d]) return
            ;(d += 4), (this.timeScale = n.getUint32(d)), (d += 4)
            const h = n.getUint32(d)
            d += 4
            const p = n.getUint32(d)
            if (
                ((d += 4),
                (this.presentationTime = Math.pow(2, 32) * h + p),
                !Number.isSafeInteger(this.presentationTime))
            )
                throw ((this.presentationTime = Number.MAX_SAFE_INTEGER), new Error("Failed to create 64 bit integer"))
            ;(this.eventDuration = n.getUint32(d)), (d += 4), (this.id = n.getUint32(d)), (d += 4)
            const [y, m] = readNullTerminatedString(e, d)
            ;(d += m + 1), (this.schemeIdUri = y)
            const [g, b] = readNullTerminatedString(e, d)
            ;(d += b + 1), (this.payload = e.subarray(d, e.byteLength)), (this.id3 = new ID3(this.payload))
        }
    }
    class TimedMetadataManager {
        processEmsgs(e) {
            const n = findEmsgs(e)
            n.length &&
                (this._currentEmsgInterval || (this._currentEmsgInterval = setInterval(this._getCurrentEmsg, 1e3)),
                n.forEach((e) => {
                    const n = new Emsg(e)
                    this._emsgLookup[n.elementPresentationTime] = n
                }))
        }
        stop() {
            const { _currentEmsgInterval: e } = this
            e && clearInterval(e)
        }
        _getCurrentEmsg() {
            const { _currentTime: e, _emsgLookup: n } = this,
                d = Math.round(e()),
                h = [],
                p = Object.keys(n)
            for (let m = 0; m < p.length; m++) {
                const e = parseInt(p[m], 10)
                if (!(e < d)) break
                h.push(e)
            }
            const y = h.pop()
            if (y) {
                const e = n[y]
                if (!e) return
                const { _currentEmsg: d, _onDidChange: h } = this,
                    p = null == d ? void 0 : d.payload,
                    m = e.payload
                ;(p && arrayEquals(p, m)) || ((this._currentEmsg = e), h(e)), this._cleanupEmsgs(y)
            }
        }
        _cleanupEmsgs(e) {
            const { _emsgLookup: n } = this
            Object.keys(n).forEach((d) => {
                parseInt(d, 10) < e && delete n[d]
            })
        }
        constructor(e, n) {
            ;(this._currentTime = e),
                (this._onDidChange = n),
                (this._emsgLookup = {}),
                (this._getCurrentEmsg = this._getCurrentEmsg.bind(this))
        }
    }
    class SegmentProcessor {
        process(e, n) {
            const { _item: d } = this
            try {
                d.isLiveRadioStation
                    ? this._processLiveRadioSegment(n)
                    : d.hasOffersHlsUrl && this._processHlsOffersSegment(e, n)
            } catch (Mr) {
                Rt.error("Error processing segment", Mr)
            }
        }
        stop() {
            this._timedMetadataManager.stop()
        }
        _processHlsOffersSegment(e, n) {
            e.isInitSegment && rewriteDefaultKid(n)
        }
        _processLiveRadioSegment(e) {
            this._timedMetadataManager.processEmsgs(e)
        }
        constructor(e, n, d) {
            ;(this._item = e),
                (this._timedMetadataManager = new TimedMetadataManager(
                    () => n.currentTime,
                    (e) => {
                        d.publish($a, e.timedMetadata)
                    }
                ))
        }
    }
    function asyncGeneratorStep$F(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$F(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$F(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$F(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    var Wa =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Ya =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const za = Rt.createChild("mse"),
        Qa = BooleanDevFlag.get("mk-mse-buffer"),
        { manifestParsed: Ja } = Yt
    class MseBuffer {
        onSourceOpen() {
            za.debug("mediaSource open handler")
            const { mediaSource: e } = this
            if (e.activeSourceBuffers.length > 0) return void za.debug("not adding new source buffer")
            za.debug("adding new source buffer")
            const n = e.addSourceBuffer(Vt)
            ;(this.sourceBuffer = n), n.addEventListener("updateend", this.updateEndHandler)
            const { clip: d, hasAppendWindowSupport: h } = this
            d &&
                (h
                    ? (za.debug("appendWindowStart/End", d.start, d.end),
                      (n.appendWindowStart = d.start),
                      (n.appendWindowEnd = d.end))
                    : (za.debug("seeking for clip", d.start), asAsync(this.seek(d.start)))),
                this.updateSegmentToFetch(0, !0)
        }
        setNextManifest(e) {
            za.debug("setting next manifest for ", e.mediaItem.title),
                this.nextSeamlessTransition
                    ? (za.debug("abandoning transition scheduled for " + this.nextSeamlessTransition),
                      this.revertSeamlessTransition(!0),
                      (this.playbackTimeline.next = { manifest: e }))
                    : ((this.playbackTimeline.next = { manifest: e }),
                      this.isFullyBuffered &&
                          (za.debug("current song is fully buffered, beginning transition to next"),
                          this.transitionToNextManifest()))
        }
        isItemPlaying(e) {
            var n, d
            const { playbackTimeline: h } = this,
                p = this.nextSeamlessTransition
                    ? null === (n = h.previous) || void 0 === n
                        ? void 0
                        : n.manifest.mediaItem
                    : null === (d = h.current) || void 0 === d
                    ? void 0
                    : d.manifest.mediaItem
            return !!p && (za.debug(`isItemPlaying ${e.title}, ${p.title}, ${e.id === p.id}`), e.id === p.id)
        }
        get currentItem() {
            return this.manifest.mediaItem
        }
        get playableUrl() {
            let e = this._playableUrl
            return (
                e ||
                ((e = window.URL.createObjectURL(this.mediaSource)),
                za.debug("created url", e),
                (this._playableUrl = e),
                e)
            )
        }
        get segments() {
            const { manifest: e, clip: n } = this
            return n ? e.segmentsForTimeRange(n) : e.segments || []
        }
        get currentTime() {
            return this._currentTime
        }
        set currentTime(e) {
            if (((e += this.currentTimestampOffset), this._currentTime === e)) return
            const { nextSeamlessTransition: n } = this
            if (n && e >= n) {
                var d, h
                za.debug("setting offset to", n),
                    (this.currentTimestampOffset = n || 0),
                    (this.nextSeamlessTransition = void 0),
                    (this.duration = this.manifest.mediaItem.playbackDuration / 1e3),
                    za.debug("buffer setting duration to", this.duration)
                const e = {
                    previous:
                        null === (d = this.playbackTimeline.previous) ||
                        void 0 === d ||
                        null === (h = d.manifest) ||
                        void 0 === h
                            ? void 0
                            : h.mediaItem,
                    current: this.manifest.mediaItem
                }
                za.debug("dispatching seamless audio transition", e), this.dispatcher.publish(Ua, e)
            }
            this._currentTime = e
            const { isOverBufferLimit: p, timeToTrim: y } = this,
                m = e > this.timeToTrim
            p && m && (za.debug("buffer over limit, trimming to ", y), this.removeToTime(y), (this.timeToTrim += 10))
        }
        get hasAppendWindowSupport() {
            var e
            return void 0 !== (null === (e = this.sourceBuffer) || void 0 === e ? void 0 : e.appendWindowStart)
        }
        seek(e) {
            var n = this
            return _asyncToGenerator$F(function* () {
                const { duration: d, seekWhenUpdated: h, sourceBuffer: p } = n
                if (
                    (n.resolveSeekPromise(!1),
                    za.debug("seek to ", e),
                    (e = +e) > d && (za.debug("rounding seek time to duration", e, d), (e = d)),
                    !p)
                )
                    return !1
                if ((n.revertSeamlessTransition(), p.updating))
                    return (
                        za.debug("sourcebuffer updating, deferring seek"),
                        new Promise((d) => {
                            h && h.resolve(!1), (n.seekWhenUpdated = { seek: n.seek.bind(n, e), resolve: d })
                        })
                    )
                ;(n.currentlyLoadingSegmentIndex = void 0),
                    n.updateSegmentToFetch(0, !0),
                    n.removeToTime(e),
                    (n.timeToTrim = 10 * Math.floor(e / 10))
                const y = n.getSegmentForTime(e)
                0 !== y && (yield n.firstSegmentLoadPromise),
                    za.debug("seeking to", e, "segment", y),
                    n.updateSegmentToFetch(y, !0)
                const m = new Promise((d) => {
                    n.seekResolver = { time: e, resolve: d }
                })
                return n.checkSeekBuffered(), m
            })()
        }
        clearNextManifest() {
            this.revertSeamlessTransition(!0), (this.playbackTimeline.next = void 0)
        }
        revertSeamlessTransition(e = !1) {
            const { playbackTimeline: n, nextSeamlessTransition: d } = this
            if (!d || !n.previous) return void za.debug("no need to revert, no transition")
            ;(this.isAtEndOfStream = e),
                za.debug("reverting seamless transition with discardNextManifest", e),
                e ? this.clearBufferToEnd(d) : this.clearBuffer(),
                za.debug("abandoning transition to " + this.manifest.mediaItem.title),
                (n.next = e ? void 0 : n.current),
                (n.current = n.previous),
                (n.previous = void 0)
            const h = this.manifest.mediaItem
            za.debug("current item reverted to " + h.title),
                (this.nextSeamlessTransition = void 0),
                (this.duration = h.playbackDuration / 1e3),
                za.debug("reverted duration to " + this.duration),
                e ||
                    ((this.currentTimestampOffset = 0),
                    (this.timestampOffsetAdjustment = 0),
                    za.debug("reverted currentTimestampOffset and timestampOffsetAdjustment to 0")),
                this.printInfo(),
                (this.segmentIndexToFetch = -1)
        }
        get streamHasEnding() {
            return !this.manifest.mediaItem.isLiveRadioStation
        }
        stop() {
            this.segmentProcessor.stop(), this.setEndOfStream(), this.remove()
        }
        remove() {
            var e
            za.debug("removing sourceBuffer and mediaSource")
            const { sourceBuffer: n, mediaSource: d } = this
            null === (e = this.seekResolver) || void 0 === e || e.resolve(!1),
                this.manifest.removeEventListener(Ja, this.onManifestParsed)
            const h = this._playableUrl
            h && (za.debug("revoking url", h), window.URL.revokeObjectURL(h)),
                d.removeEventListener("sourceopen", this.onSourceOpen),
                n && (n.removeEventListener("updateend", this.updateEndHandler), (this.sourceBuffer = void 0))
        }
        onManifestParsed() {
            const e = this.segmentIndexToFetch + 1
            za.debug("manifestParsed, loading segment", e), this.updateSegmentToFetch(e, !0)
        }
        updateEndHandler() {
            if ((this.kickstartBuffer(), this.clearDeferredRemove())) return
            if ((za.debug("update end", this.seekWhenUpdated), this.seekWhenUpdated)) {
                za.debug("updateEndHandler resolving seekWhenUpdated")
                const { seekWhenUpdated: e } = this
                return asAsync(e.seek().then(e.resolve)), void (this.seekWhenUpdated = void 0)
            }
            this.checkSeekBuffered()
            const { clip: e, sourceBuffer: n, hasAppendWindowSupport: d } = this
            if (e && n && !d) {
                const { buffered: d } = n
                if (this.isTimeBuffered(e.end + 1)) {
                    const h = d.end(d.length - 1)
                    return za.debug("clipping sourcebuffer to", e.end, h), void n.remove(e.end, h)
                }
            }
            if (this.isAtEndOfStream)
                return (
                    za.debug("buffer is at end of stream"),
                    this.streamHasEnding &&
                        (za.debug("isAtEndOfStream, not fetching any more segments"),
                        this.playbackTimeline.next || this.setEndOfStream(),
                        this.transitionToNextManifest()),
                    void (this.isAtEndOfStream = !1)
                )
            za.debug("updateEndHandler invoking loadSegment"), asAsync(this.loadSegment())
        }
        clearDeferredRemove() {
            var e
            if (0 === this.deferredRemoves.length) return !1
            const n = this.deferredRemoves.shift()
            return null === (e = this.sourceBuffer) || void 0 === e || e.remove(n.start, n.end), !0
        }
        transitionToNextManifest() {
            var e
            za.debug("beginning transition to next manifest")
            const { playbackTimeline: n, sourceBuffer: d } = this
            if (!n.next || !d) return void za.debug("no next manifest")
            const h = this.endOfBufferTime || this.currentTimestampOffset
            za.debug("setting seamless transition at", h),
                (this.nextSeamlessTransition = h),
                (this.timestampOffsetAdjustment = h),
                (this.playbackTimeline.current.endTime = h),
                (n.previous = n.current),
                za.debug(
                    "previous manifest set to",
                    null === (e = n.previous) || void 0 === e ? void 0 : e.manifest.mediaItem.title
                ),
                (n.current = n.next),
                za.debug("current manifest set to", n.current.manifest.mediaItem.title),
                (n.next = void 0),
                this.updateSegmentToFetch(0, !0),
                this.printInfo()
        }
        updateSegmentToFetch(e, n = !1) {
            this.segments.length &&
                e < this.segments.length &&
                e !== this.segmentIndexToFetch &&
                ((this.segmentIndexToFetch = e),
                n && (za.debug("updateSegmentToFetch invoking loadSegment"), asAsync(this.loadSegment())))
        }
        loadSegment() {
            var e = this
            return _asyncToGenerator$F(function* () {
                const n = e.segmentIndexToFetch,
                    d = e.segments[n]
                if (n !== e.currentlyLoadingSegmentIndex) {
                    if (d)
                        try {
                            za.debug("begin loadSegment " + n), (e.currentlyLoadingSegmentIndex = n)
                            const p = d.load()
                            0 === n && (e.firstSegmentLoadPromise = p)
                            const y = yield p
                            if (0 !== n && n !== e.segmentIndexToFetch)
                                return void za.debug(
                                    "load segment index to fetch changed, not processing bytes for segment",
                                    n
                                )
                            e.segmentProcessor.process(d, y), za.debug("loadSegment processed: " + n)
                            const { sourceBuffer: m, timestampOffsetAdjustment: g } = e
                            if (!m) return
                            try {
                                "number" == typeof g &&
                                    (za.debug("adjusting timestampOffset of sourcebuffer to", g),
                                    (m.timestampOffset = g),
                                    (e.timestampOffsetAdjustment = void 0)),
                                    m.appendBuffer(y),
                                    (e.isFullyBuffered = !1),
                                    (e.isOverBufferLimit = !1),
                                    za.debug("appended to buffer", y.length),
                                    e.printBufferTimes(),
                                    n === e.segments.length - 1
                                        ? (e.isAtEndOfStream = !0)
                                        : n === e.segmentIndexToFetch &&
                                          (za.debug("loadSegment bumping segment index to fetch to ", n + 1),
                                          e.updateSegmentToFetch(n + 1))
                            } catch (h) {
                                "QuotaExceededError" === h.name
                                    ? ((e.isOverBufferLimit = !0), za.debug("reached buffer limit"))
                                    : za.warn("Error appending to source buffer", h)
                            }
                        } catch (Mr) {
                            za.error("Error loading segment", Mr)
                        } finally {
                            e.currentlyLoadingSegmentIndex = void 0
                        }
                } else za.debug(`segment ${n} is currently loading, not loading it again`)
            })()
        }
        setEndOfStream() {
            const { sourceBuffer: e, mediaSource: n } = this
            e &&
                "ended" !== n.readyState &&
                (e.updating || "open" !== n.readyState
                    ? za.error("Could not end of stream (updating, readyState)", e.updating, n.readyState)
                    : (za.debug("mediaSource.endOfStream"), n.endOfStream(), (this.isFullyBuffered = !0)))
        }
        removeToTime(e) {
            za.debug("removing to time", e),
                e > 0 && (this.isTimeBuffered(e) || this.isOverBufferLimit) && this.safeSourceBufferRemove(0, e)
        }
        safeSourceBufferRemove(e, n) {
            const { sourceBuffer: d } = this
            d && (d.updating ? this.deferredRemoves.push({ start: e, end: n }) : d.remove(e, n))
        }
        get previousOffset() {
            var e, n
            return (
                (null === (e = this.playbackTimeline) || void 0 === e || null === (n = e.previous) || void 0 === n
                    ? void 0
                    : n.endTime) || 0
            )
        }
        get manifest() {
            var e
            return null === (e = this.playbackTimeline.current) || void 0 === e ? void 0 : e.manifest
        }
        checkSeekBuffered() {
            const { seekResolver: e, currentTimestampOffset: n } = this
            if (!e) return
            const { time: d } = e,
                h = d + n,
                p = this.isTimeBuffered(h)
            za.debug("resolving seek for time, adjustedTime, isBuffered", d, h, p),
                this.printBufferTimes(),
                p &&
                    (za.debug("resolving seek to true for time:", h),
                    (this.element.currentTime = h),
                    this.resolveSeekPromise(!0))
        }
        resolveSeekPromise(e) {
            this.seekResolver && (this.seekResolver.resolve(e), (this.seekResolver = void 0))
        }
        get endOfBufferTime() {
            var e
            const n = null === (e = this.sourceBuffer) || void 0 === e ? void 0 : e.buffered
            return !(!n || !n.length) && n.end(n.length - 1)
        }
        isTimeBuffered(e) {
            var n
            const d = null === (n = this.sourceBuffer) || void 0 === n ? void 0 : n.buffered
            if (!d) return !1
            for (let h = 0; h < d.length; h++)
                if ((za.debug("isTimeBuffered", d.start(h), e, d.end(h)), e >= d.start(h) && e <= d.end(h))) return !0
            return !1
        }
        clearBufferToEnd(e) {
            const { sourceBuffer: n } = this
            if (!n || !n.buffered) return
            const d = n.buffered.end(n.buffered.length - 1)
            this.safeSourceBufferRemove(e, d)
        }
        clearBuffer() {
            const { sourceBuffer: e } = this
            if (!e || !e.buffered) return
            const n = e.buffered
            for (let d = 0; d < n.length; d++) this.safeSourceBufferRemove(n.start(d), n.end(d))
        }
        get bufferTimesString() {
            var e
            const n = null === (e = this.sourceBuffer) || void 0 === e ? void 0 : e.buffered
            if (!n) return ""
            const d = []
            for (let h = 0; h < n.length; h++) d.push(`start ${n.start(h)} end: ${n.end(h)}`)
            return d.join(",")
        }
        printBufferTimes() {
            Qa && za.debug("buffer times", this.bufferTimesString)
        }
        getSegmentForTime(e) {
            return Math.floor(e / 10) + 1
        }
        kickstartBuffer() {
            const { hasKickstarted: e, element: n, clip: d } = this,
                { buffered: h } = n
            e ||
                (this.manifest.mediaItem.isSong
                    ? d && this.isTimeBuffered(d.start) && ((n.currentTime = d.start), (this.hasKickstarted = !0))
                    : h.length && ((n.currentTime = h.start(0)), (this.hasKickstarted = !0)))
        }
        printInfo() {
            var e, n
            const { playbackTimeline: d } = this
            za.info("---- Buffer Info ----"),
                za.info("currently buffering item", d.current.manifest.mediaItem.title),
                za.info(
                    "next item to buffer",
                    null === (e = d.next) || void 0 === e ? void 0 : e.manifest.mediaItem.title
                ),
                za.info(
                    "previously buffered item",
                    null === (n = d.previous) || void 0 === n ? void 0 : n.manifest.mediaItem.title
                ),
                za.info("currentTimestampOffset", this.currentTimestampOffset),
                za.info("currentTime", this.currentTime),
                za.info("duration", this.duration),
                za.info("nextSeamlessTransition", this.nextSeamlessTransition),
                za.info("timestampOffsetAdjustment", this.timestampOffsetAdjustment),
                za.info("buffered times", this.bufferTimesString),
                za.info("isAtEndOfStream", this.isAtEndOfStream),
                za.info("isFullyBuffered", this.isFullyBuffered),
                za.info("segmentIndexToFetch", this.segmentIndexToFetch),
                za.info("segments.length", this.segments.length),
                za.info("---- End Buffer Info ----")
        }
        constructor({ dispatcher: e, element: n, manifest: d, currentTime: h, duration: p, clip: y }) {
            ;(this.firstSegmentLoadPromise = Promise.resolve()),
                (this.hasKickstarted = !1),
                (this.segmentIndexToFetch = -1),
                (this.timeToTrim = 10),
                (this.isAtEndOfStream = !1),
                (this.isFullyBuffered = !1),
                (this.deferredRemoves = []),
                (this.currentTimestampOffset = 0),
                (this.dispatcher = e),
                (this.clip = y),
                (this.element = n),
                (this.mediaSource = new MediaSource()),
                this.mediaSource.addEventListener("sourceopen", this.onSourceOpen),
                (this.segmentProcessor = new SegmentProcessor(d.mediaItem, n, e)),
                (this.playbackTimeline = { current: { manifest: d } }),
                d.addEventListener(Ja, this.onManifestParsed),
                (this._currentTime = h || 0),
                (this.duration = p),
                (window.mseBuffer = this)
        }
    }
    function asyncGeneratorStep$E(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$E(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$E(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$E(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    Wa([Bind(), Ya("design:type", Function), Ya("design:paramtypes", [])], MseBuffer.prototype, "onSourceOpen", null),
        Wa(
            [Bind(), Ya("design:type", Function), Ya("design:paramtypes", [])],
            MseBuffer.prototype,
            "onManifestParsed",
            null
        ),
        Wa(
            [Bind(), Ya("design:type", Function), Ya("design:paramtypes", [])],
            MseBuffer.prototype,
            "updateEndHandler",
            null
        )
    var Xa =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Za =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const { mediaPlaybackError: es } = ur
    class AudioPlayer extends BasePlayer {
        get currentPlayingDate() {}
        get isPlayingAtLiveEdge() {
            return !1
        }
        get seekableTimeRanges() {
            return this.currentPlaybackDuration ? [{ start: 0, end: this.currentPlaybackDuration }] : void 0
        }
        get supportsPreviewImages() {
            return !1
        }
        get _targetElement() {
            return this.audio
        }
        initializeExtension() {
            var e = this
            return _asyncToGenerator$E(function* () {
                ;(e.extension = new MediaExtension(e.audio, Vt)),
                    yield e.extension.initializeKeySystem(),
                    e.extension.addEventListener(Yt.playbackLicenseError, (n) => {
                        e.resetDeferredPlay(), e._dispatcher.publish(es, n)
                    }),
                    e.extension.addEventListener(Yt.playbackSessionError, (n) => {
                        e._dispatcher.publish(es, new MKError(MKError.MEDIA_SESSION, n))
                    })
            })()
        }
        initializeMediaElement() {
            var e = this
            return _asyncToGenerator$E(function* () {
                const n = (function () {
                    let e = Wt.pop()
                    return (
                        e
                            ? Rt.debug(`dom-helpers: retrieving audio tag, ${Wt.length} remain`)
                            : (Rt.debug("dom-helpers: no available audio tags, creating one"),
                              (e = document.createElement("audio"))),
                        e
                    )
                })()
                ;(n.autoplay = !1),
                    (n.id = "apple-music-player"),
                    (n.controls = !1),
                    (n.muted = !1),
                    (n.playbackRate = 1),
                    (n.preload = "metadata"),
                    (n.volume = 1),
                    (e.audio = n),
                    document.body.appendChild(n),
                    Rt.debug("initializedMediaElement", n)
            })()
        }
        removeEventHandlers() {
            this._targetElement.removeEventListener("timeupdate", this.onTimeUpdate),
                this._targetElement.removeEventListener("timeupdate", this.delayedCdmUpdateCheck),
                super.removeEventHandlers()
        }
        isPlayerSupported() {
            return !0
        }
        _stopMediaElement() {
            var e = this,
                _superprop_get__stopMediaElement = () => super._stopMediaElement
            return _asyncToGenerator$E(function* () {
                var n
                yield _superprop_get__stopMediaElement().call(e),
                    yield e.tearDownManifests(),
                    null === (n = e._buffer) || void 0 === n || n.stop(),
                    (e._buffer = void 0)
            })()
        }
        setNextSeamlessItem(e) {
            var n = this
            return _asyncToGenerator$E(function* () {
                const { extension: d, nextManifest: h } = n,
                    p = n._buffer
                if (!p || !d) return
                if ((null == h ? void 0 : h.mediaItem.id) === e.id)
                    return void Rt.debug("already have next manifest for ", e.title)
                n._targetElement.removeEventListener("timeupdate", n.onTimeUpdate),
                    n._targetElement.addEventListener("timeupdate", n.onTimeUpdate),
                    Rt.debug("player preparing next manifest for", e.title)
                const y = yield n.loadAndParseManifest(e, !1)
                p.setNextManifest(y), d.setMediaItem(e), (d.extURI = y.extURI), (n.nextManifest = y)
            })()
        }
        playItemFromEncryptedSource(n, d = !1, h) {
            var p = this
            return _asyncToGenerator$E(function* () {
                const y = p._paused && !d
                Rt.debug("playItemFromEncryptedSource", n.title)
                const m = y ? void 0 : p.startPlaybackSequence()
                if (n.playRawAssetURL)
                    return (
                        (n.playbackType = e.PlaybackType.unencryptedFull),
                        (p.nowPlayingItem = n),
                        yield p._playAssetURL(n.assetURL, y),
                        p.finishPlaybackSequence()
                    )
                const { extension: g } = p
                if (!g) return m
                ;(g.initiated = d),
                    g.setMediaItem(n),
                    (n.playbackType = e.PlaybackType.encryptedFull),
                    (p.nowPlayingItem = n),
                    (n.state = $.loading)
                const b = yield p.getManifestForItem(n)
                p.manifest = b
                const _ = shouldForceAudioMse()
                if (
                    ((n.isSong || (g.isFairplay && _)) && (g.extURI = b.extURI),
                    (n.state = $.ready),
                    g.isFairplay && !_)
                ) {
                    let e = n.assetURL
                    ;(null == h ? void 0 : h.startTime) && (e += "#t=" + h.startTime), yield p._playAssetURL(e, y)
                } else {
                    const e = p._buffer
                    e && p.isSeamlessAudioTransitionsEnabled && e.isItemPlaying(b.mediaItem)
                        ? Rt.debug("already have buffer, continuing playback")
                        : yield p.beginNewBufferForItem(y, b, h)
                }
                return p.finishPlaybackSequence()
            })()
        }
        getManifestForItem(e) {
            var n = this
            return _asyncToGenerator$E(function* () {
                var d, h
                Rt.debug("reconciling item to play against playing item")
                const { nextManifest: p, manifest: y, isSeamlessAudioTransitionsEnabled: m } = n,
                    g = n._buffer
                if (!g || !y)
                    return (
                        Rt.debug(
                            "no buffer or manifest, creating manifest [title, buffer, manifest]",
                            e.title,
                            !!g,
                            !!y
                        ),
                        n.loadAndParseManifest(e)
                    )
                if (!m)
                    return (
                        Rt.debug("seamless transitions disabled, stopping and creating manifest for", e.title),
                        yield n.tearDownManifests(),
                        n.loadAndParseManifest(e)
                    )
                const b = !g.isItemPlaying(e)
                let _
                return (
                    Rt.debug("itemMismatch", b),
                    p && !b
                        ? (Rt.debug(
                              `replacing manifest for ${y.mediaItem.title} with next manifest ${p.mediaItem.title}`
                          ),
                          (_ = p),
                          (n.nextManifest = void 0),
                          Rt.debug("cease listening for keys on manifest for", y.mediaItem.title),
                          yield n.tearDownManifest(y))
                        : b
                        ? (null == p ? void 0 : p.mediaItem.id) !== e.id
                            ? (Rt.debug(
                                  `item to play ${e.title} does not match playing or next items, tearing down all manifests`
                              ),
                              yield n.tearDownManifests(),
                              (_ = yield n.loadAndParseManifest(e)))
                            : (Rt.debug(`item to play ${e.title} matches next item, tearing down current manifest`),
                              yield n.tearDownManifest(y),
                              (_ = p))
                        : (Rt.debug("item is already playing, returning existing manifest"), (_ = y)),
                    Rt.debug("getManifestForItem loading keys for", y.mediaItem.title),
                    null === (d = n.extension) ||
                        void 0 === d ||
                        null === (h = d.session) ||
                        void 0 === h ||
                        h.loadKeys(_.keyValues, _.mediaItem),
                    _
                )
            })()
        }
        seekToTime(e) {
            var n = this
            return _asyncToGenerator$E(function* () {
                const d = n._buffer
                if (d) {
                    Rt.debug("audio-player: buffer seek to", e)
                    if (!(yield d.seek(e))) return
                    n.isSeamlessAudioTransitionsEnabled && n.onTimeUpdate()
                } else Rt.debug("audio-player: media element seek to", e), (n._targetElement.currentTime = e)
            })()
        }
        tearDownManifests() {
            var e = this
            return _asyncToGenerator$E(function* () {
                ;(e.manifest = yield e.tearDownManifest(e.manifest)),
                    (e.nextManifest = yield e.tearDownManifest(e.nextManifest))
            })()
        }
        tearDownManifest(e) {
            var n = this
            return _asyncToGenerator$E(function* () {
                const { extension: d } = n
                e &&
                    (Rt.debug("tearing down manifest for", e.mediaItem.title),
                    e.stop(),
                    d && (yield d.clearSessions(e.keyValues)),
                    e.removeEventListener(Ma.keysParsed, n.loadKeysHandler))
            })()
        }
        loadAndParseManifest(e, n = !0) {
            var d = this
            return _asyncToGenerator$E(function* () {
                Rt.debug(`will load and parse manifest for ${e.title}, loadKeys ${n}`)
                const h = yield Manifest.load(e, !1)
                return n && h.addEventListener(Ma.keysParsed, d.loadKeysHandler), h.parse(), h
            })()
        }
        onTimeUpdate() {
            if (!this._buffer) return
            const { currentPlaybackTimeRemaining: e, nextManifest: n, delaySeamlessCdmUpdates: d } = this
            if (n && e < 15) {
                var h, p, y, m
                if ((Rt.debug("player loading keys for", n.mediaItem.title, d), d))
                    null === (h = this.extension) ||
                        void 0 === h ||
                        null === (p = h.session) ||
                        void 0 === p ||
                        p.loadKeys(n.keyValues, n.mediaItem, { delayCdmUpdate: !0 }),
                        this._targetElement.addEventListener("timeupdate", this.delayedCdmUpdateCheck)
                else
                    null === (y = this.extension) ||
                        void 0 === y ||
                        null === (m = y.session) ||
                        void 0 === m ||
                        m.loadKeys(n.keyValues, n.mediaItem)
                this._targetElement.removeEventListener("timeupdate", this.onTimeUpdate)
            }
        }
        delayedCdmUpdateCheck() {
            var e
            const n = null === (e = this.nowPlayingItem) || void 0 === e ? void 0 : e.playbackDuration,
                d = n ? n / 1e3 : this.currentPlaybackDuration,
                h = this._currentTime,
                p = Number((d - h).toFixed(3))
            if (p < 1) {
                const e = 1e3 * p
                Rt.debug("delayed CDM update in ", e),
                    setTimeout(() => {
                        var e, n
                        Rt.debug("applying delayed CDM update"),
                            null === (e = this.extension) ||
                                void 0 === e ||
                                null === (n = e.session) ||
                                void 0 === n ||
                                n.applyDelayedCdmUpdates()
                    }, e),
                    this._targetElement.removeEventListener("timeupdate", this.delayedCdmUpdateCheck)
            }
        }
        loadKeysHandler(e) {
            var n, d
            null === (n = this.extension) ||
                void 0 === n ||
                null === (d = n.session) ||
                void 0 === d ||
                d.loadKeys(e.keys, e.item)
        }
        beginNewBufferForItem(e, n, d) {
            var h = this
            return _asyncToGenerator$E(function* () {
                if (
                    (Rt.debug("creating new MseBuffer for item", n.mediaItem.title, e),
                    h._buffer && (Rt.debug("stopping old buffer"), h._buffer.stop()),
                    (h._buffer = new MseBuffer({
                        dispatcher: h._dispatcher,
                        element: h._targetElement,
                        duration: n.mediaItem.playbackDuration / 1e3,
                        manifest: n
                    })),
                    yield h._playAssetURL(h._buffer.playableUrl, !0),
                    !e)
                ) {
                    let e = Promise.resolve()
                    return (
                        (null == d ? void 0 : d.startTime) && (e = h.seekToTime(d.startTime)),
                        e.then(() => h._playMedia())
                    )
                }
            })()
        }
        setPresentationMode(e) {
            return _asyncToGenerator$E(function* () {
                return Promise.resolve()
            })()
        }
        loadPreviewImage(e) {
            return _asyncToGenerator$E(function* () {})()
        }
        constructor(e) {
            var n, d
            super(e),
                (this.currentAudioTrack = void 0),
                (this.currentTextTrack = void 0),
                (this.textTracks = []),
                (this.audioTracks = []),
                (this.isSeamlessAudioTransitionsEnabled = !1),
                (this.delaySeamlessCdmUpdates = !1),
                (this.mediaPlayerType = "audio")
            const h = null !== (d = null === (n = e.bag) || void 0 === n ? void 0 : n.features) && void 0 !== d ? d : {}
            ;(this.isSeamlessAudioTransitionsEnabled = !!h["seamless-audio-transitions"]),
                (this.delaySeamlessCdmUpdates = !!h["delay-seamless-cdm-updates"]),
                (window.audioPlayer = this)
        }
    }
    function asyncGeneratorStep$D(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$D(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$D(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$D(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    Xa(
        [AsyncDebounce(250), Za("design:type", Function), Za("design:paramtypes", [Number])],
        AudioPlayer.prototype,
        "seekToTime",
        null
    ),
        Xa(
            [Bind(), Za("design:type", Function), Za("design:paramtypes", [])],
            AudioPlayer.prototype,
            "onTimeUpdate",
            null
        ),
        Xa(
            [Bind(), Za("design:type", Function), Za("design:paramtypes", [])],
            AudioPlayer.prototype,
            "delayedCdmUpdateCheck",
            null
        ),
        Xa(
            [Bind(), Za("design:type", Function), Za("design:paramtypes", [void 0])],
            AudioPlayer.prototype,
            "loadKeysHandler",
            null
        )
    class EncryptedSession extends KeySession {
        attachMedia(e, n) {
            var d = this
            return _asyncToGenerator$D(function* () {
                ;(d.keySystem = n.keySystem),
                    (d._keySystemAccess = n),
                    e.addEventListener("encrypted", d.boundHandleSessionCreation, !1)
            })()
        }
        detachMedia(e) {
            e.removeEventListener("encrypted", this.boundHandleSessionCreation)
        }
        createSession(e) {
            var n = this
            return _asyncToGenerator$D(function* () {
                Rt.debug("Encrypted createSession", e)
                const d = n._keySystemAccess
                if (!d) return
                const { initData: h, initDataType: p, target: y } = e
                var m
                return (
                    n._mediaKeysPromise ||
                        (n._mediaKeysPromise = new Promise(
                            ((m = _asyncToGenerator$D(function* (e, h) {
                                const p = yield d.createMediaKeys()
                                try {
                                    yield y.setMediaKeys(p)
                                } catch (Y) {
                                    n.dispatchKeyError(Y), h(Y)
                                }
                                const m = yield n.loadCertificateBuffer()
                                yield p.setServerCertificate(m), (n._mediaKeysServerCertificate = m), e(p)
                            })),
                            function (e, n) {
                                return m.apply(this, arguments)
                            })
                        )),
                    yield n._mediaKeysPromise,
                    n._mediaKeysServerCertificate ? n._createSession(y, h, p) : void 0
                )
            })()
        }
        generatePSSH(e) {
            const n = new Uint8Array([
                    0, 0, 0, 52, 112, 115, 115, 104, 0, 0, 0, 0, 237, 239, 139, 169, 121, 214, 74, 206, 163, 200, 39,
                    220, 213, 29, 33, 237, 0, 0, 0, 20, 8, 1, 18, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ]),
                d = Se(e)
            for (let h = 0; h < d.length; h++) n[n.length - 16 + h] = d[h]
            return Rt.debug("generatePSSH", n), n
        }
        _createSession(e, n, d) {
            const h = e.mediaKeys.createSession(),
                { item: p } = this
            if (!p) return
            this._teardownCurrentSession(), Rt.debug("creating media key session", h)
            let y
            if (this.isWidevine && p.isSong) y = this.generatePSSH(this.extID)
            else {
                const e = (function (e) {
                        const n = [],
                            d = new DataView(e.buffer)
                        for (let h = 0; h < e.length; ) {
                            const p = d.getUint32(h)
                            n.push(new PsshBox(e, h, h + p)), (h += p)
                        }
                        return n
                    })(new Uint8Array(n)).find((e) => e.isWidevine),
                    d = null == e ? void 0 : e.rawBytes,
                    p = ke(d)
                Rt.debug("extracted uri", p), (h.extURI = p), (y = n)
            }
            return (
                h.addEventListener("message", this.startLicenseSession),
                (this._currentSession = h),
                h.generateRequest(d, y).catch((e) => {
                    if (e.message.match(/generateRequest.*\(75\)/)) return h.generateRequest(d, y)
                    throw e
                })
            )
        }
        _teardownCurrentSession() {
            this._currentSession &&
                (Rt.debug("tearing down media key session", this._currentSession),
                this._currentSession.removeEventListener("message", this.startLicenseSession),
                (this._currentSession = void 0))
        }
        applyDelayedCdmUpdates() {}
        loadKeys(e, n, d) {
            return _asyncToGenerator$D(function* () {})()
        }
        clearSessions() {
            return _asyncToGenerator$D(function* () {})()
        }
    }
    function asyncGeneratorStep$C(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$C(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$C(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$C(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class MediaExtensionStub extends Notifications {
        destroy(e) {}
        setMediaItem(e) {}
        initializeKeySystem() {
            var e = this
            return _asyncToGenerator$C(function* () {
                e.session = new EncryptedSession()
            })()
        }
        clearSessions() {
            return _asyncToGenerator$C(function* () {})()
        }
        constructor(e) {
            super(e),
                (this.audioTracks = []),
                (this.textTracks = []),
                (this.extURI = ""),
                (this.hasMediaKeySupport = !0),
                (this.initiated = !0),
                (this.isFairplay = !0),
                (this.hasMediaKeySupport = !0),
                (this.hasMediaSession = !0)
        }
    }
    function asyncGeneratorStep$B(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$B(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$B(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$B(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class PlayerStub {
        get hasMediaElement() {
            return !0
        }
        get isEngagedInPlayback() {
            return !this.paused
        }
        get playbackRate() {
            return this._playbackRate
        }
        set playbackRate(e) {
            ;(this._playbackRate = e), this._dispatcher.publish(ur.playbackRateDidChange, new Event("ratechange"))
        }
        get volume() {
            return this._volume
        }
        set volume(e) {
            ;(this._volume = e), this._dispatcher.publish(ur.playbackVolumeDidChange, new Event("volumeChange"))
        }
        destroy() {}
        dispatch() {}
        exitFullscreen() {
            return _asyncToGenerator$B(function* () {})()
        }
        loadPreviewImage(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        initialize() {
            return _asyncToGenerator$B(function* () {})()
        }
        isPaused() {
            return this.paused
        }
        calculateTime(e) {
            return e
        }
        clearNextManifest() {}
        mute() {}
        newSeeker() {
            return new PlayerSeeker(this)
        }
        pause(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        play() {
            return _asyncToGenerator$B(function* () {})()
        }
        playItemFromEncryptedSource(e, n, d) {
            return _asyncToGenerator$B(function* () {})()
        }
        playItemFromUnencryptedSource(e, n, d) {
            return _asyncToGenerator$B(function* () {})()
        }
        preload() {
            return _asyncToGenerator$B(function* () {})()
        }
        prepareToPlay(e, n, d) {
            return _asyncToGenerator$B(function* () {})()
        }
        seekToTime(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        requestFullscreen() {
            return _asyncToGenerator$B(function* () {})()
        }
        setPlaybackState(e, n) {}
        setPresentationMode(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        showPlaybackTargetPicker() {}
        stop(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        stopMediaAndCleanup() {
            return _asyncToGenerator$B(function* () {})()
        }
        supportsPictureInPicture() {
            return !1
        }
        tsidChanged() {}
        setNextSeamlessItem(e) {
            return _asyncToGenerator$B(function* () {})()
        }
        constructor(n) {
            ;(this.bitrate = e.PlaybackBitrate.STANDARD),
                (this.audioTracks = []),
                (this.currentBufferedProgress = 0),
                (this.currentPlaybackDuration = 0),
                (this.currentPlaybackProgress = 0),
                (this.currentPlaybackTime = 0),
                (this.currentPlaybackTimeRemaining = 0),
                (this.currentPlayingDate = void 0),
                (this.isPlayingAtLiveEdge = !1),
                (this.isPlaying = !1),
                (this.isPrimaryPlayer = !0),
                (this.isReady = !1),
                (this.paused = !1),
                (this.playbackState = e.PlaybackStates.none),
                (this.playbackTargetAvailable = !1),
                (this.playbackTargetIsWireless = !1),
                (this.previewOnly = !1),
                (this.supportsPreviewImages = !1),
                (this.textTracks = []),
                (this.extension = new MediaExtensionStub([])),
                (this.hasAuthorization = !0),
                (this.isDestroyed = !1),
                (this._volume = 1),
                (this._playbackRate = 1),
                (this._dispatcher = n.services.dispatcher),
                (this.windowHandlers = new WindowHandlers(this))
        }
    }
    e.version = "2.2314.3"
    const ts = e.version.split(".")
    ts[0]
    const rs = ts[ts.length - 1]
    var ns
    ;(ts[0] = "3"),
        (ts[ts.length - 1] = rs + "-prerelease"),
        (e.version = ts.join(".")),
        (e.PlaybackActions = void 0),
        ((ns = e.PlaybackActions || (e.PlaybackActions = {})).REPEAT = "REPEAT"),
        (ns.SHUFFLE = "SHUFFLE"),
        (ns.AUTOPLAY = "AUTOPLAY")
    const is = {
        configured: "musickitconfigured",
        loaded: "musickitloaded",
        audioTrackAdded: ur.audioTrackAdded,
        audioTrackChanged: ur.audioTrackChanged,
        audioTrackRemoved: ur.audioTrackRemoved,
        authorizationStatusDidChange: De.authorizationStatusDidChange,
        authorizationStatusWillChange: De.authorizationStatusWillChange,
        bufferedProgressDidChange: ur.bufferedProgressDidChange,
        capabilitiesChanged: "capabilitiesChanged",
        autoplayEnabledDidChange: "autoplayEnabledDidChange",
        drmUnsupported: ur.drmUnsupported,
        eligibleForSubscribeView: De.eligibleForSubscribeView,
        forcedTextTrackChanged: ur.forcedTextTrackChanged,
        mediaCanPlay: ur.mediaCanPlay,
        mediaElementCreated: ur.mediaElementCreated,
        mediaItemStateDidChange: I.mediaItemStateDidChange,
        mediaItemStateWillChange: I.mediaItemStateWillChange,
        mediaPlaybackError: ur.mediaPlaybackError,
        mediaSkipAvailable: "mediaSkipAvailable",
        mediaRollEntered: "mediaRollEntered",
        mediaUpNext: "mediaUpNext",
        metadataDidChange: ur.metadataDidChange,
        nowPlayingItemDidChange: ur.nowPlayingItemDidChange,
        nowPlayingItemWillChange: ur.nowPlayingItemWillChange,
        playbackBitrateDidChange: ur.playbackBitrateDidChange,
        playbackDurationDidChange: ur.playbackDurationDidChange,
        playbackProgressDidChange: ur.playbackProgressDidChange,
        playbackRateDidChange: ur.playbackRateDidChange,
        playbackStateDidChange: ur.playbackStateDidChange,
        playbackStateWillChange: ur.playbackStateWillChange,
        playbackTargetAvailableDidChange: ur.playbackTargetAvailableDidChange,
        playbackTargetIsWirelessDidChange: ur.playbackTargetIsWirelessDidChange,
        playbackTimeDidChange: ur.playbackTimeDidChange,
        playbackVolumeDidChange: ur.playbackVolumeDidChange,
        playerTypeDidChange: ur.playerTypeDidChange,
        presentationModeDidChange: ur.presentationModeDidChange,
        primaryPlayerDidChange: ur.primaryPlayerDidChange,
        queueIsReady: "queueIsReady",
        queueItemsDidChange: "queueItemsDidChange",
        queueItemForStartPosition: "queueItemForStartPosition",
        queuePositionDidChange: "queuePositionDidChange",
        shuffleModeDidChange: "shuffleModeDidChange",
        repeatModeDidChange: "repeatModeDidChange",
        storefrontCountryCodeDidChange: De.storefrontCountryCodeDidChange,
        storefrontIdentifierDidChange: De.storefrontIdentifierDidChange,
        textTrackAdded: ur.textTrackAdded,
        textTrackChanged: ur.textTrackChanged,
        textTrackRemoved: ur.textTrackRemoved,
        timedMetadataDidChange: ur.timedMetadataDidChange,
        userTokenDidChange: De.userTokenDidChange,
        webComponentsLoaded: "musickitwebcomponentsloaded"
    }
    function asyncGeneratorStep$A(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    var as =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ss =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class SpanWatcher {
        startMonitor() {
            this.dispatcher.unsubscribe(is.playbackTimeDidChange, this.handleTimeChange),
                this.dispatcher.subscribe(is.playbackTimeDidChange, this.handleTimeChange)
        }
        stopMonitor() {
            this.dispatcher.unsubscribe(is.playbackTimeDidChange, this.handleTimeChange)
        }
        handleTimeChange(e, { currentPlaybackTime: n }) {
            var d,
                h = this
            return ((d = function* () {
                !Number.isFinite(n) || n < h.start || n > h.stop
                    ? (h.inWatchSpan = !1)
                    : h.inWatchSpan ||
                      (h.allowMultiple || h.stopMonitor(), (h.inWatchSpan = !0), yield h.callback(n, h))
            }),
            function () {
                var e = this,
                    n = arguments
                return new Promise(function (h, p) {
                    var y = d.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$A(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$A(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        constructor(e, n, d, h, p = !1) {
            ;(this.dispatcher = e),
                (this.callback = n),
                (this.start = d),
                (this.stop = h),
                (this.allowMultiple = p),
                (this.inWatchSpan = !1)
        }
    }
    as(
        [Bind(), ss("design:type", Function), ss("design:paramtypes", [void 0, void 0])],
        SpanWatcher.prototype,
        "handleTimeChange",
        null
    )
    var cs =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ls =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class PlaybackMonitor {
        activate() {
            ;(this.isActive = !0), this.startMonitor()
        }
        deactivate() {
            ;(this.isActive = !1), this.clearMonitor()
        }
        clearMonitor() {
            this.isMonitoring && (this.watchers.forEach((e) => e.stopMonitor()), (this.isMonitoring = !1))
        }
        shouldMonitor() {
            return this.isActive
        }
        startMonitor() {
            this.shouldMonitor() && (this.watchers.forEach((e) => e.startMonitor()), (this.isMonitoring = !0))
        }
        handleMediaItemChange() {
            this.isActive && (this.clearMonitor(), this.shouldMonitor() && this.startMonitor())
        }
        constructor(e) {
            ;(this.isActive = !1),
                (this.isMonitoring = !1),
                (this.watchers = []),
                (this.handlePlaybackThreshold = this.handlePlaybackThreshold.bind(this)),
                (this.playbackController = e.controller),
                (this.dispatcher = e.services.dispatcher),
                this.dispatcher.subscribe(is.nowPlayingItemDidChange, this.handleMediaItemChange),
                (this.apiManager = e.services.apiManager)
        }
    }
    function asyncGeneratorStep$z(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    cs(
        [Bind(), ls("design:type", Function), ls("design:paramtypes", [])],
        PlaybackMonitor.prototype,
        "handleMediaItemChange",
        null
    )
    class RollMonitor extends PlaybackMonitor {
        handlePlaybackThreshold(e, n) {
            var d,
                h = this
            return ((d = function* () {
                if (!h.rollMap.has(n)) return
                const e = h.rollMap.get(n)
                h.dispatcher.publish(is.mediaRollEntered, e), h.rollMap.delete(n)
            }),
            function () {
                var e = this,
                    n = arguments
                return new Promise(function (h, p) {
                    var y = d.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$z(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$z(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        shouldMonitor() {
            if (!super.shouldMonitor()) return !1
            return this.getRollMetadata().length > 0
        }
        startMonitor() {
            this.setupWatchers(this.getRollMetadata()), super.startMonitor()
        }
        getRollMetadata() {
            const e = this.playbackController.nowPlayingItem
            return void 0 === e
                ? []
                : (function (e, n = ["pre-roll", "mid-roll", "post-roll"]) {
                      if (void 0 === e.hlsMetadata) return []
                      const d = []
                      return (
                          n.forEach((n) => {
                              const h = parseInt(e.hlsMetadata[n + ".count"], 10)
                              if (!isNaN(h))
                                  for (let p = 0; p < h; p++) {
                                      const h = `${n}.${p}`,
                                          y = {
                                              index: p,
                                              type: n,
                                              skippable: "true" === e.hlsMetadata[h + ".skippable"],
                                              "adam-id": e.hlsMetadata[h + ".adam-id"],
                                              start: Math.round(parseFloat(e.hlsMetadata[h + ".start"])),
                                              duration: Math.round(parseFloat(e.hlsMetadata[h + ".duration"]))
                                          },
                                          m = h + ".dynamic-slot.data-set-id"
                                      void 0 !== e.hlsMetadata[m] && (y["dynamic-id"] = e.hlsMetadata[m]), d.push(y)
                                  }
                          }),
                          d
                      )
                  })(e, ["pre-roll", "post-roll"])
        }
        setupWatchers(e) {
            const n = []
            e.forEach((e) => {
                const { start: d, duration: h } = e,
                    p = new SpanWatcher(this.dispatcher, this.handlePlaybackThreshold, d, d + h)
                n.push(p), this.rollMap.set(p, e)
            }),
                (this.watchers = n)
        }
        constructor(e) {
            super(e), (this.rollMap = new Map())
        }
    }
    function asyncGeneratorStep$y(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    class SkipAvailable extends PlaybackMonitor {
        handlePlaybackThreshold(e, n) {
            var d,
                h = this
            return ((d = function* () {
                if (!h.skipMap.has(n)) return
                const e = h.skipMap.get(n)
                h.dispatcher.publish(is.mediaSkipAvailable, e), h.skipMap.delete(n)
            }),
            function () {
                var e = this,
                    n = arguments
                return new Promise(function (h, p) {
                    var y = d.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$y(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$y(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        shouldMonitor() {
            if (!super.shouldMonitor()) return !1
            return this.getNowPlayingMetadata().length > 0
        }
        startMonitor() {
            this.setupWatchers(this.getNowPlayingMetadata()), super.startMonitor()
        }
        getNowPlayingMetadata() {
            const e = this.playbackController.nowPlayingItem
            return void 0 === e
                ? []
                : (function (e) {
                      const n = parseInt(e.hlsMetadata["skip.count"], 10),
                          d = []
                      if (isNaN(n) || 0 === n) return d
                      for (let h = 0; h < n; h++)
                          d.push({
                              start: parseFloat(e.hlsMetadata[`skip.${h}.start`]),
                              duration: parseFloat(e.hlsMetadata[`skip.${h}.duration`]),
                              target: parseFloat(e.hlsMetadata[`skip.${h}.target`]),
                              label: e.hlsMetadata[`skip.${h}.label`]
                          })
                      return d
                  })(e)
        }
        setupWatchers(e) {
            const n = []
            e.forEach((e) => {
                const { start: d, duration: h } = e,
                    p = new SpanWatcher(this.dispatcher, this.handlePlaybackThreshold, d, d + h)
                n.push(p), this.skipMap.set(p, e)
            }),
                (this.watchers = n)
        }
        constructor(e) {
            super(e), (this.skipMap = new Map())
        }
    }
    const us = BooleanDevFlag.register("mk-send-manifest-headers")
    function asyncGeneratorStep$x(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$x(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$x(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$x(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const ds = ["https://play.itunes.apple.com/", "https://linear.tv.apple.com/", "https://play-edge.itunes.apple.com"]
    const hs = new (class {
        fetchManifest(e) {
            var n = this
            return _asyncToGenerator$x(function* () {
                return (
                    Rt.info("fetching manifest at", e), shouldLoadManifestOnce() ? n.fetchForCache(e) : n.fetchOnly(e)
                )
            })()
        }
        getManifest(e) {
            return this.cache.get(e)
        }
        clear(e) {
            e ? this.cache.delete(e) : this.cache.clear()
        }
        fetchForCache(e) {
            var n = this
            return _asyncToGenerator$x(function* () {
                const d = (function (e) {
                        const n = {}
                        ds.some((n) => e.startsWith(n)) &&
                            ya.musicUserToken &&
                            us.configured &&
                            us.enabled &&
                            ((n["media-user-token"] = ya.musicUserToken),
                            (n.Authorization = "Bearer " + ya.developerToken))
                        return n
                    })(e),
                    h = yield n.fetch(e, { headers: new Headers(d) })
                let p = yield h.text()
                var y
                p = ((e, n) => {
                    Rt.info("converting manifest URIs to absolute paths")
                    const d = new URL(e)
                    let h = n.replace(/URI="([^"]*)"/g, function (e, n) {
                        return `URI="${new URL(n, d).href}"`
                    })
                    return (
                        (h = h.replace(/^(#EXT-X-STREAM-INF:[^\n]*\n)(.*$)/gim, function (e, n, h) {
                            return `${n}${new URL(h, d).href}`
                        })),
                        h
                    )
                })(e, p)
                const m = {
                    url: e,
                    content: p,
                    contentType: null !== (y = h.headers.get("content-type")) && void 0 !== y ? y : void 0
                }
                return n.cache.set(e, m), m
            })()
        }
        fetchOnly(e) {
            var n = this
            return _asyncToGenerator$x(function* () {
                const d = yield n.fetch(e),
                    h = yield d.text()
                var p
                return {
                    url: e,
                    content: h,
                    contentType: null !== (p = d.headers.get("content-type")) && void 0 !== p ? p : void 0
                }
            })()
        }
        constructor(e = {}) {
            var n, d
            ;(this.fetch = null !== (n = e.fetch) && void 0 !== n ? n : fetch.bind(globalThis)),
                (this.cache = null !== (d = e.cache) && void 0 !== d ? d : new Map())
        }
    })()
    function asyncGeneratorStep$w(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$o(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    const hasContentCompletionThresholdData = (e) => !isNaN(getUpNextStart(e)) && !isNaN(getWatchedTime(e)),
        getUpNextStart = (e) => parseFloat(e.hlsMetadata["up-next.start"]),
        getWatchedTime = (e) => parseFloat(e.hlsMetadata["watched.time"]),
        ps =
            ((ys = function* (e, n) {
                if (e.isUTS && e.assetURL)
                    try {
                        const d = generateAssetUrl(e, n),
                            h = yield hs.fetchManifest(d)
                        e.hlsMetadata = (function (e) {
                            for (var n = 1; n < arguments.length; n++) {
                                var d = null != arguments[n] ? arguments[n] : {},
                                    h = Object.keys(d)
                                "function" == typeof Object.getOwnPropertySymbols &&
                                    (h = h.concat(
                                        Object.getOwnPropertySymbols(d).filter(function (e) {
                                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                                        })
                                    )),
                                    h.forEach(function (n) {
                                        _defineProperty$o(e, n, d[n])
                                    })
                            }
                            return e
                        })(
                            {},
                            e.hlsMetadata,
                            (function (e, n = {}) {
                                const d = /^(?:#EXT-X-SESSION-DATA:?)DATA-ID="([^"]+)".+VALUE="([^"]+)".*$/,
                                    h = {}
                                for (const p of e.split("\n")) {
                                    const e = p.match(d)
                                    if (e) {
                                        let d = e[1]
                                        e[1].startsWith("com.apple.hls.") &&
                                            !1 !== n.stripPrefix &&
                                            (d = e[1].slice("com.apple.hls.".length))
                                        const p = e[2]
                                        h[d] = p
                                    }
                                }
                                return h
                            })(h.content)
                        )
                    } catch (Y) {
                        Mt.error(Y.message, Y)
                    }
            }),
            (fs = function () {
                var e = this,
                    n = arguments
                return new Promise(function (d, h) {
                    var p = ys.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$w(p, d, h, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$w(p, d, h, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            }),
            function (e, n) {
                return fs.apply(this, arguments)
            })
    var ys, fs
    function asyncGeneratorStep$v(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    var ms =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        gs =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class UpNextMonitor extends PlaybackMonitor {
        handlePlaybackThreshold() {
            var e = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$v(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$v(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                e.dispatcher.publish(is.mediaUpNext)
            })()
        }
        shouldMonitor() {
            if (!super.shouldMonitor()) return !1
            const e = this.playbackController.nowPlayingItem
            return void 0 !== e && hasContentCompletionThresholdData(e)
        }
        startMonitor() {
            this.setupWatchers(), super.startMonitor()
        }
        setupWatchers() {
            const e = this.playbackController.nowPlayingItem
            e &&
                hasContentCompletionThresholdData(e) &&
                (this.watchers = [
                    new SpanWatcher(
                        this.dispatcher,
                        this.handlePlaybackThreshold,
                        Math.round(this.getStartTime(e)),
                        Number.POSITIVE_INFINITY
                    )
                ])
        }
        getStartTime(e) {
            const n = getUpNextStart(e)
            return isNaN(n) ? getWatchedTime(e) : n
        }
        constructor(e) {
            super(e)
        }
    }
    ms(
        [Bind(), gs("design:type", Function), gs("design:paramtypes", [])],
        UpNextMonitor.prototype,
        "handlePlaybackThreshold",
        null
    )
    const vs = getHlsJsCdnConfig(),
        bs = {
            app: {},
            autoplay: { maxQueueSizeForAutoplay: 50, maxQueueSizeInRequest: 10, maxUpcomingTracksToMaintain: 10 },
            features: { xtrick: !0, isWeb: !0, bookmarking: !1, "seamless-audio-transitions": !0, "enhanced-hls": !1 },
            urls: {
                hls: vs.hls,
                rtc: vs.rtc,
                mediaApi: "https://api.music.apple.com/v1",
                webPlayback: `https://${getCommerceHostname("play")}/WebObjects/MZPlay.woa/wa/webPlayback`
            }
        },
        _s = JsonDevFlag.register("mk-offers-key-urls").get()
    function asyncGeneratorStep$u(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$u(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$u(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$u(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$n(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$f(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    let Ts
    _s && (bs.urls.hlsOffersKeyUrls = _s)
    class Store {
        get authorizationStatus() {
            return this.storekit.authorizationStatus
        }
        get cid() {
            return this.storekit.cid
        }
        get developerToken() {
            return this.storekit.developerToken
        }
        get hasAuthorized() {
            return this._hasAuthorized
        }
        get isAuthorized() {
            return this.storekit.hasAuthorized
        }
        get isRestricted() {
            return this.storekit.authorizationStatus === Ie.RESTRICTED
        }
        get metricsClientId() {
            return this._metricsClientId
        }
        set metricsClientId(e) {
            this._metricsClientId = e
        }
        get musicUserToken() {
            return this.storekit.userToken
        }
        set musicUserToken(e) {
            this.storekit.userToken = e
        }
        set dynamicMusicUserToken(e) {
            this.storekit.dynamicUserToken = e
        }
        get realm() {
            return this.storekit.realm
        }
        set requestUserToken(e) {
            ;(this._providedRequestUserToken = !0), (this.storekit.requestUserToken = e)
        }
        get restrictedEnabled() {
            return this.storekit.restrictedEnabled
        }
        set restrictedEnabled(e) {
            this.storekit.overrideRestrictEnabled(e)
        }
        get storefrontCountryCode() {
            var e
            return this.isAuthorized
                ? this.storekit.storefrontCountryCode
                : null !== (e = this._defaultStorefrontCountryCode) && void 0 !== e
                ? e
                : this.storekit.storefrontCountryCode
        }
        get storefrontId() {
            return this._apiStorefrontId || this.storekit.storefrontCountryCode
        }
        set storefrontId(e) {
            e && (e = e.toLowerCase()),
                e !== this._apiStorefrontId &&
                    ((this._apiStorefrontId = e),
                    this._dispatcher.publish(cr.apiStorefrontChanged, { storefrontId: e }))
        }
        get subscribeURL() {
            return this.storekit.deeplinkURL({ p: "subscribe" })
        }
        get subscribeFamilyURL() {
            return this.storekit.deeplinkURL({ p: "subscribe-family" })
        }
        get subscribeIndividualURL() {
            return this.storekit.deeplinkURL({ p: "subscribe-individual" })
        }
        get subscribeStudentURL() {
            return this.storekit.deeplinkURL({ p: "subscribe-student" })
        }
        get userToken() {
            return this.musicUserToken
        }
        authorize() {
            var e = this
            return _asyncToGenerator$u(function* () {
                if (e.storekit.userTokenIsValid) return e.storekit.userToken
                let n
                try {
                    n = yield e.storekit.requestUserToken()
                } catch (Y) {
                    try {
                        yield e.unauthorize()
                    } catch (Mr) {}
                    throw new MKError(MKError.AUTHORIZATION_ERROR, "Unauthorized")
                }
                return (
                    e._providedRequestUserToken && (e.storekit.userToken = n),
                    e.storekit.userTokenIsValid
                        ? (yield e.storekit.requestStorefrontCountryCode().catch(
                              (function () {
                                  var n = _asyncToGenerator$u(function* (n) {
                                      return yield e.unauthorize(), Promise.reject(n)
                                  })
                                  return function (e) {
                                      return n.apply(this, arguments)
                                  }
                              })()
                          ),
                          n)
                        : void 0
                )
            })()
        }
        unauthorize() {
            var e = this
            return _asyncToGenerator$u(function* () {
                return e.storekit.revokeUserToken()
            })()
        }
        constructor(n, d = {}) {
            ;(this._hasAuthorized = !1),
                (this._providedRequestUserToken = !1),
                (this._ageVerificationRequired = (e, n) => !0),
                (this._dispatcher = d.services.dispatcher),
                d.precache && (this.precache = d.precache),
                d.storefrontId && (this.storefrontId = d.storefrontId),
                (this._defaultStorefrontCountryCode = d.storefrontCountryCode),
                (d.affiliateToken || d.campaignToken) &&
                    (d.linkParameters = _objectSpreadProps$f(
                        (function (e) {
                            for (var n = 1; n < arguments.length; n++) {
                                var d = null != arguments[n] ? arguments[n] : {},
                                    h = Object.keys(d)
                                "function" == typeof Object.getOwnPropertySymbols &&
                                    (h = h.concat(
                                        Object.getOwnPropertySymbols(d).filter(function (e) {
                                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                                        })
                                    )),
                                    h.forEach(function (n) {
                                        _defineProperty$n(e, n, d[n])
                                    })
                            }
                            return e
                        })({}, d.linkParameters || {}),
                        { at: d.affiliateToken, ct: d.campaignToken }
                    )),
                (this.storekit = new StoreKit(n, {
                    apiBase: bs.urls.mediaApi,
                    authenticateMethod: bs.features["legacy-authenticate-method"] ? "POST" : "GET",
                    deeplink: d.linkParameters,
                    disableAuthBridge: d.disableAuthBridge,
                    iconURL: bs.app.icon,
                    meParameters: d.meParameters,
                    persist: d.persist,
                    realm: d.realm || e.SKRealm.MUSIC
                })),
                this.storekit.addEventListener(is.authorizationStatusDidChange, (e) => {
                    const { authorizationStatus: n } = e
                    this._hasAuthorized = [Ie.AUTHORIZED, Ie.RESTRICTED].includes(n)
                })
        }
    }
    function formattedSeconds(e) {
        return { hours: Math.floor(e / 3600), minutes: Math.floor((e % 3600) / 60) }
    }
    function asyncGeneratorStep$t(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$t(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$t(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$t(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function hasAuthorization(e) {
        return void 0 === e && (e = Ts && Ts.storekit), void 0 !== e && e.hasAuthorized && e.userTokenIsValid
    }
    function hasMusicSubscription(e) {
        return _hasMusicSubscription.apply(this, arguments)
    }
    function _hasMusicSubscription() {
        return (_hasMusicSubscription = _asyncToGenerator$t(function* (e) {
            return void 0 === e && (e = Ts && Ts.storekit), e.hasMusicSubscription()
        })).apply(this, arguments)
    }
    var Ss,
        Ps =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Es =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class MediaSessionManager {
        onCapabilitiesChanged() {
            this._resetHandlers(), this._setMediaSessionHandlers()
        }
        onNowPlayingItemDidChange(e, { item: n }) {
            this._setMediaSessionMetadata(n)
        }
        _setMediaSessionMetadata(e) {
            var n, d
            this.session &&
                "MediaMetadata" in window &&
                e &&
                (this.session.metadata = new window.MediaMetadata({
                    title: e.title,
                    artist:
                        null !== (d = e.artistName) && void 0 !== d
                            ? d
                            : null === (n = e.attributes) || void 0 === n
                            ? void 0
                            : n.showTitle,
                    album: e.albumName,
                    artwork: e.artwork
                        ? [96, 128, 192, 256, 384, 512].map((n) => ({
                              src: formatArtworkURL(e.artwork, n, n),
                              sizes: `${n}x${n}`,
                              type: "image/jpeg"
                          }))
                        : []
                }))
        }
        _setMediaSessionHandlers() {
            this.session &&
                (this._resetHandlers(),
                this.session.setActionHandler("play", () => {
                    var e
                    return null === (e = this.controller) || void 0 === e ? void 0 : e.play()
                }),
                this.capabilities.canPause
                    ? this.session.setActionHandler("pause", () => {
                          var e
                          return null === (e = this.controller) || void 0 === e ? void 0 : e.pause()
                      })
                    : this.session.setActionHandler("pause", () => {
                          var e
                          return null === (e = this.controller) || void 0 === e ? void 0 : e.stop()
                      }),
                this.capabilities.canSeek &&
                    (this.session.setActionHandler("seekforward", () => {
                        var e
                        return null === (e = this.controller) || void 0 === e ? void 0 : e.seekForward()
                    }),
                    this.session.setActionHandler("seekbackward", () => {
                        var e
                        return null === (e = this.controller) || void 0 === e ? void 0 : e.seekBackward()
                    })),
                this.capabilities.canSkipToNextItem &&
                    this.session.setActionHandler("nexttrack", () => {
                        var e
                        return null === (e = this.controller) || void 0 === e ? void 0 : e.skipToNextItem()
                    }),
                this.capabilities.canSkipToPreviousItem &&
                    this.session.setActionHandler("previoustrack", () => {
                        var e
                        return null === (e = this.controller) || void 0 === e ? void 0 : e.skipToPreviousItem()
                    }))
        }
        _resetHandlers() {
            this.session &&
                (this.session.setActionHandler("play", void 0),
                this.session.setActionHandler("pause", void 0),
                this.session.setActionHandler("seekforward", void 0),
                this.session.setActionHandler("seekbackward", void 0),
                this.session.setActionHandler("nexttrack", void 0),
                this.session.setActionHandler("previoustrack", void 0))
        }
        constructor(e, n) {
            ;(this.capabilities = e),
                (this.dispatcher = n),
                (this.session = navigator.mediaSession),
                this.session &&
                    (this.dispatcher.subscribe(is.nowPlayingItemDidChange, this.onNowPlayingItemDidChange),
                    this.dispatcher.subscribe(is.capabilitiesChanged, this.onCapabilitiesChanged),
                    this._setMediaSessionHandlers())
        }
    }
    Ps(
        [Bind(), Es("design:type", Function), Es("design:paramtypes", [])],
        MediaSessionManager.prototype,
        "onCapabilitiesChanged",
        null
    ),
        Ps(
            [Bind(), Es("design:type", Function), Es("design:paramtypes", [void 0, void 0])],
            MediaSessionManager.prototype,
            "onNowPlayingItemDidChange",
            null
        ),
        (function (e) {
            ;(e[(e.PAUSE = 0)] = "PAUSE"),
                (e[(e.EDIT_QUEUE = 1)] = "EDIT_QUEUE"),
                (e[(e.SEEK = 2)] = "SEEK"),
                (e[(e.REPEAT = 3)] = "REPEAT"),
                (e[(e.SHUFFLE = 4)] = "SHUFFLE"),
                (e[(e.SKIP_NEXT = 5)] = "SKIP_NEXT"),
                (e[(e.SKIP_PREVIOUS = 6)] = "SKIP_PREVIOUS"),
                (e[(e.SKIP_TO_ITEM = 7)] = "SKIP_TO_ITEM")
        })(Ss || (Ss = {}))
    class Capabilities {
        set controller(e) {
            this._mediaSession.controller = e
        }
        updateChecker(e) {
            this._checkCapability !== e &&
                ((this._checkCapability = e), this._dispatcher.publish(is.capabilitiesChanged))
        }
        get canEditPlaybackQueue() {
            return this._checkCapability(Ss.EDIT_QUEUE)
        }
        get canPause() {
            return this._checkCapability(Ss.PAUSE)
        }
        get canSeek() {
            return this._checkCapability(Ss.SEEK)
        }
        get canSetRepeatMode() {
            return this._checkCapability(Ss.REPEAT)
        }
        get canSetShuffleMode() {
            return this._checkCapability(Ss.SHUFFLE)
        }
        get canSkipToNextItem() {
            return this._checkCapability(Ss.SKIP_NEXT)
        }
        get canSkipToMediaItem() {
            return this._checkCapability(Ss.SKIP_TO_ITEM)
        }
        get canSkipToPreviousItem() {
            return this._checkCapability(Ss.SKIP_PREVIOUS)
        }
        constructor(e) {
            ;(this._dispatcher = e),
                (this._checkCapability = (e) => !1),
                (this._mediaSession = new MediaSessionManager(this, e))
        }
    }
    function _defineProperty$m(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function transform$6(e) {
        return (function (e) {
            for (var n = 1; n < arguments.length; n++) {
                var d = null != arguments[n] ? arguments[n] : {},
                    h = Object.keys(d)
                "function" == typeof Object.getOwnPropertySymbols &&
                    (h = h.concat(
                        Object.getOwnPropertySymbols(d).filter(function (e) {
                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                        })
                    )),
                    h.forEach(function (n) {
                        _defineProperty$m(e, n, d[n])
                    })
            }
            return e
        })(
            { attributes: {} },
            transform$8(
                {
                    id: "metadata.itemId",
                    type: "metadata.itemType",
                    "attributes.contentRating"() {
                        var n
                        if (1 === (null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.isExplicit))
                            return "explicit"
                    },
                    "attributes.playParams"() {
                        var n, d, h
                        return (
                            0 !== (null == e || null === (n = e.metadata) || void 0 === n ? void 0 : n.isPlayable) && {
                                id: null == e || null === (d = e.metadata) || void 0 === d ? void 0 : d.itemId,
                                kind: null == e || null === (h = e.metadata) || void 0 === h ? void 0 : h.itemType
                            }
                        )
                    },
                    "container.id": "metadata.containerId",
                    "container.name": "metadata.containerName",
                    "container.type": "metadata.containerType"
                },
                e
            )
        )
    }
    function _defineProperty$l(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$l(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$l(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$e(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const ks = {
        condition: () => !0,
        toOptions: (e, n, d) => [_objectSpreadProps$e(_objectSpread$l({}, e), { context: d })]
    }
    function _defineProperty$k(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$k(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$k(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$d(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const ws = {
            condition: (e) => {
                var n
                return "stations" === e.type && (null === (n = e.attributes) || void 0 === n ? void 0 : n.isLive)
            },
            toOptions: (e, n, d) => [
                _objectSpreadProps$d(_objectSpread$k({}, e), {
                    context: d,
                    container: {
                        attributes: e.attributes,
                        id: e.id,
                        type: e.type,
                        name: null == d ? void 0 : d.featureName
                    }
                })
            ]
        },
        typeIs =
            (...e) =>
            ({ type: n }) =>
                e.includes(n),
        withBagPrefix = (e) => {
            if (void 0 === e || "" === e) return
            const { prefix: n } = bs
            return n ? `${n}:${e}` : e
        }
    function _defineProperty$j(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$c(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var Is
    const getContainerName$1 = (e, n) => {
            var d
            return null !==
                (Is = null != n ? n : null == e || null === (d = e.container) || void 0 === d ? void 0 : d.name) &&
                void 0 !== Is
                ? Is
                : dr.SONG
        },
        Os = {
            toOptions: (e, n, d) => {
                const h = _objectSpreadProps$c(
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$j(e, n, d[n])
                                })
                        }
                        return e
                    })({ id: e.id }, n),
                    { name: withBagPrefix(getContainerName$1(e, null == d ? void 0 : d.featureName)) }
                )
                return [
                    {
                        relationships: e.relationships,
                        attributes: e.attributes,
                        id: e.id,
                        type: e.type,
                        container: h,
                        context: d
                    }
                ]
            },
            condition: typeIs("songs", "library-songs", "music-videos")
        }
    function _defineProperty$i(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$i(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$i(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$b(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const parseAssets = ({ type: e, attributes: { assetTokens: n } }) =>
            e.includes("udio")
                ? ((e) => {
                      if (void 0 === e) return
                      const [n] = Object.keys(e)
                      return e[n]
                  })(n)
                : ((e) => {
                      if (void 0 === e) return
                      const n = Object.keys(e)
                      return e[n[n.length - 1]]
                  })(n),
        As = {
            condition: typeIs("uploaded-audios", "uploadedAudio", "uploaded-videos", "uploadedVideo"),
            toOptions: (e, n, d) => {
                var h, p
                const y = _objectSpreadProps$b(_objectSpread$i({}, e), {
                    context: d,
                    attributes: _objectSpreadProps$b(_objectSpread$i({}, e.attributes), {
                        assetUrl: parseAssets(e),
                        playParams:
                            null !==
                                (p =
                                    null == e || null === (h = e.attributes) || void 0 === h ? void 0 : h.playParams) &&
                            void 0 !== p
                                ? p
                                : { id: e.id, kind: e.type }
                    })
                })
                return (
                    void 0 !== n && (y.container = n),
                    void 0 !== (null == d ? void 0 : d.featureName) &&
                        (y.container = _objectSpreadProps$b(_objectSpread$i({}, y.container), {
                            name: null == d ? void 0 : d.featureName
                        })),
                    [y]
                )
            }
        }
    const getFeatureName = (e, n) => {
        if (n) return n
        const d = (function (e = []) {
            return (
                0 !== e.length &&
                e.filter(
                    ({ attributes: e }) => !!e && (e.workName || e.movementName || e.movementCount || e.movementNumber)
                ).length > 0
            )
        })(e.relationships.tracks.data)
        return "albums" === e.type || "library-albums" === e.type
            ? d
                ? dr.ALBUM_CLASSICAL
                : dr.ALBUM
            : "playlists" === e.type || "library-playlists" === e.type
            ? d
                ? dr.PLAYLIST_CLASSICAL
                : dr.PLAYLIST
            : void 0
    }
    var Rs
    const Cs = [
            {
                toOptions: (e, n, d) => {
                    const h = {
                        attributes: e.attributes,
                        id: e.id,
                        type: e.type,
                        name: withBagPrefix(getFeatureName(e, null == d ? void 0 : d.featureName))
                    }
                    return e.relationships.tracks.data.map((e) => ({
                        attributes: e.attributes,
                        id: e.id,
                        type: e.type,
                        container: h,
                        context: d
                    }))
                },
                condition:
                    ((Rs = "tracks"),
                    (e) => {
                        var n, d
                        return !!(null === (n = e.relationships) || void 0 === n || null === (d = n[Rs]) || void 0 === d
                            ? void 0
                            : d.data)
                    }),
                requiredRelationships: ["tracks"]
            },
            Os,
            ws,
            As
        ],
        Ms = Cs.reduce((e, n) => {
            const d = n.requiredRelationships
            return d && e.push(...d), e
        }, []),
        Ds = new Set(Ms),
        isArrayOf = (e, n) => Array.isArray(e) && (0 === e.length || n(e[0])),
        isMediaAPIResource = (e) => e && void 0 !== e.id && void 0 !== e.type,
        isMediaItem = (e) => e && void 0 !== e.id,
        isMPMediaItem = (e) =>
            e &&
            void 0 !== e.contentId &&
            void 0 !== e.metadata &&
            void 0 !== e.metadata.itemId &&
            void 0 !== e.metadata.itemType,
        isQueueItems = (e) => e && e.items && Array.isArray(e.items),
        isQueueLoaded = (e) => e && e.loaded,
        isQueueURLOption = (e) => e && e.url
    function _defineProperty$h(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    const xs = jt.linkChild(new Logger("queue")),
        descriptorToMediaItems = (e) => {
            if (!isQueueItems(e) && !isQueueLoaded(e)) return []
            const n = isQueueLoaded(e) ? loadedDescriptorToMediaItem(e) : unloadedDescriptorToMediaItem(e)
            return (
                n.forEach(
                    (n) =>
                        (n.context = (function (e) {
                            for (var n = 1; n < arguments.length; n++) {
                                var d = null != arguments[n] ? arguments[n] : {},
                                    h = Object.keys(d)
                                "function" == typeof Object.getOwnPropertySymbols &&
                                    (h = h.concat(
                                        Object.getOwnPropertySymbols(d).filter(function (e) {
                                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                                        })
                                    )),
                                    h.forEach(function (n) {
                                        _defineProperty$h(e, n, d[n])
                                    })
                            }
                            return e
                        })({}, e.context, n.context))
                ),
                n
            )
        },
        unloadedDescriptorToMediaItem = ({ items: e }) =>
            isArrayOf(e, isMPMediaItem)
                ? e.map((e) => new MediaItem(transform$6(e)))
                : isArrayOf(e, isMediaItem)
                ? e.map((e) => new MediaItem(e))
                : [],
        loadedDescriptorToMediaItem = (e) => {
            const n = [],
                { loaded: d, container: h, context: p } = e
            return void 0 === d
                ? []
                : isArrayOf(d, isDataRecord)
                ? (d.forEach((e) => {
                      n.push(...dataRecordToMediaItems(e, h, p))
                  }),
                  n)
                : isArrayOf(d, isMediaAPIResource)
                ? (d.forEach((e) => {
                      n.push(...resourceToMediaItem(e, h, p))
                  }),
                  n)
                : isDataRecord(d)
                ? dataRecordToMediaItems(d, h, p)
                : isMediaAPIResource(d)
                ? resourceToMediaItem(d, h, p)
                : []
        },
        dataRecordToMediaItems = (e, n, d = {}) => {
            const { data: h } = e.serialize(!0, void 0, {
                includeRelationships: Ds,
                allowFullDuplicateSerializations: !0
            })
            return resourceToMediaItem(h, n, d)
        },
        resourceToMediaItem = (e, n, d = {}) => (
            xs.debug("_resourceToMediaItem", e),
            ((e, n, d = {}) => {
                var h, p, y
                n =
                    null !== (p = null == n || null === (h = n.serialize) || void 0 === h ? void 0 : h.call(n).data) &&
                    void 0 !== p
                        ? p
                        : n
                return (null !== (y = Cs.find((h) => h.condition(e, n, d))) && void 0 !== y ? y : ks)
                    .toOptions(e, n, d)
                    .map((e) => new MediaItem(e))
            })(e, n, d)
        )
    class BaseModifiableQueue {
        append(e) {
            Mt.warn("Append is not supported for this type of playback")
        }
        clear() {
            Mt.warn("Clear is not supported for this type of playback")
        }
        insertAt(e, n) {
            Mt.warn("InsertAt is not supported for this type of playback")
        }
        prepend(e, n = !1) {
            Mt.warn("Prepend is not supported for this type of playback")
        }
        constructor() {
            this.canModifyQueue = !1
        }
    }
    class ModifiableQueue {
        append(e) {
            const n = descriptorToMediaItems(e)
            this.queue.splice(this.queue.appendTargetIndex, 0, n)
        }
        clear() {
            this.queue.length && (this.queue.splice(0, this.queue.length), this.queue.reset())
        }
        insertAt(e, n) {
            const d = descriptorToMediaItems(n)
            this.queue.splice(e, 0, d)
        }
        prepend(e, n = !1) {
            const d = descriptorToMediaItems(e),
                h = this.queue.position + 1
            n && this.queue.splice(h, this.queue.length), this.queue.splice(h, 0, d)
        }
        constructor(e, n) {
            ;(this.canModifyQueue = !0), (this.queue = e), (this._mediaItemPlayback = n)
        }
    }
    var Ls
    ;(e.PlayerRepeatMode = void 0),
        ((Ls = e.PlayerRepeatMode || (e.PlayerRepeatMode = {}))[(Ls.none = 0)] = "none"),
        (Ls[(Ls.one = 1)] = "one"),
        (Ls[(Ls.all = 2)] = "all")
    class BaseRepeatable {
        get repeatMode() {
            return e.PlayerRepeatMode.none
        }
        set repeatMode(e) {
            e !== this.repeatMode && Mt.warn("setting repeatMode is not supported in this playback method")
        }
        constructor() {
            this.canSetRepeatMode = !1
        }
    }
    class Repeatable {
        get repeatMode() {
            return this._repeatMode
        }
        set repeatMode(n) {
            n in e.PlayerRepeatMode &&
                n !== this._repeatMode &&
                ((this._repeatMode = n), this.dispatcher.publish(is.repeatModeDidChange, this._repeatMode))
        }
        constructor(n, d = e.PlayerRepeatMode.none) {
            ;(this.canSetRepeatMode = !0), (this.dispatcher = n), (this._repeatMode = d)
        }
    }
    function _defineProperty$g(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function asyncGeneratorStep$s(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$s(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$s(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$s(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    !(function (e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$g(e, n, d[n])
                })
        }
    })({}, { NEXT_ITEM: "NEXT" }, e.PlayActivityEndReasonType)
    const Ns = ["musicVideo"],
        js = (function () {
            var e = _asyncToGenerator$s(function* () {})
            return function () {
                return e.apply(this, arguments)
            }
        })()
    class BaseSeekable {
        getSeekSeconds(e) {
            return (
                Mt.warn("Seeking by predetermined amounts are not supported in this playback method"),
                { BACK: 0, FORWARD: 0 }
            )
        }
        seekBackward(e = js) {
            Mt.warn("seekBackward is not supported in this playback method")
        }
        seekForward(e = js) {
            Mt.warn("seekForward is not supported in this playback method")
        }
        seekToTime(e, n) {
            return _asyncToGenerator$s(function* () {
                Mt.warn("seekToTime is not supported in this playback method")
            })()
        }
        constructor(e) {
            ;(this.mediaItemPlayback = e), (this.canSeek = !1)
        }
    }
    class Seekable {
        getSeekSeconds(e) {
            return ((e) =>
                (null == e ? void 0 : e.isUTS) || Ns.includes(null == e ? void 0 : e.type)
                    ? { FORWARD: 10, BACK: 10 }
                    : { FORWARD: 30, BACK: 15 })(e)
        }
        seekBackward(e = this._seekToBeginning) {
            var n = this
            return _asyncToGenerator$s(function* () {
                if (void 0 === n.mediaItemPlayback.nowPlayingItem)
                    return void Mt.warn("Cannot seekBackward when nowPlayingItem is not yet set.")
                const d =
                    n.mediaItemPlayback.currentPlaybackTime - n.getSeekSeconds(n.mediaItemPlayback.nowPlayingItem).BACK
                d < 0 ? yield e.call(n) : yield n.seekToTime(d, yr.Interval)
            })()
        }
        seekForward(e = this._seekToEnd) {
            var n = this
            return _asyncToGenerator$s(function* () {
                if (void 0 === n.mediaItemPlayback.nowPlayingItem)
                    return void Mt.warn("Cannot seekForward when nowPlayingItem is not yet set.")
                const d =
                    n.mediaItemPlayback.currentPlaybackTime +
                    n.getSeekSeconds(n.mediaItemPlayback.nowPlayingItem).FORWARD
                d > n.mediaItemPlayback.currentPlaybackDuration ? yield e.call(n) : yield n.seekToTime(d, yr.Interval)
            })()
        }
        seekToTime(e, n = yr.Manual) {
            var d = this
            return _asyncToGenerator$s(function* () {
                if (void 0 === d.mediaItemPlayback.nowPlayingItem)
                    return void Mt.warn("Cannot seekToTime when nowPlayingItem is not yet set.")
                const h = d.mediaItemPlayback.nowPlayingItem,
                    p = d.mediaItemPlayback.currentPlaybackTime,
                    y = d.mediaItemPlayback.currentPlayingDate,
                    m = Math.min(Math.max(0, e), d.mediaItemPlayback.currentPlaybackDuration - 1)
                let g
                if (h.isLinearStream && void 0 !== y) {
                    const e = 1e3 * (m - p)
                    g = new Date(y.getTime() + e)
                }
                yield d.mediaItemPlayback.seekToTime(m, n),
                    d._dispatcher.publish(cr.playbackSeek, {
                        item: h,
                        startPosition: p,
                        position: m,
                        playingDate: g,
                        startPlayingDate: y,
                        seekReasonType: n
                    })
            })()
        }
        _seekToBeginning() {
            var e = this
            return _asyncToGenerator$s(function* () {
                yield e.seekToTime(0, yr.Interval)
            })()
        }
        _seekToEnd() {
            var e = this
            return _asyncToGenerator$s(function* () {
                yield e.seekToTime(e.mediaItemPlayback.currentPlaybackDuration, yr.Interval)
            })()
        }
        constructor(e, n) {
            ;(this._dispatcher = e), (this.mediaItemPlayback = n), (this.canSeek = !0)
        }
    }
    const shuffleCollection = (e) => {
        const n = [...e],
            { length: d } = n
        for (let h = 0; h < d; ++h) {
            const e = h + Math.floor(Math.random() * (d - h)),
                p = n[e]
            ;(n[e] = n[h]), (n[h] = p)
        }
        return n
    }
    function _objectWithoutProperties$1(e, n) {
        if (null == e) return {}
        var d,
            h,
            p = (function (e, n) {
                if (null == e) return {}
                var d,
                    h,
                    p = {},
                    y = Object.keys(e)
                for (h = 0; h < y.length; h++) (d = y[h]), n.indexOf(d) >= 0 || (p[d] = e[d])
                return p
            })(e, n)
        if (Object.getOwnPropertySymbols) {
            var y = Object.getOwnPropertySymbols(e)
            for (h = 0; h < y.length; h++)
                (d = y[h]), n.indexOf(d) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, d) && (p[d] = e[d]))
        }
        return p
    }
    const Us = jt.createChild("queue")
    class QueueItem {
        restrict() {
            return this.item.restrict()
        }
        constructor(e, n) {
            var d
            ;(this.isAutoplay = !1),
                (this.item = e),
                (this.isAutoplay = null !== (d = null == n ? void 0 : n.isAutoplay) && void 0 !== d && d)
        }
    }
    function toQueueItems(e, n) {
        return e.map((e) => new QueueItem(e, n))
    }
    function toMediaItems(e) {
        return e.map((e) => e.item)
    }
    const parseQueueURLOption = (e) => {
            if (!isQueueURLOption(e)) return e
            const { url: n } = e,
                d = _objectWithoutProperties$1(e, ["url"]),
                { contentId: h, kind: p, storefrontId: y } = formattedMediaURL(n)
            return (d[p] = h), (Ts.storefrontId = y), Us.debug("parseQueueURLOption", d), d
        },
        { queueItemsDidChange: $s, queuePositionDidChange: Gs } = is
    class Queue {
        get isEmpty() {
            return 0 === this.length
        }
        set isRestricted(e) {
            ;(this._isRestricted = e),
                this._isRestricted &&
                    this._queueItems &&
                    this._queueItems.forEach((e) => {
                        e.restrict()
                    })
        }
        get isRestricted() {
            return this._isRestricted
        }
        get appendTargetIndex() {
            let e = this.length
            const n = this._queueItems.findIndex((e) => e.isAutoplay)
            return -1 !== n && this.position < n && (e = n), e
        }
        get items() {
            return toMediaItems(this._queueItems)
        }
        get autoplayItems() {
            return toMediaItems(this._queueItems.filter((e) => e.isAutoplay))
        }
        get unplayedAutoplayItems() {
            return toMediaItems(this._unplayedQueueItems.filter((e) => e.isAutoplay))
        }
        get userAddedItems() {
            return toMediaItems(this._queueItems.filter((e) => !e.isAutoplay))
        }
        get unplayedUserItems() {
            return toMediaItems(this._unplayedQueueItems.filter((e) => !e.isAutoplay))
        }
        get playableItems() {
            return toMediaItems(this._queueItems.filter((e) => canPlay(e.item)))
        }
        get unplayedPlayableItems() {
            return toMediaItems(this._unplayedQueueItems.filter((e) => canPlay(e.item)))
        }
        get length() {
            return this._queueItems.length
        }
        get nextPlayableItem() {
            if (-1 !== this.nextPlayableItemIndex) return this.item(this.nextPlayableItemIndex)
        }
        get nextPlayableItemIndex() {
            return (this._nextPlayableItemIndex = this.findPlayableIndexForward()), this._nextPlayableItemIndex
        }
        get position() {
            return this._position
        }
        set position(e) {
            this._updatePosition(e)
        }
        get isInitiated() {
            return this.position >= 0
        }
        get previousPlayableItem() {
            if (-1 !== this.previousPlayableItemIndex) return this.item(this.previousPlayableItemIndex)
        }
        get previousPlayableItemIndex() {
            return this.findPlayableIndexBackward()
        }
        removeQueueItems(e) {
            for (let n = this.length - 1; n >= 0; n--) e(this.queueItem(n), n) && this.spliceQueueItems(n, 1)
        }
        indexForItem(e) {
            return ("string" == typeof e ? this._itemIDs : this.items).indexOf(e)
        }
        item(e) {
            var n
            return null === (n = this.queueItem(e)) || void 0 === n ? void 0 : n.item
        }
        get currentItem() {
            return this.item(this.position)
        }
        queueItem(e) {
            var n
            return null === (n = this._queueItems) || void 0 === n ? void 0 : n[e]
        }
        get currentQueueItem() {
            return this.queueItem(this.position)
        }
        remove(e) {
            if (
                (deprecationWarning("remove", { message: "The queue remove function has been deprecated" }),
                e === this.position)
            )
                throw new MKError(MKError.INVALID_ARGUMENTS)
            this.splice(e, 1)
        }
        append(e = []) {
            return this.appendQueueItems(toQueueItems(e))
        }
        appendQueueItems(e = []) {
            return this.spliceQueueItems(this.appendTargetIndex, 0, e)
        }
        splice(e, n, d = []) {
            return toMediaItems(this.spliceQueueItems(e, n, toQueueItems(d)))
        }
        spliceQueueItems(e, n, d = [], h = !0) {
            d = d.filter((e) => isPlayable(null == e ? void 0 : e.item))
            const p = this._queueItems.splice(e, n, ...d)
            return (
                this._itemIDs.splice(e, n, ...d.map((e) => e.item.id)),
                h &&
                    (this._dispatcher.publish(cr.queueModified, {
                        start: e,
                        added: toMediaItems(d),
                        removed: toMediaItems(p)
                    }),
                    this._dispatcher.publish($s, this.items)),
                p
            )
        }
        reset() {
            const e = this.position
            ;(this._position = -1), this._dispatcher.publish(Gs, { oldPosition: e, position: this.position })
        }
        _isSameItems(e) {
            if (e.length !== this.length) return !1
            const n = e.map((e) => e.id).sort(),
                d = [...this._itemIDs].sort()
            let h, p
            try {
                ;(h = JSON.stringify(n)), (p = JSON.stringify(d))
            } catch (Mr) {
                return !1
            }
            return h === p
        }
        _reindex() {
            this._queueItems && (this._itemIDs = this._queueItems.map((e) => e.item.id))
        }
        _updatePosition(e) {
            if (e === this._position) return
            const n = this._position
            this._position = e
            const d = this.item(e)
            ;(d && canPlay(d)) || (this._position = this.findPlayableIndexForward(e)),
                this._position !== n && this._dispatcher.publish(Gs, { oldPosition: n, position: this._position })
        }
        findPlayableIndexForward(n = this.position) {
            var d
            if (this.isEmpty) return -1
            if (this.isInitiated && !indexInBounds([0, this.position], n)) return -1
            const h = null === (d = this.repeatable) || void 0 === d ? void 0 : d.repeatMode
            if (n < this.length)
                for (let e = n + 1; e < this.length; e++) {
                    if (canPlay(this.item(e))) return e
                }
            if (h === e.PlayerRepeatMode.all)
                for (let e = 0; e <= n; e++) {
                    if (canPlay(this.item(e))) return e
                }
            return -1
        }
        findPlayableIndexBackward(n = this.position) {
            var d
            if (this.isEmpty) return -1
            if (!indexInBounds([0, this.position], n)) return -1
            const h = null === (d = this.repeatable) || void 0 === d ? void 0 : d.repeatMode
            if (n > 0)
                for (let e = n - 1; e >= 0; e--) {
                    if (canPlay(this.item(e))) return e
                }
            if (h === e.PlayerRepeatMode.all)
                for (let e = this.length - 1; e >= n; e--) {
                    if (canPlay(this.item(e))) return e
                }
            return -1
        }
        get _unplayedQueueItems() {
            const e = this.position < 0 ? 0 : this.position
            return this._queueItems.slice(e)
        }
        _getStartItemPosition(e) {
            if (void 0 === e) return -1
            if (("object" == typeof e && "id" in e && (e = e.id), "string" == typeof e)) return this.indexForItem(e)
            const n = parseInt("" + e, 10)
            return n >= 0 && n < this.length ? n : -1
        }
        constructor(e) {
            if (
                ((this.hasAutoplayStation = !1),
                (this._itemIDs = []),
                (this._queueItems = []),
                (this._isRestricted = !1),
                (this._nextPlayableItemIndex = -1),
                (this._position = -1),
                (this._dispatcher = e.services.dispatcher),
                !e.descriptor)
            )
                return
            const n = descriptorToMediaItems(e.descriptor).filter((e) => isPlayable(e))
            ;(this._queueItems = toQueueItems(n)),
                this._reindex(),
                void 0 !== e.descriptor.startWith &&
                    (this.position = this._getStartItemPosition(e.descriptor.startWith))
        }
    }
    function isPlayable(e) {
        return e.isPlayable || void 0 !== e.previewURL
    }
    function canPlay(e) {
        return (
            isPlayable(e) &&
            !(function (e) {
                return e.isRestricted
            })(e) &&
            !(function (e) {
                return e.isUnavailable
            })(e)
        )
    }
    function indexInBounds(e, n) {
        return e[0] <= n && n <= e[1]
    }
    var Bs,
        Fs =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Ks =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    ;(e.PlayerShuffleMode = void 0),
        ((Bs = e.PlayerShuffleMode || (e.PlayerShuffleMode = {}))[(Bs.off = 0)] = "off"),
        (Bs[(Bs.songs = 1)] = "songs")
    const Vs = "Shuffling is not supported in this playback method."
    class BaseShuffler {
        set shuffle(e) {
            Mt.warn(Vs)
        }
        get shuffleMode() {
            return e.PlayerShuffleMode.off
        }
        set shuffleMode(e) {
            Mt.warn(Vs)
        }
        checkAndReshuffle(e) {
            Mt.warn(Vs)
        }
        constructor() {
            this.canSetShuffleMode = !1
        }
    }
    class Shuffler {
        get queue() {
            return this._queue
        }
        set queue(e) {
            ;(this._queue = e), (this._unshuffledIDs = e.userAddedItems.map((e) => e.id)), this.checkAndReshuffle(!1)
        }
        queueModifiedHandler(e, n) {
            if (this._isSpliceFromShuffle) return void (this._isSpliceFromShuffle = !1)
            const { start: d, added: h, removed: p } = n
            if (p.length > 0) {
                const e = p.map((e) => e.id)
                this._unshuffledIDs = this._unshuffledIDs.filter((n) => !e.includes(n))
            }
            h.length > 0 && this._unshuffledIDs.splice(d, 0, ...h.map((e) => e.id))
        }
        set shuffle(n) {
            this.shuffleMode = n ? e.PlayerShuffleMode.songs : e.PlayerShuffleMode.off
        }
        get shuffleMode() {
            return this.mode
        }
        set shuffleMode(n) {
            n !== this.shuffleMode &&
                n in e.PlayerShuffleMode &&
                (Mt.debug(`mk: set shuffleMode from ${this.shuffleMode} to ${n}`),
                (this.mode = n),
                this.mode === e.PlayerShuffleMode.songs ? this.shuffleQueue() : this.unshuffleQueue(),
                this.controller.nowPlayingItem &&
                    (this._queue.position = this._queue.indexForItem(this.controller.nowPlayingItem.id)),
                this.dispatcher.publish(is.shuffleModeDidChange, this.shuffleMode))
        }
        checkAndReshuffle(n = !1) {
            this.shuffleMode === e.PlayerShuffleMode.songs && this.shuffleQueue(n)
        }
        shuffleQueue(e = !0) {
            const { userAddedItems: n } = this._queue
            if (n.length <= 1) return n
            const d = n.slice(0),
                h = this._queue.position > -1 ? d.splice(this._queue.position, 1) : []
            let p = []
            do {
                p = shuffleCollection(d)
            } while (d.length > 1 && arrayEquals(p, d))
            const y = [...h, ...p]
            ;(this._isSpliceFromShuffle = !0), this._queue.spliceQueueItems(0, y.length, toQueueItems(y), e)
        }
        unshuffleQueue(e = !0) {
            let n = []
            const d = this._unshuffledIDs.reduce((e, n, d) => ((e[n] = d), e), {}),
                h = []
            let p = 0
            const y = this._queue.item(this._queue.position)
            this._queue.userAddedItems.forEach((e) => {
                const m = d[e.id]
                void 0 === m && h.push(e), (n[m] = e), e.id === (null == y ? void 0 : y.id) && (p = m)
            }),
                (n = n.filter(Boolean))
            const m = n.concat(h)
            ;(this._isSpliceFromShuffle = !0),
                this._queue.spliceQueueItems(0, m.length, toQueueItems(m), e),
                (this._queue.position = p)
        }
        constructor(n, { dispatcher: d }) {
            ;(this.controller = n),
                (this.canSetShuffleMode = !0),
                (this.mode = e.PlayerShuffleMode.off),
                (this._unshuffledIDs = []),
                (this._isSpliceFromShuffle = !1),
                (this.dispatcher = d),
                this.dispatcher.subscribe(cr.queueModified, this.queueModifiedHandler),
                (this._queue = n.queue)
        }
    }
    function asyncGeneratorStep$r(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$r(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$r(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$r(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$f(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$f(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$f(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$a(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    Fs(
        [Bind(), Ks("design:type", Function), Ks("design:paramtypes", [String, Object])],
        Shuffler.prototype,
        "queueModifiedHandler",
        null
    )
    var Hs,
        qs =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Ws =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    !(function (e) {
        ;(e.continuous = "continuous"), (e.serial = "serial")
    })(Hs || (Hs = {}))
    const { queueItemsDidChange: Ys } = is
    class PlaybackController {
        updateAutoplay(e, n) {
            this.autoplayEnabled = n
        }
        constructContext(e, n) {
            let d = e.context
            var h
            return (
                void 0 !== e.featureName &&
                    void 0 === (null == d ? void 0 : d.featureName) &&
                    (Mt.warn("featureName is deprecated, pass it inside context"),
                    d || (d = {}),
                    (d.featureName = e.featureName)),
                null !== (h = null != d ? d : n) && void 0 !== h ? h : {}
            )
        }
        get context() {
            return this._context
        }
        get continuous() {
            return this._continuous || this.hasAuthorization
        }
        set continuous(e) {
            this._continuous = e
        }
        get autoplayEnabled() {
            return this._autoplayEnabled
        }
        set autoplayEnabled(e) {
            this._autoplayEnabled = e
        }
        get previewOnly() {
            return this._mediaItemPlayback.previewOnly
        }
        get _dispatcher() {
            return this._services.dispatcher
        }
        get hasAuthorization() {
            return hasAuthorization(this.storekit)
        }
        get isPlaying() {
            return this._mediaItemPlayback.isPlaying
        }
        get isPrimaryPlayer() {
            return this._mediaItemPlayback.isPrimaryPlayer
        }
        set isPrimaryPlayer(e) {
            this._mediaItemPlayback.isPrimaryPlayer = e
        }
        get isReady() {
            return this._mediaItemPlayback.isReady
        }
        get _mediaItemPlayback() {
            return this._services.mediaItemPlayback
        }
        get nowPlayingItem() {
            return this._mediaItemPlayback.nowPlayingItem
        }
        get nowPlayingItemIndex() {
            return this.queue ? this.queue.position : -1
        }
        get queue() {
            return this._queue
        }
        set queue(e) {
            this._prepareQueue(e),
                (this._queue = e),
                (this._shuffler.queue = this._queue),
                (this._queueModifier.queue = this._queue),
                this._dispatcher.publish(Ys, e.items)
        }
        get repeatMode() {
            return this._repeatable.repeatMode
        }
        set repeatMode(e) {
            this._repeatable.repeatMode = e
        }
        get seekSeconds() {
            const { nowPlayingItem: e } = this
            if (void 0 !== e) return this._seekable.getSeekSeconds(e)
        }
        set shuffle(e) {
            this._shuffler.shuffle = e
        }
        get shuffleMode() {
            return this._shuffler.shuffleMode
        }
        set shuffleMode(e) {
            this._shuffler.shuffleMode = e
        }
        get storekit() {
            return this._storekit
        }
        set storekit(n) {
            if (n) {
                var d = this
                n.addEventListener(
                    De.authorizationStatusWillChange,
                    (function () {
                        var n = _asyncToGenerator$r(function* ({ authorizationStatus: n, newAuthorizationStatus: h }) {
                            n > Ie.DENIED && h < Ie.RESTRICTED
                                ? yield d.stop({
                                      endReasonType: e.PlayActivityEndReasonType.PLAYBACK_SUSPENDED,
                                      userInitiated: !1
                                  })
                                : yield d.stop({ userInitiated: !1 })
                        })
                        return function (e) {
                            return n.apply(this, arguments)
                        }
                    })()
                ),
                    (this._storekit = n)
            }
        }
        append(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                const d = yield n._dataForQueueOptions(e)
                return n._queueModifier.append(d), n.queue
            })()
        }
        insertAt(e, n) {
            var d = this
            return _asyncToGenerator$r(function* () {
                const h = yield d._dataForQueueOptions(n)
                return d._queueModifier.insertAt(e, h), d.queue
            })()
        }
        _dataForQueueOptions(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                const d = n.constructContext(e, n.context)
                return _objectSpreadProps$a(_objectSpread$f({}, e), { context: d })
            })()
        }
        clear() {
            var e = this
            return _asyncToGenerator$r(function* () {
                return e._queueModifier.clear(), e.queue
            })()
        }
        changeToMediaAtIndex(e = 0) {
            var n = this
            return _asyncToGenerator$r(function* () {
                var d, h, p
                yield n.stop()
                const y = null === (d = n.queue.item(e)) || void 0 === d ? void 0 : d.id,
                    m =
                        null === (h = n._mediaItemPlayback) ||
                        void 0 === h ||
                        null === (p = h.playOptions) ||
                        void 0 === p
                            ? void 0
                            : p.get(y)
                let g = (null == m ? void 0 : m.startTime) || 0
                const b = yield n._changeToMediaAtIndex(e, { userInitiated: !0 })
                b && (b.id !== y && (g = 0), n._dispatcher.publish(cr.playbackPlay, { item: b, position: g }))
            })()
        }
        changeToMediaItem(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                const d = n.queue.indexForItem(e)
                return -1 === d ? Promise.reject(new MKError(MKError.MEDIA_DESCRIPTOR)) : n.changeToMediaAtIndex(d)
            })()
        }
        activate() {
            Mt.debug("mk: base controller - activate"),
                this._dispatcher.unsubscribe(is.playbackStateDidChange, this.onPlaybackStateDidChange),
                this._dispatcher.subscribe(is.playbackStateDidChange, this.onPlaybackStateDidChange),
                this._skipIntro.activate(),
                this._upNext.activate(),
                this._rollMonitor.activate()
        }
        deactivate() {
            var e = this
            return _asyncToGenerator$r(function* () {
                yield e.stop(),
                    e._dispatcher.unsubscribe(is.playbackStateDidChange, e.onPlaybackStateDidChange),
                    e._skipIntro.deactivate(),
                    e._upNext.deactivate(),
                    e._rollMonitor.deactivate()
            })()
        }
        destroy() {
            var e = this
            return _asyncToGenerator$r(function* () {
                yield e.deactivate(), e._dispatcher.unsubscribe(is.autoplayEnabledDidChange, e.updateAutoplay)
            })()
        }
        hasCapabilities(e) {
            switch (e) {
                case Ss.SEEK:
                    return this._seekable.canSeek
                case Ss.REPEAT:
                    return this._repeatable.canSetRepeatMode
                case Ss.SHUFFLE:
                    return this._shuffler.canSetShuffleMode
                case Ss.EDIT_QUEUE:
                    return this._queueModifier.canModifyQueue
                case Ss.PAUSE:
                case Ss.SKIP_NEXT:
                case Ss.SKIP_TO_ITEM:
                    return !0
                case Ss.SKIP_PREVIOUS:
                default:
                    return !1
            }
        }
        pause(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                return n._mediaItemPlayback.pause(e)
            })()
        }
        play() {
            var e = this
            return _asyncToGenerator$r(function* () {
                if (e.nowPlayingItem) return e._mediaItemPlayback.play()
                if (!e._queue || e._queue.isEmpty) return
                if (e.nowPlayingItemIndex >= 0) return e.changeToMediaAtIndex(e.nowPlayingItemIndex)
                const { queue: n } = e
                if (-1 !== n.nextPlayableItemIndex) return e.changeToMediaAtIndex(n.nextPlayableItemIndex)
                n.isRestricted &&
                    n.items.every((e) => e.isRestricted) &&
                    e._dispatcher.publish(
                        is.mediaPlaybackError,
                        new MKError(MKError.CONTENT_RESTRICTED, "Content restricted")
                    )
            })()
        }
        playSingleMediaItem(e, n) {
            var d = this
            return _asyncToGenerator$r(function* () {
                yield ps(e, n), d._dispatcher.publish(is.queueItemsDidChange, [e])
                const h = yield d._mediaItemPlayback.startMediaItemPlayback(e, !0)
                if (h) {
                    var p
                    const e = {
                        item: h,
                        position: null !== (p = d._mediaItemPlayback.currentPlaybackTime) && void 0 !== p ? p : 0,
                        playingDate: d._mediaItemPlayback.currentPlayingDate,
                        userInitiated: !0
                    }
                    Mt.debug("playSingleMediaItem: Dispatching DispatchTypes.playbackPlay event", e),
                        d._dispatcher.publish(cr.playbackPlay, e)
                }
            })()
        }
        onPlaybackStateDidChange(n, d) {
            var h = this
            return _asyncToGenerator$r(function* () {
                d.state === e.PlaybackStates.ended &&
                    (h.continuous || h.repeatMode === e.PlayerRepeatMode.one) &&
                    (Mt.debug("controller detected track ended event, moving to next item."),
                    h._dispatcher.publish(cr.applicationActivityIntent, {
                        endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS,
                        userInitiated: !1
                    }),
                    yield h._next())
            })()
        }
        preload() {
            var e = this
            return _asyncToGenerator$r(function* () {
                return e._mediaItemPlayback.preload()
            })()
        }
        prepend(e, n) {
            var d = this
            return _asyncToGenerator$r(function* () {
                const h = yield d._dataForQueueOptions(e)
                return d._queueModifier.prepend(h, n), d.queue
            })()
        }
        prepareToPlay(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                return n._mediaItemPlayback.prepareToPlay(e)
            })()
        }
        showPlaybackTargetPicker() {
            this._mediaItemPlayback.showPlaybackTargetPicker()
        }
        seekBackward() {
            var e = this
            return _asyncToGenerator$r(function* () {
                return e._seekable.seekBackward()
            })()
        }
        seekForward() {
            var e = this
            return _asyncToGenerator$r(function* () {
                return e._seekable.seekForward(e.skipToNextItem.bind(e))
            })()
        }
        skipToNextItem() {
            var e = this
            return _asyncToGenerator$r(function* () {
                return e._next({ userInitiated: !0 })
            })()
        }
        getNewSeeker() {
            return this._mediaItemPlayback.getNewSeeker()
        }
        seekToTime(e, n) {
            var d = this
            return _asyncToGenerator$r(function* () {
                yield d._seekable.seekToTime(e, n)
            })()
        }
        setQueue(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                return yield n.extractGlobalValues(e), yield n._mediaItemPlayback.stop(), n.returnQueueForOptions(e)
            })()
        }
        extractGlobalValues(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                ;(n._context = n.constructContext(e)),
                    void 0 !== e.featureName &&
                        e.context &&
                        (Mt.warn("featureName is deprecated, pass it inside context"),
                        (e.context.featureName = e.featureName))
            })()
        }
        stop(e) {
            var n = this
            return _asyncToGenerator$r(function* () {
                yield n._mediaItemPlayback.stop(e)
            })()
        }
        _changeToMediaAtIndex(e = 0, n = {}) {
            var d = this
            return _asyncToGenerator$r(function* () {
                if (d.queue.isEmpty) return
                d.queue.position = e
                const h = d.queue.item(d.queue.position)
                if (!h) return
                var p
                const y = yield d._mediaItemPlayback.startMediaItemPlayback(
                    h,
                    null !== (p = n.userInitiated) && void 0 !== p && p
                )
                if (y || h.state !== $.unsupported) return y
                yield d.skipToNextItem()
            })()
        }
        _next(e = {}) {
            var n = this
            return _asyncToGenerator$r(function* () {
                return n._nextAtIndex(n.queue.nextPlayableItemIndex, e)
            })()
        }
        _nextAtIndex(n, d = {}) {
            var h = this
            return _asyncToGenerator$r(function* () {
                if (h.queue.isEmpty) return
                const { _mediaItemPlayback: p } = h
                var y
                const m = null !== (y = d.userInitiated) && void 0 !== y && y
                if (n < 0)
                    return (
                        Mt.debug("controller/index._next no next item available, stopping playback"),
                        yield h.stop({ userInitiated: m, seamlessAudioTransition: d.seamlessAudioTransition }),
                        void (p.playbackState = e.PlaybackStates.completed)
                    )
                const g = h.isPlaying,
                    b = p.currentPlaybackTime,
                    _ = yield h._changeToMediaAtIndex(n, { userInitiated: m })
                var T
                return (
                    h._notifySkip(g, _, {
                        userInitiated: m,
                        seamlessAudioTransition: null !== (T = d.seamlessAudioTransition) && void 0 !== T && T,
                        position: b,
                        direction: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS
                    }),
                    _
                )
            })()
        }
        _notifySkip(n, d, h) {
            const { userInitiated: p, direction: y, position: m, seamlessAudioTransition: g = !1 } = h,
                b = this._dispatcher
            g
                ? (Mt.debug("seamlessAudioTransition transition, PAF play"),
                  b.publish(cr.playbackPlay, {
                      item: d,
                      position: 0,
                      endReasonType: e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK
                  }))
                : n
                ? d
                    ? b.publish(cr.playbackSkip, { item: d, userInitiated: p, direction: y, position: m })
                    : b.publish(cr.playbackStop, { item: d, userInitiated: p, position: m })
                : d &&
                  b.publish(
                      cr.playbackPlay,
                      _objectSpread$f(
                          { item: d, position: 0 },
                          p
                              ? { endReasonType: e.PlayActivityEndReasonType.MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM }
                              : {}
                      )
                  )
        }
        _prepareQueue(e) {
            Mt.debug("mk: _prepareQueue"),
                this.hasAuthorization && (e.isRestricted = this.storekit.restrictedEnabled || !1),
                (e.repeatable = this._repeatable)
        }
        constructor(e) {
            var n
            ;(this._context = {}),
                (this.onPlaybackStateDidChange = this.onPlaybackStateDidChange.bind(this)),
                (this._autoplayEnabled = null !== (n = null == e ? void 0 : e.autoplayEnabled) && void 0 !== n && n),
                (this._services = e.services),
                (this._playerOptions = e),
                (this.storekit = e.storekit),
                (this._skipIntro = new SkipAvailable({ controller: this, services: e.services })),
                (this._upNext = new UpNextMonitor({ controller: this, services: e.services })),
                (this._rollMonitor = new RollMonitor({ controller: this, services: e.services })),
                (this._queueModifier = new BaseModifiableQueue()),
                (this._shuffler = new BaseShuffler()),
                (this._seekable = new BaseSeekable(this._mediaItemPlayback)),
                (this._repeatable = new BaseRepeatable()),
                this._dispatcher.subscribe(is.autoplayEnabledDidChange, this.updateAutoplay)
        }
    }
    qs(
        [Bind(), Ws("design:type", Function), Ws("design:paramtypes", [String, Boolean])],
        PlaybackController.prototype,
        "updateAutoplay",
        null
    )
    function rejectOnLast() {
        return Promise.reject("The last middleware in the stack should not call next")
    }
    function processMiddleware(e, ...n) {
        return e.length
            ? (function createNextFunction([e, ...n]) {
                  return (...d) => e(createNextFunction(n), ...d)
              })([...e, rejectOnLast])(...n)
            : Promise.reject("processMiddleware requires at mimimum one middleware function")
    }
    function parameterizeString(e, n) {
        return (function (e) {
            try {
                return (function recursiveTokenizeParameterizedString(e, n = []) {
                    if (e.startsWith("{{")) {
                        const d = e.indexOf("}}")
                        if (-1 === d) throw new Error("UNCLOSED_PARAMETER")
                        const h = { type: zs.Parameter, value: e.slice(2, d) }
                        return d + 2 < e.length
                            ? recursiveTokenizeParameterizedString(e.slice(d + 2), [...n, h])
                            : [...n, h]
                    }
                    {
                        const d = e.indexOf("{{")
                        return -1 === d
                            ? [...n, { type: zs.Static, value: e }]
                            : recursiveTokenizeParameterizedString(e.slice(d), [
                                  ...n,
                                  { type: zs.Static, value: e.slice(0, d) }
                              ])
                    }
                })(e)
            } catch (Y) {
                if ("UNCLOSED_PARAMETER" === Y.message) throw new Error(`Unclosed parameter in path: "${e}"`)
                throw Y
            }
        })(e)
            .map((e) => {
                switch (e.type) {
                    case zs.Parameter:
                        return e.value in n ? encodeURIComponent("" + n[e.value]) : `{{${e.value}}}`
                    case zs.Static:
                    default:
                        return e.value
                }
            })
            .join("")
    }
    var zs
    function _defineProperty$e(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$9(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function constructUrlMiddleware(e, n) {
        let d = n.url
        return (
            d || (d = addPathToURL(n.baseUrl, n.path)),
            n.urlParameters && (d = parameterizeString(d, n.urlParameters)),
            n.queryParameters && (d = addQueryParamsToURL(d, n.queryParameters)),
            e(
                _objectSpreadProps$9(
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$e(e, n, d[n])
                                })
                        }
                        return e
                    })({}, n),
                    { url: d }
                )
            )
        )
    }
    function asyncGeneratorStep$q(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$q(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$q(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$q(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function unwrapJSONFromResponse(e) {
        return _unwrapJSONFromResponse.apply(this, arguments)
    }
    function _unwrapJSONFromResponse() {
        return (_unwrapJSONFromResponse = _asyncToGenerator$q(function* (e) {
            try {
                return yield e.json()
            } catch (Y) {
                return
            }
        })).apply(this, arguments)
    }
    function fetchMiddlewareFactory(e) {
        return (
            (n = _asyncToGenerator$q(function* (n, d) {
                const h = yield e(d.url, d.fetchOptions),
                    p = { request: d, response: h, data: yield unwrapJSONFromResponse(h) }
                if (!h.ok) throw MKError.responseError(h)
                return p
            })),
            function (e, d) {
                return n.apply(this, arguments)
            }
        )
        var n
    }
    !(function (e) {
        ;(e[(e.Static = 0)] = "Static"), (e[(e.Parameter = 1)] = "Parameter")
    })(zs || (zs = {}))
    const Qs = fetchMiddlewareFactory(
        "undefined" != typeof fetch
            ? fetch
            : () => {
                  throw new Error("window.fetch is not defined")
              }
    )
    function _defineProperty$d(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$d(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$d(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$8(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var Js
    !(function (e) {
        ;(e.Replace = "REPLACE"), (e.Merge = "MERGE")
    })(Js || (Js = {}))
    const Xs = ["url"]
    class APISession {
        get config() {
            return this._config
        }
        request(e, n = {}, d = {}) {
            var h
            return processMiddleware(
                this.middlewareStack,
                _objectSpreadProps$8(_objectSpread$d({}, this.config.defaultOptions, d), {
                    baseUrl: this.config.url,
                    path: e,
                    fetchOptions: mergeFetchOptions(
                        null === (h = this.config.defaultOptions) || void 0 === h ? void 0 : h.fetchOptions,
                        d.fetchOptions
                    ),
                    queryParameters: _objectSpread$d({}, this.config.defaultQueryParameters, n),
                    urlParameters: _objectSpread$d({}, this.config.defaultUrlParameters, d.urlParameters)
                })
            )
        }
        reconfigure(e, n = Js.Replace) {
            n === Js.Merge && (e = deepmerge(this.config, e)),
                Xs.forEach((n) => {
                    if (void 0 === e[n]) throw new Error(`Session requires a valid SessionConfig, missing "${n}"`)
                }),
                (this._config = e),
                (this.middlewareStack = this.createMiddlewareStack())
        }
        createMiddlewareStack() {
            return Array.isArray(this.config.middleware)
                ? [constructUrlMiddleware, ...this.config.middleware, this.makeFetchMiddleware()]
                : [constructUrlMiddleware, this.makeFetchMiddleware()]
        }
        makeFetchMiddleware() {
            return "function" == typeof this.config.fetchFunction
                ? fetchMiddlewareFactory(this.config.fetchFunction)
                : Qs
        }
        constructor(e) {
            this.reconfigure(e)
        }
    }
    function _objectWithoutProperties(e, n) {
        if (null == e) return {}
        var d,
            h,
            p = (function (e, n) {
                if (null == e) return {}
                var d,
                    h,
                    p = {},
                    y = Object.keys(e)
                for (h = 0; h < y.length; h++) (d = y[h]), n.indexOf(d) >= 0 || (p[d] = e[d])
                return p
            })(e, n)
        if (Object.getOwnPropertySymbols) {
            var y = Object.getOwnPropertySymbols(e)
            for (h = 0; h < y.length; h++)
                (d = y[h]), n.indexOf(d) >= 0 || (Object.prototype.propertyIsEnumerable.call(e, d) && (p[d] = e[d]))
        }
        return p
    }
    const Zs = { music: { url: "https://api.music.apple.com" } }
    class MediaAPIV3 {
        configure(e, n, d = Js.Merge) {
            this.storefrontId = n.storefrontId
            const h = (function (e) {
                let n = {}
                e.url && (n.url = e.url)
                e.storefrontId && (n.defaultUrlParameters = { storefrontId: e.storefrontId })
                e.mediaUserToken &&
                    (n.defaultOptions = { fetchOptions: { headers: { "Media-User-Token": e.mediaUserToken } } })
                e.developerToken &&
                    (n = deepmerge(n, {
                        defaultOptions: { fetchOptions: { headers: { Authorization: "Bearer " + e.developerToken } } }
                    }))
                e.options && (n = deepmerge(n, e.options))
                return n
            })(n)
            if (this[e]) this[e].session.reconfigure(h, d)
            else {
                var p
                const n = new APISession(h),
                    d = n.request.bind(n)
                d.session = n
                const y =
                    "undefined" != typeof process &&
                    "test" === (null === (p = process.env) || void 0 === p ? void 0 : p.NODE_ENV)
                Object.defineProperty(this, e, { value: d, writable: y, enumerable: !0 })
            }
        }
        constructor(e) {
            const { realmConfig: n } = e,
                d = _objectWithoutProperties(e, ["realmConfig"])
            for (const h in Zs) {
                let e = deepmerge(Zs[h], d)
                const p = null == n ? void 0 : n[h]
                p && (e = deepmerge(e, p)), this.configure(h, e)
            }
        }
    }
    function asyncGeneratorStep$p(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    var eo,
        to,
        ro =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        no =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class StationTrackLoader {
        activate() {
            this.dispatcher.unsubscribe(is.queuePositionDidChange, this.checkLoadMore),
                this.dispatcher.subscribe(is.queuePositionDidChange, this.checkLoadMore),
                (this.isActive = !0)
        }
        deactivate() {
            this.dispatcher.unsubscribe(is.queuePositionDidChange, this.checkLoadMore), (this.isActive = !1)
        }
        start() {
            return this.isActive || this.activate(), this.loadNextTracks()
        }
        checkLoadMore() {
            if (!(this.queue.isEmpty || this.queue.nextPlayableItemIndex >= 0)) return this.loadNextTracks()
        }
        loadNextTracks() {
            var e = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$p(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$p(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                let n = []
                const { apiManager: d } = e
                if ((null == d ? void 0 : d.api) instanceof MediaAPIV3) {
                    var h
                    const p = yield d.api.music("v1/me/stations/next-tracks/" + e.station.id, void 0, {
                        fetchOptions: { method: "POST" }
                    })
                    n = null == p || null === (h = p.data) || void 0 === h ? void 0 : h.data
                } else {
                    var p
                    const h = {}
                    var y
                    bs.features["enhanced-hls"] && (h.extend = { songs: ["extendedAssetUrls"] }),
                        (n =
                            null !==
                                (y = yield null === (p = d.mediaAPI) || void 0 === p
                                    ? void 0
                                    : p.nextStationTracks(e.station.id, null, { queryParameters: h })) && void 0 !== y
                                ? y
                                : [])
                }
                if (0 === n.length)
                    throw (
                        (Mt.warn("No track data is available for the current station", { stationId: e.station.id }),
                        new MKError(MKError.CONTENT_UNAVAILABLE, "No track data is available for the current station."))
                    )
                const m = descriptorToMediaItems({ context: e.context, loaded: n, container: e.station })
                e.queue.splice(e.queue.length, 0, m)
            })()
        }
        constructor(e, n, { dispatcher: d, apiManager: h }, p = {}) {
            ;(this.queue = e),
                (this.station = n),
                (this.context = p),
                (this.isActive = !1),
                (this.dispatcher = d),
                (this.apiManager = h)
        }
    }
    ro(
        [Bind(), no("design:type", Function), no("design:paramtypes", [])],
        StationTrackLoader.prototype,
        "checkLoadMore",
        null
    ),
        (function (e) {
            ;(e.artist = "artist"), (e.song = "song"), (e.station = "station"), (e.radioStation = "radioStation")
        })(eo || (eo = {})),
        (function (e) {
            e.BEATS1 = "beats1"
        })(to || (to = {}))
    const isIdentityQueue = (e) => e && void 0 !== e.identity
    function asyncGeneratorStep$o(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$o(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$o(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$o(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$c(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    var io =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        ao =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const { queueIsReady: so } = is
    class ContinuousPlaybackController extends PlaybackController {
        get continuous() {
            return !0
        }
        set continuous(e) {
            if (!0 !== e)
                throw new MKError(
                    MKError.UNSUPPORTED_ERROR,
                    "Continuous playback cannot be disabled for station queues."
                )
        }
        get context() {
            return (function (e) {
                for (var n = 1; n < arguments.length; n++) {
                    var d = null != arguments[n] ? arguments[n] : {},
                        h = Object.keys(d)
                    "function" == typeof Object.getOwnPropertySymbols &&
                        (h = h.concat(
                            Object.getOwnPropertySymbols(d).filter(function (e) {
                                return Object.getOwnPropertyDescriptor(d, e).enumerable
                            })
                        )),
                        h.forEach(function (n) {
                            _defineProperty$c(e, n, d[n])
                        })
                }
                return e
            })({ featureName: dr.STATION }, this._context)
        }
        get isLive() {
            return this._isLive
        }
        set isLive(e) {
            e !== this._isLive && ((this._isLive = e), this._dispatcher.publish(is.capabilitiesChanged))
        }
        changeToMediaItem(e) {
            var n = this
            return _asyncToGenerator$o(function* () {
                n.generateMethodNotAvailable("changeToMediaItem")
            })()
        }
        hasCapabilities(e) {
            switch (e) {
                case Ss.PAUSE:
                case Ss.SKIP_NEXT:
                    return !this.isLive
                case Ss.SKIP_PREVIOUS:
                case Ss.SKIP_TO_ITEM:
                    return !1
                default:
                    return super.hasCapabilities(e)
            }
        }
        pause(e) {
            var n = this,
                _superprop_get_pause = () => super.pause
            return _asyncToGenerator$o(function* () {
                if (!n.isLive) return _superprop_get_pause().call(n, e)
                n.generateMethodNotAvailable("pause")
            })()
        }
        skipToPreviousItem() {
            var e = this
            return _asyncToGenerator$o(function* () {
                e.generateMethodNotAvailable("skipToPreviousItem")
            })()
        }
        _dataForQueueOptions(e) {
            var n = this,
                _superprop_get__dataForQueueOptions = () => super._dataForQueueOptions
            return _asyncToGenerator$o(function* () {
                const d = yield _superprop_get__dataForQueueOptions().call(n, e)
                return n.isLive && (d.loaded = n.station), d
            })()
        }
        returnQueueForOptions(e) {
            var n = this
            return _asyncToGenerator$o(function* () {
                var d
                const h = isIdentityQueue(e)
                    ? yield n.loadStationByIdentity(e.identity)
                    : yield n.loadStationByStationId(n.generateStationId(e))
                if (void 0 === h)
                    return Promise.reject(new MKError(MKError.UNSUPPORTED_ERROR, "Cannot load requested station"))
                ;(n.station = h),
                    (n.isLive =
                        isIdentityQueue(e) ||
                        !!(null == h ? void 0 : h.isLive) ||
                        !!(null == h || null === (d = h.attributes) || void 0 === d ? void 0 : d.isLive))
                const p = { services: { dispatcher: n._dispatcher }, descriptor: yield n._dataForQueueOptions(e) }
                return (
                    (n.queue = new Queue(p)),
                    n.isLive ||
                        ((n.trackLoader = new StationTrackLoader(
                            n.queue,
                            h,
                            { dispatcher: n._dispatcher, apiManager: n._services.apiManager },
                            n.context
                        )),
                        yield n.trackLoader.start()),
                    (n._seekable = n.isLive
                        ? new BaseSeekable(n._mediaItemPlayback)
                        : new Seekable(n._dispatcher, n._mediaItemPlayback)),
                    n._dispatcher.publish(so, n.queue.items),
                    n.queue
                )
            })()
        }
        getNewSeeker() {
            return this.hasCapabilities(Ss.SEEK) ? super.getNewSeeker() : new UnsupportedSeeker()
        }
        skipToNextItem() {
            var e = this,
                _superprop_get_skipToNextItem = () => super.skipToNextItem
            return _asyncToGenerator$o(function* () {
                if (!e.isLive) return _superprop_get_skipToNextItem().call(e)
                e.generateMethodNotAvailable("skipToNextItem")
            })()
        }
        generateMethodNotAvailable(e) {
            Mt.warn(e + " is not supported for this type of playback")
        }
        generateStationId(e) {
            let n
            if (isQueueURLOption(e)) {
                const { contentId: d, kind: h, storefrontId: p } = formattedMediaURL(e.url)
                ;(e[h] = d), (Ts.storefrontId = p), (n = h)
            }
            const d = e
            if (d.artist) return "ra." + d.artist
            if (d.song) return "ra." + d.song
            if (d.station) return d.station
            if (d.radioStation) return d.radioStation
            throw new MKError(
                MKError.UNSUPPORTED_ERROR,
                n
                    ? n + " is not a supported option. Use setQueue instead."
                    : "Unsupported options specified for setStationQueue. You may want setQueue instead."
            )
        }
        loadStationByIdentity(e) {
            var n = this
            return _asyncToGenerator$o(function* () {
                var d
                const { apiManager: h } = n._services
                if ((null == h ? void 0 : h.api) instanceof MediaAPIV3) {
                    var p, y
                    const n = yield h.api.music("v1/catalog/{{storefrontId}}/stations", { filter: { identity: e } })
                    return null == n || null === (p = n.data) || void 0 === p || null === (y = p.data) || void 0 === y
                        ? void 0
                        : y[0]
                }
                const m = yield null == h || null === (d = h.mediaAPI) || void 0 === d
                    ? void 0
                    : d.stations(void 0, { filter: { identity: e } })
                return m && m[0]
            })()
        }
        loadStationByStationId(e) {
            var n = this
            return _asyncToGenerator$o(function* () {
                var d
                const { apiManager: h } = n._services
                if ((null == h ? void 0 : h.api) instanceof MediaAPIV3) {
                    var p, y
                    const n = yield h.api.music("v1/catalog/{{storefrontId}}/stations/" + e)
                    return null == n || null === (p = n.data) || void 0 === p || null === (y = p.data) || void 0 === y
                        ? void 0
                        : y[0]
                }
                return null == h || null === (d = h.mediaAPI) || void 0 === d ? void 0 : d.station(e)
            })()
        }
        activate() {
            super.activate(), this.trackLoader && this.trackLoader.activate()
        }
        deactivate() {
            var e = this,
                _superprop_get_deactivate = () => super.deactivate
            return _asyncToGenerator$o(function* () {
                yield _superprop_get_deactivate().call(e), e.trackLoader && e.trackLoader.deactivate()
            })()
        }
        constructor(e) {
            super(e), (this.type = Hs.continuous), (this._isLive = !1), (this._continuous = !0)
        }
    }
    function asyncGeneratorStep$n(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    io(
        [Bind(), ao("design:type", Function), ao("design:paramtypes", [void 0 === Ss ? Object : Ss])],
        ContinuousPlaybackController.prototype,
        "hasCapabilities",
        null
    )
    var oo =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        co =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class PercentageWatcher {
        startMonitor() {
            this.dispatcher.unsubscribe(is.playbackDurationDidChange, this.updateThreshold),
                this.dispatcher.unsubscribe(is.playbackTimeDidChange, this.handleTimeChange),
                this.dispatcher.subscribe(is.playbackDurationDidChange, this.updateThreshold),
                this.dispatcher.subscribe(is.playbackTimeDidChange, this.handleTimeChange)
        }
        stopMonitor() {
            this.dispatcher.unsubscribe(is.playbackDurationDidChange, this.updateThreshold),
                this.dispatcher.unsubscribe(is.playbackTimeDidChange, this.handleTimeChange),
                (this.threshold = -1)
        }
        handleTimeChange(e, { currentPlaybackDuration: n, currentPlaybackTime: d }) {
            var h = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$n(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$n(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                h.threshold < 0 && h.updateThreshold(e, { duration: n }),
                    d < h.threshold || (h.stopMonitor(), yield h.callback(d, h))
            })()
        }
        updateThreshold(e, { duration: n }) {
            this.threshold = n * this.percentage
        }
        constructor(e, n, d) {
            ;(this.dispatcher = e), (this.callback = n), (this.percentage = d), (this.threshold = -1)
        }
    }
    function asyncGeneratorStep$m(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    oo(
        [Bind(), co("design:type", Function), co("design:paramtypes", [void 0, void 0])],
        PercentageWatcher.prototype,
        "handleTimeChange",
        null
    ),
        oo(
            [Bind(), co("design:type", Function), co("design:paramtypes", [void 0, void 0])],
            PercentageWatcher.prototype,
            "updateThreshold",
            null
        )
    class Preloader extends PlaybackMonitor {
        handlePlaybackThreshold() {
            var e = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$m(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$m(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                const n = e.getNextPlayableItem()
                n && (yield e.playbackController.prepareToPlay(n, !0))
            })()
        }
        shouldMonitor() {
            if (!super.shouldMonitor()) return !1
            if (!this.playbackController.hasAuthorization || this.playbackController.previewOnly) return !1
            const e = this.getNextPlayableItem(),
                n = void 0 !== e
            return this.isSeamlessAudioTransitionsEnabled ? n : n && !(null == e ? void 0 : e.isPreparedToPlay)
        }
        getNextPlayableItem() {
            return this.playbackController.queue.nextPlayableItem
        }
        constructor(e) {
            super(e),
                (this.isSeamlessAudioTransitionsEnabled = !1),
                (this.watchers = [new PercentageWatcher(this.dispatcher, this.handlePlaybackThreshold, 0.3)]),
                (this.isSeamlessAudioTransitionsEnabled = bs.features["seamless-audio-transitions"])
        }
    }
    function dasherize(e) {
        return e
            .replace(/([A-Z])/g, "-$1")
            .replace(/[-_\s]+/g, "-")
            .toLowerCase()
    }
    function asyncGeneratorStep$l(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$l(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$l(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$l(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$b(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$b(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$b(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$7(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    function loadRelationshipData(e, n, d) {
        return _loadRelationshipData.apply(this, arguments)
    }
    function _loadRelationshipData() {
        return (_loadRelationshipData = _asyncToGenerator$l(function* (e, n, d, h = {}) {
            if (void 0 === n) return d
            void 0 === h.limit && (h.limit = 100), void 0 === h.offset && (h.offset = 0)
            const { relationship: p, method: y } = n,
                m = e[y].bind(e)
            let g
            return (
                isDataRecord(d)
                    ? (void 0 === d[p] && d.setProperty(p, [], "relationships"), (g = d[p]))
                    : ((d.relationships = d.relationships || {}),
                      void 0 === d.relationships[p] &&
                          Object.defineProperty(d.relationships, p, { value: { data: [] }, enumerable: !0 }),
                      (g = d.relationships[p].data)),
                yield lo(m, [d.id, p, h], g),
                d
            )
        })).apply(this, arguments)
    }
    const lo = (function () {
            var e = _asyncToGenerator$l(function* (e, n, d) {
                const [h, p, y] = n,
                    m = d.length
                if (m > 0 && m < y.limit + y.offset) return d
                const g = _objectSpread$b({}, y)
                let b
                g.offset = m
                try {
                    b = yield e(h, p, g)
                } catch (Mr) {
                    return d
                }
                return d.push(...b), b.length < g.limit ? d : lo(e, n, d)
            })
            return function (n, d, h) {
                return e.apply(this, arguments)
            }
        })(),
        getNamedQueueOptions = (e, n) => {
            const d = [],
                h = e.namedQueueOptions
            for (const p in n) Object.keys(h).includes(p) && d.push([p, h[p]])
            return d
        },
        uo = (function () {
            var e = _asyncToGenerator$l(function* (e, n, d) {
                const [h] = d,
                    p = n[h]
                if (!Array.isArray(p)) return loadSelectedQueueValue(e, n, d, p)
                const y = new Map()
                p.forEach((e) => {
                    const n = e.indexOf("."),
                        d = -1 === n ? "" : e.substring(0, n)
                    y.has(d) || y.set(d, [])
                    const h = y.get(d)
                    h && h.push(e)
                })
                const m = (yield Promise.all([...y.values()].map((h) => loadSelectedQueueValue(e, n, d, h)))).reduce(
                        (e, n) => {
                            var d
                            return (
                                (n = null !== (d = n.data) && void 0 !== d ? d : n).forEach((n) => {
                                    e.set(n.id, n)
                                }),
                                e
                            )
                        },
                        new Map()
                    ),
                    g = []
                return (
                    p.forEach((e) => {
                        const n = m.get(e)
                        n && g.push(n)
                    }),
                    g
                )
            })
            return function (n, d, h) {
                return e.apply(this, arguments)
            }
        })()
    function loadSelectedQueueValue(e, n, d, h) {
        return _loadSelectedQueueValue.apply(this, arguments)
    }
    function _loadSelectedQueueValue() {
        return (_loadSelectedQueueValue = _asyncToGenerator$l(function* (e, n, d, h) {
            const p = yield e.getAPIForItem(Array.isArray(h) ? h[0] : h)
            return p instanceof MediaAPIV3 ? loadSelectedQueueValueV3(p, n, d, h) : loadSelectedQueueValueV2(p, n, d, h)
        })).apply(this, arguments)
    }
    function loadSelectedQueueValueV2(e, n, d, h) {
        return _loadSelectedQueueValueV2.apply(this, arguments)
    }
    function _loadSelectedQueueValueV2() {
        return (_loadSelectedQueueValueV2 = _asyncToGenerator$l(function* (e, n, d, h) {
            const [, p] = d
            let y = n.parameters
            bs.features["enhanced-hls"] &&
                (y = _objectSpreadProps$7(_objectSpread$b({}, y), { extend: { songs: ["extendedAssetUrls"] } }))
            let m = yield e[p.apiMethod](h, y)
            return (
                p.loadedQueueTransform && (m = p.loadedQueueTransform(m)),
                Array.isArray(h) || (yield loadRelationshipData(e, p.relationshipMethod, m)),
                m
            )
        })).apply(this, arguments)
    }
    function loadSelectedQueueValueV3(e, n, d, h) {
        return _loadSelectedQueueValueV3.apply(this, arguments)
    }
    function _loadSelectedQueueValueV3() {
        return (_loadSelectedQueueValueV3 = _asyncToGenerator$l(function* (e, n, d, h) {
            const [p] = d,
                y = Array.isArray(h),
                m = S(y ? "" + h[0] : "" + h),
                g = /^(?:playlists?|albums?)$/i.test(p)
            let b = dasherize(p)
            b.endsWith("s") || (b += "s")
            let _ = (m ? "/v1/me/library" : "/v1/catalog/{{storefrontId}}") + "/" + b
            y || (_ += "/{{id}}")
            const T = {}
            y && (T.ids = h), m && g && (T.include = "tracks")
            const P = yield e.music(_, T, { urlParameters: { id: h } })
            return y ? P.data.data : P.data.data[0]
        })).apply(this, arguments)
    }
    function asyncGeneratorStep$k(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$k(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$k(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$k(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$a(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$a(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$a(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$6(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var ho =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        po =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const yo = ["library-songs", "songs"],
        isAutoplaySupportedForType = (e) => yo.includes(e),
        normalizeTypeForAutoplay = (e, n) =>
            (S(e) && !(null != n ? n : "").startsWith("library-") ? "library-" : "") + normalizeContentType(n)
    class AutoplayTrackLoader {
        activate() {
            this.isActive ||
                (this.dispatcher.unsubscribe(is.queuePositionDidChange, this.onQueueChanged),
                this.dispatcher.subscribe(is.queuePositionDidChange, this.onQueueChanged),
                this.dispatcher.unsubscribe(is.repeatModeDidChange, this.onRepeatableChanged),
                this.dispatcher.subscribe(is.repeatModeDidChange, this.onRepeatableChanged),
                (this.isActive = !0))
        }
        deactivate() {
            this.isActive &&
                (this.dispatcher.unsubscribe(is.queuePositionDidChange, this.onQueueChanged),
                this.dispatcher.unsubscribe(is.repeatModeDidChange, this.onRepeatableChanged),
                (this.isActive = !1),
                (this.station = void 0),
                (this.queue.hasAutoplayStation = !1))
        }
        start() {
            if (!this.isActive) return this.activate(), this.loadNextTracks()
        }
        stop() {
            this.isActive && (this.deactivate(), this.cleanupQueue())
        }
        onRepeatableChanged() {
            this.repeatable.repeatMode === e.PlayerRepeatMode.none ? this.checkLoadMore() : this.cleanupQueue()
        }
        onQueueChanged() {
            if (!(this.queue.nextPlayableItemIndex >= 0)) return this.checkLoadMore()
        }
        get api() {
            const e = this.apiManager.mediaAPI
            var n
            return null !== (n = null == e ? void 0 : e.v3) && void 0 !== n ? n : e
        }
        checkLoadMore() {
            var e
            const n = null !== (e = this.queue.unplayedAutoplayItems.length) && void 0 !== e ? e : 0,
                d = bs.autoplay.maxUpcomingTracksToMaintain
            if (!(this.queue.isEmpty || this.queue.unplayedUserItems.length > bs.autoplay.maxQueueSizeForAutoplay))
                return n < d ? this.loadNextTracks(d - n) : this.loadNextTracks()
        }
        cleanupQueue() {
            this.queue.removeQueueItems((e, n) => !(n <= this.queue.position) && !!e.isAutoplay)
        }
        loadNextTracks(n = bs.autoplay.maxUpcomingTracksToMaintain) {
            var d = this
            return _asyncToGenerator$k(function* () {
                var h
                if (d.repeatable.repeatMode !== e.PlayerRepeatMode.none) return
                let p,
                    { station: y } = d
                if (d.station) {
                    try {
                        var m
                        ;(p = yield d.api.music(
                            "v1/me/stations/next-tracks/" + d.station.id,
                            { limit: n },
                            { fetchOptions: { method: "POST" } }
                        )),
                            (p = null == p || null === (m = p.data) || void 0 === m ? void 0 : m.data)
                    } catch (Mr) {
                        return
                    }
                    if (!d.isActive) return
                } else {
                    var g
                    const e = yield d.startStation(n)
                    if (!e || !d.isActive) return void (d.queue.hasAutoplayStation = !1)
                    ;(y = d.station = e.station),
                        (d.queue.hasAutoplayStation = !0),
                        (p = e.tracks),
                        (null == e || null === (g = e.tracks) || void 0 === g ? void 0 : g.length) ||
                            Mt.warn("No track data is available for the current station", {
                                stationId: null == y ? void 0 : y.id
                            })
                }
                const b = descriptorToMediaItems({
                    context: _objectSpreadProps$6(_objectSpread$a({}, d.context), {
                        featureName: "now_playing",
                        reco_id: (
                            null === (h = d.context.featureName) || void 0 === h ? void 0 : h.startsWith("listen-now")
                        )
                            ? void 0
                            : d.context.reco_id
                    }),
                    loaded: p,
                    container: y
                })
                d.queue.appendQueueItems(toQueueItems(b, { isAutoplay: !0 }))
            })()
        }
        startStation(e) {
            var n = this
            return _asyncToGenerator$k(function* () {
                const { userAddedItems: d } = n.queue
                var h
                const p = null !== (h = d[d.length - 2]) && void 0 !== h ? h : d[d.length - 1],
                    y = null == p ? void 0 : p.container,
                    m = y ? { container: { id: y.id, type: y.type } } : void 0,
                    g = n.queue.items.slice(-1 * bs.autoplay.maxQueueSizeInRequest).reduce((e, { id: d, type: h }) => {
                        const p = normalizeTypeForAutoplay(d, h)
                        return (
                            isAutoplaySupportedForType(p) && !n.errorIds.has(d) && e.push({ id: d, type: p, meta: m }),
                            e
                        )
                    }, [])
                if (0 === g.length) return
                const b = { data: g }
                let _
                try {
                    var T
                    ;(_ = yield n.api.music(
                        "v1/me/stations/continuous",
                        { "limit[results:tracks]": e, with: ["tracks"] },
                        { fetchOptions: { method: "POST", body: JSON.stringify(b, void 0, 2) } }
                    )),
                        (_ = null == _ || null === (T = _.data) || void 0 === T ? void 0 : T.results)
                } catch (Mr) {
                    g.forEach((e) => n.errorIds.add(e.id))
                }
                return _
            })()
        }
        constructor(e, n, { dispatcher: d, apiManager: h }, p = {}) {
            ;(this.queue = e),
                (this.repeatable = n),
                (this.context = p),
                (this.isActive = !1),
                (this.errorIds = new Set()),
                (this.dispatcher = d),
                (this.apiManager = h)
        }
    }
    function asyncGeneratorStep$j(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$j(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$j(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$j(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$9(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$9(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$9(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$5(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    ho(
        [Bind(), po("design:type", Function), po("design:paramtypes", [])],
        AutoplayTrackLoader.prototype,
        "onRepeatableChanged",
        null
    ),
        ho(
            [Bind(), po("design:type", Function), po("design:paramtypes", [])],
            AutoplayTrackLoader.prototype,
            "onQueueChanged",
            null
        ),
        ho(
            [
                (e, n, d) => {
                    const h = d.value,
                        p = "_singlePromise_" + n,
                        y = "undefined" != typeof Symbol ? Symbol(p) : p
                    return (
                        (d.value = function (...e) {
                            if (this[y]) return this[y]
                            const n = (this[y] = h.apply(this, e)),
                                reset = () => {
                                    this[y] = void 0
                                }
                            return n.then(reset, reset), n
                        }),
                        d
                    )
                },
                po("design:type", Function),
                po("design:paramtypes", [Number])
            ],
            AutoplayTrackLoader.prototype,
            "loadNextTracks",
            null
        )
    var fo =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        mo =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const { queueIsReady: go } = is
    var vo, bo
    !(function (e) {
        ;(e.album = "album"), (e.musicVideo = "musicVideo"), (e.playlist = "playlist"), (e.song = "song")
    })(vo || (vo = {})),
        (function (e) {
            ;(e.albums = "albums"), (e.musicVideos = "musicVideos"), (e.playlists = "playlists"), (e.songs = "songs")
        })(bo || (bo = {}))
    class SerialPlaybackController extends PlaybackController {
        get autoplayEnabled() {
            return this._autoplayEnabled
        }
        set autoplayEnabled(e) {
            var n
            this._autoplayEnabled = e
            const d = e ? "start" : "stop"
            null === (n = this._autoplayTrackLoader) || void 0 === n || n[d]()
        }
        activate() {
            super.activate(),
                this._preloader.activate(),
                this._dispatcher.subscribe(Ua, this.onSeamlessAudioTransition),
                this._dispatcher.subscribe(is.repeatModeDidChange, this.onRepeatModeChange)
        }
        deactivate() {
            var e = this,
                _superprop_get_deactivate = () => super.deactivate
            return _asyncToGenerator$j(function* () {
                yield _superprop_get_deactivate().call(e),
                    e._preloader.deactivate(),
                    e._dispatcher.unsubscribe(Ua, e.onSeamlessAudioTransition),
                    e._dispatcher.unsubscribe(is.repeatModeDidChange, e.onRepeatModeChange)
            })()
        }
        onSeamlessAudioTransition(n, d) {
            Mt.debug("controller handling seamless audio transition, PAF stop", d),
                this._next({
                    userInitiated: !1,
                    seamlessAudioTransition: !0,
                    endReasonType: e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK,
                    position: d.previous.playbackDuration / 1e3,
                    isPlaying: !1
                })
        }
        hasCapabilities(e) {
            var n, d, h
            return (
                e === Ss.SKIP_PREVIOUS ||
                (((e !== Ss.REPEAT && e !== Ss.SHUFFLE) ||
                    !(null === (n = this.queue) || void 0 === n || null === (d = n.currentQueueItem) || void 0 === d
                        ? void 0
                        : d.isAutoplay)) &&
                    ((e !== Ss.SEEK && e !== Ss.PAUSE) ||
                        !(null === (h = this.nowPlayingItem) || void 0 === h ? void 0 : h.isAssetScrubbingDisabled)) &&
                    super.hasCapabilities(e))
            )
        }
        onRepeatModeChange() {
            var e
            this.queue.nextPlayableItem &&
                (Mt.info(
                    "SerialPlaybackController: preparing new item after RepeatMode change",
                    null === (e = this.queue.nextPlayableItem) || void 0 === e ? void 0 : e.title
                ),
                this.prepareToPlay(this.queue.nextPlayableItem, !0))
        }
        prepareToPlay(n, d = !1) {
            var h = this
            return _asyncToGenerator$j(function* () {
                if ((Mt.debug("mk: SerialController - prepareToPlay - ", { item: n, preload: d }), n.isPlayable))
                    return h._mediaItemPlayback.prepareToPlay(n).catch((n) => {
                        const p = !d && -1 === [MKError.DEVICE_LIMIT, MKError.STREAM_UPSELL].indexOf(n.errorCode)
                        if (h.continuous && p)
                            return (
                                h._dispatcher.publish(cr.applicationActivityIntent, {
                                    endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS,
                                    userInitiated: !1
                                }),
                                h._next()
                            )
                        throw n
                    })
            })()
        }
        prepend(e, n) {
            var d = this,
                _superprop_get_prepend = () => super.prepend
            return _asyncToGenerator$j(function* () {
                const h = yield _superprop_get_prepend().call(d, e, n)
                if (d.shouldTransitionSeamlessly) {
                    const e = d.queue,
                        n = e.position,
                        h = e.item(n + 1)
                    Mt.debug("prepend preparing ", h.title), yield d._mediaItemPlayback.prepareToPlay(h)
                }
                return h
            })()
        }
        returnQueueForOptions(e) {
            var n = this
            return _asyncToGenerator$j(function* () {
                void 0 !== (e = parseQueueURLOption(e)).startPosition &&
                    (deprecationWarning("startPosition", {
                        message: "startPosition has been deprecated in favor of startWith"
                    }),
                    void 0 === e.startWith && (e.startWith = e.startPosition))
                const d = yield n._dataForQueueOptions(e),
                    h = {
                        services: { dispatcher: n._dispatcher, mediaItemPlayback: n._mediaItemPlayback },
                        descriptor: d
                    }
                if (
                    (void 0 !== e.shuffleMode && (n.shuffleMode = e.shuffleMode),
                    (n.queue = new Queue(h)),
                    "number" == typeof e.startTime)
                ) {
                    const d = n.queue.nextPlayableItem
                    d && n._mediaItemPlayback.playOptions.set(d.id, { startTime: e.startTime })
                }
                if (0 === n.queue.length)
                    throw (
                        (Mt.warn("No item data is available for the current media queue", e),
                        new MKError(
                            MKError.CONTENT_UNAVAILABLE,
                            "No item data is available for the current media queue."
                        ))
                    )
                return (
                    n._autoplayTrackLoader && n._autoplayTrackLoader.deactivate(),
                    (n._autoplayTrackLoader = new AutoplayTrackLoader(
                        n.queue,
                        n._repeatable,
                        { dispatcher: n._dispatcher, apiManager: n._services.apiManager },
                        n._context
                    )),
                    n.autoplayEnabled && n._autoplayTrackLoader.start(),
                    n._dispatcher.publish(go, n.queue.items),
                    n.queue
                )
            })()
        }
        skipToPreviousItem() {
            var e = this
            return _asyncToGenerator$j(function* () {
                return e._previous({ userInitiated: !0 })
            })()
        }
        _dataForQueueOptions(e) {
            var n = this,
                _superprop_get__dataForQueueOptions = () => super._dataForQueueOptions
            return _asyncToGenerator$j(function* () {
                var d
                const h = e,
                    p = ((e, n) => {
                        const d = getNamedQueueOptions(e, n)
                        if (d.length > 1)
                            throw new MKError(
                                MKError.UNSUPPORTED_ERROR,
                                "Queues with multiple media types are not supported."
                            )
                        if (0 === d.length) return
                        const [h] = d,
                            [p, y] = h
                        if (Array.isArray(n[p]) !== y.isPlural)
                            throw new MKError(
                                MKError.UNSUPPORTED_ERROR,
                                y.isPlural
                                    ? `Queue option ${p} must be an array of id values`
                                    : `Queue option ${p} must be a single id value`
                            )
                        return h
                    })(n._services.apiManager.apiService, e)
                return (
                    void 0 === p ||
                        ((null === (d = n.storekit) || void 0 === d ? void 0 : d.restrictedEnabled) &&
                            (e.parameters = _objectSpreadProps$5(_objectSpread$9({}, e.parameters), {
                                restrict: "explicit"
                            })),
                        (h.loaded = yield uo(n._services.apiManager.apiService, e, p))),
                    _objectSpread$9({}, yield _superprop_get__dataForQueueOptions().call(n, e), h)
                )
            })()
        }
        _changeToMediaAtIndex(e = 0, n = { userInitiated: !1 }) {
            var d = this,
                _superprop_get__changeToMediaAtIndex = () => super._changeToMediaAtIndex
            return _asyncToGenerator$j(function* () {
                const h = yield _superprop_get__changeToMediaAtIndex().call(d, e, n),
                    p = d.queue.nextPlayableItem
                return p && d.shouldTransitionSeamlessly && (yield d.prepareToPlay(p)), h
            })()
        }
        _next(n = {}) {
            var d = this
            return _asyncToGenerator$j(function* () {
                if (d.queue.isEmpty) return
                const { userInitiated: h = !1 } = n
                return d.repeatMode === e.PlayerRepeatMode.one && void 0 !== d.queue.currentItem
                    ? (yield d.stop(_objectSpread$9({ userInitiated: h }, n)), void (yield d.play()))
                    : (!h &&
                          n.seamlessAudioTransition &&
                          (d._dispatcher.publish(
                              cr.playbackStop,
                              _objectSpread$9(
                                  { userInitiated: h, endReasonType: e.PlayActivityEndReasonType.NATURAL_END_OF_TRACK },
                                  n
                              )
                          ),
                          (n = { userInitiated: n.userInitiated, seamlessAudioTransition: !0 })),
                      d._nextAtIndex(d.queue.nextPlayableItemIndex, n))
            })()
        }
        _previous(n = {}) {
            var d = this
            return _asyncToGenerator$j(function* () {
                if (d.queue.isEmpty) return
                const { userInitiated: h = !1 } = n
                if (d.repeatMode === e.PlayerRepeatMode.one && void 0 !== d.queue.currentItem)
                    return (
                        yield d.stop({
                            endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS,
                            userInitiated: h
                        }),
                        void (yield d.play())
                    )
                const p = d.queue.previousPlayableItemIndex
                if (h && d.repeatMode === e.PlayerRepeatMode.none && void 0 !== d.nowPlayingItem && -1 === p)
                    return (
                        yield d.stop({
                            endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS,
                            userInitiated: !0
                        }),
                        void (yield d.play())
                    )
                if (-1 === p) return
                const y = d.isPlaying,
                    m = d._mediaItemPlayback.currentPlaybackTime,
                    g = yield d._changeToMediaAtIndex(p, { userInitiated: h })
                return (
                    d._notifySkip(y, g, {
                        userInitiated: h,
                        seamlessAudioTransition: !1,
                        direction: e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS,
                        position: m
                    }),
                    g
                )
            })()
        }
        _prepareQueue(e) {
            super._prepareQueue(e), this._shuffler.checkAndReshuffle()
        }
        get shouldTransitionSeamlessly() {
            return this._isSeamlessAudioTransitionsEnabled && this.hasAuthorization && !this.previewOnly
        }
        constructor(e) {
            var n
            super(e),
                (this.type = Hs.serial),
                (this._queue = new Queue(e)),
                (this._repeatable = new Repeatable(this._dispatcher)),
                (this._seekable = new Seekable(this._dispatcher, this._mediaItemPlayback)),
                (this._shuffler = new Shuffler(this, { dispatcher: this._dispatcher })),
                (this._queueModifier = new ModifiableQueue(this._queue, this._mediaItemPlayback)),
                (this._isSeamlessAudioTransitionsEnabled = !!(null == e || null === (n = e.bag) || void 0 === n
                    ? void 0
                    : n.features["seamless-audio-transitions"]))
            const d = { controller: this, services: e.services }
            this._preloader = new Preloader(d)
        }
    }
    fo(
        [Bind(), mo("design:type", Function), mo("design:paramtypes", [void 0, void 0])],
        SerialPlaybackController.prototype,
        "onSeamlessAudioTransition",
        null
    ),
        fo(
            [Bind(), mo("design:type", Function), mo("design:paramtypes", [void 0 === Ss ? Object : Ss])],
            SerialPlaybackController.prototype,
            "hasCapabilities",
            null
        ),
        fo(
            [Bind(), mo("design:type", Function), mo("design:paramtypes", [])],
            SerialPlaybackController.prototype,
            "onRepeatModeChange",
            null
        )
    class MKDialog {
        static presentError(e) {
            const n = e.dialog
            void 0 !== n ? MKDialog.serverDialog(n).present() : new MKDialog(e.message).present()
        }
        static serverDialog(e) {
            const n = new this(e.message, e.explanation)
            return (
                e.okButtonAction && e.okButtonAction.url && (n._okButtonActionURL = e.okButtonAction.url),
                e.okButtonString && (n._okButtonString = e.okButtonString),
                e.cancelButtonString && (n._cancelButtonString = e.cancelButtonString),
                n
            )
        }
        static clientDialog(e) {
            const n = new this(e.message, e.explanation)
            return (
                e.okButtonAction && (n._okButtonAction = e.okButtonAction),
                e.cancelButtonAction && (n._cancelButtonAction = e.cancelButtonAction),
                e.okButtonString && (n._okButtonString = e.okButtonString),
                e.cancelButtonString && (n._cancelButtonString = e.cancelButtonString),
                n
            )
        }
        get actions() {
            return this.cancelButton
                ? `<div id="mk-dialog-actions">${this.cancelButton}${this.okButton}</div>`
                : `<div id="mk-dialog-actions">${this.okButton}</div>`
        }
        get cancelButton() {
            if ("string" == typeof this._cancelButtonString)
                return `<button type="button">${this._cancelButtonString}</button>`
        }
        set cancelButton(e) {
            this._cancelButtonString = e
        }
        get explanation() {
            return `<p id="mk-dialog-explanation">${this._explanation}</p>`
        }
        get hasOKButtonAction() {
            return !!this._okButtonActionURL || !!this._okButtonAction
        }
        get message() {
            return `<h5 id="mk-dialog-title">${this._message}</h5>`
        }
        get okButton() {
            return this.hasOKButtonAction && this._okButtonActionURL
                ? `<button type="button" data-ok-action-url='${this._okButtonActionURL}'>${this._okButtonString}</button>`
                : `<button type="button">${this._okButtonString}</button>`
        }
        present() {
            const e = document.createDocumentFragment(),
                n = document.createElement("div")
            ;(n.id = this.scrimId), e.appendChild(n)
            const d = document.createElement("div")
            ;(d.id = this.id),
                d.classList.add("mk-dialog"),
                d.setAttribute("role", "alertDialog"),
                d.setAttribute("aria-modal", "true"),
                d.setAttribute("aria-labeledby", "mk-dialog-title"),
                d.setAttribute("aria-describedby", "mk-dialog-explanation")
            let h = `\n      <div id="mk-dialog-body">\n        ${this.message}\n        ${this.explanation}\n      </div>`
            ;(h = `\n      ${h}\n      ${this.actions}\n    `),
                (d.innerHTML = h),
                e.appendChild(d),
                document.body.appendChild(e),
                document.querySelector(`#${d.id} #mk-dialog-actions *:first-child`).focus(),
                setTimeout(() => {
                    document
                        .querySelector(`#${d.id} #mk-dialog-actions *:first-child`)
                        .addEventListener("click", () => {
                            this._cancelButtonAction && this._cancelButtonAction(),
                                d.parentElement.removeChild(d),
                                n.parentElement.removeChild(n)
                        }),
                        this.hasOKButtonAction &&
                            (this._okButtonActionURL
                                ? document
                                      .querySelector(`#${d.id} #mk-dialog-actions *:last-child`)
                                      .addEventListener("click", (e) => {
                                          window.open(e.target.dataset.okActionUrl, "_blank"),
                                              d.parentElement.removeChild(d),
                                              n.parentElement.removeChild(n)
                                      })
                                : this._okButtonAction &&
                                  document
                                      .querySelector(`#${d.id} #mk-dialog-actions *:last-child`)
                                      .addEventListener("click", (e) => {
                                          this._okButtonAction(),
                                              d.parentElement.removeChild(d),
                                              n.parentElement.removeChild(n)
                                      }))
                })
        }
        _appendStyle(e) {
            const n = document.createElement("style")
            ;(n.id = this.styleId),
                n.styleSheet ? (n.styleSheet.cssText = e) : (n.innerHTML = e),
                document.body.appendChild(n)
        }
        constructor(e, n = "") {
            ;(this._message = e),
                (this._explanation = n),
                (this.id = "musickit-dialog"),
                (this.scrimId = this.id + "-scrim"),
                (this.styleId = this.id + "-style"),
                (this._okButtonString = "OK"),
                [this.id, this.scrimId, this.styleId].forEach((e) => {
                    try {
                        const n = document.getElementById(e)
                        n.parentElement.removeChild(n)
                    } catch (Mr) {}
                }),
                this._appendStyle(
                    "\n#musickit-dialog {\n  --mk-dialog-background: rgba(255, 255, 255, 1);\n  --mk-dialog-text: rgba(0, 0, 0, 0.95);\n  --mk-dialog-border: rgba(0, 0, 0, 0.07);\n  --mk-dialog-scrim: rgba(255, 255, 255, 0.8);\n  --mk-dialog-primary: rgba(0, 122, 255, 1);\n}\n\n@media (prefers-color-scheme: dark) {\n  #musickit-dialog {\n      --mk-dialog-background: rgba(30, 30, 30, 1);\n      --mk-dialog-text: rgba(255, 255, 255, 0.85);\n      --mk-dialog-border: rgba(255, 255, 255, 0.1);\n      --mk-dialog-scrim: rgba(38, 38, 38, 0.8);\n      --mk-dialog-primary: rgba(8, 132, 255, 1);\n  }\n}\n\n#musickit-dialog-scrim {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.35);\n}\n\n#musickit-dialog * {\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  -ms-touch-action: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  font-family: -apple-system, SF UI Text, Helvetica Neue, Helvetica, sans-serif;\n  font-size: 15px;\n  line-height: 20px;\n}\n\n#musickit-dialog *:focus { outline: 0; }\n\n#musickit-dialog {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-direction: column;\n  -moz-flex-direction: column;\n  flex-direction: column;\n  -webkit-justify-content: space-between;\n  -moz-justify-content: space-between;\n  justify-content: space-between;\n  min-width: 277px;\n  max-width: 290px;\n  min-height: 109px;\n  background: var(--mk-dialog-background);\n  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.18);\n  border-radius: 10px;\n  color: var(--mk-dialog-text);\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  margin-left: -142px;\n  margin-top: -67px;\n  z-index: 9999999999999999999999999;\n}\n\n#musickit-dialog #mk-dialog-body {\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-direction: column;\n  -moz-flex-direction: column;\n  flex-direction: column;\n  flex-grow: 1;\n  -webkit-justify-content: space-evenly;\n  -moz-justify-content: space-evenly;\n  justify-content: space-evenly;\n  -webkit-align-items: stretch;\n  align-items: stretch;\n  padding: 10px 20px;\n  min-height: 74px;\n  text-align: center;\n}\n\n#musickit-dialog .mk-dialog h5 {\n  font-weight: 500;\n  line-height: 20px;\n  margin: 7px 0 0 0;\n  padding: 0;\n}\n\n#musickit-dialog .mk-dialog p {\n  margin: 0 0 7px 0;\n  padding: 0;\n  paddin-top: 3px;\n  line-height: 18px;\n  font-size: 13px;\n  font-weight: 300;\n}\n\n#musickit-dialog #mk-dialog-actions {\n  border-top: 1px solid var(--mk-dialog-border);\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-direction: row;\n  -moz-flex-direction: colrowumn;\n  flex-direction: row;\n  max-height: 41px;\n  min-height: 34px;\n  -webkit-justify-self: flex-end;\n  -moz-justify-self: flex-end;\n  justify-self: flex-end;\n}\n\n#musickit-dialog #mk-dialog-actions button {\n  flex-grow: 1;\n  border: 0;\n  background: none;\n  color: var(--mk-dialog-primary);\n  padding: 0;\n  margin: 0;\n  min-height: 34px;\n  height: 41px;\n  text-align: center;\n}\n\n#musickit-dialog #mk-dialog-actions *:nth-child(2) {\n  border-left: 1px solid var(--mk-dialog-border);\n  font-weight: 500;\n}\n"
                )
        }
    }
    var _o
    function asyncGeneratorStep$i(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    !(function (e) {
        ;(e.MEDIA_API = "media-api"), (e.UTS_CLIENT = "uts-client")
    })(_o || (_o = {}))
    class APIServiceManager {
        get api() {
            return this.getApiByType(this._defaultAPI)
        }
        get apiService() {
            if (void 0 !== this._defaultAPI) return this._apisByType[this._defaultAPI]
            Mt.error("There is no API instance configured")
        }
        get mediaAPI() {
            return this.getApiByType(_o.MEDIA_API)
        }
        get utsClient() {
            return this.getApiByType(_o.UTS_CLIENT)
        }
        getApiByType(e) {
            let n
            if ((void 0 !== e && (n = this._apisByType[e]), void 0 === n || void 0 === n.api))
                throw new MKError(
                    MKError.CONFIGURATION_ERROR,
                    "There is no API instance configured for the requested type: " + e
                )
            return n.api
        }
        set defaultApiType(e) {
            this._defaultAPI = e
        }
        registerAPIService(e) {
            var n = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$i(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$i(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                const { apiType: d, configureFn: h, options: p } = e,
                    y = p.apiOptions || {}
                void 0 === n._defaultAPI && (n._defaultAPI = d),
                    (n._apisByType[d] = yield h.call(n, { apiOptions: y, store: n.store, dispatcher: n._dispatcher }))
            })()
        }
        constructor(e, n) {
            ;(this.store = e), (this._dispatcher = n), (this._apisByType = {})
        }
    }
    const To = {}
    function adaptAddEventListener(e, n, d, h = {}) {
        const { once: p } = h,
            y = (function (e, n) {
                const d = getCallbacksForName(e),
                    wrappedCallback = (e, d) => {
                        n(d)
                    }
                return d.push([n, wrappedCallback]), wrappedCallback
            })(n, d)
        !0 === p ? e.subscribeOnce(n, y) : e.subscribe(n, y)
    }
    function getCallbacksForName(e) {
        let n = To[e]
        return n || ((n = []), (To[e] = n)), n
    }
    function asyncGeneratorStep$h(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$h(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$h(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$h(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const So = Mt.createChild("rtc")
    class RTCStreamingTracker {
        configure(e, n) {
            var d = this
            return _asyncToGenerator$h(function* () {
                d.instance = e
            })()
        }
        handleEvent(e, n, d) {}
        loadScript() {
            return _asyncToGenerator$h(function* () {
                if (!bs.urls.rtc) throw new Error("bag.urls.rtc is not configured")
                yield loadScript(bs.urls.rtc)
            })()
        }
        prepareReportingAgent(e) {
            this.clearReportingAgent()
            const n = e || this.instance.nowPlayingItem,
                d = n ? n.defaultPlayable : void 0,
                {
                    Sender: h,
                    ClientName: p,
                    ServiceName: y,
                    ApplicationName: m,
                    ReportingStoreBag: g,
                    DeviceName: b
                } = window.rtc.RTCReportingAgentConfigKeys,
                _ = { firmwareVersion: this.generateBrowserVersion(), model: this.options.browserName }
            var T
            d
                ? ((null === (T = d.mediaMetrics) || void 0 === T ? void 0 : T.MediaIdentifier) &&
                      (_.MediaIdentifier = d.mediaMetrics.MediaIdentifier),
                  d.channelId && (_.ContentProvider = d.channelId))
                : "musicVideo" === (null == e ? void 0 : e.type)
                ? (_.MediaIdentifier = "adamid=" + e.id)
                : (null == e ? void 0 : e.isLiveVideoStation) && (_.MediaIdentifier = "raid=" + e.id)
            void 0 === this._storeBag && (this._storeBag = this.generateStoreBag())
            const S = {
                [h]: "HLSJS",
                [p]: this.options.clientName,
                [y]: this.options.serviceName,
                [m]: this.options.applicationName,
                [g]: this._storeBag,
                [b]: this.options.osVersion,
                userInfoDict: _
            }
            return (
                So.debug("RTC: creating reporting agent with config", S),
                (this.reportingAgent = new window.rtc.RTCReportingAgent(S)),
                So.debug("RTC: created reporting agent", this.reportingAgent),
                this.reportingAgent
            )
        }
        cleanup() {
            var e = this
            return _asyncToGenerator$h(function* () {
                e.clearReportingAgent()
            })()
        }
        clearReportingAgent() {
            void 0 !== this.reportingAgent &&
                (this.reportingAgent.destroy(),
                So.debug("RTC: called destroy on reporting agent", this.reportingAgent),
                (this.reportingAgent = void 0))
        }
        generateBrowserVersion() {
            return this.options.browserMajorVersion
                ? `${this.options.browserMajorVersion}.${this.options.browserMinorVersion || 0}`
                : "unknown"
        }
        generateStoreBag() {
            var e
            const { storeBagURL: n, clientName: d, applicationName: h, serviceName: p, browserName: y } = this.options,
                m = {
                    iTunesAppVersion: `${`${bs.app.name}-${bs.app.build}`}/${
                        null === (e = this.instance) || void 0 === e ? void 0 : e.version
                    }`
                },
                g = new window.rtc.RTCStorebag.RTCReportingStoreBag(n, d, p, h, y, m)
            return So.debug("RTC: created store bag", g), g
        }
        constructor(e) {
            ;(this.requestedEvents = []), (this.options = e)
        }
    }
    function asyncGeneratorStep$g(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$8(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    var Po =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Eo =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    class PlayActivityService {
        cleanup() {
            this.trackers.forEach((e) => {
                var n
                return null === (n = e.cleanup) || void 0 === n ? void 0 : n.call(e)
            }),
                this.clearIntention(),
                this.teardownListeners(),
                this.registeredEvents.clear()
        }
        configure(e, n) {
            var d = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$g(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$g(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                d.cleanup(),
                    (d.registeredEvents = (function (e) {
                        const n = []
                        for (const d of e) n.push(...d.requestedEvents)
                        return new Set(n)
                    })(d.trackers)),
                    d.setupListeners()
                try {
                    yield Promise.all(d.trackers.map((d) => d.configure(e, n)))
                } catch (Mr) {
                    Mt.error("Error configuring a play activity service", Mr)
                }
            })()
        }
        getTrackerByType(e) {
            return this.trackers.find((n) => n instanceof e)
        }
        handleEvent(e, n = {}) {
            const d = this.addIntention(e, n)
            e === cr.playerActivate && (d.flush = "boolean" == typeof n.isPlaying ? !n.isPlaying : void 0)
            for (const h of this.trackers) h.handleEvent(e, d, n.item)
        }
        addIntention(e, n) {
            if (![cr.playbackPause, cr.playbackStop].includes(e)) return n
            const d = (function (e) {
                for (var n = 1; n < arguments.length; n++) {
                    var d = null != arguments[n] ? arguments[n] : {},
                        h = Object.keys(d)
                    "function" == typeof Object.getOwnPropertySymbols &&
                        (h = h.concat(
                            Object.getOwnPropertySymbols(d).filter(function (e) {
                                return Object.getOwnPropertyDescriptor(d, e).enumerable
                            })
                        )),
                        h.forEach(function (n) {
                            _defineProperty$8(e, n, d[n])
                        })
                }
                return e
            })({}, this.lastUserIntent, this.lastApplicationIntent, n)
            return this.clearIntention(), d
        }
        clearIntention() {
            ;(this.lastUserIntent = void 0), (this.lastApplicationIntent = void 0)
        }
        recordApplicationIntent(e, n) {
            this.lastApplicationIntent = n
        }
        recordUserIntent(e, n) {
            this.lastUserIntent = n
        }
        setupListeners() {
            this.registeredEvents.forEach((e) => {
                this.dispatcher.subscribe(e, this.handleEvent)
            }),
                this.dispatcher.subscribe(cr.userActivityIntent, this.recordUserIntent),
                this.dispatcher.subscribe(cr.applicationActivityIntent, this.recordApplicationIntent)
        }
        teardownListeners() {
            this.registeredEvents.forEach((e) => {
                this.dispatcher.unsubscribe(e, this.handleEvent)
            }),
                this.dispatcher.unsubscribe(cr.userActivityIntent, this.recordUserIntent),
                this.dispatcher.unsubscribe(cr.applicationActivityIntent, this.recordApplicationIntent)
        }
        constructor(e, n) {
            ;(this.dispatcher = e), (this.trackers = n), (this.registeredEvents = new Set())
        }
    }
    function asyncGeneratorStep$f(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$f(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$f(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$f(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    Po(
        [Bind(), Eo("design:type", Function), Eo("design:paramtypes", [String, Object])],
        PlayActivityService.prototype,
        "handleEvent",
        null
    ),
        Po(
            [
                Bind(),
                Eo("design:type", Function),
                Eo("design:paramtypes", [String, "undefined" == typeof ActivityIntention ? Object : ActivityIntention])
            ],
            PlayActivityService.prototype,
            "recordApplicationIntent",
            null
        ),
        Po(
            [
                Bind(),
                Eo("design:type", Function),
                Eo("design:paramtypes", [String, "undefined" == typeof ActivityIntention ? Object : ActivityIntention])
            ],
            PlayActivityService.prototype,
            "recordUserIntent",
            null
        )
    const ko = BooleanDevFlag.register("mk-force-safari-hlsjs")
    function useNativeSafariPlayback() {
        return !ko.enabled
    }
    function requiresHlsJs(e) {
        return _requiresHlsJs.apply(this, arguments)
    }
    function _requiresHlsJs() {
        return (_requiresHlsJs = _asyncToGenerator$f(function* (e) {
            const n = null != e ? e : yield findKeySystemPreference(),
                d = !useNativeSafariPlayback()
            return n !== Bt.FAIRPLAY || d
        })).apply(this, arguments)
    }
    function asyncGeneratorStep$e(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _defineProperty$7(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$4(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const wo = (function () {
        var e = (function (e) {
            return function () {
                var n = this,
                    d = arguments
                return new Promise(function (h, p) {
                    var y = e.apply(n, d)
                    function _next(e) {
                        asyncGeneratorStep$e(y, h, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$e(y, h, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            }
        })(function* (e, n, d) {
            const h = new Headers({
                    Authorization: "Bearer " + n,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-Apple-Music-User-Token": "" + d
                }),
                p = urlEncodeParameters(
                    _objectSpreadProps$4(
                        (function (e) {
                            for (var n = 1; n < arguments.length; n++) {
                                var d = null != arguments[n] ? arguments[n] : {},
                                    h = Object.keys(d)
                                "function" == typeof Object.getOwnPropertySymbols &&
                                    (h = h.concat(
                                        Object.getOwnPropertySymbols(d).filter(function (e) {
                                            return Object.getOwnPropertyDescriptor(d, e).enumerable
                                        })
                                    )),
                                    h.forEach(function (n) {
                                        _defineProperty$7(e, n, d[n])
                                    })
                            }
                            return e
                        })({}, e.playParams),
                        { keyFormat: "web" }
                    )
                ),
                y = `${bs.urls.mediaApi}/play/assets?${p}`,
                m = yield fetch(y, { method: "GET", headers: h })
            if (500 === m.status) {
                const n = new MKError(MKError.SERVER_ERROR)
                throw ((n.data = e), n)
            }
            if (403 === m.status) {
                let n
                try {
                    var g
                    ;(n = yield m.json()), (n = null == n || null === (g = n.errors) || void 0 === g ? void 0 : g[0])
                } catch (Mr) {}
                const d = "40303" === (null == n ? void 0 : n.code) ? MKError.SUBSCRIPTION_ERROR : MKError.ACCESS_DENIED
                var b
                const h = new MKError(
                    d,
                    null !== (b = null == n ? void 0 : n.title) && void 0 !== b ? b : null == n ? void 0 : n.detail
                )
                throw ((h.data = e), h)
            }
            if (!m.ok) {
                const n = new MKError(MKError.CONTENT_UNAVAILABLE)
                throw ((n.data = e), n)
            }
            const _ = (yield m.json()).results
            return Mt.debug(`media-item: loaded data from ${y}: ${JSON.stringify(_)}`), _
        })
        return function (n, d, h) {
            return e.apply(this, arguments)
        }
    })()
    function asyncGeneratorStep$d(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$d(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$d(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$d(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    const Io = (function () {
            var e = _asyncToGenerator$d(function* (e, n, d) {
                e.hasOffersHlsUrl ? yield Oo(e) : e.isLiveRadioStation ? yield Ao(e, n, d) : yield Co(e, n, d)
            })
            return function (n, d, h) {
                return e.apply(this, arguments)
            }
        })(),
        Oo = (function () {
            var e = _asyncToGenerator$d(function* (e) {
                const n = bs.urls.hlsOffersKeyUrls
                if (!n) throw new MKError(MKError.CONTENT_UNSUPPORTED, "HLS OFFERS")
                e.updateWithLoadedKeys(n), yield Ro(e, e.offersHlsUrl)
            })
            return function (n) {
                return e.apply(this, arguments)
            }
        })(),
        Ao = (function () {
            var e = _asyncToGenerator$d(function* (e, n, d) {
                if (
                    !bs.features["playready-live-radio"] &&
                    Jt === Bt.PLAYREADY &&
                    "video" !== e.attributes.mediaKind &&
                    !bs.features["mse-live-radio"]
                )
                    throw new MKError(MKError.CONTENT_UNSUPPORTED, "LIVE_RADIO")
                const h = (yield wo(e, n, d)).assets[0]
                e.updateWithLoadedKeys({
                    "hls-key-cert-url": h.fairPlayKeyCertificateUrl,
                    "hls-key-server-url": h.keyServerUrl,
                    "widevine-cert-url": h.widevineKeyCertificateUrl
                }),
                    filterUnavailableLiveRadioUrls(h, e),
                    e.isLiveVideoStation ? (e.assetURL = h.url) : yield Ro(e, h.url)
            })
            return function (n, d, h) {
                return e.apply(this, arguments)
            }
        })(),
        Ro = (function () {
            var e = _asyncToGenerator$d(function* (e, n) {
                let d
                try {
                    d = yield fetch(n)
                } catch (Mr) {
                    throw makeContentUnavailableError(e)
                }
                const h = yield d.text()
                extractAssetsFromMasterManifest(h, n, e)
            })
            return function (n, d) {
                return e.apply(this, arguments)
            }
        })(),
        extractAssetsFromMasterManifest = (e, n, d) => {
            const h = /^#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+),CODECS="(.*)"\s*\n(.*$)/gim
            let p
            for (; (p = h.exec(e)); ) {
                let [e, h, y, m] = p
                ;/^http(s)?:\/\//.test(m) || (m = rewriteLastUrlPath(n, m)),
                    d.assets.push({ bandwidth: Number(h), codec: y, URL: m })
            }
        },
        filterUnavailableLiveRadioUrls = (e, n) => {
            const d = new URL(e.url)
            if (!d.host.endsWith(".apple.com") && !d.host.endsWith(".applemusic.com"))
                throw makeContentUnavailableError(n)
        },
        makeContentUnavailableError = (e) => {
            const n = new MKError(MKError.CONTENT_UNAVAILABLE)
            return (n.data = e), n
        },
        Co = (function () {
            var e = _asyncToGenerator$d(function* (e, n, d) {
                if ((Mt.debug("mk: loadWithMZPlay", e.playParams), "podcast-episodes" === e.type))
                    return void (e.assetURL = e.attributes.assetUrl)
                if (!(yield hasMusicSubscription())) return
                const h = e.playParams.id,
                    p = new Headers({
                        Authorization: "Bearer " + n,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-Apple-Music-User-Token": "" + d
                    })
                let y = { salableAdamId: h }
                if (e.isCloudItem) {
                    ;(y = {}),
                        e.playParams.purchasedId && (y.purchaseAdamId = e.playParams.purchasedId),
                        e.playParams.catalogId && (y.subscriptionAdamId = e.playParams.catalogId)
                    const n = /^a\.(\d+)$/
                    n.test(h) ? (y.subscriptionAdamId = h.replace(n, "$1")) : S(h) && (y.universalLibraryId = h)
                }
                if (!bs.urls.webPlayback) throw new Error("bag.urls.webPlayback is not configured")
                const m = yield fetch(bs.urls.webPlayback, { method: "POST", body: JSON.stringify(y), headers: p }),
                    g = yield m.text(),
                    b = JSON.parse(g)
                if (!b || !b.songList) {
                    const n = MKError.serverError(b, MKError.UNSUPPORTED_ERROR)
                    return (
                        e.updateFromLoadError(n),
                        Mt.debug("mk: prepareItemWithMZPlay - rejecting with error", n),
                        Promise.reject(n)
                    )
                }
                const [_] = b.songList
                e.updateFromSongList(_)
            })
            return function (n, d, h) {
                return e.apply(this, arguments)
            }
        })()
    function asyncGeneratorStep$c(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$c(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$c(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$c(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function prepareToPlayMediaItem(e, n) {
        return _prepareToPlayMediaItem.apply(this, arguments)
    }
    function _prepareToPlayMediaItem() {
        return (_prepareToPlayMediaItem = _asyncToGenerator$c(function* (e, n) {
            const { developerToken: d, userToken: h } = e.store
            if (void 0 === d || void 0 === h)
                return Promise.reject(
                    new MKError(MKError.AUTHORIZATION_ERROR, "Unable to prepare media item for play.")
                )
            if (n.isPreparedToPlay) Mt.warn("media-item: item is prepared to play")
            else {
                if (
                    (Mt.debug("media-item: item.prepareToPlay playParams", n.playParams),
                    (n.state = $.loading),
                    n.isUTS)
                )
                    return Promise.reject(new MKError(MKError.UNSUPPORTED_ERROR, "Item was not prepared to play"))
                yield Io(n, d, h)
            }
        })).apply(this, arguments)
    }
    function _shouldPlayPreview() {
        return (_shouldPlayPreview = _asyncToGenerator$c(function* (e, n) {
            return (
                !!e.previewURL &&
                (!!n ||
                    (!e.playRawAssetURL &&
                        ((!e.isUTS && !(yield hasMusicSubscription())) ||
                            !hasAuthorization() ||
                            !e.isPlayable ||
                            (e.isUTS ? "Preview" === e.type : !supportsDrm()))))
            )
        })).apply(this, arguments)
    }
    function _prepareForEncryptedPlayback() {
        return (_prepareForEncryptedPlayback = _asyncToGenerator$c(function* (e, n, d) {
            if ((Mt.debug("prepareForEncryptedPlayback"), !hasAuthorization()))
                return Promise.reject(new MKError(MKError.AUTHORIZATION_ERROR, "Unable to prepare for playback."))
            try {
                yield prepareToPlayMediaItem(e, n)
            } catch (Y) {
                if ([MKError.AUTHORIZATION_ERROR].includes(Y.errorCode)) yield e.store.storekit.revokeUserToken()
                else if (Y.errorCode === MKError.TOKEN_EXPIRED)
                    try {
                        return (
                            yield e.store.storekit.renewUserToken(),
                            yield prepareToPlayMediaItem(e, n),
                            (n.playbackData = _playbackDataForItem(n, d)),
                            n
                        )
                    } catch (Mr) {}
                if (Y) return Promise.reject(Y)
            }
            return (n.playbackData = _playbackDataForItem(n, d)), n
        })).apply(this, arguments)
    }
    function _playbackDataForItem(n, d) {
        if ((Mt.debug("mk: _playbackDataForItem", n), n.isCloudUpload)) return n.assets[0]
        if ("musicVideo" !== n.type && !n.isLiveVideoStation) {
            if (!n.isLiveRadioStation && !n.hasOffersHlsUrl) {
                const [e] = n.assets.filter((e) => {
                    if (!("flavor" in e)) return !1
                    const n = new RegExp(
                            `\\d{1,2}\\:(c${
                                (function () {
                                    var e
                                    return null === (e = window.WebKitMediaKeys) || void 0 === e
                                        ? void 0
                                        : e.isTypeSupported(Zt + ".1_0", zt.AVC1)
                                })()
                                    ? "bc"
                                    : "tr"
                            }p)(\\d{2,3})`,
                            "i"
                        ),
                        h = n.test(e.flavor)
                    var p
                    const y = null !== (p = e.flavor.match(n)) && void 0 !== p ? p : []
                    return h && parseInt(y[2], 10) <= d.bitrate
                })
                return e
            }
            {
                const h = n.assets.reduce((e, n) => {
                        const d = n.bandwidth
                        return e[d] || (e[d] = []), e[d].push(n), e
                    }, {}),
                    p = Object.keys(h).sort((e, n) => parseInt(e, 10) - parseInt(n, 10)),
                    y = d.bitrate === e.PlaybackBitrate.STANDARD ? p[0] : p[p.length - 1]
                n.assetURL = h[y][0].URL
            }
        }
    }
    class HlsJsPreviewImageLoader {
        loadPreviewImage(e) {
            return (
                this.lastPosition === e ||
                    ((this.lastPosition = e),
                    (this.lastPromise = new Promise((n, d) => {
                        this.hls.loadImageIframeData$(e).subscribe((e) => {
                            const { data: d } = e,
                                h = new Blob([d], { type: "image/jpeg" })
                            n(h)
                        })
                    }))),
                this.lastPromise
            )
        }
        constructor(e) {
            this.hls = e
        }
    }
    function _defineProperty$6(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$6(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$6(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$3(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var Mo =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Do =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const {
        audioTracksSwitched: xo,
        audioTracksUpdated: Lo,
        inlineStylesParsed: No,
        textTracksSwitched: jo,
        textTracksUpdated: Uo
    } = Yt
    class HlsJsTracks extends Notifications {
        get audioTracks() {
            return this._audioTracks
        }
        get textTracks() {
            return this._textTracks
        }
        set audioTrack(e) {
            this.session && e && void 0 !== e.id && (this.session.audioSelectedPersistentID = e.id)
        }
        set textTrack(e) {
            var n
            this.session.subtitleSelectedPersistentID =
                null !== (n = null == e ? void 0 : e.id) && void 0 !== n ? n : -1
        }
        selectForcedTrack() {
            const { session: e } = this
            if (!(null == e ? void 0 : e.audioTracks)) return
            const n = e.audioTracks.filter((n) => n.persistentID === e.audioSelectedPersistentID),
                d = n && n.length && n[0]
            if (!d) return
            const h = e.subtitleMediaOptions.filter(
                    (e) =>
                        0 === e.MediaSelectionOptionsDisplaysNonForcedSubtitles &&
                        e.MediaSelectionOptionsExtendedLanguageTag === d.lang
                ),
                p = null == h ? void 0 : h[0]
            let y
            return (
                p
                    ? (Rt.debug("hlsjsTracks: found forced track for " + p.MediaSelectionOptionsExtendedLanguageTag),
                      (e.subtitleSelectedPersistentID = p.MediaSelectionOptionsPersistentID),
                      (y = this.normalizeTextTrack(p)))
                    : (e.subtitleSelectedPersistentID = -1),
                y
            )
        }
        audioTracksUpdated(e, n) {
            const d = (
                (n && n.audioMediaSelectionGroup && n.audioMediaSelectionGroup.MediaSelectionGroupOptions) ||
                []
            ).map(this.normalizeAudioTrack, this)
            ;(this._audioTracks = d), this.dispatchEvent(Lo, d)
        }
        handleAudioTrackSwitched() {
            this.dispatchEvent(xo, { selectedId: this.session.audioSelectedPersistentID })
        }
        handleInlineStylesParsed(e, n) {
            this.dispatchEvent(No, n)
        }
        handleManifestLoaded(e, n) {
            this.audioTracksUpdated(e, n), this.subtitleTracksUpdated(e, n)
        }
        handleSubtitleTrackSwitch(e, n) {
            this.dispatchEvent(jo, n)
        }
        subtitleTracksUpdated(e, n) {
            const d =
                    (n && n.subtitleMediaSelectionGroup && n.subtitleMediaSelectionGroup.MediaSelectionGroupOptions) ||
                    [],
                h = []
            d.forEach((e) => {
                0 !== e.MediaSelectionOptionsDisplaysNonForcedSubtitles && h.push(this.normalizeTextTrack(e))
            }),
                (this._textTracks = h),
                this.dispatchEvent(Uo, h)
        }
        normalizeAudioTrack(e) {
            const n = e.MediaSelectionOptionsTaggedMediaCharacteristics,
                d = (null != n ? n : []).includes("public.accessibility.describes-video") ? "description" : "main"
            return _objectSpreadProps$3(_objectSpread$6({}, this.normalizeSelectionOption(e)), {
                enabled: !1,
                kind: d,
                characteristics: n
            })
        }
        normalizeTextTrack(e) {
            var n
            let d
            return (
                (d =
                    (null === (n = e.MediaSelectionOptionsTaggedMediaCharacteristics) || void 0 === n
                        ? void 0
                        : n.includes("public.accessibility.describes-music-and-sound")) ||
                    "clcp" === e.MediaSelectionOptionsMediaType
                        ? "captions"
                        : "subtitles"),
                _objectSpreadProps$3(_objectSpread$6({}, this.normalizeSelectionOption(e)), {
                    mode: "disabled",
                    kind: d
                })
            )
        }
        normalizeSelectionOption(e) {
            return {
                id: e.MediaSelectionOptionsPersistentID,
                label: e.MediaSelectionOptionsName,
                language: e.MediaSelectionOptionsExtendedLanguageTag
            }
        }
        destroy() {
            const {
                MANIFEST_LOADED: e,
                AUDIO_TRACK_SWITCHED: n,
                SUBTITLE_TRACK_SWITCH: d,
                INLINE_STYLES_PARSED: h
            } = window.Hls.Events
            this.session.off(e, this.handleManifestLoaded),
                this.session.off(n, this.handleAudioTrackSwitched),
                this.session.off(d, this.handleSubtitleTrackSwitch),
                this.session.off(h, this.handleInlineStylesParsed)
        }
        constructor(e) {
            super([xo, Lo, No, jo, Uo]), (this.session = e), (this._audioTracks = []), (this._textTracks = [])
            const {
                MANIFEST_LOADED: n,
                AUDIO_TRACK_SWITCHED: d,
                SUBTITLE_TRACK_SWITCH: h,
                INLINE_STYLES_PARSED: p
            } = window.Hls.Events
            this.session.on(n, this.handleManifestLoaded),
                this.session.on(d, this.handleAudioTrackSwitched),
                this.session.on(h, this.handleSubtitleTrackSwitch),
                this.session.on(p, this.handleInlineStylesParsed)
        }
    }
    function asyncGeneratorStep$b(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$b(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$b(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$b(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    Mo(
        [Bind(), Do("design:type", Function), Do("design:paramtypes", [])],
        HlsJsTracks.prototype,
        "handleAudioTrackSwitched",
        null
    ),
        Mo(
            [Bind(), Do("design:type", Function), Do("design:paramtypes", [void 0, void 0])],
            HlsJsTracks.prototype,
            "handleInlineStylesParsed",
            null
        ),
        Mo(
            [Bind(), Do("design:type", Function), Do("design:paramtypes", [void 0, void 0])],
            HlsJsTracks.prototype,
            "handleManifestLoaded",
            null
        ),
        Mo(
            [Bind(), Do("design:type", Function), Do("design:paramtypes", [void 0, void 0])],
            HlsJsTracks.prototype,
            "handleSubtitleTrackSwitch",
            null
        )
    var $o =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        Go =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const Bo = { keySystemGenericError: "keySystemGenericError" },
        Fo = new Set([MKError.DEVICE_LIMIT, MKError.GEO_BLOCK, MKError.WIDEVINE_CDM_EXPIRED]),
        Ko = {}
    ;(Ko[Bt.FAIRPLAY] = "fairplaystreaming"), (Ko[Bt.PLAYREADY] = "playready"), (Ko[Bt.WIDEVINE] = "widevine")
    const Vo = BooleanDevFlag.get("mk-block-report-cdn-server"),
        Ho = { nightly: !0, carry: !0 },
        qo = JsonDevFlag.register("mk-hlsjs-config-overrides")
    class HlsJsVideoPlayer extends VideoPlayer {
        get shouldDispatchErrors() {
            return !this.userInitiated || this._playbackDidStart
        }
        get supportsPreviewImages() {
            var e, n
            return (
                !(Gt.isAndroid || Gt.isiOS || (Gt.isMacOs && navigator.maxTouchPoints > 2)) &&
                (null === (e = this._hls) || void 0 === e || null === (n = e.iframeVariants) || void 0 === n
                    ? void 0
                    : n.some((e) => "mjpg" === e.imageCodec))
            )
        }
        get currentPlayingDate() {
            var e
            return null === (e = this._hls) || void 0 === e ? void 0 : e.playingDate
        }
        get isPlayingAtLiveEdge() {
            var e
            const n = this._hls
            return (
                !(!n || !(null === (e = this.nowPlayingItem) || void 0 === e ? void 0 : e.isLinearStream)) &&
                !!n.isPlayingAtLive
            )
        }
        get seekableTimeRanges() {
            const e = this._hls
            return e
                ? e.seekableTimeRanges
                : this.currentPlaybackDuration
                ? [{ start: 0, end: this.currentPlaybackDuration }]
                : void 0
        }
        initializeExtension() {
            var e = this
            return _asyncToGenerator$b(function* () {
                e._keySystem = yield findKeySystemPreference()
                try {
                    var n
                    if (!Ft.urls.hls) throw new Error("bag.urls.hls is not configured")
                    yield Promise.all([
                        loadScript(Ft.urls.hls),
                        null === (n = e._rtcTracker) || void 0 === n ? void 0 : n.loadScript()
                    ])
                } catch (Mr) {
                    throw (Rt.error("hlsjs-video-player failed to load script " + Ft.urls.hls, Mr), Mr)
                }
            })()
        }
        destroy() {
            var e
            if (
                (Rt.debug("hlsjs-video-player.destroy"),
                null === (e = this._hlsJsTracks) || void 0 === e || e.destroy(),
                this._hls)
            ) {
                const {
                        ERROR: e,
                        INTERNAL_ERROR: n,
                        MANIFEST_PARSED: d,
                        KEY_REQUEST_STARTED: h,
                        LICENSE_CHALLENGE_CREATED: p,
                        LEVEL_SWITCHED: y,
                        UNRESOLVED_URI_LOADING: m
                    } = window.Hls.Events,
                    g = this._hls
                g.stopLoad(),
                    g.detachMedia(),
                    g.off(e, this.handleHlsError),
                    g.off(n, this.handleHlsError),
                    g.off(d, this.handleManifestParsed),
                    g.off(h, this.handleKeyRequestStarted),
                    g.off(p, this.handleLicenseChallengeCreated),
                    g.off(y, this.handleLevelSwitched),
                    this._shouldLoadManifestsOnce && g.off(m, this.handleUnresolvedUriLoading),
                    g.destroy(),
                    (window.hlsSession = void 0)
            }
            super.destroy(), asAsync(this._license.stop())
        }
        playHlsStream(e, n, d = {}) {
            var h = this
            return _asyncToGenerator$b(function* () {
                Rt.debug("hlsjs-video-player.playHlsStream", e, n)
                const { _keySystem: p } = h
                if (!p) return
                let y, m
                ;(h._unrecoverableError = void 0), h.createHlsPlayer()
                const hasKey = (e, n) => {
                    var d
                    return void 0 !== (null == n || null === (d = n.keyURLs) || void 0 === d ? void 0 : d[e])
                }
                p === Bt.WIDEVINE &&
                    hasKey("widevine-cert-url", n) &&
                    ((y = "WIDEVINE_SOFTWARE"),
                    (m = {
                        initDataTypes: ["cenc", "keyids"],
                        distinctiveIdentifier: "optional",
                        persistentState: "required"
                    }))
                const g = {
                        subs: "accepts-css",
                        platformInfo: {
                            requiresCDMAttachOnStart: p !== Bt.NONE,
                            maxSecurityLevel: y,
                            keySystemConfig: m
                        },
                        appData: { serviceName: Ft.app.name }
                    },
                    { _rtcTracker: b, _hls: _ } = h
                if (b) {
                    const e = b.prepareReportingAgent(n)
                    void 0 !== e && (g.appData.reportingAgent = e)
                }
                Rt.debug("RTC: loadSource with load options", g)
                const T = h.startPlaybackSequence()
                return (
                    h._shouldLoadManifestsOnce &&
                        ((e = e.replace("https://", "manifest://")),
                        Rt.info("Manifest already loaded, passing url to HLSJS", e)),
                    _.loadSource(e, g, d.startTime),
                    _.attachMedia(h.video),
                    n &&
                        ((h._licenseServerUrl = n.keyURLs["hls-key-server-url"]),
                        p === Bt.FAIRPLAY && hasKey("hls-key-cert-url", n)
                            ? _.setProtectionData({
                                  fairplaystreaming: { serverCertUrl: n.keyURLs["hls-key-cert-url"] }
                              })
                            : hasKey("widevine-cert-url", n) &&
                              _.setProtectionData({ widevine: { serverCertUrl: n.keyURLs["widevine-cert-url"] } })),
                    T
                )
            })()
        }
        createHlsPlayer() {
            const { _keySystem: e } = this,
                { Hls: n } = window,
                d = le.get(),
                h = {
                    clearMediaKeysOnPromise: !1,
                    customTextTrackCueRenderer: !0,
                    debug: !!d,
                    debugLevel: d,
                    enableIFramePreloading: !1,
                    enablePerformanceLogging: !!d,
                    enablePlayReadyKeySystem: !0,
                    enableQueryParamsForITunes: !this._shouldLoadManifestsOnce,
                    enableRtcReporting: void 0 !== this._rtcTracker,
                    keySystemPreference: Ko[e],
                    useMediaKeySystemAccessFilter: !0,
                    nativeControlsEnabled: Gt.isAndroid,
                    warmupCdms: this._shouldLoadManifestsOnce
                }
            ;((e) => {
                const { Hls: n } = window
                if (n && Vo) {
                    const d = deepClone(n.DefaultConfig.fragLoadPolicy)
                    ;(d.default.reportCDNServer = !1), (d.customURL.reportCDNServer = !1), (e.fragLoadPolicy = d)
                }
            })(h),
                ((e) => {
                    const n = ae.value
                    if (!n) return
                    var d
                    const h = null !== (d = determineCdnPathPrefix()) && void 0 !== d ? d : ""
                    n.socketurl &&
                        isAppleHostname(n.socketurl) &&
                        Ho[h.split(".")[0]] &&
                        ((e.socketurl = n.socketurl), (e.socketid = n.socketid), (e.log = n.log))
                })(h),
                ((e) => {
                    const n = qo.value
                    n && "object" == typeof n && Object.assign(e, n)
                })(h)
            const p = new n(h),
                {
                    ERROR: y,
                    INTERNAL_ERROR: m,
                    MANIFEST_PARSED: g,
                    KEY_REQUEST_STARTED: b,
                    LICENSE_CHALLENGE_CREATED: _,
                    LEVEL_SWITCHED: T,
                    UNRESOLVED_URI_LOADING: S
                } = n.Events
            p.on(y, this.handleHlsError),
                p.on(m, this.handleHlsError),
                p.on(g, this.handleManifestParsed),
                p.on(b, this.handleKeyRequestStarted),
                p.on(_, this.handleLicenseChallengeCreated),
                p.on(T, this.handleLevelSwitched),
                this._shouldLoadManifestsOnce && p.on(S, this.handleUnresolvedUriLoading),
                (this._hls = p),
                (window.hlsSession = p),
                (this._hlsJsTracks = new HlsJsTracks(this._hls)),
                this.setupTrackManagers(this._hlsJsTracks),
                (this._hlsPreviewImageLoader = new HlsJsPreviewImageLoader(this._hls))
        }
        handleUnresolvedUriLoading(e, n) {
            var d = this
            return _asyncToGenerator$b(function* () {
                const e = d._hls,
                    h = n.uri,
                    p = h.replace("manifest://", "https://")
                var y
                Rt.debug("handleUnresolvedUriLoading for uri ", h)
                const m = null !== (y = hs.getManifest(p)) && void 0 !== y ? y : yield hs.fetchManifest(p)
                m
                    ? (hs.clear(p),
                      e.off(window.Hls.Events.UNRESOLVED_URI_LOADING, d.handleUnresolvedUriLoading),
                      e.handleResolvedUri(h, { url: p, status: 200, data: m.content }))
                    : Rt.error("No cached manifest for " + p)
            })()
        }
        handleLevelSwitched(e, n) {
            var d, h
            const { level: p } = n
            if (!p) return
            const y = null === (d = this._levels) || void 0 === d ? void 0 : d.find((e) => e.persistentId === p)
            if (
                !y ||
                (null === (h = this._currentLevel) || void 0 === h ? void 0 : h.persistentId) ===
                    (null == y ? void 0 : y.persistentId)
            )
                return
            this._currentLevel = y
            const m = void 0 !== y.audioGroupId ? this._channelsByGroup[y.audioGroupId] : void 0
            this._dispatcher.publish(cr.hlsLevelUpdated, { level: y, channels: m })
        }
        handleHlsError(e, n) {
            if ((Rt.warn("HLS.js error", JSON.stringify(n)), this._unrecoverableError)) return
            let d = new MKError(MKError.UNSUPPORTED_ERROR, n.reason)
            d.data = n
            const { keySystemGenericError: h } = Bo
            if (n.details !== h) {
                if (
                    ("output-restricted" === n.reason && (d = new MKError(MKError.OUTPUT_RESTRICTED, n.reason)),
                    n.fatal)
                ) {
                    if ((this._hls.destroy(), !this.shouldDispatchErrors)) throw d
                    this._dispatcher.publish(ur.mediaPlaybackError, d)
                }
            } else this._dispatcher.publish(h, d)
        }
        handleManifestParsed(e, n) {
            var d = this
            return _asyncToGenerator$b(function* () {
                var e, h
                let p
                Rt.debug("handleManifestParsed", n),
                    (d._levels = null !== (e = n.levels) && void 0 !== e ? e : []),
                    (d.nowPlayingItem.state = $.ready),
                    (d._channelsByGroup = (null !== (h = n.audioTracks) && void 0 !== h ? h : []).reduce(
                        (e, n) => ((e[n.groupId] = n.channels), e),
                        {}
                    ))
                try {
                    yield d._playMedia()
                } catch (Mr) {
                    throw (Rt.warn("error from media element, possibly non-fatal", Mr), Mr)
                } finally {
                    p = yield d.finishPlaybackSequence()
                }
                return p
            })()
        }
        handleKeyRequestStarted(e, n) {
            Rt.debug("hlsjs-video.handleKeyRequestStarted"), this._hls.generateKeyRequest(n.keyuri, {})
        }
        handleLicenseChallengeCreated(n, d) {
            var h = this
            return _asyncToGenerator$b(function* () {
                const { _licenseServerUrl: n, nowPlayingItem: p, _keySystem: y, userInitiated: m } = h
                try {
                    var g
                    const e = yield null === (g = h._license) || void 0 === g ? void 0 : g.start(n, p, d, y, m),
                        b = { statusCode: e.status }
                    ;(null == e ? void 0 : e.license) &&
                        (y === Bt.FAIRPLAY ? (b.ckc = Se(e.license)) : (b.license = Se(e.license)))
                    const _ = e["renew-after"]
                    _ && (b.renewalDate = new Date(Date.now() + 1e3 * _)), h._hls.setLicenseResponse(d.keyuri, b)
                } catch (Mr) {
                    if (h._unrecoverableError) return
                    const p = Mr.data,
                        y = {}
                    void 0 !== (null == p ? void 0 : p.status) && (y.statusCode = +p.status),
                        Rt.warn("Passing license response error to Hls.js", y),
                        h._hls.setLicenseResponse(d.keyuri, y),
                        Fo.has(Mr.name) &&
                            ((h._unrecoverableError = Mr),
                            h.resetDeferredPlay(),
                            yield h.stop({
                                endReasonType: e.PlayActivityEndReasonType.FAILED_TO_LOAD,
                                userInitiated: m
                            })),
                        h.onPlaybackLicenseError(Mr)
                }
            })()
        }
        seekToTime(e) {
            var n = this
            return _asyncToGenerator$b(function* () {
                n._hls
                    ? (Rt.debug("hlsjs-video: hls seekTo", e), (n._hls.seekTo = e))
                    : (Rt.debug("hlsjs-video: media element seek to", e), (n._targetElement.currentTime = e))
            })()
        }
        loadPreviewImage(e) {
            var n = this
            return _asyncToGenerator$b(function* () {
                var d
                return null === (d = n._hlsPreviewImageLoader) || void 0 === d ? void 0 : d.loadPreviewImage(e)
            })()
        }
        constructor(e) {
            var n
            super(e),
                (this._channelsByGroup = {}),
                (this._rtcTracker =
                    null == e || null === (n = e.playbackServices) || void 0 === n
                        ? void 0
                        : n.getRTCStreamingTracker()),
                (this._license = new License())
        }
    }
    var Wo
    $o(
        [
            Bind(),
            Go("design:type", Function),
            Go("design:paramtypes", [
                String,
                "undefined" == typeof HlsUnresolvedUriData ? Object : HlsUnresolvedUriData
            ])
        ],
        HlsJsVideoPlayer.prototype,
        "handleUnresolvedUriLoading",
        null
    ),
        $o(
            [Bind(), Go("design:type", Function), Go("design:paramtypes", [void 0, void 0])],
            HlsJsVideoPlayer.prototype,
            "handleLevelSwitched",
            null
        ),
        $o(
            [Bind(), Go("design:type", Function), Go("design:paramtypes", [void 0, void 0])],
            HlsJsVideoPlayer.prototype,
            "handleHlsError",
            null
        ),
        $o(
            [Bind(), Go("design:type", Function), Go("design:paramtypes", [void 0, void 0])],
            HlsJsVideoPlayer.prototype,
            "handleManifestParsed",
            null
        ),
        $o(
            [Bind(), Go("design:type", Function), Go("design:paramtypes", [void 0, void 0])],
            HlsJsVideoPlayer.prototype,
            "handleKeyRequestStarted",
            null
        ),
        $o(
            [Bind(), Go("design:type", Function), Go("design:paramtypes", [void 0, void 0])],
            HlsJsVideoPlayer.prototype,
            "handleLicenseChallengeCreated",
            null
        ),
        $o(
            [AsyncDebounce(250), Go("design:type", Function), Go("design:paramtypes", [Number])],
            HlsJsVideoPlayer.prototype,
            "seekToTime",
            null
        ),
        $o(
            [
                ((Wo = 250),
                (e, n, d) => {
                    const h = (function (e, n) {
                        let d,
                            h,
                            p = 0
                        const resetState = () => {
                            clearTimeout(h), (h = 0), (d = void 0)
                        }
                        return function (...y) {
                            const m = this
                            return new Promise(function (g, b) {
                                const _ = Date.now()
                                _ - p < n
                                    ? (d && (d.resolve(void 0), resetState()),
                                      (d = { resolve: g, reject: b, args: y }),
                                      (h = setTimeout(() => {
                                          e.apply(m, d.args).then(d.resolve).catch(d.reject), resetState()
                                      }, n - (_ - p + 1))))
                                    : (resetState(), (p = _), e.apply(m, y).then(g).catch(b))
                            })
                        }
                    })(d.value, Wo)
                    d.value = h
                }),
                Go("design:type", Function),
                Go("design:paramtypes", [Number])
            ],
            HlsJsVideoPlayer.prototype,
            "loadPreviewImage",
            null
        )
    class VideoMediaExtension extends MediaExtension {
        destroy(e) {
            var n
            null === (n = this._session) || void 0 === n || n.stopLicenseSession(), super.destroy(e)
        }
    }
    function asyncGeneratorStep$a(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$a(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$a(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$a(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    var Yo =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        zo =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const { mediaPlaybackError: Qo } = ur,
        { playbackLicenseError: Jo, playbackSessionError: Xo } = Yt
    class NativeSafariVideoPlayer extends VideoPlayer {
        get currentPlayingDate() {}
        get isPlayingAtLiveEdge() {
            return !1
        }
        get seekableTimeRanges() {
            return this.currentPlaybackDuration ? [{ start: 0, end: this.currentPlaybackDuration }] : void 0
        }
        get supportsPreviewImages() {
            return !1
        }
        initializeExtension() {
            var e = this
            return _asyncToGenerator$a(function* () {
                if (!e.video)
                    return void Rt.warn(
                        "NativeSafariVideoPlayer.initializeExtension No video element, not initializing extension"
                    )
                const n = new VideoMediaExtension(e.video, 'video/mp4;codecs="avc1.42E01E"')
                ;(e.extension = n),
                    yield n.initializeKeySystem(),
                    n.addEventListener(Jo, e.onPlaybackLicenseError),
                    n.addEventListener(Xo, e.onPlaybackSessionError)
            })()
        }
        destroy() {
            Rt.debug("native-safari-video-player.destroy")
            const { extension: e, video: n } = this
            this._blobUrl && (URL.revokeObjectURL(this._blobUrl), (this._blobUrl = void 0)),
                e &&
                    n &&
                    (e.removeEventListener(Jo, this.onPlaybackLicenseError),
                    e.removeEventListener(Xo, this.onPlaybackSessionError),
                    n.removeEventListener("loadedmetadata", this.onMetadataLoaded),
                    super.destroy())
        }
        loadPreviewImage(e) {
            return _asyncToGenerator$a(function* () {})()
        }
        playHlsStream(e, n, d = {}) {
            var h = this
            return _asyncToGenerator$a(function* () {
                Rt.debug("native-safari-video-player.playHlsStream", e)
                const { video: p } = h
                if (!p) {
                    const e = "NativeSafariVideoPlayer.playHlsStream(): No video element"
                    throw (Rt.error(e), new Error(e))
                }
                h.setupTrackManagers()
                const y = h.startPlaybackSequence(),
                    m = (h._shouldLoadManifestsOnce ? h.playByBlob(e, p, d) : h.playBySource(e, p, d)).then(() => y)
                var g
                n && (null === (g = h.extension) || void 0 === g || g.setMediaItem(n))
                return p.addEventListener("loadedmetadata", h.onMetadataLoaded), m
            })()
        }
        onPlaybackSessionError(e) {
            this._dispatcher.publish(Qo, new MKError(MKError.MEDIA_SESSION, e))
        }
        onMetadataLoaded() {
            var e = this
            return _asyncToGenerator$a(function* () {
                Rt.debug("native-safari-video-player.onMetadataLoaded")
                const { nowPlayingItem: n } = e
                n && (n.state = $.ready), yield e._playMedia(), e.finishPlaybackSequence()
            })()
        }
        seekToTime(e) {
            var n = this
            return _asyncToGenerator$a(function* () {
                Rt.debug("native-safari-video-player: media element seek to", e), (n._targetElement.currentTime = e)
            })()
        }
        playByBlob(e, n, d = {}) {
            var h = this
            return _asyncToGenerator$a(function* () {
                Rt.debug("native-safari-video-player: playing video by blob")
                let p = hs.getManifest(e)
                if (
                    !p &&
                    (Rt.debug("native-safari-video-player: fetching manifest"), (p = yield hs.fetchManifest(e)), !p)
                )
                    throw (
                        (Rt.error("No manifest for " + e),
                        new MKError(MKError.CONTENT_UNAVAILABLE, "Failed to load manifest"))
                    )
                Rt.debug("native-safari-video-player: loaded manifest", !!p), hs.clear(e)
                const y = p.contentType,
                    m = p.content.replace(/^#EXT-X-SESSION-DATA-ITUNES:.*$/gm, ""),
                    g = new Blob([m], { type: y })
                ;(e = URL.createObjectURL(g)), (h._blobUrl = e)
                const b = document.createElement("source")
                b.setAttribute("src", e),
                    y && b.setAttribute("type", y),
                    Rt.debug("native-safari-video-player: blob url", e),
                    void 0 !== d.startTime && (n.currentTime = d.startTime),
                    n.appendChild(b)
            })()
        }
        playBySource(e, n, d = {}) {
            return _asyncToGenerator$a(function* () {
                Rt.debug("native-safari-video-player: playing video by source"),
                    void 0 !== d.startTime && (e += "#t=" + d.startTime),
                    (n.src = e)
            })()
        }
    }
    function asyncGeneratorStep$9(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    Yo(
        [Bind(), zo("design:type", Function), zo("design:paramtypes", [void 0])],
        NativeSafariVideoPlayer.prototype,
        "onPlaybackSessionError",
        null
    ),
        Yo(
            [Bind(), zo("design:type", Function), zo("design:paramtypes", [])],
            NativeSafariVideoPlayer.prototype,
            "onMetadataLoaded",
            null
        ),
        Yo(
            [AsyncDebounce(250), zo("design:type", Function), zo("design:paramtypes", [Number])],
            NativeSafariVideoPlayer.prototype,
            "seekToTime",
            null
        )
    const Zo = BooleanDevFlag.register("mk-safari-force-native-live-stream")
    class Factory {
        getPlayerForMediaItem(e, n, d) {
            var h = this
            return (function (e) {
                return function () {
                    var n = this,
                        d = arguments
                    return new Promise(function (h, p) {
                        var y = e.apply(n, d)
                        function _next(e) {
                            asyncGeneratorStep$9(y, h, p, _next, _throw, "next", e)
                        }
                        function _throw(e) {
                            asyncGeneratorStep$9(y, h, p, _next, _throw, "throw", e)
                        }
                        _next(void 0)
                    })
                }
            })(function* () {
                Rt.debug("mk: getPlayerForMediaItem", e, n)
                const p = getPlayerType(e)
                let y = h._playersByType[p]
                if (
                    ((null == y ? void 0 : y.isDestroyed) &&
                        (Rt.debug("mk: existingPlayer was previously destroyed. Removing from factory."),
                        (y = void 0),
                        delete h._playersByType[p]),
                    y && y === d)
                )
                    return d
                if (y) return h._applyPlayerState(y, n), y
                const { _playerOptions: m } = h
                let g
                switch (p) {
                    case "audio":
                        ;(g = new AudioPlayer(m)), (h._playersByType[p] = g)
                        break
                    case "video": {
                        var b
                        const n = yield null === (b = h._playerOptions.playbackServices) || void 0 === b
                                ? void 0
                                : b.requiresHlsJs(),
                            d = h._shouldForceHlsJsPlayer(e)
                        g = n || d ? new HlsJsVideoPlayer(m) : new NativeSafariVideoPlayer(m)
                        break
                    }
                    default:
                        throw new Error("Invalid player type requested: " + p)
                }
                return yield g.initialize(), h._applyPlayerState(g, n), g
            })()
        }
        _shouldForceHlsJsPlayer(e) {
            var n, d, h
            return (
                !Zo.enabled &&
                (e.isLiveVideoStation ||
                    e.isLinearStream ||
                    (null === (n = e.defaultPlayable) ||
                    void 0 === n ||
                    null === (d = n.assets) ||
                    void 0 === d ||
                    null === (h = d.fpsKeyServerUrl) ||
                    void 0 === h
                        ? void 0
                        : h.startsWith("https://linear.tv.apple.com")))
            )
        }
        _applyPlayerState(e, n) {
            return n
                ? (Rt.debug("_applyPlayerState", n),
                  Object.keys(n).forEach((d) => {
                      void 0 !== e[d] && (e[d] = n[d])
                  }),
                  e)
                : e
        }
        destroy() {
            Object.values(this._playersByType).forEach((e) => e.destroy())
        }
        constructor(e) {
            ;(this._playersByType = {}), (this._playerOptions = e)
        }
    }
    function asyncGeneratorStep$8(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$8(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$8(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$8(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    var ec =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        tc =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const { mediaPlaybackError: rc, playerTypeDidChange: nc } = ur,
        { playbackLicenseError: ic } = Yt,
        { keySystemGenericError: ac } = Bo,
        sc = (function () {
            var e = _asyncToGenerator$8(function* (e, n) {
                var d, h
                if (
                    null === (d = e.container) || void 0 === d || null === (h = d.attributes) || void 0 === h
                        ? void 0
                        : h.requiresSubscription
                ) {
                    if (!(yield n())) {
                        const n = new MKError(MKError.SUBSCRIPTION_ERROR)
                        throw ((n.data = e), n)
                    }
                }
            })
            return function (n, d) {
                return e.apply(this, arguments)
            }
        })()
    let oc = !1
    class MediaItemPlayback {
        get currentPlaybackTime() {
            return this._currentPlayer.currentPlaybackTime
        }
        get currentPlaybackTimeRemaining() {
            return this._currentPlayer.currentPlaybackTimeRemaining
        }
        get currentPlayingDate() {
            return this._currentPlayer.currentPlayingDate
        }
        get isPlayingAtLiveEdge() {
            return this._currentPlayer.isPlayingAtLiveEdge
        }
        get seekableTimeRanges() {
            return this._currentPlayer.seekableTimeRanges
        }
        get audioTracks() {
            return this._currentPlayer.audioTracks
        }
        get currentAudioTrack() {
            return this._currentPlayer.currentAudioTrack
        }
        set currentAudioTrack(e) {
            this._currentPlayer.currentAudioTrack = e
        }
        get currentPlaybackDuration() {
            return this._currentPlayer.currentPlaybackDuration
        }
        get currentBufferedProgress() {
            return this._currentPlayer.currentBufferedProgress
        }
        get currentPlaybackProgress() {
            return this._currentPlayer.currentPlaybackProgress
        }
        get currentTextTrack() {
            return this._currentPlayer.currentTextTrack
        }
        set currentTextTrack(e) {
            this._currentPlayer.currentTextTrack = e
        }
        get previewOnly() {
            return this._previewOnly
        }
        set previewOnly(e) {
            this._previewOnly = e
        }
        get isPlaying() {
            return this._currentPlayer.isPlaying
        }
        get isPrimaryPlayer() {
            return this._currentPlayer.isPrimaryPlayer
        }
        set isPrimaryPlayer(e) {
            this._currentPlayer.isPrimaryPlayer = e
        }
        get isReady() {
            return this._currentPlayer.isReady
        }
        get nowPlayingItem() {
            return this._currentPlayer.nowPlayingItem
        }
        get playbackRate() {
            return this._currentPlayer.playbackRate
        }
        set playbackRate(e) {
            this._updatePlayerState("playbackRate", e)
        }
        get playbackState() {
            return this._currentPlayer.playbackState
        }
        set playbackState(e) {
            this._currentPlayer.setPlaybackState(e, this.nowPlayingItem)
        }
        get playbackTargetAvailable() {
            return this._currentPlayer.playbackTargetAvailable
        }
        get playbackTargetIsWireless() {
            return this._currentPlayer.playbackTargetIsWireless
        }
        get supportsPreviewImages() {
            return this._currentPlayer.supportsPreviewImages
        }
        get textTracks() {
            return this._currentPlayer.textTracks
        }
        get volume() {
            return this._currentPlayer.volume
        }
        set volume(e) {
            var n
            this._currentPlayer.isDestroyed &&
                (null === (n = this._dispatcher) || void 0 === n || n.publish(ur.playbackVolumeDidChange, {}))
            this._updatePlayerState("volume", e)
        }
        clearNextManifest() {
            this._currentPlayer.clearNextManifest()
        }
        destroy() {
            var e, n
            this._playerFactory.destroy(),
                null === (e = this._dispatcher) || void 0 === e || e.unsubscribe(ic, this.onPlaybackLicenseError),
                null === (n = this._dispatcher) || void 0 === n || n.unsubscribe(ac, this.onKeySystemGenericError)
        }
        exitFullscreen() {
            return this._currentPlayer.exitFullscreen()
        }
        loadPreviewImage(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                return n._currentPlayer.loadPreviewImage(e)
            })()
        }
        getNewSeeker() {
            return this._currentPlayer.newSeeker()
        }
        mute() {
            ;(this._volumeAtMute = this.volume), (this.volume = 0)
        }
        pause(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                return n._currentPlayer.pause(e)
            })()
        }
        play() {
            var e = this
            return _asyncToGenerator$8(function* () {
                return e._currentPlayer.play()
            })()
        }
        preload() {
            var e = this
            return _asyncToGenerator$8(function* () {
                return e._currentPlayer.preload()
            })()
        }
        prepareToPlay(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                var d
                jt.debug("invoking prepareToPlay for ", e.title)
                const h = yield n.prepareForEncryptedPlayback(e, { bitrate: n._bitrateCalculator.bitrate }),
                    p = null === (d = n._currentPlayback) || void 0 === d ? void 0 : d.item,
                    y = Ft.features["seamless-audio-transitions"],
                    m = "song" === (null == p ? void 0 : p.type) && "song" === e.type,
                    g = !e.playRawAssetURL
                return (
                    y &&
                        m &&
                        g &&
                        (jt.debug(`setting ${e.title} for seamless audio transition`),
                        yield n._currentPlayer.setNextSeamlessItem(e)),
                    h
                )
            })()
        }
        requestFullscreen(e) {
            return this._currentPlayer.requestFullscreen(e)
        }
        showPlaybackTargetPicker() {
            this._currentPlayer.showPlaybackTargetPicker()
        }
        seekToTime(e, n = yr.Manual) {
            var d = this
            return _asyncToGenerator$8(function* () {
                yield d._currentPlayer.seekToTime(e, n)
            })()
        }
        setPresentationMode(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                return n._currentPlayer.setPresentationMode(e)
            })()
        }
        startMediaItemPlayback(e, n = !1) {
            var d = this
            return _asyncToGenerator$8(function* () {
                var h
                jt.debug("MediaItemPlayback: startMediaItemPlayback", e),
                    e.resetState(),
                    ((e) => {
                        if (e.isLinearStream && (Gt.isiOS || (Gt.isMacOs && navigator.maxTouchPoints > 2))) {
                            jt.warn("Cannot play linear stream on iOS or iPad")
                            const n = new MKError(MKError.CONTENT_UNSUPPORTED, "IOS LINEAR")
                            throw ((n.data = { item: e }), n)
                        }
                    })(e),
                    yield sc(e, d.hasMusicSubscription)
                const p = yield d._getPlayerForMediaItem(e)
                if (
                    (yield d.setCurrentPlayer(p),
                    !(null === (h = d._currentPlayer) || void 0 === h ? void 0 : h.hasMediaElement))
                )
                    return (
                        jt.warn(
                            `MediaItemPlayback: Could not play media of type ${e.type}, marking item as unsupported and skipping.`
                        ),
                        void e.notSupported()
                    )
                try {
                    e.beginMonitoringStateDidChange((e) => {
                        var n
                        return null === (n = d._dispatcher) || void 0 === n
                            ? void 0
                            : n.publish(I.mediaItemStateDidChange, e)
                    }),
                        e.beginMonitoringStateWillChange((e) => {
                            var n
                            return null === (n = d._dispatcher) || void 0 === n
                                ? void 0
                                : n.publish(I.mediaItemStateWillChange, e)
                        })
                    const h = d.playOptions.get(e.id)
                    h && d.playOptions.delete(e.id)
                    const p = yield d._playAccordingToPlaybackType(e, n, h)
                    return (d._currentPlayback = { item: e, userInitiated: n }), p
                } catch (Y) {
                    throw (e.updateFromLoadError(Y), jt.error(Y.message, Y), Y)
                }
            })()
        }
        _playAccordingToPlaybackType(e, n, d) {
            var h = this
            return _asyncToGenerator$8(function* () {
                return (yield (function (e, n) {
                    return _shouldPlayPreview.apply(this, arguments)
                })(e, h._previewOnly))
                    ? h._playPreview(e, n)
                    : (function (e) {
                          return !(!e.playRawAssetURL || !e.attributes.assetUrl)
                      })(e)
                    ? h._playRawAsset(e, n, d)
                    : isBroadcastRadio(e)
                    ? h._playBroadcastRadio(e, n)
                    : (((e) => {
                          if (!supportsDrm()) {
                              const n = new MKError(MKError.CONTENT_UNSUPPORTED, "NO DRM")
                              throw ((n.data = { item: e }), jt.warn("No DRM detected"), n)
                          }
                      })(e),
                      h._playEncryptedFull(e, n, d))
            })()
        }
        _playEncryptedFull(e, n, d) {
            var h = this
            return _asyncToGenerator$8(function* () {
                if ((jt.debug("MediaItemPlayback: play encrypted full", e), !e || !e.isPlayable))
                    return Promise.reject(new MKError(MKError.MEDIA_PLAYBACK, "Not Playable"))
                const p = h._currentPlayer
                try {
                    yield h.prepareForEncryptedPlayback(e, { bitrate: h._bitrateCalculator.bitrate })
                } catch (Y) {
                    return (
                        jt.error("prepareForEncryptedPlayback Error: userInitiated " + n),
                        p.destroy(),
                        n ? Promise.reject(Y) : void p.dispatch(ur.mediaPlaybackError, Y)
                    )
                }
                return (
                    yield (function (e) {
                        return new Promise((n, d) => {
                            const { ageGatePolicy: h } = e
                            if (!h || !h.age || !h.frequencyInMinutes)
                                return Mt.debug("No ageGatePolicy. Resolving handleAgeGate()"), n(void 0)
                            const p = getLocalStorage(),
                                y = null == p ? void 0 : p.ageGatePolicyAge,
                                m = null == p ? void 0 : p.ageGatePolicyExpiration
                            if (y && m && parseInt(m, 10) > Date.now() && parseInt(y, 10) >= h.age) return n(void 0)
                            MKDialog.clientDialog({
                                okButtonString: "Yes",
                                okButtonAction: () => (
                                    null == p || p.setItem("ageGatePolicyAge", h.age.toString()),
                                    null == p ||
                                        p.setItem(
                                            "ageGatePolicyExpiration",
                                            (Date.now() + 60 * h.frequencyInMinutes * 1e3).toString()
                                        ),
                                    n(void 0)
                                ),
                                cancelButtonString: "No",
                                cancelButtonAction: () => d(new MKError("AGE_GATE", "Age Gate Declined")),
                                explanation: `This content may not be appropriate for ages younger than ${h.age}.`,
                                message: `Are you ${h.age} or older?`
                            }).present()
                        })
                    })(e),
                    jt.debug("About to play item as encrypted", e),
                    yield p.playItemFromEncryptedSource(e, n, d),
                    e
                )
            })()
        }
        _playBroadcastRadio(n, d) {
            var h = this
            return _asyncToGenerator$8(function* () {
                if ((jt.debug("MediaItemPlayback: play broadcast radio", n), !Ft.features["broadcast-radio"])) {
                    const e = new MKError(MKError.CONTENT_UNAVAILABLE)
                    throw ((e.data = n), e)
                }
                const p = h._currentPlayer,
                    y = p.isPaused() && !d,
                    m = yield wo(n, ya.developerToken, ya.musicUserToken),
                    g = m.assets[0]
                return (
                    (n.playbackType = e.PlaybackType.unencryptedFull),
                    (n.trackInfo = m["track-info"]),
                    (p.nowPlayingItem = n),
                    yield p.playItemFromUnencryptedSource(g.url, y),
                    n
                )
            })()
        }
        _playRawAsset(n, d, h) {
            var p = this
            return _asyncToGenerator$8(function* () {
                jt.debug("MediaItemPlayback: play raw asset", n)
                const y = p._currentPlayer,
                    m = y.isPaused() && !d
                return (
                    (n.playbackType = e.PlaybackType.unencryptedFull),
                    (y.nowPlayingItem = n),
                    yield y.playItemFromUnencryptedSource(n.attributes.assetUrl, m, h),
                    n
                )
            })()
        }
        _playPreview(n, d) {
            var h = this
            return _asyncToGenerator$8(function* () {
                jt.debug("MediaItemPlayback: play preview", n)
                const p = h._currentPlayer,
                    y = p.isPaused() && !d
                return (
                    supportsDrm() || p.dispatch(ur.drmUnsupported, { item: n }),
                    (n.playbackType = e.PlaybackType.preview),
                    (p.nowPlayingItem = n),
                    yield p.playItemFromUnencryptedSource(n.previewURL, y),
                    n
                )
            })()
        }
        stop(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                yield n._currentPlayer.stop(e)
            })()
        }
        unmute() {
            this.volume > 0 || ((this.volume = this._volumeAtMute || 1), (this._volumeAtMute = void 0))
        }
        _getPlayerForMediaItem(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                jt.debug("MediaItemPlayback:  _getPlayerForMediaItem", e.id)
                return yield n._playerFactory.getPlayerForMediaItem(e, n.playerState, n._currentPlayer)
            })()
        }
        setCurrentPlayer(e) {
            var n = this
            return _asyncToGenerator$8(function* () {
                var d
                n._currentPlayer !== e &&
                    (jt.debug("MediaItemPlayback: setting currentPlayer", e),
                    yield n._currentPlayer.stop(),
                    (n._currentPlayer = e),
                    null === (d = n._dispatcher) || void 0 === d || d.publish(nc, { player: e }))
            })()
        }
        onKeySystemGenericError(e, n) {
            var d = this
            return _asyncToGenerator$8(function* () {
                var e
                oc
                    ? null === (e = d._dispatcher) || void 0 === e || e.publish(rc, n)
                    : ((oc = !0), jt.warn("Retrying playback after keysystemGenericError"), yield d.restartPlayback())
            })()
        }
        onPlaybackLicenseError(e, n) {
            var d = this
            return _asyncToGenerator$8(function* () {
                var e
                n.errorCode === MKError.PLAYREADY_CBC_ENCRYPTION_ERROR
                    ? (jt.warn(
                          "MediaItemPlayback: PLAYREADY_CBC_ENCRYPTION_ERROR...retrying with different key system"
                      ),
                      yield d.restartPlayback())
                    : null === (e = d._dispatcher) || void 0 === e || e.publish(rc, n)
            })()
        }
        restartPlayback() {
            var e = this
            return _asyncToGenerator$8(function* () {
                yield e.stop()
                const { _currentPlayback: n } = e
                if (n) {
                    const { item: d, userInitiated: h } = n
                    d.resetState(), yield e.startMediaItemPlayback(d, h)
                }
            })()
        }
        _updatePlayerState(e, n) {
            ;(this.playerState[e] = n), (this._currentPlayer[e] = n)
        }
        constructor(e) {
            ;(this.playerState = { playbackRate: 1, volume: 1 }),
                (this.playOptions = new Map()),
                (this._previewOnly = !1)
            const { playbackServices: n } = e
            var d, h
            ;(this.hasMusicSubscription = n.hasMusicSubscription),
                (this.prepareForEncryptedPlayback = n.prepareForEncryptedPlayback),
                (d = e.tokens),
                (ya = d),
                e.bag && ((h = e.bag), Object.assign(Ft, h)),
                (this._dispatcher = e.services.dispatcher),
                (this._bitrateCalculator = e.services.bitrateCalculator),
                (this._playerFactory = new Factory(e)),
                (this._currentPlayer = new PlayerStub(e)),
                this._dispatcher.subscribe(ic, this.onPlaybackLicenseError),
                this._dispatcher.subscribe(ac, this.onKeySystemGenericError)
        }
    }
    function asyncGeneratorStep$7(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$7(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$7(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$7(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$5(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$5(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$5(e, n, d[n])
                })
        }
        return e
    }
    ec(
        [Bind(), tc("design:type", Function), tc("design:paramtypes", [void 0, void 0])],
        MediaItemPlayback.prototype,
        "onKeySystemGenericError",
        null
    ),
        ec(
            [Bind(), tc("design:type", Function), tc("design:paramtypes", [void 0, void 0])],
            MediaItemPlayback.prototype,
            "onPlaybackLicenseError",
            null
        )
    var cc =
            ({} && {}.__decorate) ||
            function (e, n, d, h) {
                var p,
                    y = arguments.length,
                    m = y < 3 ? n : null === h ? (h = Object.getOwnPropertyDescriptor(n, d)) : h
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    m = Reflect.decorate(e, n, d, h)
                else
                    for (var g = e.length - 1; g >= 0; g--)
                        (p = e[g]) && (m = (y < 3 ? p(m) : y > 3 ? p(n, d, m) : p(n, d)) || m)
                return y > 3 && m && Object.defineProperty(n, d, m), m
            },
        lc =
            ({} && {}.__metadata) ||
            function (e, n) {
                if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, n)
            }
    const uc = [
        MKError.AGE_VERIFICATION,
        MKError.CONTENT_EQUIVALENT,
        MKError.CONTENT_RESTRICTED,
        MKError.CONTENT_UNAVAILABLE,
        MKError.CONTENT_UNSUPPORTED,
        MKError.SERVER_ERROR,
        MKError.SUBSCRIPTION_ERROR,
        MKError.UNSUPPORTED_ERROR,
        MKError.USER_INTERACTION_REQUIRED
    ]
    var dc
    ;(e.PlaybackMode = void 0),
        ((dc = e.PlaybackMode || (e.PlaybackMode = {}))[(dc.PREVIEW_ONLY = 0)] = "PREVIEW_ONLY"),
        (dc[(dc.MIXED_CONTENT = 1)] = "MIXED_CONTENT"),
        (dc[(dc.FULL_PLAYBACK_ONLY = 2)] = "FULL_PLAYBACK_ONLY")
    const hc = JsonDevFlag.register("mk-bag-features-overrides")
    class MKInstance {
        get developerToken() {
            return Ts.developerToken
        }
        get api() {
            return this._services.apiManager.api
        }
        get audioTracks() {
            return this._mediaItemPlayback.audioTracks
        }
        get authorizationStatus() {
            return Ts.authorizationStatus
        }
        get bitrate() {
            return this._services.bitrateCalculator.bitrate
        }
        set bitrate(e) {
            this._services.bitrateCalculator.bitrate = e
        }
        get browserSupportsPictureInPicture() {
            return (function () {
                if ($t) return !1
                const e = Ht,
                    n = e && e.webkitSupportsPresentationMode && "function" == typeof e.webkitSetPresentationMode,
                    d = document.pictureInPictureEnabled
                return !(!n && !d)
            })()
        }
        get browserSupportsVideoDrm() {
            return supportsDrm()
        }
        get cid() {
            return (this.realm === e.SKRealm.TV || this.sourceType !== Ar.MUSICKIT) && Ts.cid
        }
        get continuous() {
            return this._playbackController.continuous
        }
        set continuous(e) {
            this._playbackController.continuous = e
        }
        get autoplayEnabled() {
            return this._autoplayEnabled
        }
        set autoplayEnabled(n) {
            this.realm !== e.SKRealm.MUSIC && (n = !1),
                n !== this.autoplayEnabled &&
                    ((this._autoplayEnabled = n),
                    this._services.dispatcher.publish(is.autoplayEnabledDidChange, this.autoplayEnabled))
        }
        get currentAudioTrack() {
            return this._mediaItemPlayback.currentAudioTrack
        }
        set currentAudioTrack(e) {
            this._mediaItemPlayback.currentAudioTrack = e
        }
        get currentPlaybackDuration() {
            return this._mediaItemPlayback.currentPlaybackDuration
        }
        get currentPlaybackProgress() {
            return this._mediaItemPlayback.currentPlaybackProgress
        }
        get currentPlaybackTime() {
            return this._mediaItemPlayback.currentPlaybackTime
        }
        get currentPlaybackTimeRemaining() {
            return this._mediaItemPlayback.currentPlaybackTimeRemaining
        }
        get currentTextTrack() {
            return this._mediaItemPlayback.currentTextTrack
        }
        set currentTextTrack(e) {
            this._mediaItemPlayback.currentTextTrack = e
        }
        get isAuthorized() {
            return Ts.isAuthorized
        }
        get isPlaying() {
            return this._playbackController.isPlaying
        }
        get isRestricted() {
            return Ts.isRestricted
        }
        get metricsClientId() {
            return Ts.metricsClientId
        }
        set metricsClientId(e) {
            Ts.metricsClientId = e
        }
        get musicUserToken() {
            return Ts.musicUserToken
        }
        set musicUserToken(e) {
            ;(e && Ts.musicUserToken === e) || (Ts.musicUserToken = e)
        }
        get nowPlayingItem() {
            return this._mediaItemPlayback.nowPlayingItem
        }
        get nowPlayingItemIndex() {
            return this._playbackController.nowPlayingItemIndex
        }
        get playbackMode() {
            return this._playbackMode
        }
        set playbackMode(n) {
            if (-1 === Object.values(e.PlaybackMode).indexOf(n)) return
            this._playbackMode = n
            const d = n === e.PlaybackMode.PREVIEW_ONLY,
                h = this._services.mediaItemPlayback
            h && (h.previewOnly = d)
        }
        get playbackRate() {
            return this._mediaItemPlayback.playbackRate
        }
        set playbackRate(e) {
            this._mediaItemPlayback.playbackRate = e
        }
        get playbackState() {
            return this._mediaItemPlayback.playbackState
        }
        get playbackTargetAvailable() {
            return this._mediaItemPlayback.playbackTargetAvailable
        }
        get playbackTargetIsWireless() {
            return this._mediaItemPlayback.playbackTargetIsWireless
        }
        get previewOnly() {
            return this.playbackMode === e.PlaybackMode.PREVIEW_ONLY
        }
        set previewOnly(n) {
            this.playbackMode = n ? e.PlaybackMode.PREVIEW_ONLY : e.PlaybackMode.MIXED_CONTENT
        }
        get queue() {
            return this._playbackController.queue
        }
        get queueIsEmpty() {
            return this._playbackController.queue.isEmpty
        }
        get realm() {
            return Ts.realm
        }
        get repeatMode() {
            return this._playbackController.repeatMode
        }
        set repeatMode(e) {
            this._playbackController.repeatMode = e
        }
        set requestUserToken(e) {
            Ts.requestUserToken = e
        }
        get restrictedEnabled() {
            return Ts.restrictedEnabled
        }
        set restrictedEnabled(e) {
            Ts.restrictedEnabled = e
        }
        get supportsPreviewImages() {
            return this._mediaItemPlayback.supportsPreviewImages
        }
        get seekSeconds() {
            return this._playbackController.seekSeconds
        }
        get services() {
            return this._services
        }
        set shuffle(e) {
            this._playbackController.shuffle = e
        }
        get shuffleMode() {
            return this._playbackController.shuffleMode
        }
        set shuffleMode(e) {
            this._playbackController.shuffleMode = e
        }
        get storefrontCountryCode() {
            return Ts.storefrontCountryCode
        }
        get subscribeURL() {
            return Ts.subscribeURL
        }
        get subscribeFamilyURL() {
            return Ts.subscribeFamilyURL
        }
        get subscribeIndividualURL() {
            return Ts.subscribeIndividualURL
        }
        get subscribeStudentURL() {
            return Ts.subscribeStudentURL
        }
        get textTracks() {
            return this._mediaItemPlayback.textTracks
        }
        get videoContainerElement() {
            return this.context.videoContainerElement
        }
        set videoContainerElement(e) {
            this.context.videoContainerElement = e
        }
        get volume() {
            return this._mediaItemPlayback.volume
        }
        set volume(e) {
            this._mediaItemPlayback.volume = e
        }
        get storefrontId() {
            return Ts.storefrontId
        }
        set storefrontId(e) {
            Ts.storefrontId = e
        }
        get _mediaItemPlayback() {
            return this._services.mediaItemPlayback
        }
        get _playbackController() {
            if (void 0 !== this._playbackControllerInternal) return this._playbackControllerInternal
            jt.debug("setting _playbackController")
            const e = this._getPlaybackControllerByType(Hs.serial)
            return (this._playbackController = e), e
        }
        set _playbackController(e) {
            ;(this._playbackControllerInternal = e),
                (this._playbackControllerInternal.autoplayEnabled = this._autoplayEnabled),
                this._playbackControllerInternal.activate(),
                this.capabilities.updateChecker(this._playbackControllerInternal.hasCapabilities),
                (this.capabilities.controller = this._playbackControllerInternal)
        }
        addEventListener(e, n, d = {}) {
            adaptAddEventListener(this._services.dispatcher, e, n, d)
        }
        authorize() {
            var e = this
            return _asyncToGenerator$7(function* () {
                return e.deferPlayback(), Ts.authorize()
            })()
        }
        canAuthorize() {
            return supportsDrm() && !this.isAuthorized
        }
        canUnauthorize() {
            return supportsDrm() && this.isAuthorized
        }
        changeToMediaAtIndex(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                n._isPlaybackSupported() &&
                    (yield n._validateAuthorization(),
                    n._signalChangeItemIntent(),
                    yield n._playbackController.changeToMediaAtIndex(e))
            })()
        }
        changeToMediaItem(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                jt.debug("instance.changeToMediaItem", e),
                    n._isPlaybackSupported() &&
                        (yield n._validateAuthorization(),
                        n._signalChangeItemIntent(),
                        yield n._playbackController.changeToMediaItem(e))
            })()
        }
        changeUserStorefront(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                n.storefrontId = e
            })()
        }
        cleanup() {
            var n = this
            return _asyncToGenerator$7(function* () {
                var d
                null === (d = n._services.mediaItemPlayback) || void 0 === d || d.destroy(),
                    n._signalIntent({ endReasonType: e.PlayActivityEndReasonType.EXITED_APPLICATION })
                const h = Object.keys(n._playbackControllers).map((e) => n._playbackControllers[e].destroy())
                try {
                    yield Promise.all(h)
                } catch (Mr) {
                    jt.error("Error cleaning up controller", Mr)
                }
                n._services.dispatcher.clear()
            })()
        }
        configure(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                return (n._whenConfigured = n._configure(e)), n._whenConfigured
            })()
        }
        _configure(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                yield Ts.storekit.whenAuthCompleted
                const d = e.map(n._services.apiManager.registerAPIService, n._services.apiManager)
                yield Promise.all(d), yield n._configurePlayActivity(), n._initializeExternalEventPublishing()
            })()
        }
        deferPlayback() {
            jt.debug("deferPlayback", this._playbackControllerInternal), deferPlayback()
        }
        me() {
            return _asyncToGenerator$7(function* () {
                try {
                    return yield Ts.storekit.me()
                } catch (Mr) {
                    return Promise.reject(new MKError(MKError.AUTHORIZATION_ERROR, "Unauthorized"))
                }
            })()
        }
        hasMusicSubscription() {
            return hasMusicSubscription(Ts.storekit)
        }
        mute() {
            return this._mediaItemPlayback.mute()
        }
        pause(n) {
            var d = this
            return _asyncToGenerator$7(function* () {
                if (d._isPlaybackSupported()) {
                    try {
                        d._signalIntent({ endReasonType: e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED }),
                            yield d._playbackController.pause(n)
                    } catch (Y) {
                        d._handlePlaybackError(Y)
                    }
                    return Promise.resolve()
                }
            })()
        }
        play() {
            var e = this
            return _asyncToGenerator$7(function* () {
                if ((jt.debug("instance.play()"), e._isPlaybackSupported())) {
                    yield e._validateAuthorization()
                    try {
                        yield e._playbackController.play()
                    } catch (Y) {
                        e._handlePlaybackError(Y)
                    }
                    return Promise.resolve()
                }
            })()
        }
        playMediaItem(e, n) {
            var d = this
            return _asyncToGenerator$7(function* () {
                if (
                    (jt.debug("mk: playMediaItem", e),
                    (null == n ? void 0 : n.bingeWatching) || d.deferPlayback(),
                    (n = _objectSpread$5({}, n)),
                    (null == e ? void 0 : e.playEvent) && !hasOwn(n, "startTime"))
                ) {
                    const { playEvent: d } = e
                    d.isDone || void 0 === d.playCursorInSeconds || (n.startTime = d.playCursorInSeconds)
                }
                try {
                    n && d._mediaItemPlayback.playOptions.set(e.id, n)
                    const h = yield d._playbackController.playSingleMediaItem(e, n)
                    return d.services.dispatcher.publish(is.capabilitiesChanged), h
                } catch (Y) {
                    jt.error("mk:playMediaItem error", Y), d._handlePlaybackError(Y)
                }
            })()
        }
        removeEventListener(e, n) {
            !(function (e, n, d) {
                const h = getCallbacksForName(n)
                let p
                for (let y = h.length - 1; y >= 0; y--) {
                    const [e, n] = h[y]
                    if (e === d) {
                        ;(p = n), h.splice(y, 1)
                        break
                    }
                }
                p && e.unsubscribe(n, p)
            })(this._services.dispatcher, e, n)
        }
        exitFullscreen() {
            return this._mediaItemPlayback.exitFullscreen()
        }
        requestFullscreen(e) {
            return this._mediaItemPlayback.requestFullscreen(e)
        }
        loadPreviewImage(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                return n._mediaItemPlayback.loadPreviewImage(e)
            })()
        }
        getNewSeeker() {
            return this._playbackController.getNewSeeker()
        }
        seekToTime(e, n = yr.Manual) {
            var d = this
            return _asyncToGenerator$7(function* () {
                if (d._isPlaybackSupported()) {
                    yield d._validateAuthorization()
                    try {
                        yield d._playbackController.seekToTime(e, n)
                    } catch (Y) {
                        d._handlePlaybackError(Y)
                    }
                    return Promise.resolve()
                }
            })()
        }
        setPresentationMode(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                return n._mediaItemPlayback.setPresentationMode(e)
            })()
        }
        skipToNextItem() {
            var n = this
            return _asyncToGenerator$7(function* () {
                if (n._isPlaybackSupported()) {
                    yield n._validateAuthorization(),
                        n._signalIntent({
                            endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS,
                            direction: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS
                        })
                    try {
                        yield n._playbackController.skipToNextItem()
                    } catch (Y) {
                        n._handlePlaybackError(Y)
                    }
                }
            })()
        }
        skipToPreviousItem() {
            var n = this
            return _asyncToGenerator$7(function* () {
                if (n._isPlaybackSupported()) {
                    yield n._validateAuthorization(),
                        n._signalIntent({
                            endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS,
                            direction: e.PlayActivityEndReasonType.TRACK_SKIPPED_BACKWARDS
                        })
                    try {
                        yield n._playbackController.skipToPreviousItem()
                    } catch (Y) {
                        n._handlePlaybackError(Y)
                    }
                }
            })()
        }
        seekForward() {
            var n = this
            return _asyncToGenerator$7(function* () {
                if (n._isPlaybackSupported()) {
                    yield n._validateAuthorization()
                    try {
                        n._signalIntent({
                            endReasonType: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS,
                            direction: e.PlayActivityEndReasonType.TRACK_SKIPPED_FORWARDS
                        }),
                            yield n._playbackController.seekForward()
                    } catch (Y) {
                        n._handlePlaybackError(Y)
                    }
                }
            })()
        }
        seekBackward() {
            var e = this
            return _asyncToGenerator$7(function* () {
                if (e._isPlaybackSupported()) {
                    yield e._validateAuthorization()
                    try {
                        yield e._playbackController.seekBackward()
                    } catch (Y) {
                        e._handlePlaybackError(Y)
                    }
                }
            })()
        }
        showPlaybackTargetPicker() {
            this._playbackController.showPlaybackTargetPicker()
        }
        stop(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                if (n._isPlaybackSupported()) {
                    var d
                    n._signalIntent({
                        endReasonType: null == e ? void 0 : e.endReasonType,
                        userInitiated: null === (d = null == e ? void 0 : e.userInitiated) || void 0 === d || d
                    })
                    try {
                        yield n._playbackController.stop(e)
                    } catch (Y) {
                        n._handlePlaybackError(Y)
                    }
                }
            })()
        }
        unauthorize() {
            return _asyncToGenerator$7(function* () {
                return Ts.unauthorize()
            })()
        }
        unmute() {
            return this._mediaItemPlayback.unmute()
        }
        _createPlayerControllerOptions() {
            return {
                tokens: Ts,
                bag: bs,
                playbackServices: {
                    getRTCStreamingTracker: () => {
                        var e
                        return null === (e = this._services.playActivity) || void 0 === e
                            ? void 0
                            : e.getTrackerByType(RTCStreamingTracker)
                    },
                    hasMusicSubscription: hasMusicSubscription,
                    prepareForEncryptedPlayback: (e, n) =>
                        (function (e, n, d) {
                            return _prepareForEncryptedPlayback.apply(this, arguments)
                        })(this._services.apiManager, e, n),
                    requiresHlsJs: requiresHlsJs
                },
                services: this._services,
                context: this.context,
                autoplayEnabled: this.autoplayEnabled,
                privateEnabled: this.privateEnabled,
                siriInitiated: this.siriInitiated,
                storekit: null == Ts ? void 0 : Ts.storekit
            }
        }
        _getPlaybackControllerByType(e) {
            const n = this._playbackControllers[e]
            if (n) return n
            let d
            switch (e) {
                case Hs.serial:
                    d = new SerialPlaybackController(this._createPlayerControllerOptions())
                    break
                case Hs.continuous:
                    d = new ContinuousPlaybackController(this._createPlayerControllerOptions())
                    break
                default:
                    throw new MKError(MKError.UNSUPPORTED_ERROR, "Unsupported controller requested: " + e)
            }
            return (this._playbackControllers[e] = d), d
        }
        _handlePlaybackError(e) {
            if ((jt.error("mediaPlaybackError", e), uc.includes(e.name))) throw e
            this._playbackErrorDialog && !$t && MKDialog.presentError(e)
        }
        _initializeInternalEventHandling() {
            Ts.storekit.addEventListener(is.userTokenDidChange, () => {
                this._whenConfigured && this._whenConfigured.then(() => this._configurePlayActivity().catch()).catch()
            })
            const n = this._services.dispatcher
            n.subscribe(is.mediaPlaybackError, (e, n) => this._handlePlaybackError(n)),
                n.subscribe(is.playbackStateDidChange, (n, d) => {
                    d.state === e.PlaybackStates.paused &&
                        (jt.debug(
                            "mk: playbackStateDidChange callback - calling storekit.presentSubscribeViewForEligibleUsers"
                        ),
                        Ts.storekit.presentSubscribeViewForEligibleUsers(
                            { state: d.state, item: this.nowPlayingItem },
                            !1
                        ))
                })
        }
        _initializeExternalEventPublishing() {
            ;[
                is.authorizationStatusDidChange,
                is.storefrontCountryCodeDidChange,
                is.storefrontIdentifierDidChange,
                is.userTokenDidChange,
                is.eligibleForSubscribeView
            ].forEach((e) => {
                Ts.storekit.addEventListener(e, (n) => this._services.dispatcher.publish(e, n))
            })
            const e = ar[this.storefrontId.toUpperCase()],
                n = rr[e]
            this._services.dispatcher.subscribe($a, (e, d) => {
                d.resolveAdamIdFromStorefront(n), this._services.dispatcher.publish(is.timedMetadataDidChange, d)
            })
        }
        configureLogger(e) {
            var n
            jt.level === Lt &&
                (!0 === e.debug
                    ? setRootLoggingLevel(O.DEBUG)
                    : void 0 !== e.logLevel && setRootLoggingLevel(e.logLevel)),
                void 0 !== e.logHandler && ((n = e.logHandler), (jt.handlers.external = new CallbackHandler(n)))
        }
        _configurePlayActivity() {
            var e = this
            return _asyncToGenerator$7(function* () {
                void 0 !== e._services.playActivity &&
                    (yield e._services.playActivity.configure(e, { services: e._services }))
            })()
        }
        _isPlaybackSupported() {
            return !$t || (jt.warn("Media playback is not supported in Node environments."), !1)
        }
        _updatePlaybackController(e) {
            var n = this
            return _asyncToGenerator$7(function* () {
                jt.debug("mk: _updatePlaybackController", e),
                    n._playbackControllerInternal !== e &&
                        (n._playbackControllerInternal && (yield n._playbackControllerInternal.deactivate()),
                        (n._playbackController = e))
            })()
        }
        _signalChangeItemIntent() {
            this._signalIntent({ endReasonType: e.PlayActivityEndReasonType.MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM })
        }
        _signalIntent(e) {
            this.services.dispatcher.publish(cr.userActivityIntent, _objectSpread$5({ userInitiated: !0 }, e))
        }
        _validateAuthorization(n = !1) {
            var d = this
            return _asyncToGenerator$7(function* () {
                ;(n || d.playbackMode === e.PlaybackMode.FULL_PLAYBACK_ONLY) &&
                    ((void 0 !== d._playbackControllerInternal &&
                        d._playbackControllerInternal.isReady &&
                        d._playbackControllerInternal.isPlaying) ||
                        (yield d.authorize()))
            })()
        }
        constructor(n, d = {}) {
            if (
                ((this._autoplayEnabled = !1),
                (this.privateEnabled = !1),
                (this.siriInitiated = !1),
                (this.sourceType = Ar.MUSICKIT),
                (this.version = e.version),
                (this._bag = bs),
                (this._playbackControllers = {}),
                (this._playbackErrorDialog = !0),
                (this._playbackMode = e.PlaybackMode.MIXED_CONTENT),
                (this._whenConfigured = void 0),
                "string" != typeof n)
            )
                throw new Error("MusicKit was initialized without an developerToken.")
            Object.assign(
                bs.features,
                (function (e = []) {
                    const n = {}
                    return (
                        e.forEach((e) => {
                            "-" === e.charAt(0) ? ((e = e.substr(1)), (n[e] = !1)) : (n[e] = !0)
                        }),
                        n
                    )
                })(d.features)
            )
            const h = hc.get()
            h && (jt.warn("Overriding bag.features with", h), (bs.features = _objectSpread$5({}, bs.features, h))),
                Object.assign(bs.autoplay, d.autoplay),
                (this.context = {})
            const p = new PubSub()
            ;(this.capabilities = new Capabilities(p)), d.playbackActions && (this.playbackActions = d.playbackActions)
            const y = new TimingAccuracy(!!bs.features["player-accurate-timing"]),
                m = new BitrateCalculator(p, d.bitrate)
            ;(this._services = { dispatcher: p, timing: y, bitrateCalculator: m }),
                void 0 !== d.playActivityAPI &&
                    (this._services.playActivity = new PlayActivityService(p, d.playActivityAPI)),
                (d.services = this._services),
                this.configureLogger(d),
                (bs.app = d.app || {}),
                (bs.store = new DataStore({
                    filter: getFilterFromFlags(d.storeFilterTypes || []),
                    shouldDisableRecordReuse: !!bs.features["disable-data-store-record-reuse"]
                })),
                Object.assign(bs.urls, d.urls || {})
            const g = (function (e, n) {
                return (Ts = new Store(e, n)), Ts
            })(n, d)
            this._services.apiManager = new APIServiceManager(g, p)
            const b = new MediaItemPlayback(this._createPlayerControllerOptions())
            ;(this._services.mediaItemPlayback = b),
                d.sourceType && (this.sourceType = d.sourceType),
                this._initializeInternalEventHandling(),
                d.bitrate && (this.bitrate = d.bitrate),
                d.prefix && /^(?:web|preview)$/.test(d.prefix) && (this.prefix = bs.prefix = d.prefix),
                d.suppressErrorDialog && (this._playbackErrorDialog = !d.suppressErrorDialog),
                void 0 !== d.playbackMode && (this.playbackMode = d.playbackMode),
                (this.privateEnabled = d.privateEnabled || !1),
                (this.siriInitiated = d.siriInitiated || !1),
                (this.id = generateUUID()),
                jt.info("MusicKit JS Version: " + this.version),
                jt.info("InstanceId", this.id),
                jt.debug("Link Parameters", d.linkParameters),
                bs.app && jt.debug("App", bs.app)
        }
    }
    function asyncGeneratorStep$6(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$6(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$6(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$6(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function dispatchDocumentEvent(e) {
        if ($t) return
        const n = new Event(e, { bubbles: !0, cancelable: !0 })
        setTimeout(() => document.dispatchEvent(n))
    }
    function _loadWebComponents() {
        return (_loadWebComponents = _asyncToGenerator$6(function* () {
            var e
            if ($t) return
            const n = findScript("musickit.js")
            if ("" !== (null == n || null === (e = n.dataset) || void 0 === e ? void 0 : e.webComponents)) return
            const d = "noModule" in n,
                h = `components/musickit-components/musickit-components${d ? ".esm" : ""}.js`,
                p = "https:" + cdnBaseURL(h) + h,
                y = {}
            d && (y.type = "module"),
                n.hasAttribute("async") && (y.async = ""),
                n.hasAttribute("defer") && (y.defer = ""),
                yield loadScript(p, y),
                dispatchDocumentEvent(is.webComponentsLoaded)
        })).apply(this, arguments)
    }
    function asyncGeneratorStep$5(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$5(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$5(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$5(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$4(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$4(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$4(e, n, d[n])
                })
        }
        return e
    }
    cc(
        [
            AsyncDebounce(250, { isImmediate: !0 }),
            lc("design:type", Function),
            lc("design:paramtypes", [
                "undefined" == typeof ActivityNotificationOptions ? Object : ActivityNotificationOptions
            ])
        ],
        MKInstance.prototype,
        "pause",
        null
    ),
        cc(
            [AsyncDebounce(250, { isImmediate: !0 }), lc("design:type", Function), lc("design:paramtypes", [])],
            MKInstance.prototype,
            "play",
            null
        ),
        cc(
            [SerialAsync("skip"), lc("design:type", Function), lc("design:paramtypes", [])],
            MKInstance.prototype,
            "skipToNextItem",
            null
        ),
        cc(
            [SerialAsync("skip"), lc("design:type", Function), lc("design:paramtypes", [])],
            MKInstance.prototype,
            "skipToPreviousItem",
            null
        ),
        cc(
            [SerialAsync("seek"), lc("design:type", Function), lc("design:paramtypes", [])],
            MKInstance.prototype,
            "seekForward",
            null
        ),
        cc(
            [SerialAsync("seek"), lc("design:type", Function), lc("design:paramtypes", [])],
            MKInstance.prototype,
            "seekBackward",
            null
        )
    const pc = "undefined" != typeof window && "undefined" != typeof document
    let yc = !1
    const fc = []
    function cleanupInstances() {
        return _cleanupInstances.apply(this, arguments)
    }
    function _cleanupInstances() {
        return (_cleanupInstances = _asyncToGenerator$5(function* () {
            const e = fc.map((e) => e.cleanup())
            yield Promise.all(e), fc.splice(0, fc.length)
        })).apply(this, arguments)
    }
    function configure$2(e) {
        return _configure$1.apply(this, arguments)
    }
    function _configure$1() {
        return (_configure$1 = _asyncToGenerator$5(function* (e, n = MKInstance, d) {
            if (!e) throw new MKError(MKError.INVALID_ARGUMENTS, "configuration required")
            const h = {},
                { developerToken: p, mergeQueryParams: y } = e
            if (!p) throw new MKError(MKError.CONFIGURATION_ERROR, "Missing developer token")
            y &&
                pc &&
                window.location &&
                (h.linkParameters = _objectSpread$4(
                    {},
                    e.linkParameters || {},
                    parseQueryParams(window.location.href)
                )),
                yield findKeySystemPreference()
            const m = new n(p, _objectSpread$4({}, e, h))
            return (
                yc || (yield cleanupInstances()), d && (yield d(m)), fc.push(m), dispatchDocumentEvent(is.configured), m
            )
        })).apply(this, arguments)
    }
    function getInstances() {
        return fc
    }
    function _defineProperty$3(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$3(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$3(e, n, d[n])
                })
        }
        return e
    }
    function transformStoreData(e) {
        const n = _objectSpread$3({}, e),
            { href: d } = n
        return void 0 !== d && (delete n.href, (n.attributes = _objectSpread$3({}, n.attributes, { href: d }))), n
    }
    pc &&
        (asAsync(
            (function () {
                return _loadWebComponents.apply(this, arguments)
            })()
        ),
        dispatchDocumentEvent(is.loaded))
    const mc = ["extend", "include", "l", "platform", "views"]
    class LocalDataStore {
        get hasDataStore() {
            return this.enableDataStore && void 0 !== this._store
        }
        delete(e, n) {
            this.hasDataStore && this._store.remove(e, n)
        }
        read(e, n, d, h) {
            h || "function" != typeof d || ((h = d), (d = void 0))
            const p = {}
            let y = !1
            if (
                (d &&
                    ((y = Object.keys(d).some((e) => /^(fields|extend)/.test(e))),
                    d.views && (p.views = d.views),
                    d.include && (p.relationships = d.include)),
                this.hasDataStore && !y)
            ) {
                let h,
                    y = []
                if (
                    (d && (y = Object.keys(d).reduce((e, n) => (-1 === mc.indexOf(n) && e.push([n, d[n]]), e), y)),
                    (h = y && 1 === y.length ? this._store.query(y[0][0], y[0][1]) : this._store.peek(e, n, p)),
                    Array.isArray(h))
                ) {
                    if (!d && h.length) return h
                } else if (h) return h
            }
            if ("function" == typeof h) return h()
        }
        write(e) {
            return this._prepareDataForDataStore(e, (e) => this._store.save(e))
        }
        parse(e) {
            return this._prepareDataForDataStore(e, (e) => this._store.populateDataRecords(e, {}))
        }
        _prepareDataForDataStore(e, n) {
            return this.hasDataStore
                ? Array.isArray(e)
                    ? n({ data: e })
                    : Object.keys(e).reduce((d, h) => {
                          const p = e[h]
                          return hasOwn(p, "data") && (d[h] = n({ data: p.data })), "meta" === h && (d[h] = e[h]), d
                      }, {})
                : e
        }
        constructor(e = {}) {
            this.enableDataStore = !1
            let n = !1
            e.features &&
                hasOwn(e.features, "api-data-store") &&
                (this.enableDataStore = !!e.features["api-data-store"]),
                e.features &&
                    hasOwn(e.features, "disable-data-store-record-reuse") &&
                    (n = !!e.features["disable-data-store-record-reuse"]),
                this.enableDataStore &&
                    ((this._store = e.store || new DataStore({ shouldDisableRecordReuse: n })),
                    (this._store.mapping = transformStoreData))
        }
    }
    function _defineProperty$2(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpreadProps$2(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    var gc, vc
    !(function (e) {
        ;(e[(e.Global = 0)] = "Global"),
            (e.Catalog = "catalog"),
            (e.Personalized = "me"),
            (e.Editorial = "editorial"),
            (e.Engagement = "engagement"),
            (e.Social = "social")
    })(gc || (gc = {})),
        (function (e) {
            ;(e.songs = "songs"),
                (e.albums = "albums"),
                (e.playlists = "playlists"),
                (e.stations = "stations"),
                (e["music-videos"] = "music-videos"),
                (e["library-music-videos"] = "library-music-videos"),
                (e["library-playlists"] = "library-playlists"),
                (e["library-songs"] = "library-songs")
        })(vc || (vc = {}))
    class API extends class extends class {
        clearCacheForRequest(e, n) {
            "object" == typeof e && ((n = e), (e = void 0))
            const d = this.constructURL(e, n)
            this.networkCache.removeItemsMatching(d)
        }
        request(e, n, d) {
            var h,
                p = this
            return ((h = function* () {
                d || "object" != typeof e || ((d = n || {}), (n = e), (e = void 0))
                let h = {}
                "object" ==
                typeof (d = _objectSpread$C({ method: p.method, headers: p.headers, reload: !1 }, p._fetchOptions, d))
                    .queryParameters
                    ? ((h = d.queryParameters), delete d.queryParameters)
                    : ("GET" !== d.method && "DELETE" !== d.method) || (h = n)
                const y = p.constructURL(e, h),
                    { method: m, reload: g = !1, useRawResponse: b } = d
                if (((d.headers = p.buildHeaders(d)), delete d.reload, delete d.useRawResponse, "GET" === m && !g)) {
                    const e = p.getCacheItem(y)
                    if (e) return Promise.resolve(e)
                }
                n &&
                    Object.keys(n).length &&
                    ("POST" === m || "PUT" === m) &&
                    ((d.body = d.body || n),
                    d.contentType === Nr.FORM
                        ? ((d.body = urlEncodeParameters(d.body)), d.headers.set("Content-Type", Nr.FORM))
                        : ((d.body = JSON.stringify(d.body)), d.headers.set("Content-Type", Nr.JSON)))
                const _ = yield p._fetchFunction(y, d)
                if (!_.ok) return Promise.reject(_)
                let T
                try {
                    T = yield _.json()
                } catch (Mr) {
                    T = {}
                }
                if (T.errors) return Promise.reject(T.errors)
                const S = b ? T : T.results || T.data || T
                if ("GET" === m) {
                    var P
                    const e = null !== (P = getMaxAgeFromHeaders(_.headers)) && void 0 !== P ? P : p.ttl
                    p.setCacheItem(y, S, e)
                }
                return S
            }),
            function () {
                var e = this,
                    n = arguments
                return new Promise(function (d, p) {
                    var y = h.apply(e, n)
                    function _next(e) {
                        asyncGeneratorStep$_(y, d, p, _next, _throw, "next", e)
                    }
                    function _throw(e) {
                        asyncGeneratorStep$_(y, d, p, _next, _throw, "throw", e)
                    }
                    _next(void 0)
                })
            })()
        }
        buildHeaders({ headers: e, reload: n = !1 } = {}) {
            void 0 === e && (e = this.headers)
            const d = ((e) => new e.constructor(e))(e)
            return n && d.set("Cache-Control", "no-cache"), d
        }
        constructURL(e, n) {
            return (d = this.url), (h = n), addQueryParamsToURL(addPathToURL(d, e), h)
            var d, h
        }
        getCacheItem(e) {
            const n = this.networkCache.storage,
                d = `${this.prefix}${this.prefix}cache-mut`,
                h = n.getItem(d) || null,
                p = this.headers.get("Music-User-Token") || this.headers.get("Media-User-Token") || null
            return (
                p !== h && (this.networkCache.clear(), null === p ? n.removeItem(d) : n.setItem(d, p)),
                this.networkCache.getItem(e)
            )
        }
        setCacheItem(e, n, d = this.ttl) {
            this.networkCache.setItem(e, n, d)
        }
        clearNetworkCache() {
            this.networkCache.clear()
        }
        _key(e, n) {
            const d = (function (e) {
                try {
                    const [n, d] = e.split("?", 2)
                    if (void 0 === d) return n
                    const h = d.split("&").map((e) => e.split("=", 2)),
                        p = [...Array(h.length).keys()]
                    p.sort((e, n) => {
                        const d = h[e],
                            p = h[n]
                        return d < p ? -1 : d > p ? 1 : e - n
                    })
                    const y = p.map((e) => h[e])
                    return `${n}?${y.map(([e, n]) => (void 0 !== n ? `${e}=${n}` : e)).join("&")}`
                } catch (Mr) {
                    return e
                }
            })(e)
                .toLowerCase()
                .replace(this.url, "")
            return `${this.prefix}${d.replace(/[^-_0-9a-z]{1,}/g, ".")}`
        }
        constructor(e, n) {
            if (
                ((this.prefix = "铮�"),
                (this.method = "GET"),
                (this.url = e),
                (n = n || {}).storage && n.underlyingStorage)
            )
                throw new Error("only pass storage OR underlyingStorage in sessionOptions to URLSession")
            const d = n.underlyingStorage || {}
            if (
                ((this.storage = n.storage || new GenericStorage(d)),
                (this.networkCache = new NetworkCache({
                    storage: this.storage,
                    prefix: this.prefix,
                    cacheKeyFunction: this._key.bind(this)
                })),
                (this.ttl = n.ttl || 3e5),
                (this._fetchOptions = _objectSpread$C({}, n.fetchOptions)),
                "function" != typeof n.fetch && "function" != typeof fetch)
            )
                throw new Error("window.fetch is not defined")
            var h
            ;(this._fetchFunction = null !== (h = n.fetch) && void 0 !== h ? h : fetch.bind(window)),
                (this.headers = this._fetchOptions.headers || new Headers()),
                delete this._fetchOptions.headers
        }
    } {
        get developerToken() {
            return this._developerToken.token
        }
        constructor(e, n, d) {
            super(e, d),
                (this._developerToken = new DeveloperToken(n)),
                this.headers.set("Authorization", "Bearer " + this.developerToken),
                (d = d || {}),
                (this.userToken = d.userToken),
                this.userToken && this.headers.set("Media-User-Token", this.userToken)
        }
    } {
        get needsEquivalents() {
            const { userStorefrontId: e } = this
            return void 0 !== e && "" !== e && e !== this.storefrontId
        }
        constructor(e, n, d, h, p, y, m = {}, g) {
            super(
                e,
                n,
                _objectSpreadProps$2(
                    (function (e) {
                        for (var n = 1; n < arguments.length; n++) {
                            var d = null != arguments[n] ? arguments[n] : {},
                                h = Object.keys(d)
                            "function" == typeof Object.getOwnPropertySymbols &&
                                (h = h.concat(
                                    Object.getOwnPropertySymbols(d).filter(function (e) {
                                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                                    })
                                )),
                                h.forEach(function (n) {
                                    _defineProperty$2(e, n, d[n])
                                })
                        }
                        return e
                    })({}, g),
                    { userToken: h, storage: y }
                )
            ),
                (this.storefrontId = Me.ID),
                (this.resourceRelatives = {
                    artists: { albums: { include: "tracks" }, playlists: { include: "tracks" }, songs: null }
                }),
                (this.defaultIncludePaginationMetadata = m.features && hasOwn(m.features, "api-pagination-metadata")),
                (this._store = new LocalDataStore(m)),
                d && (this.storefrontId = d.toLowerCase()),
                h && p && (this.userStorefrontId = p.toLowerCase()),
                (this.v3 = new MediaAPIV3({
                    developerToken: n,
                    mediaUserToken: h,
                    storefrontId: d,
                    realmConfig: { music: { url: e.replace(/\/v[0-9]+(\/)?$/, "") } }
                }))
        }
    }
    function asyncGeneratorStep$4(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$4(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$4(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$4(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    let bc
    const _c = (function () {
            var e = _asyncToGenerator$4(function* (e, n = !1) {
                if (bc && !n) {
                    if (void 0 === e.storefrontId || e.storefrontId === bc.storefrontId) return bc
                    bc.clear()
                }
                return (bc = new MediaAPIService(e.dispatcher)), bc.configure(e)
            })
            return function (n) {
                return e.apply(this, arguments)
            }
        })(),
        Tc = {
            album: {
                isPlural: !1,
                apiMethod: "album",
                relationshipMethod: { method: "albumRelationship", relationship: "tracks" }
            },
            albums: { isPlural: !0, apiMethod: "albums" },
            musicVideo: { isPlural: !1, apiMethod: "musicVideo" },
            musicVideos: { isPlural: !0, apiMethod: "musicVideos" },
            musicMovie: { isPlural: !1, apiMethod: "musicMovie" },
            musicMovies: { isPlural: !0, apiMethod: "musicMovies" },
            playlist: {
                isPlural: !1,
                apiMethod: "playlist",
                relationshipMethod: { method: "playlistRelationship", relationship: "tracks" }
            },
            playlists: { isPlural: !0, apiMethod: "playlists" },
            song: { isPlural: !1, apiMethod: "song" },
            songs: { isPlural: !0, apiMethod: "songs" }
        }
    class MediaAPIService {
        get api() {
            if (void 0 === this._api)
                throw new MKError(MKError.CONFIGURATION_ERROR, "The API cannot be accessed before it is configured.")
            return this._api
        }
        get storefrontId() {
            return this.store && this.store.storefrontId
        }
        configure(e) {
            var n = this
            return _asyncToGenerator$4(function* () {
                if (void 0 !== e.store)
                    return (
                        (n.store = e.store),
                        [
                            is.authorizationStatusDidChange,
                            is.userTokenDidChange,
                            is.storefrontIdentifierDidChange,
                            is.storefrontCountryCodeDidChange
                        ].forEach((e) => {
                            n.store.storekit.addEventListener(e, () => n.resetAPI())
                        }),
                        n._initializeAPI(e),
                        n
                    )
            })()
        }
        clear() {
            this.api && this.api.clearNetworkCache && this.api.clearNetworkCache()
        }
        getAPIForItem(e) {
            var n = this
            return _asyncToGenerator$4(function* () {
                return S(e) ? (yield n.store.authorize(), n.api.library || n.api) : n.api
            })()
        }
        resetAPI() {
            var e = this
            return _asyncToGenerator$4(function* () {
                e.clear(), e._initializeAPI()
            })()
        }
        _initializeAPI(e) {
            if (void 0 !== (null == e ? void 0 : e.api)) return void (this._api = e.api)
            const n = (e && e.store) || this.store
            if (void 0 === n) return
            const d = bs.features["api-session-storage"] ? getSessionStorage() : void 0,
                h = (e && e.storefrontId) || n.storefrontId,
                p = new API(
                    this.url,
                    n.developerToken,
                    h,
                    n.storekit.userToken,
                    n.storekit.storefrontCountryCode,
                    d,
                    bs,
                    e && e.apiOptions && e.apiOptions.sessionOptions
                )
            this._api = p.v3
        }
        _updateStorefrontId(e) {
            var n = this
            return _asyncToGenerator$4(function* () {
                ;(n.api && e === n.api.storefrontId) ||
                    (yield n.configure({ dispatcher: n._dispatcher, store: n.store, storefrontId: e }))
            })()
        }
        constructor(e) {
            if (((this._dispatcher = e), !bs.urls.mediaApi)) throw new Error("bag.urls.mediaApi is not configured")
            ;(this.url = bs.urls.mediaApi), (this.namedQueueOptions = Tc)
            var n = this
            this._dispatcher.subscribe(
                cr.apiStorefrontChanged,
                (function () {
                    var e = _asyncToGenerator$4(function* (e, { storefrontId: d }) {
                        yield n._updateStorefrontId(d)
                    })
                    return function (n, d) {
                        return e.apply(this, arguments)
                    }
                })()
            )
        }
    }
    const Sc = ["uploadedVideo", "uploadedAudio", "uploaded-videos", "uploaded-audios"]
    function asyncGeneratorStep$3(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$3(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$3(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$3(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty$1(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread$1(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty$1(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps$1(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const Pc = Mt.createChild("paf"),
        asCode = (n) => {
            switch (typeof n) {
                case "string":
                    return n
                case "undefined":
                    return "undefined"
                default:
                    return "PlayActivityEndReasonType." + e.PlayActivityEndReasonType[n]
            }
        }
    class MPAFTracker {
        get requestedEvents() {
            return Array.from(this.dispatchTable.keys())
        }
        get activityTracker() {
            if (void 0 === this._activityTracker)
                throw new MKError(MKError.CONFIGURATION_ERROR, "Play Activity service was called before configuration.")
            return this._activityTracker
        }
        configure(e, n) {
            var d = this
            return _asyncToGenerator$3(function* () {
                ;(d.instance = e),
                    (d._activityTracker = (function (e) {
                        var n
                        return new PlayActivity(e.developerToken, e.musicUserToken, e.storefrontCountryCode, {
                            app: {
                                build: bs.app.build,
                                name: null !== (n = bs.app.name) && void 0 !== n ? n : "",
                                version: bs.app.version
                            },
                            fetch: !$t && fetch.bind(globalThis),
                            isQA: Ec.enabled,
                            logInfo: Pc.enabled,
                            sourceType: e.sourceType,
                            userIsSubscribed: () =>
                                !(!e.isAuthorized || !Ts.storekit._getIsActiveSubscription.getCachedValue())
                        })
                    })(e))
            })()
        }
        handleEvent(e, n, d) {
            if (!this.shouldTrackPlayActivity(e, d)) return
            const h = this.dispatchTable.get(e)
            void 0 !== h && "function" == typeof this[h] && this[h](d, n)
        }
        activate(e, n = {}) {
            return this.activityTracker.activate(n.flush)
        }
        exit(e, n = {}) {
            return Pc.debug("PAF debug", `client.exit(${n.position})`), this.activityTracker.exit(n.position)
        }
        pause(e, n = {}) {
            return "number" == typeof n.endReasonType
                ? (Pc.debug("PAF debug", `client.stop(${n.position}, ${n.endReasonType})`),
                  this.activityTracker.stop(n.position, n.endReasonType))
                : (Pc.debug("PAF debug", `client.pause(${n.position})`), this.activityTracker.pause(n.position))
        }
        play(e, n = {}) {
            const d = generateItemDescriptorForPAF(cr.playbackPlay, this.instance, e)
            return (
                isLiveRadioKind(e, "video") && (this.musicLiveVideoStartTime = Date.now()),
                Pc.debug("PAF debug", `client.play(${JSON.stringify(d)}, ${n.position})`),
                this.activityTracker.play(d, n.position)
            )
        }
        scrub(e, n = {}) {
            return (
                Pc.debug("PAF debug", `client.scrub(${n.position}, ${asCode(n.endReasonType)})`),
                this.activityTracker.scrub(n.position, n.endReasonType)
            )
        }
        seek(n, d = {}) {
            var h = this
            return _asyncToGenerator$3(function* () {
                yield h.scrub(n, { position: d.startPosition, endReasonType: e.PlayActivityEndReasonType.SCRUB_BEGIN }),
                    yield h.scrub(n, { position: d.position, endReasonType: e.PlayActivityEndReasonType.SCRUB_END })
            })()
        }
        skip(e, n = {}) {
            var d = this
            return _asyncToGenerator$3(function* () {
                const h = generateItemDescriptorForPAF(cr.playbackSkip, d.instance, e)
                Pc.debug("PAF debug", `client.skip(${JSON.stringify(h)}, ${asCode(n.direction)}, ${n.position})`)
                try {
                    yield d.activityTracker.skip(h, n.direction, n.position)
                } catch (Mr) {
                    if ("A play stop() method was called without a previous play() descriptor" !== Mr.message)
                        return Promise.reject(Mr)
                    yield d.play(e, n)
                }
            })()
        }
        stop(n, d = {}) {
            var h
            ;(isLiveRadioKind(n, "video")
                ? ((d.position = (Date.now() - this.musicLiveVideoStartTime) / 1e3), (this.musicLiveVideoStartTime = 0))
                : (null == n ? void 0 : n.isLiveRadioStation) &&
                  d.position &&
                  (d.position = d.position - (d.startPosition || 0)),
            null == n ? void 0 : n.isLiveRadioStation) &&
                (d.endReasonType =
                    null !== (h = d.endReasonType) && void 0 !== h
                        ? h
                        : e.PlayActivityEndReasonType.PLAYBACK_MANUALLY_PAUSED)
            return (
                Pc.debug("PAF debug", `client.stop(${d.position}, ${asCode(d.endReasonType)})`),
                this.activityTracker.stop(d.position, d.endReasonType)
            )
        }
        shouldTrackPlayActivity(n, d) {
            const h = hasAuthorization(),
                p = !d || d.playbackType !== e.PlaybackType.preview,
                y = this.alwaysSendForActivityType(n),
                m = !d || (d && this.mediaRequiresPlayActivity(d))
            return !(!h || !p || (!y && !m))
        }
        alwaysSendForActivityType(e) {
            return e === cr.playerActivate || e === cr.playerExit
        }
        mediaRequiresPlayActivity(e) {
            return (
                (void 0 !== (n = e.type) && Sc.includes(n)) ||
                -1 !== ["musicVideo", "song", "radioStation"].indexOf(e.type)
            )
            var n
        }
        constructor() {
            ;(this.musicLiveVideoStartTime = 0),
                (this.dispatchTable = new Map([
                    [cr.playbackPlay, "play"],
                    [cr.playbackPause, "pause"],
                    [cr.playbackScrub, "scrub"],
                    [cr.playbackSeek, "seek"],
                    [cr.playbackSkip, "skip"],
                    [cr.playbackStop, "stop"],
                    [cr.playerActivate, "activate"],
                    [cr.playerExit, "exit"]
                ]))
        }
    }
    function generateItemDescriptorForPAF(n, d, h) {
        const p = _objectSpreadProps$1(
            _objectSpread$1(
                {},
                (function (n, d, h) {
                    if (void 0 === (null == h ? void 0 : h.playbackActions) || void 0 === d) return {}
                    const p = {
                            [e.PlayerRepeatMode.all]: Tr.REPEAT_ALL,
                            [e.PlayerRepeatMode.none]: Tr.REPEAT_OFF,
                            [e.PlayerRepeatMode.one]: Tr.REPEAT_ONE
                        },
                        y = { [e.PlayerShuffleMode.off]: Sr.SHUFFLE_OFF, [e.PlayerShuffleMode.songs]: Sr.SHUFFLE_ON }
                    return {
                        playMode() {
                            let n = Tr.REPEAT_UNKNOWN,
                                d = Sr.SHUFFLE_UNKNOWN,
                                m = Pr.AUTO_UNKNOWN
                            const { playbackActions: g } = h
                            var b
                            return (
                                g &&
                                    (g.includes(e.PlaybackActions.REPEAT) && (n = p[h.repeatMode]),
                                    g.includes(e.PlaybackActions.SHUFFLE) && (d = y[h.shuffleMode]),
                                    g.includes(e.PlaybackActions.AUTOPLAY) &&
                                        (m = h.autoplayEnabled
                                            ? (b = h.queue).hasAutoplayStation &&
                                              b.items.some((e) => {
                                                  const { id: n, type: d, container: h } = e
                                                  if (h && "stations" === h.type && h.name === dr.RADIO) return !1
                                                  const p = normalizeTypeForAutoplay(n, d)
                                                  return isAutoplaySupportedForType(p)
                                              })
                                                ? Pr.AUTO_ON
                                                : Pr.AUTO_ON_CONTENT_UNSUPPORTED
                                            : Pr.AUTO_OFF)),
                                { repeatPlayMode: n, shufflePlayMode: d, autoplayMode: m }
                            )
                        }
                    }
                })(0, h, d),
                (function (e, n) {
                    var d
                    if (!typeRequiresItem(e)) return {}
                    if (void 0 === n) return {}
                    const h = null === (d = n.attributes) || void 0 === d ? void 0 : d.mediaKind
                    return _objectSpread$1({}, void 0 !== h ? { mediaType: h } : {}, n.playParams)
                })(n, h),
                (function (e, n) {
                    if (!typeRequiresItem(e) || void 0 === n) return {}
                    const { context: d = {} } = n
                    return { recoData: d.reco_id }
                })(n, h),
                (function (e, n) {
                    if (!typeRequiresItem(e) || void 0 === n) return {}
                    const d = n.playbackDuration
                    if (!d) return {}
                    return { duration: d / 1e3 }
                })(n, h),
                (function (e, n) {
                    var d, h
                    const p = (function (e, n) {
                            var d
                            return (
                                (itemIsRequired(e, n) &&
                                    (null == n || null === (d = n.container) || void 0 === d ? void 0 : d.name)) ||
                                null
                            )
                        })(e, n),
                        y = itemIsRequired(e, n)
                            ? _objectSpread$1(
                                  {},
                                  null == n ? void 0 : n.container,
                                  null == n ||
                                      null === (d = n.container) ||
                                      void 0 === d ||
                                      null === (h = d.attributes) ||
                                      void 0 === h
                                      ? void 0
                                      : h.playParams
                              )
                            : null
                    if (null === p && null === y) return
                    return { container: cleanContainer(_objectSpread$1({}, y, null !== p ? { name: p } : {})) }
                })(n, h)
            ),
            { trackInfo: null == h ? void 0 : h.trackInfo }
        )
        return Pc.trace("PAF descriptor", p), p
    }
    const Ec = BooleanDevFlag.register("mk-use-paf-qa-endpoint")
    const typeRequiresItem = (e) => [cr.playbackPlay, cr.playbackSkip].includes(e),
        itemIsRequired = (e, n) => void 0 !== n && typeRequiresItem(e)
    function cleanContainer(e) {
        const n = _objectSpread$1({}, e)
        return delete n.attributes, n
    }
    function asyncGeneratorStep$2(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$2(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$2(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$2(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function _defineProperty(e, n, d) {
        return (
            n in e
                ? Object.defineProperty(e, n, { value: d, enumerable: !0, configurable: !0, writable: !0 })
                : (e[n] = d),
            e
        )
    }
    function _objectSpread(e) {
        for (var n = 1; n < arguments.length; n++) {
            var d = null != arguments[n] ? arguments[n] : {},
                h = Object.keys(d)
            "function" == typeof Object.getOwnPropertySymbols &&
                (h = h.concat(
                    Object.getOwnPropertySymbols(d).filter(function (e) {
                        return Object.getOwnPropertyDescriptor(d, e).enumerable
                    })
                )),
                h.forEach(function (n) {
                    _defineProperty(e, n, d[n])
                })
        }
        return e
    }
    function _objectSpreadProps(e, n) {
        return (
            (n = null != n ? n : {}),
            Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : (function (e, n) {
                      var d = Object.keys(e)
                      if (Object.getOwnPropertySymbols) {
                          var h = Object.getOwnPropertySymbols(e)
                          n &&
                              (h = h.filter(function (n) {
                                  return Object.getOwnPropertyDescriptor(e, n).enumerable
                              })),
                              d.push.apply(d, h)
                      }
                      return d
                  })(Object(n)).forEach(function (d) {
                      Object.defineProperty(e, d, Object.getOwnPropertyDescriptor(n, d))
                  }),
            e
        )
    }
    const kc = Mt.createChild("lyrics")
    class LyricsTracker {
        get requestedEvents() {
            return Array.from(this.dispatchTable.keys())
        }
        get activityTracker() {
            if (void 0 === this.instance)
                throw new MKError(
                    MKError.CONFIGURATION_ERROR,
                    "Lyrics Play Activity service was called before configuration."
                )
            var e, n
            return (
                void 0 === this._activityTracker &&
                    (this._activityTracker =
                        ((e = this.instance),
                        new LyricsPlayActivity(e.developerToken, e.musicUserToken, e.storefrontCountryCode, {
                            app: {
                                build: bs.app.build,
                                name: null !== (n = bs.app.name) && void 0 !== n ? n : "",
                                version: bs.app.version
                            },
                            fetch: !$t && fetch.bind(globalThis),
                            logInfo: kc.level <= O.INFO,
                            sourceType: e.sourceType,
                            isQA: wc.enabled,
                            userIsSubscribed: () =>
                                e.isAuthorized && Ts.storekit._getIsActiveSubscription.getCachedValue()
                        }))),
                this._activityTracker
            )
        }
        static configure(e, n) {
            var d = this
            return _asyncToGenerator$2(function* () {
                const h = new d()
                return h.configure(e, n), h
            })()
        }
        configure(e, n) {
            var d = this
            return _asyncToGenerator$2(function* () {
                d.instance = e
            })()
        }
        handleEvent(e, n, d) {
            const h = this.dispatchTable.get(e)
            void 0 !== h && "function" == typeof this[h] && this[h](d, n)
        }
        lyricsPlay(e, n) {
            var d = this
            return _asyncToGenerator$2(function* () {
                const h = null == n ? void 0 : n.lyrics
                if (void 0 === h)
                    throw new MKError(
                        MKError.MEDIA_DESCRIPTOR,
                        "Key lyrics is missing from descriptor provided to lyricsPlay"
                    )
                if (void 0 === e)
                    throw new MKError(MKError.MEDIA_DESCRIPTOR, "Cannot display lyrics without a MediaItem")
                d.activityTracker.play(
                    (function (e, n, d) {
                        var h, p, y, m
                        return _objectSpreadProps(
                            _objectSpread(
                                {
                                    id: n.id,
                                    duration: 0,
                                    eventType: kr.LYRIC_DISPLAY,
                                    container: _objectSpread(
                                        {},
                                        n.container,
                                        null === (h = n.container) ||
                                            void 0 === h ||
                                            null === (p = h.attributes) ||
                                            void 0 === p
                                            ? void 0
                                            : p.playParams
                                    )
                                },
                                n.playParams
                            ),
                            {
                                lyricDescriptor: {
                                    id: null !== (m = d.id) && void 0 !== m ? m : n.id,
                                    displayType: d.displayType,
                                    language: d.language
                                },
                                trackInfo: n.trackInfo,
                                recoData: null === (y = n.attributes) || void 0 === y ? void 0 : y.reco_id
                            }
                        )
                    })(cr.lyricsPlay, e, h)
                )
            })()
        }
        lyricsStop(e, n) {
            var d = this
            return _asyncToGenerator$2(function* () {
                d.activityTracker.stop()
            })()
        }
        exit(e, n) {
            var d = this
            return _asyncToGenerator$2(function* () {
                d.activityTracker.exit()
            })()
        }
        constructor() {
            this.dispatchTable = new Map([
                [cr.lyricsPlay, "lyricsPlay"],
                [cr.lyricsStop, "lyricsStop"],
                [cr.playerExit, "exit"]
            ])
        }
    }
    const wc = BooleanDevFlag.register("mk-use-paf-qa-endpoint")
    function asyncGeneratorStep$1(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator$1(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep$1(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep$1(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    function loadLinksData() {
        return _loadLinksData.apply(this, arguments)
    }
    function _loadLinksData() {
        return (_loadLinksData = _asyncToGenerator$1(function* () {
            const e = [
                {
                    feature: "album-song",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/albums?/(?:[^/]+/)?(?<album>\\d+)$",
                    requiredQueryParams: { i: "(?<identifier>\\d+)" },
                    mediaAPI: { resources: ["songs"] }
                },
                {
                    feature: "albums",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/albums?/(?:[^/]+/)?(?<identifier>\\d+)$",
                    mediaAPI: { resources: ["albums"] }
                },
                {
                    feature: "algo-stations",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/stations?/(?:[^/]+/)?(?<identifier>(?:ra|st).\\d+)",
                    mediaAPI: { resources: ["stations"] }
                },
                {
                    feature: "artist-default-playable-content",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/artists?/(?:[^/]+/)?(?<identifier>\\d+)$",
                    mediaAPI: { resources: ["artists", "default-playable-content"] }
                },
                {
                    feature: "genre-stations",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/genre-stations?",
                    mediaAPI: {
                        resources: ["stations"],
                        parameterMapping: {
                            genres: "filter[genres]",
                            eras: "filter[eras]",
                            tags: "filter[tags]",
                            moods: "filter[moods]"
                        }
                    }
                },
                {
                    feature: "library-albums",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/library/albums?/(?:[^/]+/)?(?<identifier>(?:l).[a-zA-Z0-9-]+)$",
                    mediaAPI: { resources: ["albums"] }
                },
                {
                    feature: "library-album-song",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/library/albums?/(?:[^/]+/)?(?<album>(?:l).[a-zA-Z0-9-]+)$",
                    requiredQueryParams: { i: "(?<identifier>i\\.[a-zA-Z0-9-]+)" },
                    mediaAPI: { resources: ["songs"] }
                },
                {
                    feature: "library-playlists",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/library/playlists?/(?:[^/]+/)?(?<identifier>(?:p).[a-zA-Z0-9-]+)$",
                    mediaAPI: { resources: ["playlists"] }
                },
                {
                    feature: "music-videos",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/music-videos?/(?:[^/]+/)?(?<identifier>\\d+)$",
                    mediaAPI: { resources: ["musicVideos"] }
                },
                {
                    feature: "personal-general-radio",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/stations?/me$",
                    mediaAPI: { resources: ["stations"], parameters: { "filter[identity]": "personal" } }
                },
                {
                    feature: "personal-mixes",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/(?:personal-)?mix/(?:[^/]+/)?(?<identifier>mx.(?:\\d{1,2}|rp-\\d{4}))$",
                    mediaAPI: { resources: ["playlists"] }
                },
                {
                    feature: "playlists",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/playlists?/(?:[^/]+/)?(?<identifier>(?:pl).[a-zA-Z0-9-]+)$",
                    mediaAPI: { resources: ["playlists"] }
                },
                {
                    feature: "song",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/(?<storefront>\\w{2})/songs?/(?:[^/]+/)?(?<identifier>\\d+)$",
                    mediaAPI: { resources: ["songs"] }
                },
                {
                    feature: "steering-request",
                    regex: "http(?:s)?://(?<realm>itunes|music).apple.com/me/stations?/change-station/?$",
                    mediaAPI: { resources: ["stations"] }
                }
            ].map(
                (e) => (
                    (e.regex = new RegExp(e.regex)),
                    e.requiredQueryParams &&
                        (e.requiredQueryParams = Object.keys(e.requiredQueryParams).reduce(
                            (n, d) => ((n[d] = new RegExp(e.requiredQueryParams[d])), n),
                            {}
                        )),
                    e
                )
            )
            return Promise.resolve(e)
        })).apply(this, arguments)
    }
    function meetsLinkRequirements(e, n, d = {}) {
        const [h] = e.split(/\?|\#|\&/),
            p = n.regex.test(h)
        return p && n.requiredQueryParams
            ? Object.keys(n.requiredQueryParams).every((e) => {
                  const h = d[e]
                  return n.requiredQueryParams[e].test(h)
              })
            : p
    }
    function filterLinks(e) {
        return _filterLinks.apply(this, arguments)
    }
    function _filterLinks() {
        return (_filterLinks = _asyncToGenerator$1(function* (e) {
            const n = yield loadLinksData(),
                d = parseQueryParams(e)
            return n.reduce((n, h) => {
                if (meetsLinkRequirements(e, h, d)) {
                    if (n.length > 0)
                        if (h.requiredQueryParams) n = n.filter((e) => e.requiredQueryParams)
                        else if (n.some((e) => e.requiredQueryParams)) return n
                    h.requiredQueryParams
                        ? (h.mediaAPI.parameters = Object.keys(h.requiredQueryParams).reduce(
                              (e, n) => ((e[n] = d[n]), e),
                              {}
                          ))
                        : h.mediaAPI.parameterMapping &&
                          (h.mediaAPI.parameters = transform$8(h.mediaAPI.parameterMapping, d, !0)),
                        n.push(h)
                }
                return n
            }, [])
        })).apply(this, arguments)
    }
    function _resolveCanonical() {
        return (_resolveCanonical = _asyncToGenerator$1(function* (e) {
            return {
                results: { links: yield filterLinks(e) },
                meta: { originalUrl: e, originalQueryParams: parseQueryParams(e) }
            }
        })).apply(this, arguments)
    }
    function asyncGeneratorStep(e, n, d, h, p, y, m) {
        try {
            var g = e[y](m),
                b = g.value
        } catch (Y) {
            return void d(Y)
        }
        g.done ? n(b) : Promise.resolve(b).then(h, p)
    }
    function _asyncToGenerator(e) {
        return function () {
            var n = this,
                d = arguments
            return new Promise(function (h, p) {
                var y = e.apply(n, d)
                function _next(e) {
                    asyncGeneratorStep(y, h, p, _next, _throw, "next", e)
                }
                function _throw(e) {
                    asyncGeneratorStep(y, h, p, _next, _throw, "throw", e)
                }
                _next(void 0)
            })
        }
    }
    class MusicKitInstance extends MKInstance {
        addToLibrary(e, n) {
            var d = this
            return _asyncToGenerator(function* () {
                yield d.authorize(), n || (n = /[a-z]{2}\.[a-z0-9\-]+/i.test(e) ? "playlists" : "albums")
                let h
                return (
                    d.api.music &&
                        (h = d.api.music("/v1/me/library", { [`ids[${n}]`]: e }, { fetchOptions: { method: "POST" } })),
                    h
                )
            })()
        }
        changeToMediaItem(e) {
            var n = this,
                _superprop_get_changeToMediaItem = () => super.changeToMediaItem
            return _asyncToGenerator(function* () {
                return n._checkNeedsEquivalent(), _superprop_get_changeToMediaItem().call(n, e)
            })()
        }
        play() {
            var e = this,
                _superprop_get_play = () => super.play
            return _asyncToGenerator(function* () {
                return e._checkNeedsEquivalent(), _superprop_get_play().call(e)
            })()
        }
        playMediaItem(e, n) {
            var d = this,
                _superprop_get_playMediaItem = () => super.playMediaItem
            return _asyncToGenerator(function* () {
                return d._checkNeedsEquivalent(), _superprop_get_playMediaItem().call(d, e, n)
            })()
        }
        _isStationQueueOptions(e) {
            return !(
                !((e) =>
                    !!e &&
                    (!!isIdentityQueue(e) || !!isQueueURLOption(e) || Object.keys(eo).some((n) => void 0 !== e[n])))(
                    (e = parseQueueURLOption(e))
                ) ||
                ((e) => {
                    if (!e) return !1
                    if (isQueueURLOption(e)) return !0
                    if (isQueueItems(e)) return !0
                    return Object.keys(vo)
                        .concat(Object.keys(bo))
                        .some((n) => void 0 !== e[n])
                })(e)
            )
        }
        setStationQueue(e) {
            var n = this,
                _superprop_get__validateAuthorization = () => super._validateAuthorization
            return _asyncToGenerator(function* () {
                if (!n._isPlaybackSupported()) return
                n._signalChangeItemIntent(),
                    n.deferPlayback(),
                    yield n._updatePlaybackController(n._getPlaybackControllerByType(Hs.continuous)),
                    yield _superprop_get__validateAuthorization().call(n, !0),
                    (e = parseQueueURLOption(e))
                const d = n._playbackController.setQueue(e)
                return (
                    void 0 !== e.autoplay &&
                        (deprecationWarning("autoplay", {
                            message: "autoplay has been deprecated, use startPlaying instead"
                        }),
                        void 0 === e.startPlaying && (e.startPlaying = e.autoplay)),
                    e.startPlaying && (yield n.play()),
                    d
                )
            })()
        }
        setQueue(e) {
            var n = this
            return _asyncToGenerator(function* () {
                if ((jt.debug("instance.setQueue()", e), n._checkNeedsEquivalent(), !n._isPlaybackSupported()))
                    return void jt.warn("Playback is not supported")
                if (n._isStationQueueOptions(e))
                    return (
                        jt.warn(
                            "setQueue options contained a station queue request. Changing to setStationQueue mode."
                        ),
                        n.setStationQueue(e)
                    )
                n._signalChangeItemIntent(),
                    n.deferPlayback(),
                    yield n._updatePlaybackController(n._getPlaybackControllerByType(Hs.serial))
                const d = yield n._playbackController.setQueue(e)
                return (
                    void 0 !== e.repeatMode && (n._playbackController.repeatMode = e.repeatMode),
                    void 0 !== e.autoplay &&
                        (deprecationWarning("autoplay", {
                            message: "autoplay has been deprecated, use startPlaying instead"
                        }),
                        void 0 === e.startPlaying && (e.startPlaying = e.autoplay)),
                    e.startPlaying && (yield n.play()),
                    d
                )
            })()
        }
        _checkNeedsEquivalent() {
            var n
            if (
                this.realm === e.SKRealm.MUSIC &&
                !this.previewOnly &&
                (null === (n = this.api) || void 0 === n ? void 0 : n.needsEquivalents)
            )
                throw new MKError(MKError.CONTENT_EQUIVALENT)
        }
        playNext(e, n = !1) {
            var d = this
            return _asyncToGenerator(function* () {
                if (d._isPlaybackSupported())
                    return d._playbackController.queue
                        ? (d.deferPlayback(), d._playbackController.prepend(e, n))
                        : d.setQueue(e)
            })()
        }
        playLater(e) {
            var n = this
            return _asyncToGenerator(function* () {
                if (n._isPlaybackSupported())
                    return n._playbackController.queue
                        ? (n.deferPlayback(), n._playbackController.append(e))
                        : n.setQueue(e)
            })()
        }
        playAt(e, n) {
            var d = this
            return _asyncToGenerator(function* () {
                if (d._isPlaybackSupported())
                    return d._playbackController.queue
                        ? (d.deferPlayback(), d._playbackController.insertAt(e, n))
                        : d.setQueue(n)
            })()
        }
        clearQueue() {
            var e = this
            return _asyncToGenerator(function* () {
                return e._mediaItemPlayback.clearNextManifest(), e._playbackController.clear()
            })()
        }
    }
    function configure(e) {
        return _configure.apply(this, arguments)
    }
    function _configure() {
        return (_configure = _asyncToGenerator(function* (e) {
            jt.linkChild(Mt),
                jt.linkChild(Rt),
                jt.linkChild(he),
                jt.linkChild(Ct),
                (e.playActivityAPI = [new MPAFTracker(), new LyricsTracker()])
            return yield configure$2(
                e,
                MusicKitInstance,
                (function () {
                    var n = _asyncToGenerator(function* (n) {
                        const d = { apiType: _o.MEDIA_API, configureFn: _c, options: {} }
                        yield n.configure([d]),
                            e.declarativeMarkup &&
                                "undefined" != typeof console &&
                                console.warn &&
                                console.warn(
                                    "The declarativeMarkup configuration option has been removed in MusicKit JS V3"
                                )
                    })
                    return function (e) {
                        return n.apply(this, arguments)
                    }
                })()
            )
        })).apply(this, arguments)
    }
    if (pc) {
        const e = (function () {
                function meta(e) {
                    if ($t) return
                    const n = document.head.querySelector(`meta[name=${e}]`)
                    return (null == n ? void 0 : n.content) || void 0
                }
                const e = meta("apple-music-developer-token") || meta("JWT"),
                    n = meta("apple-music-app-build") || meta("version"),
                    d = meta("apple-music-app-name"),
                    h = meta("apple-music-app-version")
                let p
                return (
                    (e || n || d || h) &&
                        ((p = {}),
                        e && (p.developerToken = e),
                        (n || d || h) &&
                            ((p.app = {}), n && (p.app.build = n), d && (p.app.name = d), h && (p.app.version = h))),
                    p
                )
            })(),
            n = /interactive|complete|loaded/.test(document.readyState)
        e &&
            e.developerToken &&
            0 === getInstances().length &&
            (n ? asAsync(configure(e)) : document.addEventListener("DOMContentLoaded", () => configure(e)))
    }
    ;(e.Events = is),
        (e.MKError = MKError),
        (e.MediaItem = MediaItem),
        (e.MusicKitInstance = MusicKitInstance),
        (e.VideoTypes = {
            movie: !0,
            musicVideo: !0,
            musicMovie: !0,
            trailer: !0,
            tvEpisode: !0,
            uploadedVideo: !0,
            "uploaded-videos": !0,
            "music-videos": !0,
            "music-movies": !0,
            "tv-episodes": !0,
            Bonus: !0,
            Extra: !0,
            Episode: !0,
            Movie: !0,
            Preview: !0,
            Promotional: !0,
            Season: !0,
            Show: !0,
            Vod: !0,
            EditorialVideoClip: !0,
            RealityVideo: !0,
            SportingEvent: !0,
            LiveService: !0
        }),
        (e.configure = configure),
        (e.enableMultipleInstances = function () {
            yc = !0
        }),
        (e.formatArtworkURL = formatArtworkURL),
        (e.formatMediaTime = function (e, n = ":") {
            const { hours: d, minutes: h } = formattedSeconds(e)
            e = Math.floor((e % 3600) % 60)
            const p = []
            return (
                d ? (p.push("" + d), p.push(h < 10 ? "0" + h : "" + h)) : p.push("" + h),
                p.push(e < 10 ? "0" + e : "" + e),
                p.join(n)
            )
        }),
        (e.formattedMediaURL = formattedMediaURL),
        (e.formattedMilliseconds = function (e) {
            return formattedSeconds(e / 1e3)
        }),
        (e.formattedSeconds = formattedSeconds),
        (e.generateEmbedCode = function (e, n = { height: "450", width: "660" }) {
            if (!h.test(e)) throw new Error("Invalid content url")
            var d
            let m = null !== (d = n.height) && void 0 !== d ? d : "450"
            var g
            let b = null !== (g = n.width) && void 0 !== g ? g : "660"
            const { kind: _, isUTS: T } = formattedMediaURL(e),
                S = "post" === _ || "musicVideo" === _ || T
            "song" === _ || "episode" === _ ? (m = "175") : S && (m = "" + Math.round(0.5625 * parseInt(b, 10))),
                (m = ("" + m).replace(/(\d+)px/i, "$1")),
                (b = ("" + b).replace(/^(\d+)(?!px)%?$/i, "$1px"))
            const P =
                (S ? "width:" + b : "width:100%;" + (b ? "max-width:" + b : "")) +
                ";overflow:hidden;border-radius:10px;"
            return `<iframe ${[
                `allow="${y.join("; ")}"`,
                'frameborder="0"',
                m ? `height="${m}"` : "",
                `style="${P}"`,
                `sandbox="${p.join(" ")}"`,
                `src="${e.replace(h, "https://embed.music.apple.com")}"`
            ].join(" ")}></iframe>`
        }),
        (e.getHlsJsCdnConfig = getHlsJsCdnConfig),
        (e.getInstance = function (e) {
            if (0 !== fc.length) return void 0 === e ? fc[fc.length - 1] : fc.find((n) => n.id === e)
        }),
        (e.getInstances = getInstances),
        (e.getPlayerType = getPlayerType),
        (e.resolveCanonical = function (e) {
            return _resolveCanonical.apply(this, arguments)
        }),
        Object.defineProperty(e, "__esModule", { value: !0 })
})
