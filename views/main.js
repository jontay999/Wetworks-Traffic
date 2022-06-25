const main = document.getElementById("main")
const container = document.querySelector("#main .container")
const hoseContainer = document.getElementById("hoses")

const inventory1 = document.getElementById("inventory1")
const inventory2 = document.getElementById("inventory2")
//weird drag event got problem

const TRUCK = "TRUCK"
const PIPE = "PIPE"
const FIRE = "FIRE"
const WALL = "WALL"
const EMPTY = "EMPTY"
const HYDRANT = "HYDRANT"
const HOSE1 = "HOSE1"
const HOSE2 = "HOSE2"
const HOSE3 = "HOSE3"
const HOSE4 = "HOSE4"
const HOSE5 = "HOSE5"
const MONITOR = "MONITOR" // the water spout
const DRAGGABLE_ITEMS = [TRUCK, PIPE, HOSE1, HOSE2, HOSE3, HOSE4, HOSE5]
const TRUCK_VERTICAL = true
const SIDE_LENGTH = 51 //plus 1px for grid gap
const original = {
    TRUCK: 1,
    MONITOR: 2,
    PIPE: 15,
    HOSE1: 0,
    HOSE2: 0,
    HOSE3: 15,
    HOSE4: 0,
    HOSE5: 0,
}

const DEBUG = false

const ROW_LENGTH = 9;
const COL_LENGTH = 12
// const TEMPLATE = (text) => `<div draggable="true" class="box">${text}</div>`
const TEMPLATE = (text) => `<div class="box">${DEBUG ? text : ""}</div>`

//convert html string to dom element
const htmlToElement = (html) => {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

//when dragging from outside, help to spawn a new element
const generateDragSrcEl = (type) => {

    if (type === HOSE5) return htmlToElement(`<div draggable="true" class="box h5 h5vertical vertical"></div>`)
    if (type === HOSE4) return htmlToElement(`<div draggable="true" class="box h4 h4vertical vertical"></div>`)
    if (type === HOSE3) return htmlToElement(`<div draggable="true" class="box h3 h3vertical vertical"></div>`)
    if (type === HOSE2) return htmlToElement(`<div draggable="true" class="box h2 h2vertical vertical"></div>`)
    if (type === HOSE1) return htmlToElement(`<div draggable="true" class="box h1  horizontal"></div>`)
    if (type === PIPE) return htmlToElement(`<div draggable="true" class="box pipe r1"></div>`)
    if (type === MONITOR) return htmlToElement(`<div draggable="true" class="box monitor r1"></div>`)
    if (type === TRUCK) return htmlToElement(`<div draggable="true" class="box truck r1 vertical"></div>`)
    throw "havent code for " + type + " yet"
}

const getRotationState = (elem) => {
    const classList = elem.classList
    if (classList.contains('r1')) return ["r2", "r1"]
    if (classList.contains('r2')) return ["r3", "r2"]
    if (classList.contains('r3')) return ["r4", "r3"]
    if (classList.contains('r4')) return ["r1", "r4"]


    if (classList.contains('h2vertical')) return ['h2horizontal', 'h2vertical']
    if (classList.contains('h2horizontal')) return ['h2vertical', 'h2horizontal']

    if (classList.contains('h3vertical')) return ['h3horizontal', 'h3vertical']
    if (classList.contains('h3horizontal')) return ['h3vertical', 'h3horizontal']

    if (classList.contains('h4vertical')) return ['h4horizontal', 'h4vertical']
    if (classList.contains('h4horizontal')) return ['h4vertical', 'h4horizontal']

    if (classList.contains('h5vertical')) return ['h5horizontal', 'h5vertical']
    if (classList.contains('h5horizontal')) return ['h5vertical', 'h5horizontal']

}


let INVENTORY = {
    TRUCK: 1,
    MONITOR: 2,
    PIPE: 15,
    HOSE1: 0,
    HOSE2: 0,
    HOSE3: 15,
    HOSE4: 0,
    HOSE5: 0,
}

document.addEventListener('click', (e) => DEBUG && console.log("Position:", e.pageX, e.pageY))

const states = {
    TRUCK: {
        isHorizontal: false,
        length: 3
    },
    HOSE: {
        length: 1,
    },
    PIPE: {
        length: 1,
    },
    FIRE: {
        length: 1,
    },
    WALL: {
        length: 1,
    },
    EMPTY: {
        length: 1,
    },
    MONITOR: {
        length: 1
    },
    HYDRANT: {
        length: 1,
    },
    HOSE1: {
        length: 1
    },
    HOSE2: {
        length: 2
    },
    HOSE3: {
        length: 3
    },
    HOSE4: {
        length: 4
    },
    HOSE5: {
        length: 5
    },
}

const drawInventory = () => {

    let html1 = ""
    let html2 = ""

    html1 += `<div class='group2'>`
    //hose5
    html1 += `<div class="outer"><div class="quantity">(${HOSE5} x ${INVENTORY[HOSE5]})</div><div ${INVENTORY[HOSE5] > 0 ? `draggable="true"` : ""} class="outsideItem hose h5 h5vertical hose5 ${INVENTORY[HOSE5] > 0 ? `` : `noDrag`}"></div></div>`

    //hose4
    html1 += `<div class="outer"><div class="quantity">(${HOSE4} x ${INVENTORY[HOSE4]})</div><div ${INVENTORY[HOSE4] > 0 ? `draggable="true"` : ""} class="outsideItem hose h4 h4vertical hose4 ${INVENTORY[HOSE4] > 0 ? `` : `noDrag`}"></div></div>`

    html1 += `</div>`


    html2 += `<div class='group2'>`
    //hose3
    html2 += `<div class="outer"><div class="quantity">(${HOSE3} x ${INVENTORY[HOSE3]})</div><div ${INVENTORY[HOSE3] > 0 ? `draggable="true"` : ""} class="outsideItem hose h3 h3vertical hose3 ${INVENTORY[HOSE3] > 0 ? `` : `noDrag`}"></div></div>`

    //hose2
    html2 += `<div class="outer"><div class="quantity">(${HOSE2} x ${INVENTORY[HOSE2]})</div><div ${INVENTORY[HOSE2] > 0 ? `draggable="true"` : ""} class="outsideItem hose h2 h2vertical hose2 ${INVENTORY[HOSE2] > 0 ? `` : `noDrag`}"></div></div>`

    html2 += `</div>`

    html2 += `<div class='group2'>`
    //TRUCK
    html2 += `<div class="outer"><div class="quantity">(${TRUCK} x ${INVENTORY[TRUCK]})</div><div ${INVENTORY[TRUCK] > 0 ? `draggable="true"` : ""} class="outsideItem truck r1 ${INVENTORY[TRUCK] > 0 ? `` : `noDrag`}"></div></div>`

    //hose1
    html2 += `<div class="outer"><div class="quantity">(${HOSE1} x ${INVENTORY[HOSE1]})</div><div ${INVENTORY[HOSE1] > 0 ? `draggable="true"` : ""} class="outsideItem hose h1 hose1 ${INVENTORY[HOSE1] > 0 ? `` : `noDrag`}"></div></div>`
    html2 += `</div>`

    html1 += `<div class='group2'>`

    //pipe
    html1 += `<div class="outer"><div class="quantity">(${PIPE} x ${INVENTORY[PIPE]})</div><div ${INVENTORY[PIPE] > 0 ? `draggable="true"` : ""} class="outsideItem pipe r1 ${INVENTORY[PIPE] > 0 ? `` : `noDrag`}"></div></div>`

    //MONITOR
    html1 += `<div class="outer"><div class="quantity">(${MONITOR} x ${INVENTORY[MONITOR]})</div><div ${INVENTORY[MONITOR] > 0 ? `draggable="true"` : ""} class="outsideItem monitor r1 ${INVENTORY[MONITOR] > 0 ? `` : `noDrag`}"></div></div>`

    html1 += `</div>`


    inventory1.innerHTML = html1
    inventory2.innerHTML = html2
    // hoseContainer.innerHTML = html
}

let gameState = []

const consoleLogElements = (arr) => {
    let text = []
    arr.forEach(i => text.push(i.textContent ? i.textContent : i))
    console.log(text)
}

const initial = () => {
    for (let i = 0; i < ROW_LENGTH; i++) {
        let row = []
        for (let j = 0; j < COL_LENGTH; j++) {
            row.push(0)
        }
        gameState.push(row)
    }

    // let r = 3
    // let c = 1
    // let truck = [[r, c], [r + 1, c], [r + 2, c]]
    // truck.forEach(tuple => gameState[tuple[0]][tuple[1]] = "🚒")

    // let h4r = 1
    // let h4c = 1
    // let hose4 = [[h4r, h4c], [h4r, h4c + 1], [h4r, h4c + 2], [h4r, h4c + 3]]
    // hose4.forEach(tuple => gameState[[tuple[0]]][tuple[1]] = "4▬")

    // let h5r = 1
    // let h5c = 0
    // // let hose5 = [[h5r, h5c], [h5r + 1, h5c], [h5r + 2, h5c + 2], [h5r + 3, h5c], [h5r + 4, h5c]]
    // let hose5 = [[h5r, h5c], [h5r, h5c + 1], [h5r, h5c + 2], [h5r, h5c + 3], [h5r, h5c + 4]]
    // hose5.forEach(tuple => gameState[[tuple[0]]][tuple[1]] = "5▬")

    // let pipes = [[6, 6]]
    // pipes.forEach(tuple => gameState[tuple[0]][tuple[1]] = "↪️")



    let fires = [[1, 8], [5, 9]]
    fires.forEach(tuple => gameState[tuple[0]][tuple[1]] = "🔥")


    let walls = [
        [0, 7], [0, 8], [0,9 ], [1, 7], [1,9], [2, 7], [2, 8], [2,9 ],
        [4, 8], [4, 9], [4, 10], [5,8], [5,10], [6, 8], [6, 9], [6, 10],
    ]
    walls.forEach(tuple => gameState[tuple[0]][tuple[1]] = "📦")

    let hydrant = [[8, 6]]
    hydrant.forEach(tuple => gameState[tuple[0]][tuple[1]] = "🧯")


    // let monitors = [[1, 6], [5,7]]
    // monitors.forEach(tuple => gameState[tuple[0]][tuple[1]] = "🚰")
    // gameState.forEach((i) => console.log(i))

}

// draw first grid
const drawGrid = () => {
    let html = ""
    let fireTruckSeen = false
    let h4seen = false
    let h5seen = false
    for (let row = 0; row < ROW_LENGTH; row++) {
        for (let col = 0; col < COL_LENGTH; col++) {
            if (gameState[row][col] === 0) {
                // html += `<div draggable="true" class="box">${DEBUG ? row + "," + col : ""}</div>`
                html += `<div class="box">${DEBUG ? row + "," + col : ""}</div>`
            } else if (gameState[row][col] === "🔥") {
                html += `<div class="box fire"></div>`
            } else if (gameState[row][col] === "📦") {
                html += `<div class="box wall"></div>`
            } else if (gameState[row][col] === "🧯") {
                html += `<div class="box hydrant"></div>`
            } else if (gameState[row][col] === "🚒") {
                if (fireTruckSeen) continue
                html += `<div draggable="true" class="box truck truckVertical vertical"></div>`
                fireTruckSeen = true;
            } else if (gameState[row][col] === "4▬") {
                if (h4seen) continue
                html += `<div draggable="true" class="box h4 h4horizontal horizontal"></div>`
                h4seen = true
            }
            else if (gameState[row][col] === "5▬") {
                if (h5seen) continue
                html += `<div draggable="true" class="box h5 h5horizontal horizontal"></div>`
                h5seen = true
            }
            else if (gameState[row][col] === "↪️") {
                html += `<div draggable="true" class="box pipe r1"></div>`
            }
            else if (gameState[row][col] === "🚰") {
                html += `<div class="box monitor r1"></div>`
            }
        }
    }
    container.innerHTML = html

}

const clearClasses = () => {
    let removedClasses = ["over"]
    for (let i = 0; i < removedClasses.length; i++) {
        let elems = document.getElementsByClassName(removedClasses[i])
        if (elems.length == 0) continue
        console.log(elems)
        for (let j = 0; j < elems.length; j++) {
            elems[j].classList.remove(removedClasses[i])
        }

    }
}

const getType = (elem) => {
    if (!elem) return null
    let classes = Array.from(elem.classList)
    if (classes.includes("truck")) {
        return TRUCK
    } else if (classes.includes("fire")) {
        return FIRE
    } else if (classes.includes("wall")) {
        return WALL
    } else if (classes.includes("hydrant")) {
        return HYDRANT
    } else if (classes.includes('pipe')) {
        return PIPE
    }
    else if (classes.includes('monitor')) {
        return MONITOR
    }
    else if (classes.includes('h1') || classes.includes("hose1")) {
        return HOSE1
    }
    else if (classes.includes('h2') || classes.includes("hose2")) {
        return HOSE2
    }
    else if (classes.includes('h3') || classes.includes("hose3")) {
        return HOSE3
    }
    else if (classes.includes('h4') || classes.includes("hose4")) {
        return HOSE4
    }
    else if (classes.includes('h5') || classes.includes("hose5")) {
        return HOSE5
    }
    else if (classes.includes('box')) {
        return EMPTY
    }
    return null
    // throw "WHAT IS THIS ELEMENT YOU DRAGGING"
}

const indexInParent = (node) => {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i] == node) return num;
        if (children[i].nodeType == 1) num++;
    }
    return -1;
}

// which position did you click within long block
const getPosition = (e, type, isHorizontal) => {
    console.log("position:", isHorizontal)
    let elemWidth = e.target.offsetWidth + 1
    let elemHeight = e.target.offsetHeight + 1
    let clickWidth = e.offsetX
    let clickHeight = e.offsetY
    let pos = 0
    let divWidth = elemWidth / states[type]["length"]
    let divHeight = elemHeight / states[type]["length"]
    if (states[type]["length"] > 1) {
        if (isHorizontal) {
            pos = Math.floor(clickWidth / divWidth)
        } else {
            pos = Math.floor(clickHeight / divHeight)
        }
    }
    return Math.max(pos, 0)
}



//swap class lists betwene two elements, #not used now
const swapClassList = (srcEl, targetEl, srcClass, targetClass) => {
    srcEl.className = ""
    targetClass.forEach((i) => srcEl.classList.add(i))

    console.log(srcClass)

    targetEl.className = ""
    srcClass.forEach((i) => targetEl.classList.add(i))
}

//check if current position is the top of a vertical element
const checkIfPositionIsFirst = (xCoord, yCoord) => {
    const elem = document.elementFromPoint(xCoord, yCoord)
    if (!elem) throw "why is there no element here"
    const upElem = document.elementFromPoint(xCoord, yCoord - HEIGHT_INTERVAL) //assuming it shifts down by one, need to offset the shift down alr
    // console.log("res", upElem !== elem)
    return upElem !== elem // if they are same element, that means is not first
}




//check if the next position is valid, and if it is return the elements that you can replace
const isValid = (isHorizontal, startX, startY, length, srcElement) => {
    // console.log("params", isHorizontal, startX, startY, srcElement)

    let elems = []
    for (let i = 0; i < length; i++) {
        let currX, currY;
        if (isHorizontal) {
            currX = startX + i * WIDTH_INTERVAL
            // currY = startY + HEIGHT_INTERVAL / 2 //double check this
            currY = startY + HEIGHT_INTERVAL / 2 //double check this
        } else {
            currX = startX
            currY = startY + i * HEIGHT_INTERVAL
        }
        let elem = document.elementFromPoint(currX, currY);
        // console.log("curr elem:", elem, currX, currY)
        // overlaps with current element, dont need replace so much
        if (elem == srcElement) continue
        if (!elem || !elem.classList.contains('box')) return false
        if (getType(elem) != EMPTY) return false
        elems.push(elem)
    }
    // console.log("valid elems:")
    // consoleLogElements(elems)
    return elems;

}

const sameElemValid = (isHorizontal, sourceElement, startPos, endPos) => {
    if (startPos === endPos) throw "what nonsense is this, startPos and endPos the same"
    const elemsToSwap = []

    const numBlocksToCheck = Math.abs(startPos - endPos)
    //if startPos > endPos --> means shift down / left
    let bounds = sourceElement.getBoundingClientRect()
    let startX = bounds.x + WIDTH_INTERVAL / 2
    let startY = bounds.y + HEIGHT_INTERVAL / 2
    if (isHorizontal) {
        if (startPos < endPos) {
            startX = bounds.x + bounds.width - WIDTH_INTERVAL / 2
            // console.log("Dragging to right")
        } else {
            startX = bounds.x + WIDTH_INTERVAL / 2 - (numBlocksToCheck + 1) * WIDTH_INTERVAL
            // console.log("Dragging to left")
        }
        // throw "give me a while man"
        for (let i = 0; i < numBlocksToCheck; i++) {
            let currX = startX + WIDTH_INTERVAL * (i + 1)
            let currY = startY // is not necessary but at least easier for me to keep track
            let elem = document.elementFromPoint(currX, currY)
            if (getType(elem) !== EMPTY) return false
            elemsToSwap.push(elem)
        }
    } else {
        let sign = -1;

        if (startPos < endPos) {
            // console.log("dragging down")
            startY += bounds.height - HEIGHT_INTERVAL // offset for the half increase that was put earlier
        } else {
            //dragging up
            startY = startY - (numBlocksToCheck + 1) * HEIGHT_INTERVAL //just minus 1 to maintain i+1 below

        }
        for (let i = 0; i < numBlocksToCheck; i++) {
            let currX = startX // is not necessary but at least easier for me to keep track
            let currY = startY + HEIGHT_INTERVAL * (i + 1)
            let elem = document.elementFromPoint(currX, currY)
            if (getType(elem) !== EMPTY) return false
            elemsToSwap.push(elem)
        }
    }
    return elemsToSwap
}


const crawlElementWithOffset = (sourceElement, length, offset, isHorizontal) => {
    if (offset >= 0) throw "what is this shit" + offset
    let num = length + offset
    let currX, currY;
    const bounds = sourceElement.getBoundingClientRect()
    if (isHorizontal) {
        currX = bounds.x + WIDTH_INTERVAL / 2
        currY = bounds.y + HEIGHT_INTERVAL / 2
    } else {
        currX = bounds.x + WIDTH_INTERVAL / 2
        currY = bounds.y + HEIGHT_INTERVAL / 2 + num * HEIGHT_INTERVAL;
    }
    while (true) {
        currX -= WIDTH_INTERVAL
        if (currX < GRID_BOUNDS.x) {
            currX = GRID_BOUNDS.right - WIDTH_INTERVAL / 2
            currY -= HEIGHT_INTERVAL
        }
        if (currY < GRID_BOUNDS.top) {
            return container
        }
        let possible = document.elementFromPoint(currX, currY)
        let possibleType = getType(possible)
        if (possibleType && (states[possibleType]["length"] == 1 || possible.classList.contains('horizontal'))) {
            return possible
        }
    }
    throw " i have no idea how you reached this block"

}

//check which element to insert after // making sure that it doesn't shift everything
const crawlNextGoodElem = (sourceElement, length, isHorizontal, offset = 0, shiftingDown = false, isDraggingFromOutside = false) => {
    // console.log("Hori:", isHorizontal, " offset:", offset)
    const actualNum = length - Math.abs(offset)

    const bounds = sourceElement.getBoundingClientRect()
    // console.log("bounds", bounds, sourceElement)
    const goodElems = []

    //offset for  checking if the first position of element has been taken
    let startedSet = new Set()

    for (let i = 0; i < actualNum; i++) {

        //the top left of the source element
        let currX = bounds.x + WIDTH_INTERVAL / 2;
        let currY = bounds.y + HEIGHT_INTERVAL / 2;


        if (isHorizontal) {
            currX += i * WIDTH_INTERVAL
            if (offset > 0) currX += offset * WIDTH_INTERVAL
        } else {
            currY += i * HEIGHT_INTERVAL
            let absOffset = Math.abs(offset)
            if (absOffset > 0 && !shiftingDown) {
                // console.log("inside", shiftingDown)
                currY += absOffset * HEIGHT_INTERVAL
            }

        }
        // console.log("Start Y:", currY, offset)

        while (true) {
            //offset < 0 is incase dragging along same axis with overlap
            if (isHorizontal && (goodElems.length == 1 || offset < 0)) {
                //horizontal only need one element
                while (goodElems.length != actualNum) {
                    goodElems.push(goodElems[0])
                }
                return goodElems

            }


            currX -= WIDTH_INTERVAL
            if (currX < GRID_BOUNDS.x) {
                // console.log("at the start of row alr", currX)
                currX = GRID_BOUNDS.right - WIDTH_INTERVAL / 2
                currY -= HEIGHT_INTERVAL
            }
            if (currY < GRID_BOUNDS.top) {
                goodElems.push(container)
                break
            }
            let possible = document.elementFromPoint(currX, currY)
            if (!possible) continue // noe lement available

            let possibleType = getType(possible)

            if (possibleType && (states[possibleType]["length"] == 1 || possible.classList.contains('horizontal')) && !goodElems.includes(possible)) {
                goodElems.push(possible)
                break
            }

            // console.log("considering:", possible.textContent, currX, currY, possible)
            if (states[possibleType]["length"] > 1 && possible.classList.contains('vertical') && checkIfPositionIsFirst(currX, currY) && !startedSet.has(possible)) {
                goodElems.push(possible)
                startedSet.add(possible)
                break
            }
        }
    }

    // console.log("printing good elems:")
    // consoleLogElements(goodElems)
    return goodElems


}

//actually append, replace dom nodes with each other
const replaceBigElem = (isHorizontal, elems, length, sourceElement, addListeners, negativeOffset, shiftingDown = false, isDraggingFromOutside = false) => {
    // consoleLogElements(elems)
    // console.log("input to replace:", isHorizontal, length, sourceElement, negativeOffset)
    sourceElement.style.cssText = ""
    const cloneSource = sourceElement.cloneNode(true)
    addListeners(cloneSource)

    let goodElems = [];
    let offset = length - elems.length;
    let offsetElem

    if (isHorizontal && offset > 0) {
        const sourceIndex = indexInParent(sourceElement)
        let prevElement;
        if (sourceIndex == 0) {
            prevElement = container
        } else {
            prevElement = container.children[sourceIndex - 1]
        }
        while (goodElems.length < elems.length) {
            goodElems.push(prevElement)
        }

    } else if (elems.length < length) {
        // offset = length - elems.length
        if (negativeOffset) {
            offset *= -1
            offsetElem = crawlElementWithOffset(sourceElement, length, offset, isHorizontal)
        }
        goodElems = crawlNextGoodElem(sourceElement, length, isHorizontal, offset, shiftingDown)
    } else {
        goodElems = crawlNextGoodElem(sourceElement, length, isHorizontal, 0, false, isDraggingFromOutside)
    }

    //otherwise latest element will appear first because only inserting after 1 element

    if (isHorizontal) elems.reverse()

    // only need replace elements if not dragging from outside
    if (!isDraggingFromOutside) {
        for (let i = 0; i < elems.length; i++) {
            const elemClone = elems[i].cloneNode(true)

            addListeners(elemClone)
            elemClone.classList.remove('over')
            if (goodElems[i].classList.contains('container')) {
                goodElems[i].insertAdjacentElement('afterbegin', elemClone) // that means inserting from start
            }
            else {
                goodElems[i].insertAdjacentElement('afterend', elemClone)
            }
        }
    }

    if (offset < 0) {
        //in case of vertical, means drag down but still overlapping prev position 
        offsetElem.insertAdjacentElement('afterend', cloneSource)
    } else {
        elems[0].insertAdjacentElement('beforebegin', cloneSource)
    }
    elems.forEach(i => i.remove())
    sourceElement.remove()
    computeBounds()
}


const removeElement = (elemToRemove, elemType, isHorizontal, addListeners) => {
    let length = states[elemType]["length"]
    let elemsToAppend = crawlNextGoodElem(elemToRemove, length, isHorizontal)

    for (let i = 0; i < elemsToAppend.length; i++) {
        let newElem = htmlToElement(TEMPLATE("N"))
        addListeners(newElem)
        elemsToAppend[i].insertAdjacentElement('afterend', newElem)
    }
    elemToRemove.remove()
    INVENTORY[elemType] += 1

    // drawInventory()
}



//main functionality
const dragNdrop = () => {
    let dragSrcEl = null;
    let dragType = null
    let pos = null;
    let isHorizontal = false;
    let isDraggingFromOutside = false

    //all for dragging within container, use functions for easy reference of this
    function handleDragStart(e) {
        console.log("started dragging")
        this.style.opacity = '0.4';
        dragSrcEl = this;

        const type = getType(this)
        dragType = type
        isHorizontal = e.target.classList.contains('horizontal')
        e.dataTransfer.effectAllowed = 'move';
        if (dragType === PIPE) {

            e.dataTransfer.setDragImage(e.target, SIDE_LENGTH / 2, SIDE_LENGTH / 2)
        }
        pos = getPosition(e, type, isHorizontal)

        let dataToTransfer = e.target.outerHTML
        e.dataTransfer.setData('text/html', dataToTransfer);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }


        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        clearClasses()
        const currType = getType(this)

        let length = states[dragType]["length"]

        //this is for dragging within, just for easier separation of concerns even though code is largely similar
        if (currType == EMPTY) {
            if (states[dragType]["length"] == 1) {
                let toReplace = htmlToElement(this.outerHTML)

                let data, elem;
                if (isDraggingFromOutside) {
                    elem = dragSrcEl
                } else {
                    data = e.dataTransfer.getData('text/html').split('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">')[1]
                    elem = htmlToElement(data)
                }
                addListeners(toReplace)
                addListeners(elem)
                elem.style.cssText = ""
                toReplace.classList.remove('over')
                if (!isDraggingFromOutside) {

                    dragSrcEl.insertAdjacentElement('afterend', toReplace)
                    dragSrcEl.remove()
                }
                this.insertAdjacentElement('afterend', elem)
                this.remove()

                if (isDraggingFromOutside) {
                    INVENTORY[dragType] -= 1
                    drawInventory()
                    addInventoryListeners()
                }
                isDraggingFromOutside = false;
            } else {
                // console.log("length > 1 , still need check if valid")
                let currBounds = e.target.getBoundingClientRect()
                let top = currBounds.top
                let left = currBounds.left
                let startX, startY;
                if (isDraggingFromOutside) isHorizontal = false
                if (isHorizontal) {
                    startX = left - (pos * WIDTH_INTERVAL) + WIDTH_INTERVAL / 2
                    startY = top
                } else {
                    startX = left
                    startY = top - (pos * HEIGHT_INTERVAL) + HEIGHT_INTERVAL / 2
                }
                // console.log("horizontal?", isHorizontal)
                // console.log("dragging from outside?:", isDraggingFromOutside)
                // console.log("Dragged pos:", pos)
                // console.log("start coords:", top, left)
                // console.log("coords:", startX, startY, "\n")


                // console.log("calling here")
                let elems = isValid(isHorizontal, startX, startY, length, dragSrcEl)
                if (elems === false || elems.length === 0) return false



                //if draggin by the last element, need to -ve offset it
                let negativeOffset = false

                if (pos != 0) negativeOffset = true

                //only useful when shifting down and got overlap
                let shiftingDown = false
                if (dragSrcEl.getBoundingClientRect().y > e.pageY) {
                    negativeOffset = false
                } else {
                    shiftingDown = true
                }

                if (isDraggingFromOutside) {
                    negativeOffset = false //no need this nonsense
                }


                console.log("Source:", dragSrcEl)
                replaceBigElem(isHorizontal, elems, length, dragSrcEl, addListeners, negativeOffset, shiftingDown, isDraggingFromOutside)

                //update inventory
                if (isDraggingFromOutside) {
                    INVENTORY[dragType] -= 1
                    drawInventory()
                    addInventoryListeners()
                }

                isDraggingFromOutside = false
            }
        } else {
            if (isDraggingFromOutside) {
                isDraggingFromOutside = false
                return false
            }
            if (e.target != dragSrcEl || length == 1) return false
            let newPos = getPosition(e, dragType, isHorizontal)
            if (newPos != pos) {
                console.log("dragging over same Elem and changed:", pos, "-->", newPos)
                let currBounds = e.target.getBoundingClientRect()
                let top = currBounds.top
                let left = currBounds.left
                let startX, startY;

                if (isHorizontal) {
                    startX = left - (newPos * WIDTH_INTERVAL) + WIDTH_INTERVAL / 2
                    startY = top
                } else {
                    startX = left
                    startY = top - (newPos * HEIGHT_INTERVAL) + HEIGHT_INTERVAL / 2
                }
                // let elems = isValid(isHorizontal, startX, startY, length, dragSrcEl)
                let elems = sameElemValid(isHorizontal, dragSrcEl, pos, newPos)
                //invalid position
                if (elems === false) return false
                // consoleLogElements(elems)



                let negativeOffset = false
                let shiftingDown = false
                if (pos < newPos) { // shifting down
                    shiftingDown = true
                    negativeOffset = true
                }
                // console.log("-ve offset", negativeOffset)
                replaceBigElem(isHorizontal, elems, length, dragSrcEl, addListeners, negativeOffset, shiftingDown)
            }
        }
        pipeRotateListeners()
        longObjectListeners()
        return false;
    }

    function handleDragEnd(e) {

        let droppedOntoElems = document.elementsFromPoint(e.clientX, e.clientY)
        let droppedInside = droppedOntoElems.includes(container)

        this.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });

        isDraggingFromOutside = false;
        if (droppedInside) return

        console.log("dropped inside?", droppedInside)

        //dropped outside, need to remove element
        removeElement(dragSrcEl, dragType, isHorizontal, addListeners)
        drawInventory()
        addInventoryListeners()

        isDraggingFromOutside = false;
    }


    //dragging from outside inside
    function handleDragStartOutside(e) {
        console.log("started dragging outside")
        isDraggingFromOutside = true;
        dragType = getType(e.target)
        // console.log("type", dragType)
        dragSrcEl = generateDragSrcEl(dragType)
        pos = getPosition(e, dragType, false) //default vertical drag

    }

    function pipeRotate(e) {
        console.log("rotating pipe")
        let pipe = e.target
        let newRotation = getRotationState(pipe)
        pipe.classList.add(newRotation[0])
        pipe.classList.remove(newRotation[1])
    }




    const addListeners = (item) => {
        item.removeEventListener('dragstart', handleDragStart, false);
        item.removeEventListener('dragenter', handleDragEnter, false);
        item.removeEventListener('dragover', handleDragOver, false);
        item.removeEventListener('dragleave', handleDragLeave, false);
        item.removeEventListener('drop', handleDrop, false);
        item.removeEventListener('dragend', handleDragEnd, false);

        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

    let items = document.querySelectorAll('.container .box');
    items.forEach(item => addListeners(item));

    //only done once, but need to call every time i redraw the inventory

    const addInventoryListeners = () => {
        let outsideItems = document.querySelectorAll('.outsideItem')
        outsideItems.forEach(i => {
            i.removeEventListener('dragstart', handleDragStartOutside, false)
            i.addEventListener('dragstart', handleDragStartOutside, false)
        })
    }

    //actually  monitor and pipe
    const pipeRotateListeners = () => {
        //monitor dont need rotate anymore
        // let pipeItems = document.querySelectorAll(".pipe.box, .monitor.box")
        let pipeItems = document.querySelectorAll(".pipe.box")
        pipeItems.forEach(i => {
            i.removeEventListener('click', pipeRotate, false)
            i.addEventListener('click', pipeRotate, false)
        })
    }


    // click on truck/long hose, rotate
    const rotateLongObject = (e) => {
        const sourceElement = e.target
        let isHorizontalElem = sourceElement.classList.contains('horizontal')
        let bounds = sourceElement.getBoundingClientRect()
        let elemType = getType(sourceElement)
        if (!elemType.startsWith('HOSE') && elemType != TRUCK) throw "what is this element??" + elemType

        let length = states[elemType]["length"]
        if (length <= 1) throw "what again"

        let rotatePos = getPosition(e, elemType, isHorizontalElem)

        let newRotatePos = getRotationState(sourceElement)


        if (isHorizontalElem) {
            console.log("flipping to vertical")
            let startX = bounds.x + WIDTH_INTERVAL / 2 + (rotatePos) * WIDTH_INTERVAL
            let startY = Math.max(bounds.y + HEIGHT_INTERVAL / 2 - (length - 1) * HEIGHT_INTERVAL, GRID_BOUNDS.y + HEIGHT_INTERVAL / 2)
            console.log("starting from", startX, startY, bounds, document.elementFromPoint(startX, startY))

            let elems = false // to replace
            for (let i = 0; i < length; i++) {
                elems = isValid(!isHorizontalElem, startX, startY + i * HEIGHT_INTERVAL, length, sourceElement)
                if (elems) break
            }
            // consoleLogElements(elems)
            if (!elems || elems.length !== length - 1) {
                console.log("cannot rotate")
                return
            }
            console.log("got some elems:", elems)
            consoleLogElements(elems)

            //since horizontal, only need one element
            const possibleElems = crawlNextGoodElem(sourceElement, length, isHorizontalElem, 0)
            console.log("possible")
            possibleElems.forEach(i => console.log(i))

            sourceElement.classList.toggle('horizontal')
            sourceElement.classList.toggle('vertical')

            sourceElement.classList.add(newRotatePos[0])
            sourceElement.classList.remove(newRotatePos[1])

            let clonedSource = sourceElement.cloneNode(true)
            addListeners(clonedSource)



            if (getType(document.elementFromPoint(startX, bounds.y - HEIGHT_INTERVAL / 2)) !== EMPTY) {
                elems.splice(rotatePos, 0, clonedSource)
                elems.reverse()
                let insertPosition = possibleElems[0] === container ? 'afterbegin' : 'afterend'
                for (let i = 0; i < elems.length; i++) {
                    let clonedElem = elems[i].cloneNode(true)
                    addListeners(clonedElem)
                    possibleElems[0].insertAdjacentElement(insertPosition, clonedElem)
                }
                sourceElement.remove()
                elems.forEach(i => i.remove())
                longObjectListeners()
                return
            }






            // console.log("new elem classes:", sourceElement.classList)


            if (possibleElems[0] != container) {
                elems[0].insertAdjacentElement('beforebegin', clonedSource)
            }
            elems.reverse()

            for (let i = 0; i < elems.length; i++) {
                let clonedElem = elems[i].cloneNode(true)
                addListeners(clonedElem)
                if (possibleElems[0] == container) {
                    possibleElems[0].insertAdjacentElement('afterbegin', clonedElem)
                    if (i == rotatePos - 1) {
                        clonedElem.insertAdjacentElement('afterend', clonedSource)
                    }
                } else {

                    possibleElems[0].insertAdjacentElement('afterend', clonedElem)
                }
            }

            sourceElement.remove()
            elems.forEach(i => i.remove())
            //flip this to vertical
        } else {

            console.log("flipping to horizontal")

            let startX = bounds.x + WIDTH_INTERVAL / 2 - (length - 1) * WIDTH_INTERVAL
            let startY = bounds.y + HEIGHT_INTERVAL / 2 + (rotatePos - 1) * HEIGHT_INTERVAL

            console.log("starting from", document.elementFromPoint(startX, startY))

            let elems = false // to replace
            for (let i = 0; i < length; i++) {
                elems = isValid(!isHorizontalElem, startX + i * WIDTH_INTERVAL, startY, length, sourceElement)
                if (elems) break
            }
            if (!elems || elems.length !== length - 1) {
                console.log("cannot rotate")
                return
            }

            // console.log("got some valid elements to swap out:")
            // consoleLogElements(elems)
            const elemToAppendLongObject = rotatePos < elems.length ? elems[rotatePos] : elems[rotatePos - 1]
            // console.log("trying to use", elemToAppendLongObject)

            // const possibleElems = crawlElementWithOffset(sourceElement, length, 0, !isHorizontalElem)

            // console.log("WHATS WRONG:", sourceElement, length, isHorizontal, 0)
            const possibleElems = crawlNextGoodElem(sourceElement, length, isHorizontalElem, 0)
            possibleElems.splice(rotatePos, 1) //dont need to insert at the point you are rotating

            // console.log("inserting here")
            // consoleLogElements(possibleElems)

            sourceElement.classList.toggle('horizontal')
            sourceElement.classList.toggle('vertical')

            sourceElement.classList.add(newRotatePos[0])
            sourceElement.classList.remove(newRotatePos[1])

            let clonedSource = sourceElement.cloneNode(true)
            addListeners(clonedSource)
            elemToAppendLongObject.insertAdjacentElement('beforebegin', clonedSource)


            for (let i = 0; i < elems.length; i++) {
                let clonedElem = elems[i].cloneNode(true)
                addListeners(clonedElem)
                if (possibleElems[i] === container) {
                    possibleElems[i].insertAdjacentElement('afterbegin', clonedElem)
                } else {
                    possibleElems[i].insertAdjacentElement('afterend', clonedElem)
                }
            }
            sourceElement.remove()
            elems.forEach(i => i.remove())

            //flip this to horizontal
        }
        longObjectListeners()


    }

    const longObjectListeners = () => {

        let longObjects = document.querySelectorAll(".vertical, .horizontal")
        longObjects.forEach(i => {

            i.removeEventListener('click', rotateLongObject, false)
            i.addEventListener('click', rotateLongObject, false)
        })
    }

    addInventoryListeners()
    pipeRotateListeners()
    longObjectListeners()


};


initial()
drawGrid()
drawInventory()
let GRID_BOUNDS;
let HEIGHT_INTERVAL;
let WIDTH_INTERVAL;

const computeBounds = () => {
    GRID_BOUNDS = container.getBoundingClientRect()
    HEIGHT_INTERVAL = Math.ceil(GRID_BOUNDS.height / ROW_LENGTH);
    WIDTH_INTERVAL = Math.ceil(GRID_BOUNDS.width / COL_LENGTH);
}
computeBounds()
dragNdrop()


//reset everything
const reset = () => {
    INVENTORY = Object.assign(INVENTORY, original)

    initial()
    drawGrid()
    drawInventory()
    dragNdrop()
}
document.addEventListener("keydown", event => {
    if (event.code === "KeyR") {
        reset()
    }
})


let ro = new ResizeObserver(entries => {
    computeBounds()
});

// Observe one or multiple elements
ro.observe(document.body);



//instruction modal stuff

//addEventListener on mouse click for opening modal on clas btn-modal
document.addEventListener('click', function (e) {

    //check is the right element clicked
    if (!e.target.matches('.btn-modal')) return;
    else {

        //select right modal from id-data
        var modal = document.querySelectorAll('#' + e.target.dataset.id);
        Array.prototype.forEach.call(modal, function (el) {

            //add active class on modal
            el.classList.add('active');
        });
    }
});




const instructionModalString = `<h3 style="margin-bottom: 10px">
Oh no! Fires are blazing, and its up to you to put out the flames!
</h3>
<p>1. Drag your firefighting equipment into the grid</p>
<p>2. Click the items that you dragged in the grid to rotate them</p>
<p>
3. Drag items out of the grid to put them back in your inventory
</p>
<p>
4. Direct the water from the fire hydrant through the firetruck and
into the monitors to put out all the fires
</p>
<h3 style="margin-top: 10px">All the best!</h3>
<h4 style="margin-top: 10px">
Protip: Use the 'R' key to reset the board easily
</h4>
<p style="margin-top: 10px">
Note: Meant for Devices / Windows that can fit the entire grid onto
the screen.
</p>`
function genModal(id, title, bodyHtmlString){
    let html = ""
    html += `
    <div class="modal ${id}" id="${id}">
        <div class="m-container slide-from-bottom">
        <h2 class="m-title">${title}</h2>
        <p class="m-close close-${id}"></p>
        <div class="m-content">
            ${bodyHtmlString}
            <div class="m-footer">
            <button class="button resetButton close-${id}">
                Close
            </button>
            </div>
        </div>
        </div>
    </div>
    `
    const modalElem = htmlToElement(html)
    document.querySelector('body').insertAdjacentElement('afterbegin', modalElem)
    document.addEventListener('click', function (e) {
        if (!e.target.matches('.modal')) return;
        modalElem.classList.remove('active')
    });
    document.querySelectorAll(`.close-${id}`).forEach(i => i.addEventListener('click', () => {
        document.querySelector(id).classList.remove('active')
    }))

}

// genModal("instruction-modal", "INSTRUCTIONS", instructionModalString);



const instructionModal = document.querySelector('#instruction-modal')
const resultModal = document.querySelector('#result-modal')
document.querySelector("#instructionToggle").addEventListener('click', () => instructionModal.classList.add('active'))
//addEventListener on mouse click for closing modal on modal dark background

document.addEventListener('click', function (e) {

    //check is the right element clicked
    if (!e.target.matches('.modal')) return;
    instructionModal.classList.remove('active')
    resultModal.classList.remove('active')
});


//cheeky animation
if (!DEBUG) setTimeout(() => instructionModal.classList.add('active'), 400)


document.querySelectorAll('.close-instruction-modal').forEach(i => i.addEventListener('click', () => {
    document.querySelector("#instruction-modal").classList.remove('active')
}))
document.querySelectorAll('.close-result-modal').forEach(i => i.addEventListener('click', () => {
    document.querySelector("#result-modal").classList.remove('active')
}))


const print = (i) => console.log(i)


const types = {
    TRUCK: "🚒",
    HOSE5: ["5▬", "5▮"],
    HOSE4: ["4▬", "4▮"],
    HOSE3: ["3▬", "3▮"],
    HOSE2: ["2▬", "2▮"],
    HOSE1: "1▮",
    FIRE: "🔥",
    WALL: "📦",
    HYDRANT: "🧯",
    PIPE: ["RB", "LB", "LT", "RT"], // R = right, B = bottom so on, the sides that the pipe points to
    EMPTY: "0",
    MONITOR: ["🚰r", "🚰b", "🚰l", "🚰t"]
}

const getSymbol = (elem) => {
    let type = getType(elem)
    let length = 1
    let isHorizontal = false
    let symbol;
    if (type == HOSE1) {
        symbol = types[type]

    }
    else if (type.startsWith("HOSE")) {
        length = parseInt(type.charAt(type.length - 1))
        if (elem.classList.contains('horizontal')) {
            isHorizontal = true
            symbol = types[type][0]
        } else {
            symbol = types[type][1]
        }
    } else if (type === PIPE || type === MONITOR) {
        if (elem.classList.contains('r1')) symbol = types[type][0]
        else if (elem.classList.contains('r2')) symbol = types[type][1]
        else if (elem.classList.contains('r3')) symbol = types[type][2]
        else if (elem.classList.contains('r4')) symbol = types[type][3]
    } else if (type === TRUCK) {
        length = 3
        if (elem.classList.contains('horizontal')) {
            isHorizontal = true
        } else {
            isHorizontal = false
        }
        symbol = types[type]
    }
    else {
        symbol = types[type]
    }
    return { symbol, length, isHorizontal }
}

const encodeGrid = () => {
    arr = []
    for (let i = 0; i < 9; i++) {
        (row = []).length = 12;
        row.fill(false); //random placeholder
        arr.push(row)
    }
    elems = container.children
    console.log(elems.length)
    let currLength = 0;
    let elemIdx = 0
    while (elemIdx < elems.length) {
        let row = Math.floor(currLength / COL_LENGTH)
        let col = currLength % COL_LENGTH
        if (arr[row][col] !== false) {
            currLength++;
            continue
        }
        const { symbol, length, isHorizontal } = getSymbol(elems[elemIdx]) //return symbol + length + direction

        if (length > 1) {
            for (let j = 0; j < length; j++) {
                if (isHorizontal) {
                    arr[row][col + j] = symbol
                } else {
                    arr[row + j][col] = symbol
                }
            }
        } else {
            arr[row][col] = symbol
        }
        currLength++;
        elemIdx++;
    }
    arr.forEach(i => console.log(i))
    return arr
}

//submitting encoded data
const submitSolution = async () => {
    const arr = encodeGrid()
    let data = { grid: arr, time: Math.floor(new Date().getTime() / 1000) }
    console.log("sending:", data)
    let result = await fetch('/submit', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let title, message;
    try {
        result = await result.json()
        console.log("result:", result)
        title = result.Result
        message = result.Message
    } catch (e) {
        console.log(e)
        title = "Sorry, something went wrong!"
        message = "Please refresh and try again! Sorry for the inconvenience!"
    }
    resultModal.classList.add('active')
    document.querySelector("#result-status").textContent = title
    document.querySelector("#result-message").textContent = message

}


