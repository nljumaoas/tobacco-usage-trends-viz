<script>
    import * as d3 from "d3";
    import * as topojson from "topojson";
    import { onMount } from 'svelte';

    


    // renames countries to make sure names are consistent for mapping
    function rename() {
        return new Map([
            ["Antigua and Barbuda", "Antigua and Barb."],
            ["Bolivia (Plurinational State of)", "Bolivia"],
            ["Bosnia and Herzegovina", "Bosnia and Herz."],
            ["Brunei Darussalam", "Brunei"],
            ["Central African Republic", "Central African Rep."],
            ["Cook Islands", "Cook Is."],
            ["Democratic People's Republic of Korea", "North Korea"],
            ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
            ["Dominican Republic", "Dominican Rep."],
            ["Equatorial Guinea", "Eq. Guinea"],
            ["Iran (Islamic Republic of)", "Iran"],
            ["Lao People's Democratic Republic", "Laos"],
            ["Marshall Islands", "Marshall Is."],
            ["Micronesia (Federated States of)", "Micronesia"],
            ["Republic of Korea", "South Korea"],
            ["Republic of Moldova", "Moldova"],
            ["Russian Federation", "Russia"],
            ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
            ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
            ["Sao Tome and Principe", "São Tomé and Principe"],
            ["Solomon Islands", "Solomon Is."],
            ["South Sudan", "S. Sudan"],
            ["Swaziland", "eSwatini"],
            ["Syrian Arab Republic", "Syria"],
            ["The former Yugoslav Republic of Macedonia", "Macedonia"],
            ["United Republic of Tanzania", "Tanzania"],
            ["Venezuela (Bolivarian Republic of)", "Venezuela"],
            ["Viet Nam", "Vietnam"],
        ]);
    }

    // stores all data here
    //tobacco
    let tobacco = [];

    //topojson
    let countries = [];
    let countrymesh = [];

    onMount(async () => {
        // read in tobacco_trends
        const res1 = await fetch('tobacco_trends.csv'); 
        const csv = await res1.text();
        tobacco = d3.csvParse(csv, d3.autoType)
        console.log(tobacco);

        // read in topojson
        const res2 = await fetch('world.json');
        const data = await res2.json();
        countries = topojson.feature(
            data,
            data.objects.countries
        );
        countrymesh = topojson.mesh(
            data,
            data.objects.countries,
            (a, b) => a !== b
        ); 

        // creates SVG with specified characteristics
        const width = 1000;
        const marginTop = 46;
        const height = width / 2 + marginTop;

        const svg = d3
            .select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // creates base map
        const projection = d3.geoEqualEarth();
        const path = d3.geoPath(projection);

        // creates map border
        svg
            .append("path")
            .datum({ type: "Sphere" })
            .attr("fill", "white")
            .attr("stroke", "currentColor")
            .attr("d", path);

        const g = svg.append("g");

        function populate_color(dataset, sex, year){
            console.log(dataset);
            const filtered = dataset.filter(
            (entry) => entry.Dim1 == sex && entry.Period == year
            );
            console.log(filtered);

            const valuemap = new Map(
                filtered.map((d) => [d.Location, +d.FactValueNumeric])
            );
            const color = d3.scaleSequential(
                d3.extent(valuemap.values()),
                d3.interpolateYlGnBu
            );
            console.log(valuemap);

            // assigns colors to countries based on FactValueNumeric data
            g.selectAll("path")
                    .data(countries.features)
                    .join("path")
                    .attr("fill", (d) => color(valuemap.get(d.properties.name)))
                    .attr("d", path)
                    // creates basic tooltip, should be pretty customizable
                    .append("title")
                    .text(
                    (d) => `${d.properties.name}\n${valuemap.get(d.properties.name)}`
                    );

            // adds a white border between countries for *aesthetics*
            svg
                .append("path")
                .datum(countrymesh)
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);

            const legendWidth = 300, legendHeight = 20, legendMargin = {top: 10, right: 60, bottom: 40, left: 60};

            // Create a sequential color scale (if different, adjust as needed)
            const colorScale = d3.scaleSequential(d3.extent(tobacco.map(d => +d.FactValueNumeric)), d3.interpolateYlGnBu);

            // Define the legend scale
            const legendScale = d3.scaleLinear()
                .domain(d3.extent(tobacco.map(d => +d.FactValueNumeric)))
                .range([0, legendWidth]);

            // Append a legend group to the SVG
            const legend = svg.append("g")
                .attr("transform", `translate(${width - legendWidth - legendMargin.right},${height - legendMargin.bottom})`);

            // Append gradient bar for the legend
            const linearGradient = legend.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%");

            colorScale.ticks().forEach(function(tick, i, ticks) {
                linearGradient.append("stop")
                    .attr("offset", `${100 * i / ticks.length}%`)
                    .attr("stop-color", colorScale(tick));
            });

            // Append color bar
            legend.append("rect")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .style("fill", "url(#gradient)");

            // Append legend axis
            legend.append("g")
                .attr("transform", `translate(0, ${legendHeight})`)
                .call(d3.axisBottom(legendScale).ticks(6));

            // Append legend title
            legend.append("text")
                .attr("class", "legend-title")
                .attr("x", -240) // X coordinate of the legend title; adjust as needed
                .attr("y", -5) // Y coordinate of the legend title; adjust as needed
                .text("Estimate of Current Tobacco Use Prevalence in " + sex + "(%) (Age-standardized Rate)");
        };

        // FINALLY GUYS
        populate_color(tobacco, 'Female', 2007);

        
    });

</script>

<main>
    
</main>