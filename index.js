const print = console.log
const ratio = 16 / 9
const nRows = 3
const nCols = 3
const seqLen = 6
let resolution = null

const getBgSize = rect => {
    if (rect.width / rect.height < ratio)
        return { width: rect.width, height: Math.floor(rect.width / ratio) }
    else
        return { width: Math.floor(rect.height * ratio), height: rect.height }
}

const mapRelativePos = { x: 1940 / 8000, y: 191 / 4500 }
const getMapPos = (rect, bgSize) => {
    const offsetX = rect.width - bgSize.width
    const offsetY = rect.height - bgSize.height
    return {
        x: Math.floor(bgSize.width * mapRelativePos.x + offsetX / 2),
        y: Math.floor(bgSize.height * mapRelativePos.y + offsetY / 2)
    }
}


const shuffle = (a) => {
    for (let i = a.length; i > 0; i--) {
        const r = Math.floor(Math.random() * i)
        const swap = a[r]
        a[r] = a[i-1]
        a[i-1] = swap
    }
    return a
}

const newSeq = () => shuffle(Array(seqLen).fill().map((_, i) => i))

const tileIndices = Array(nRows*nCols).fill().map((_, i) => String.fromCharCode("a".charCodeAt(0) + i))
const tileSeq = Array(nRows*nCols).fill().map(newSeq)

Array.prototype.reversemap = function (f) {
    const a = []
    for (let i = 0; i < this.length; i++) {
        const element = this[this.length-1-i]
        a[i] = f(element, i, this)
    }
    return a
}

const onTileClick = (elem, row, col, peek) => {
    const i = row * nCols + col
    const tileIndex = tileIndices[i]
    let seq = tileSeq[i]
    if (seq.length == 0) {
        seq = tileSeq[i] = newSeq()
    }
    
    const urls = seq.reversemap(k => `url(assets/${resolution}/tile-${tileIndex}${k+1}.jpg)`).join(", ")
    elem.style.setProperty("background-image", urls)
    if (!peek) {
        seq.pop()
        elem.classList.add("click-anim")
        setTimeout(() => elem.classList.remove("click-anim"), 400)
    }
}

const updateTiles = () => {
    const tiles = [...document.getElementsByClassName("tile")].sort((a, b) => a.className > b.className)
    tiles.forEach(e => onTileClick(e, +e.className.match(/row-(\d+)/)[1], +e.className.match(/col-(\d+)/)[1], true))
}

const onResize = () => {
    const container = document.getElementsByTagName("body")[0]
    const map = document.getElementById("map")
    const bodyRect = container.getClientRects()[0]
    const bgSize = getBgSize(bodyRect)
    const mapPos = getMapPos(bodyRect, bgSize)

    map.style.setProperty("display", "block")
    document.documentElement.style.setProperty("--map-width", `${bgSize.width}px`)
    document.documentElement.style.setProperty("--map-height", `${bgSize.height}px`)
    document.documentElement.style.setProperty("--tiles-x", `${mapPos.x}px`)
    document.documentElement.style.setProperty("--tiles-y", `${mapPos.y}px`)

    const newRes = (bodyRect.width < 1000 || bodyRect.height < 500) && "low" || "high"
    if (newRes !== resolution) {
        resolution = newRes
        updateTiles()
    }
}

addEventListener("resize", onResize)
setTimeout(onResize, 0)
