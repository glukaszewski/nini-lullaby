(function () {
    const intlMessages = {
        en: {
            DOWNLOAD: 'Download',
            LISTEN: 'Listen',
            PLAY: 'Play',
            PAUSE: 'Pause',
            RESUME: 'Resume',
            STOP: 'Stop and close',
            DEFAULT_QUALITY: 'Default quality',
            HIGHER_QUALITY: 'Higher quality',
            LANGUAGE: 'Language',
            LICENSE: '© 2024 GUILHERME LUKASZEWSKI and CD BABY, INC.\nAll Rights on Behalf of CD BABY, INC. Administered by DOWNTOWN MUSIC PUBLISHING, LLC\nAll Rights Reserved.'
        },
        es: {
            DOWNLOAD: 'Descargar',
            LISTEN: 'Escuchar',
            PLAY: 'Tocar',
            PAUSE: 'Pausar',
            RESUME: 'Reanudar',
            STOP: 'Detener y cerrar',
            DEFAULT_QUALITY: 'Calidad por defecto',
            HIGHER_QUALITY: 'Mayor calidad',
            LANGUAGE: 'Idioma',
            LICENSE: '© 2024 GUILHERME LUKASZEWSKI y CD BABY, INC.\nTodos los derechos en nombre de CD BABY, INC. Administrada por DOWNTOWN MUSIC PUBLISHING, LLC\nTodos los derechos reservados.'
        },
        pt: {
            DOWNLOAD: 'Baixar',
            LISTEN: 'Ouvir',
            PLAY: 'Reproduzir',
            PAUSE: 'Pausar',
            RESUME: 'Continuar reprodução',
            STOP: 'Parar e fechar',
            DEFAULT_QUALITY: 'Qualidade padrão',
            HIGHER_QUALITY: 'Qualidade superior',
            LANGUAGE: 'Idioma',
            LICENSE: '© 2024 GUILHERME LUKASZEWSKI e CD BABY, INC.\nTodos os direitos em nome de CD BABY, INC. administrada por DOWNTOWN MUSIC PUBLISHING, LLC\nTodos os direitos reservados.'
        },
        fr: {
            DOWNLOAD: 'Télécharger',
            LISTEN: 'Ecoutez',
            PLAY: 'Passer',
            PAUSE: 'Mettre en pause',
            RESUME: 'Reprendre',
            STOP: 'Arrêter et fermer',
            DEFAULT_QUALITY: 'Qualité par défaut',
            HIGHER_QUALITY: 'Qualité supérieure',
            LANGUAGE: 'Langue',
            LICENSE: '© 2024 GUILHERME LUKASZEWSKI et CD BABY, INC.\nTous droits au nom de CD BABY, INC. Administré par DOWNTOWN MUSIC PUBLISHING, LLC\nTous droits réservés.'
        },
        nl: {
            DOWNLOAD: 'Downloaden',
            LISTEN: 'Luisteren',
            PLAY: 'Spelen',
            PAUSE: 'Pauzeren',
            RESUME: 'Hervatten',
            STOP: 'Stoppen en sluiten',
            DEFAULT_QUALITY: 'Standaard kwaliteit',
            HIGHER_QUALITY: 'Superieure kwaliteit',
            LANGUAGE: 'Taal',
            LICENSE: '© 2024 GUILHERME LUKASZEWSKI en CD BABY, INC.\nAlle rechten namens CD BABY, INC. Beheerd door DOWNTOWN MUSIC PUBLISHING, LLC\nAlle rechten voorbehouden.'
        }
    }

    function getDuration(time) {
        if (Number.isNaN(Number(time))) return '0:00'
        const totalInSecs = Math.floor(time)
        if (totalInSecs < 60) {
            return `0:${totalInSecs < 10 ? '0'.concat(totalInSecs) : totalInSecs}`
        } else {
            const minutes = Math.floor(totalInSecs / 60)
            const seconds = totalInSecs - minutes * 60
            return `${minutes}:${seconds < 10 ? '0'.concat(seconds) : seconds}`
        }
    }

    function listenTo(version = 'mp3') {
        try {
            const playerEl = document.getElementById('file-player')
            if (!playerEl) return
            if (playerEl.classList.contains('hidden')) {
                playerEl.classList.remove('hidden')
                const ariaHiddenElList = playerEl.querySelectorAll('[aria-hidden="true"]')
                Array.from(ariaHiddenElList).forEach(el => {
                    if (!(el instanceof SVGAElement) && !(el instanceof HTMLImageElement)) {
                        el.setAttribute('aria-hidden', 'false')
                    }
                })
            }
            const currentAudioEl = document.getElementsByTagName('audio')[0]
            if (currentAudioEl) {
                const assetUri = `asset/Nini's Lullaby.${version}`
                if (
                    currentAudioEl.getAttribute('src') &&
                    currentAudioEl.getAttribute('src').includes(assetUri)
                ) return
                currentAudioEl.pause()
                const { currentTime, duration } = currentAudioEl
                const fileQEl = playerEl.getElementsByClassName('music-file-q')[0]
                if (fileQEl) fileQEl.style.opacity = version === 'wav' ? 1 : 0
                currentAudioEl.src = assetUri
                if (currentTime) {
                    currentAudioEl.currentTime = currentTime === duration ? 0 : currentTime
                }
                currentAudioEl.play()
                const playerButtonList = playerEl.getElementsByTagName('button')
                Array.from(playerButtonList).forEach(el => {
                    if (el.classList.contains('bt-play')) {
                        el.classList.remove('paused')
                        const messages = intlMessages[window.lang] || intlMessages.en
                        el.setAttribute('aria-label', messages.PAUSE)
                        el.setAttribute('title', messages.PAUSE)
                    }
                })
                return
            }
            // Create audio element
            const audioEl = document.createElement('audio')
            audioEl.setAttribute('controls', 'controls')
            audioEl.style.visibility = 'hidden'
            audioEl.style.position = 'absolute'
            audioEl.src = `asset/Nini's Lullaby.${version}`
            // Add event listeners
            const onTimeUpdate = e => {
                const { currentTime } = e.target
                const el = document.getElementsByClassName('music-time')[0]
                if (el) {
                    const elapsedEl = el.getElementsByClassName('elapsed')[0]
                    if (elapsedEl) {
                        elapsedEl.innerHTML = getDuration(currentTime)
                    }
                }
            }
            const onDurationChange = e => {
                const { duration } = e.target
                const el = document.getElementsByClassName('music-time')[0]
                if (el) {
                    const durationEl = el.getElementsByTagName('duration')[0]
                    if (durationEl) {
                        durationEl.innerHTML = getDuration(duration)
                    }
                }
            }
            const onEnded = () => {
                const playerButtonList = playerEl.getElementsByTagName('button')
                Array.from(playerButtonList).forEach(el => {
                    if (el.classList.contains('bt-play')) {
                        el.classList.add('paused')
                        const messages = intlMessages[window.lang] || intlMessages.en
                        el.setAttribute('aria-label', messages.PLAY)
                        el.setAttribute('title', messages.PLAY)
                    }
                })
            }
            audioEl.addEventListener('durationchange', onDurationChange)
            audioEl.addEventListener('timeupdate', onTimeUpdate)
            audioEl.addEventListener('ended', onEnded, false)
            // Add events to player buttons
            const onPlayPause = (e) => {
                const el = e.currentTarget || e.target
                const messages = intlMessages[window.lang] || intlMessages.en
                if (audioEl.ended) {
                    audioEl.currentTime = 0
                    audioEl.play()
                    el.classList.remove('paused')
                    el.setAttribute('aria-label', messages.PAUSE)
                    el.setAttribute('title', messages.PAUSE)
                    return
                }
                if (audioEl.paused) {
                    audioEl.play()
                    el.classList.remove('paused')
                    el.setAttribute('aria-label', messages.PAUSE)
                    el.setAttribute('title', messages.PAUSE)
                } else {
                    audioEl.pause()
                    el.classList.add('paused')
                    el.setAttribute('aria-label', messages.RESUME)
                    el.setAttribute('title', messages.RESUME)
                }
            }
            const onStop = () => {
                audioEl.pause()
                audioEl.removeEventListener('durationchange', onDurationChange)
                audioEl.removeEventListener('timeupdate', onTimeUpdate)
                audioEl.removeEventListener('ended', onEnded)
                audioEl.remove()
                const licenseEl = document.querySelector('.wrapper > div:last-child')
                if (licenseEl) licenseEl.style.paddingBottom = '16px'
                playerEl.classList.add('hidden')
                const ariaHiddenElList = playerEl.querySelectorAll('[aria-hidden="false"]')
                Array.from(ariaHiddenElList).forEach(el => {
                    if (!(el instanceof SVGAElement) && !(el instanceof HTMLImageElement)) {
                        try {
                            // Remove focus before hiding from a18y
                            el.blur()
                        } catch { /** pass */ }
                        el.setAttribute('aria-hidden', 'true')
                    }
                })
                const playerButtonList = playerEl.getElementsByTagName('button')
                Array.from(playerButtonList).forEach(el => {
                    if (el.classList.contains('bt-play')) {
                        el.removeEventListener('click', onPlayPause)
                    } else {
                        el.removeEventListener('click', onStop)
                    }
                })
            }
            const playerButtonList = playerEl.getElementsByTagName('button')
            Array.from(playerButtonList).forEach(el => {
                if (el.classList.contains('bt-play')) {
                    el.addEventListener('click', onPlayPause)
                    el.classList.remove('paused')
                    const messages = intlMessages[window.lang] || intlMessages.en
                    el.setAttribute('aria-label', messages.PAUSE)
                    el.setAttribute('title', messages.PAUSE)
                } else {
                    el.addEventListener('click', onStop)
                }
            })
            const fileQEl = playerEl.getElementsByClassName('music-file-q')[0]
            if (fileQEl) fileQEl.style.opacity = version === 'wav' ? 1 : 0
            document.getElementsByTagName('body')[0].append(audioEl)
            const licenseEl = document.querySelector('.wrapper > div:last-child')
            if (licenseEl) licenseEl.style.paddingBottom = '80px'
            audioEl.play()
        } catch (e) {
            console.error(e)
        }
    }

    function download(version = 'mp3') {
        fetch(`asset/Nini's Lullaby.${version}`)
            .then(resp =>
                resp.status === 200
                    ? resp.blob()
                    : Promise.reject(resp.status)
            )
            .then(blob => {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url
                a.download = `Nini's Lullaby.${version}`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
            })
            .catch(e => {
                console.error(e)
            })
    }

    const actionContainerEl = document.getElementsByClassName('file-q-version-container')[0]
    if (actionContainerEl) {
        // Attach events to the listen buttons
        const listenButtonList = actionContainerEl.getElementsByClassName('bt-outlined')
        Array.from(listenButtonList).forEach(el => {
            let version = el.getAttribute('data-fq-version') || 'mp3'
            if (!['mp3', 'wav'].includes(version)) version = 'mp3'
            el.addEventListener('click', () => listenTo(version))
        })
        // Attach events to the download buttons
        const downloadButtonList = actionContainerEl.getElementsByClassName('bt-icon-outlined')
        Array.from(downloadButtonList).forEach(el => {
            let version = el.getAttribute('data-fq-version') || 'mp3'
            if (!['mp3', 'wav'].includes(version)) version = 'mp3'
            el.addEventListener('click', () => download(version))
        })
    }

    function changeLanguage(lang) {
        try {
            window.lang = lang
            localStorage.setItem('lang', lang)
        } catch { /** pass */ }

        const messages = intlMessages[lang] || intlMessages.en
        const actionContainerEl = document.getElementsByClassName('file-q-version-container')[0]
        if (actionContainerEl) {
            const listenButtonList = actionContainerEl.getElementsByClassName('bt-outlined')
            Array.from(listenButtonList).forEach(el => {
                const version = (el.getAttribute('data-fq-version') || 'mp3') === 'wav'
                    ? messages.HIGHER_QUALITY || 'Lossless'
                    : messages.DEFAULT_QUALITY || 'MP3'
                el.setAttribute('aria-label', `${messages.LISTEN} (${version})`)
                el.innerHTML = messages.LISTEN
            })
            const downloadButtonList = actionContainerEl.getElementsByClassName('bt-icon-outlined')
            Array.from(downloadButtonList).forEach(el => {
                const version = (el.getAttribute('data-fq-version') || 'mp3') === 'wav'
                    ? 'Lossless'
                    : 'MP3'
                const intlText = `${messages.DOWNLOAD} (${version})`
                el.setAttribute('aria-label', intlText)
                el.setAttribute('title', intlText)
            })
        }
        const playerEl = document.getElementById('file-player')
        if (playerEl) {
            const playerButtonList = playerEl.getElementsByTagName('button')
            Array.from(playerButtonList).forEach(el => {
                if (el.classList.contains('bt-play')) {
                    const audioEl = document.getElementsByTagName('audio')[0]
                    let intlText = messages.PAUSE
                    if (audioEl) {
                        intlText = audioEl.ended
                            ? messages.PLAY
                            : audioEl.paused
                                ? messages.RESUME
                                : messages.PAUSE
                    }
                    el.setAttribute('aria-label', intlText)
                    el.setAttribute('title', intlText)
                } else {
                    el.setAttribute('aria-label', messages.STOP)
                    el.setAttribute('title', messages.STOP)
                }
            })
        }
        const licenseEl = document.getElementsByClassName('license')[0]
        if (licenseEl) licenseEl.innerHTML = messages.LICENSE
        const langEl = document.getElementsByClassName('lang')[0]
        if (langEl) {
            const langButtonEl = langEl.getElementsByClassName('tx-secondary')[0]
            if (langButtonEl) {
                langButtonEl.setAttribute('aria-label', messages.LANGUAGE)
                langButtonEl.setAttribute('title', messages.LANGUAGE)
            }
        }
    }

    const langEl = document.getElementsByClassName('lang')[0]
    if (langEl) {
        const mobileLangButton = langEl.getElementsByClassName('tx-secondary')[0]
        if (mobileLangButton) {
            const onToggleLangPanel = () => {
                const fn = langEl.classList.contains('open') ? 'remove' : 'add'
                langEl.classList[fn]('open')
            }
            let hasAddedClickListener = false
            const onToggleLangClickEvent = () => {
                if (window.innerWidth <= 660) {
                    if (hasAddedClickListener) return
                    mobileLangButton.setAttribute('role', 'button')
                    mobileLangButton.setAttribute('tabindex', '0')
                    mobileLangButton.addEventListener('click', onToggleLangPanel)
                    hasAddedClickListener = true
                } else {
                    if (!hasAddedClickListener) return
                    mobileLangButton.removeAttribute('role')
                    mobileLangButton.removeAttribute('tabindex')
                    mobileLangButton.removeEventListener('click', onToggleLangPanel)
                    hasAddedClickListener = false
                }
            }
            onToggleLangClickEvent()
            window.addEventListener('resize', onToggleLangClickEvent)
        }
        const langButtonList = langEl.getElementsByTagName('img')
        Array.from(langButtonList).forEach(el => {
            const lang = el.getAttribute('data-lang')
            el.addEventListener('click', () => changeLanguage(lang))
        })
    }

    try {
        const lang = localStorage.getItem('lang')
        if (lang && lang !== 'en' && Object.keys(intlMessages).includes(lang)) {
            changeLanguage(lang)
            return
        }
    } catch { /** pass */ }
    try {
        const browserLang = navigator.language.split('-', 1)[0]
        if (
            browserLang && browserLang !== 'en' &&
            Object.keys(intlMessages).includes(browserLang)
        ) {
            changeLanguage(browserLang)
            return
        }
    } catch { /** pass */ }
    try {
        window.lang = 'en'
        localStorage.setItem('lang', 'en')
    } catch { /** pass */ }
})()
