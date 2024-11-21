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
                const durationEl = el.getElementsByTagName('span')[1]
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
                }
            })
        }
        audioEl.addEventListener('durationchange', onDurationChange)
        audioEl.addEventListener('timeupdate', onTimeUpdate)
        audioEl.addEventListener('ended', onEnded, false)
        // Add events to player buttons
        const onPlayPause = (e) => {
            const el = e.currentTarget || e.target
            if (audioEl.ended) {
                audioEl.currentTime = 0
                audioEl.play()
                el.classList.remove('paused')
                return
            }
            if (audioEl.paused) {
                audioEl.play()
                el.classList.remove('paused')
            } else {
                audioEl.pause()
                el.classList.add('paused')
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
            } else {
                el.addEventListener('click', onStop)
            }
        })
        const fileQEl = playerEl.getElementsByClassName('music-file-q')[0]
        if (fileQEl) fileQEl.style.opacity = version === 'wav' ? 1 : 0
        document.getElementsByTagName('body')[0].append(audioEl)
        const licenseEl = document.querySelector('.wrapper > div:last-child')
        if (licenseEl) licenseEl.style.paddingBottom = '80px'
        audioEl.currentTime = 290
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

(function () {
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
})()
