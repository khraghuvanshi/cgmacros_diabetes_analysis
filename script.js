const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// Load the dataset
d3.json("data.json").then(data => {
    // Scale functions
    const xScale = d3.scaleLinear().domain([0, 150]).range([50, width - 50]);
    const yScale = d3.scaleLinear().domain([0, 50]).range([height - 50, 50]);

    // Color scale for clusters
    const colorScale = d3.scaleThreshold()
        .domain([10, 25]) // Pre-diabetic, Diabetic
        .range(["green", "orange", "red"]); // Healthy, Pre-diabetic, Diabetic

    // Draw initial circles
    let circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.carbs))
        .attr("cy", d => yScale(d.fat))
        .attr("r", 8)
        .attr("fill", d => colorScale(d.insulin))
        .style("opacity", 0.8);

    // Function to add user input data
    window.addUserData = function () {
        let carbs = +document.getElementById("carbs").value;
        let protein = +document.getElementById("protein").value;
        let fat = +document.getElementById("fat").value;
        let fiber = +document.getElementById("fiber").value;

        // Compute insulin prediction (Example formula, adjust for real data)
        let insulinLevel = (carbs * 0.2) + (protein * 0.1) + (fat * 0.15) - (fiber * 0.05);

        let classification = "Healthy";
        if (insulinLevel > 25) classification = "Diabetic";
        else if (insulinLevel > 10) classification = "Pre-diabetic";

        // Add animated user data point
        let newCircle = svg.append("circle")
            .attr("cx", width / 2) // Start from center
            .attr("cy", height / 2)
            .attr("r", 12)
            .attr("fill", colorScale(insulinLevel))
            .style("opacity", 1);

        newCircle.transition()
            .duration(1000)
            .attr("cx", xScale(carbs))
            .attr("cy", yScale(fat))
            .attr("r", 8);

        alert(`You are classified as: ${classification} (Predicted Insulin: ${insulinLevel.toFixed(2)})`);
    };
});
