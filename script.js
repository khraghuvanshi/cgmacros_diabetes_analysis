// Load data
d3.json("data.json").then(function(data) {
    
    // Set SVG dimensions
    const width = 800, height = 600;
    const svg = d3.select("svg");

    // Scale functions
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Carbs))
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Protein))
        .range([height - 50, 50]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Carbs))
        .attr("cy", d => yScale(d.Protein))
        .attr("r", 8)
        .attr("fill", d => color(d.subject))
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 12);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("r", 8);
        });

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));

});
