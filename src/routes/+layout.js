// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

import * as d3 from 'd3';
import * as topojson from 'topojson';

// renames countries to make sure names are consistent for mapping
function rename(){return(
    new Map([
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
      ["Viet Nam", "Vietnam"]
    ])
    )}



// Check if running in a browser environment
if (typeof document !== 'undefined') {
    // creates SVG with specified characteristics 
    const width = 1000;
    const marginTop = 46;
    const height = width / 2 + marginTop;
  
    const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    // creates base map
    const projection = d3.geoEqualEarth();
    const path = d3.geoPath(projection);

    // creates map border
    svg.append("path")
        .datum({type: "Sphere"})
        .attr("fill", "white")
        .attr("stroke", "currentColor")
        .attr("d", path);

    const g = svg.append('g');

    // reads in the WHO tobacco dataset
    d3.csv('src/routes/tobacco_trends.csv').then(tobacco => {
        // this is probably where the filters can be changed based on user input, currently arbitrary placeholders
        tobacco = tobacco.filter(entry => (entry.Dim1ValueCode == "SEX_BTSX") && (entry.Period == 2007));
        console.log(tobacco)

        const valuemap = new Map(tobacco.map(d => [d.Location, +d.FactValueNumeric]));
        const color = d3.scaleSequential(d3.extent(valuemap.values()), d3.interpolateYlGnBu);
        console.log(valuemap)

        // reads in the topojson data
        d3.json('src/routes/world.json').then(topojsonData => {
            const countries = topojson.feature(topojsonData, topojsonData.objects.countries);
            const countrymesh = topojson.mesh(topojsonData, topojsonData.objects.countries, (a,b) => a !== b)
            
            // assigns colors to countries based on FactValueNumeric data
            g.selectAll("path")
                .data(countries.features)
                .join("path")
                    .attr("fill", d => color(valuemap.get(d.properties.name)))
                    .attr("d", path)
                // creates basic tooltip, should be pretty customizable
                .append("title")
                    .text(d => `${d.properties.name}\n${valuemap.get(d.properties.name)}`);
            
            // adds a white border between countries for *aesthetics*
            svg.append("path")
                .datum(countrymesh)
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("d", path);
            });
    });
  }


