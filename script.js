// D3 Cluster Visualization with User Input

const width = 800, height = 500;
const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define cluster centers
const clusters = {
    "Healthy": { x: 200, y: height / 2, color: "green" },
    "Pre-diabetic": { x: 400, y: height / 2, color: "orange" },
    "Diabetic": { x: 600, y: height / 2, color: "red" }
};

let nodes = [];

// Load data.json
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        nodes = data.map(d => ({
            ...d,
            category: getCategory(d["Insulin "]),
            x: width / 2,
            y: height / 2,
            color: clusters[getCategory(d["Insulin "])].color
        }));
        startSimulation();
    });

// Function to determine category
function getCategory(insulin) {
    if (insulin <= 10) return "Healthy";
    if (insulin <= 25) return "Pre-diabetic";
    return "Diabetic";
}

// Force simulation
function startSimulation() {
    const simulation = d3.forceSimulation(nodes)
        .force("x", d3.forceX(d => clusters[d.category].x).strength(0.2))
        .force("y", d3.forceY(d => clusters[d.category].y).strength(0.2))
        .force("collide", d3.forceCollide(15))
        .on("tick", ticked);

    const circles = svg.selectAll("circle").data(nodes).enter().append("circle")
        .attr("r", 10)
        .attr("fill", d => d.color)
        .on("mouseover", function (event, d) {
            d3.select("#tooltip").style("visibility", "visible")
                .text(`Carbs: ${d.Carbs}, Protein: ${d.Protein}, Fat: ${d.Fat}, Fiber: ${d.Fiber}, Insulin: ${d["Insulin "]}`)
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => d3.select("#tooltip").style("visibility", "hidden"));

    function ticked() {
        circles.attr("cx", d => d.x).attr("cy", d => d.y);
    }
}

// Handle user input
function addUserData() {
    const carbs = +document.getElementById("carbs").value;
    const protein = +document.getElementById("protein").value;
    const fat = +document.getElementById("fat").value;
    const fiber = +document.getElementById("fiber").value;
    
    const predictedInsulin = (carbs * 0.1) + (protein * 0.05) + (fat * 0.03) - (fiber * 0.02) + 5; // Example model
    const category = getCategory(predictedInsulin);
    
    const newNode = {
        Carbs: carbs,
        Protein: protein,
        Fat: fat,
        Fiber: fiber,
        "Insulin ": predictedInsulin,
        category: category,
        x: width / 2,
        y: height / 2,
        color: "blue"
    };
    nodes.push(newNode);

    const circle = svg.append("circle")
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .transition()
        .duration(1000)
        .attr("cx", clusters[category].x)
        .attr("cy", clusters[category].y);

    // Show category label next to new point
    svg.append("text")
        .attr("x", clusters[category].x + 15)
        .attr("y", clusters[category].y)
        .attr("fill", "black")
        .text(category);
}
