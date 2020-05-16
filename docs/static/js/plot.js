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
    //Set trace for Gauge plot
    let traceGauge = {
        type: "indicator",
        mode: "gauge",
        value: meta[0].wfreq,
        gauge: {
            bar: {
                color: "blue",
                line: {
                    color: "black",
                    width: 2
                }
            },
            shape: "angular",
            bordercolor: "black"
        },
        axis: {showticklabels: false,}
    };
    //Set gauge layout variables
    let degrees = 115;
    let radius = .6;
    const radians = degrees * Math.PI / 180;
    const x = -1 * radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    //Set gauge layout
    let layoutGauge = {
        title: "Belly Button Scrubs Per Week"
    };
    //Append information to Demographic Card
    //Select Card body
    const card = d3.select(".card-body");
    Object.entries(meta[0]).forEach(([key, value]) => card.append("p").attr("class", "card-text").attr("id", `${key}`).text(`${key}: ${value}`));
    //Set seperate datas for easier plot placement
    const dataBar = [traceBar];
    const dataBubble = [traceBubble];
    const dataGauge = [traceGauge];
    //Set layout for charts all can use same layout
    const layout = {
        title : "Bacteria Levels by Species",
        xaxis: {gridcolor: "black"},
        yaxis: {gridcolor: "black"},
        //Set plot's bacground to transparent
        paper_bgcolor: "rgb(176, 176, 206)",
        plot_bgcolor: "rgb(176, 176, 206)",
    };
    //Create initial plots
    Plotly.newPlot("plot1", dataBar, layout);
    Plotly.newPlot("plot2", dataBubble, layout);
    Plotly.newPlot("plot3", dataGauge, layoutGauge);

    //Function to update Dashboard based on patient selection
    function switchDashboard() {
        //Grab input value
        const input = select.property("value");
        //Grab the index value for the desired patient
        const index = names.findIndex(name => name == input);
        //Reset trace values for Bar plot
        let barx = samples[index].sample_values.reverse();
        let bary = samples[index].otu_ids.map(id => `OTU ${id}`).reverse();
        let bartext = samples[index].otu_labels;
        //Reset trace values for Bubble plot
        let bubblex = samples[index].otu_ids;
        let bubbley = samples[index].sample_values;
        let bubbletext = samples[index].otu_labels;
        let bubblesize =  samples[index].sample_values;
        let bubblecolor = samples[index].otu_ids;
        //Restyle Bar plot
        Plotly.restyle("plot1", "x", [barx]);
        Plotly.restyle("plot1", "y", [bary]);
        Plotly.restyle("plot1", "text", [bartext])
        //Restyle Bubble Plot
        Plotly.restyle("plot2", "x", [bubblex]);
        Plotly.restyle("plot2", "y", [bubbley]);
        Plotly.restyle("plot2", "text", [bubbletext]);
        Plotly.restyle("plot2", "marker.size", [bubblesize]);
        Plotly.restyle("plot2", "marker.color", [bubblecolor]);
        //Change Demograpic Card
        //Iterate through the patient meta object values and replace the card body text to new patient info
        Object.entries(meta[index]).forEach(([key, value]) => d3.select(`#${key}`).text(`${key}: ${value}`));
    }

    //Event handler
    select.on("change", switchDashboard);
});