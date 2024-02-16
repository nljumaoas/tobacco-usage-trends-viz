// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

import * as d3 from 'd3';
import * as topojson from 'topojson';

const width = 928;
const marginTop = 46;
const height = width / 2 + marginTop;

if (typeof window !== 'undefined') {
    // Code that depends on the DOM, like D3's select method
    const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

    const projection = d3.geoEqualEarth().fitExtent([[2, marginTop + 2], [width - 2, height]], {type: "Sphere"});
    const path = d3.geoPath()

    const g = svg.append('g');

    d3.json('world.json').then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'country').attr(d, path)
    });
}
