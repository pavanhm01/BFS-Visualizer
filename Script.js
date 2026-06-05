const graph = document.getElementById("graph");
const svg = document.getElementById("edges");

const addNodeBtn = document.getElementById("addNode");
const connectBtn = document.getElementById("connectNodes");
const bfsBtn = document.getElementById("startBFS");
const resetBtn = document.getElementById("reset");

const nodeInput = document.getElementById("nodeName");

const visitedBox = document.getElementById("visited");
const queueBox = document.getElementById("queue");
const traversalBox = document.getElementById("traversal");
const statusBox = document.getElementById("status");

let nodes = {};
let edges = [];
let adjacency = {};

let selectedNode = null;

addNodeBtn.onclick = () => {

    const name = nodeInput.value.toUpperCase();

    if (!name) return;

    if (nodes[name]) {
        alert("Node already exists");
        return;
    }

    createNode(
        name,
        100 + Object.keys(nodes).length * 80,
        100
    );

    nodeInput.value = "";
};

function createNode(name, x, y) {

    const node = document.createElement("div");

    node.className = "node";
    node.innerText = name;

    node.style.left = x + "px";
    node.style.top = y + "px";

    graph.appendChild(node);

    nodes[name] = node;
    adjacency[name] = [];

    makeDraggable(node);

    node.onclick = () => {

        if (!connectMode) return;

        if (!selectedNode) {

            selectedNode = name;
            node.style.border = "4px solid yellow";

        } else {

            if (selectedNode !== name) {

                createEdge(selectedNode, name);

            }

            nodes[selectedNode].style.border = "none";
            selectedNode = null;
        }
    };
}

let connectMode = false;

connectBtn.onclick = () => {

    connectMode = !connectMode;

    if (connectMode) {

        statusBox.innerText =
            "Connection Mode ON";

    } else {

        statusBox.innerText =
            "Connection Mode OFF";
    }
};

function createEdge(a, b) {

    adjacency[a].push(b);
    adjacency[b].push(a);

    edges.push({
        from: a,
        to: b
    });

    drawEdges();
}

function drawEdges() {

    svg.innerHTML = "";

    edges.forEach(edge => {

        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];

        const x1 =
            parseInt(n1.style.left) + 30;

        const y1 =
            parseInt(n1.style.top) + 30;

        const x2 =
            parseInt(n2.style.left) + 30;

        const y2 =
            parseInt(n2.style.top) + 30;

        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

        line.setAttribute(
            "stroke",
            "#3b82f6"
        );

        line.setAttribute(
            "stroke-width",
            "4"
        );

        svg.appendChild(line);

        edge.element = line;
    });
}

function makeDraggable(node) {

    let offsetX;
    let offsetY;
    let dragging = false;

    node.addEventListener(
        "mousedown",
        e => {

            dragging = true;

            offsetX = e.offsetX;
            offsetY = e.offsetY;
        }
    );

    document.addEventListener(
        "mousemove",
        e => {

            if (!dragging) return;

            const rect =
                graph.getBoundingClientRect();

            node.style.left =
                e.clientX -
                rect.left -
                offsetX +
                "px";

            node.style.top =
                e.clientY -
                rect.top -
                offsetY +
                "px";

            drawEdges();
        }
    );

    document.addEventListener(
        "mouseup",
        () => {

            dragging = false;
        }
    );
}

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}

bfsBtn.onclick = async () => {

    const start =
        prompt("Enter Start Node");

    if (!nodes[start]) {
        alert("Node not found");
        return;
    }

    for (let n in nodes) {

        nodes[n].classList.remove(
            "visitedNode"
        );

        nodes[n].classList.remove(
            "activeNode"
        );
    }

    let visited = [];
    let queue = [start];
    let seen = new Set();

    seen.add(start);

    traversalBox.innerText = "";

    while (queue.length > 0) {

        queueBox.innerText =
            queue.join(" → ");

        const current =
            queue.shift();

        nodes[current].classList.add(
            "activeNode"
        );

        statusBox.innerText =
            "Visiting " + current;

        await sleep(1000);

        visited.push(current);

        visitedBox.innerText =
            visited.join(" → ");

        traversalBox.innerText =
            visited.join(" → ");

        nodes[current].classList.remove(
            "activeNode"
        );

        nodes[current].classList.add(
            "visitedNode"
        );

        for (let neighbour of adjacency[current]) {

            if (!seen.has(neighbour)) {

                statusBox.innerText =
                    "Moving " +
                    current +
                    " → " +
                    neighbour;

                seen.add(neighbour);

                queue.push(neighbour);

                highlightEdge(
                    current,
                    neighbour
                );

                await sleep(800);
            }
        }
    }

    statusBox.innerText =
        "BFS Completed";
};

function highlightEdge(a, b) {

    edges.forEach(edge => {

        if (
            (edge.from === a &&
                edge.to === b) ||
            (edge.from === b &&
                edge.to === a)
        ) {

            edge.element.setAttribute(
                "stroke",
                "yellow"
            );

            setTimeout(() => {

                edge.element.setAttribute(
                    "stroke",
                    "#3b82f6"
                );

            }, 700);
        }
    });
}

resetBtn.onclick = () => {

    location.reload();
};