function listenTo(version = 'mp3') {

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
    // Attach events to the listen buttons
    const listenButtonElList = document.getElementsByClassName('bt-outlined')
    Array.from(listenButtonElList).forEach(el => {
        let version = el.getAttribute('data-fq-version') || 'mp3'
        if (['mp3', 'wav'].includes(version)) version = 'mp3'
        el.addEventListener('click', () => listenTo(version))
    })

    // Attach events to the download buttons
    const downloadButtonElList = document.getElementsByClassName('bt-icon-outlined')
    Array.from(downloadButtonElList).forEach(el => {
        let version = el.getAttribute('data-fq-version') || 'mp3'
        if (['mp3', 'wav'].includes(version)) version = 'mp3'
        el.addEventListener('click', () => download(version))
    })
})()
