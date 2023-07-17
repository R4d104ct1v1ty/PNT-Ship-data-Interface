import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './Overlay.css'; // Import the CSS file


const Overlay = () => {
const [radii, setRadii] = useState([50, 100, 150]);
const svgRef = useRef(null);


useEffect(() => {
drawOverlay();
}, [radii]);


const drawOverlay = () => {
const svg = d3.select(svgRef.current);


svg.selectAll('*').remove();


svg
.append('circle')
.attr('cx', 250)
.attr('cy', 250)
.attr('r', radii[0])
.attr('class', 'overlay-circle-inner');


svg
.append('circle')
.attr('cx', 250)
.attr('cy', 250)
.attr('r', radii[1])
.attr('class', 'overlay-circle-middle');


svg
.append('circle')
.attr('cx', 250)
.attr('cy', 250)
.attr('r', radii[2])
.attr('class', 'overlay-circle-outer');
};


const handleInputChange = (e, index) => {
const { value } = e.target;
const updatedRadii = [...radii];
updatedRadii[index] = +value;
setRadii(updatedRadii);
};


return (
<div className="overlay-container">
<svg width={500} height={500} ref={svgRef} />


<div className="input-container">
{radii.map((radius, index) => (
<input
key={index}
type="number"
value={radius}
onChange={(e) => handleInputChange(e, index)}
/>
))}
</div>
</div>
);
};


export default Overlay;
