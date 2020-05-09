//Set up selector to create dashboard controller
const select = d3.select("select");

//Read is json data
const samples = d3.json("data/samples.json").then(function(data) {
    names = data.names;
    names.forEach(name => select.append("option").text(name));
});