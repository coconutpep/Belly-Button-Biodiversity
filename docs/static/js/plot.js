//Set up selector to create dashboard controller
const select = d3.select("select");

//Read is json data
const samples = d3.json("data/samples.json").then(function(data) {
    //Create callable objects & arrays out of the json file
    const names = data.names;
    const meta = data.metadata;
    const samples = data.samples;
    //Use name array to create patient selector
    names.forEach(name => select.append("option").text(name));
    //Use switch to create dashboard plots
    //Set traces for initial plot
    //Trace for Bar plot
    let traceBar = {
        //Reverse arrays to but largest bars at the top
        x: samples[0].sample_values.reverse(),
        y: samples[0].otu_ids.map(id => `OTU ${id}`).reverse(),
        type: "bar",
        text: samples[0].otu_labels,
        orientation: "h",
        //Set bar outline for greater readability
        marker: {
            line: {
                color: "black",
                width: 1
            }
        }
    };
    //Set trace for Bubble plot
    let traceBubble = {
        x: samples[0].otu_ids,
        y: samples[0].sample_values,
        mode: "markers",
        text: samples[0].otu_labels,
        marker: {
            size: samples[0].sample_values,
            color: samples[0].otu_ids,
            line: {
                color: "black",
                width: 1
            }
        }
    };
    //Append information to Demographic Card
    //Select Card body
    const card = d3.select(".card-body");
    console.log(meta[0]);
    Object.entries(meta[0]).forEach(([key, value]) => card.append("p").attr("class", "card-text").text(`${key}: ${value}`));
    //Set seperate datas for easier plot placement
    let dataBar = [traceBar];
    let dataBubble = [traceBubble];
    //Set layout for charts all can use same layout
    let layout = {
        title : "Bacteria Levels by Species",
        xaxis: {gridcolor: "black"},
        yaxis: {gridcolor: "black"},
        //Set plot's bacground to transparent
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
    };
    //Create initial plots
    Plotly.newPlot("plot1", dataBar, layout);
    Plotly.newPlot("plot2", dataBubble, layout);
    //Switch function for dynamic plot control
    switch(name) {
        //Let first patient be default
        default:
            traceBar = {
                x: samples[0].sample_values.reverse(),
                y: samples[0].otu_ids.map(id => `OTU ${id}`).reverse(),
                type: "bar",
                text: samples[0].otu_labels,
                orientation: "h",
                marker: {
                    line: {
                        color: "black",
                        width: 1
                    }
                }
            };
            traceBubble = {
                x: samples[0].otu_ids,
                y: samples[0].sample_values,
                mode: "markers",
                text: samples[0].otu_labels,
                marker: {
                    size: samples[0].sample_values,
                    color: samples[0].otu_ids
                }
            };
}
});