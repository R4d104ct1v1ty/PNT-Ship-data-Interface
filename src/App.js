import {scaleLinear,extent, select, path, min, max, pointRadial} from 'd3';
import {useState} from 'react';
import {useData} from './UseData';


const width = 800;
const height = 600;  
const margin = {top: 20, right: 50, bottom: 20, left: 100};
const fetchText = async (url) => {
  const response = await fetch(url);
  return await response.text();
}
const xValue = d => d.lon;
const yValue = d => d.lat;
const myLat = 18.937947;
const myLon =  72.844555;
const myAngle = 79.9;



function App() {
  const data = useData();
  const [mapData, setMapData] = useState(null);
  const mapUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'
  const [sortColumn, setSortColumn] = useState("ROC");
  const [shipMmsi, setShipMmsi] = useState(0);
  const [riskiest, setRiskiest] = useState(0);
  const [rotateAngle, setRotateAngle] = useState(79.9);
  const [rotateAngle2, setRotateAngle2] = useState(79.9);
  const [inpState1, setInpState1] = useState('off');
  const [inpState2, setInpState2] = useState('off');
  const [inpState3, setInpState3] = useState('off');
  const [inpState4, setInpState4] = useState('off');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radius1, setRadius1] = useState(40);
  const [radius2, setRadius2] = useState(80);
  const [radius3, setRadius3] = useState(120);
  // const [minx, setMinx] = useState(myLon-0.012);
  // const [miny, setMiny] = useState(myLat-0.014);
  // const [maxy, setMaxy] = useState(myLat+0.014);
  // const [maxx, setMaxx] = useState(myLon+0.012);

  
  if(!data){
    return <pre>Loading...</pre>
  }
  
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;


  // setMinx(min(data, xValue));
  // setMaxx(max(data, xValue));
  // setMiny(min(data, yValue));
  // setMaxy(max(data, yValue));
  const yScale = scaleLinear()
    .domain([myLat-(0.014/zoomLevel), myLat+(0.014/zoomLevel)])
    .range([0, innerHeight])
    .nice();

  const xScale = scaleLinear()
    .domain([myLon-(0.012/zoomLevel), myLon+(0.012/zoomLevel)])
    .range([0, innerWidth])
    .nice();

  const columnChange = () => {
    const riskFactor = document.getElementById('riskFactorSelect');
    setSortColumn(riskFactor.value);
    if(riskFactor.value === "ROC"){
      data.sort((a, b)=> b.roc - a.roc);
      setRiskiest(data[0].mmsi)
    }else{
      if(riskFactor.value === 'TCPA'){
        data.sort((a,b) => a.tcpa - b.tcpa);
        setRiskiest(data[0].mmsi)
      }else{
        data.sort((a,b) => a.cpa - b.cpa);
        setRiskiest(data[0].mmsi)
      }
    }
  }

  const rotateShip1 = () => {
    const inp = document.getElementById('-60');
    if(inp.value == 'off'){
      setRotateAngle(rotateAngle2-60);
      setRotateAngle2(rotateAngle-60);
      setInpState1('on');
    }else{
      setRotateAngle(rotateAngle2+60);
      setRotateAngle2(rotateAngle+60);
      setInpState1('off');
    } 
  }

  const rotateShip2 = () => {
    const inp = document.getElementById('-30');
    if(inp.value == 'off'){
      setRotateAngle(rotateAngle2-30);
      setRotateAngle2(rotateAngle-30);
      setInpState2('on');
    }else{
      setRotateAngle(rotateAngle2+30);
      setRotateAngle2(rotateAngle+30);
      setInpState2('off');
    } 
  }

  const rotateShip3 = () => {
    const inp = document.getElementById('+30');
    if(inp.value == 'off'){
      setRotateAngle(rotateAngle2+30);
      setRotateAngle2(rotateAngle+30);
      setInpState3('on');
    }else{
      setRotateAngle(rotateAngle2-30);
      setRotateAngle2(rotateAngle-30);
      setInpState3('off');
    } 
  }

  const rotateShip4 = () => {
    const inp = document.getElementById('+60');
    if(inp.value == 'off'){
      setRotateAngle(rotateAngle2+60);
      setRotateAngle2(rotateAngle+60);
      setInpState4('on');
    }else{
      setRotateAngle(rotateAngle2-60);
      setRotateAngle2(rotateAngle-60);
      setInpState4('off');
    } 
  }

  const mouseover = (e, mmsi) => {
    setShipMmsi(mmsi);
  }
  
  const mouseout = () => {
    setShipMmsi(0);
  }

  const zoomIn = () => {
    if(zoomLevel != 4){
      setZoomLevel(zoomLevel+1);
    }
  }

  const zoomOut = () => {
    if(zoomLevel != 1){
      setZoomLevel(zoomLevel-1);
    }
  }

  const handleRad1 = () => {
    const inp = document.getElementById('rad1');
    setRadius1(inp.value);
  }

  const handleRad2 = () => {
    const inp = document.getElementById('rad2');
    setRadius2(inp.value);
  }

  const handleRad3 = () => {
    const inp = document.getElementById('rad3');
    setRadius3(inp.value);
  }

  const handleAngle = ()=> {
    const inp = document.getElementById('angleinput');
    setRotateAngle(myAngle+parseInt(inp.value));
    setRotateAngle2(myAngle+parseInt(inp.value));
  }

  return (
    <div className="graph">
      <div>
      <div className='zoom' style={{marginLeft: "150px"}}>
          <button className='zoom-button' style={{fontSize: "20px"}} onClick={zoomIn}>+</button>
          <span style={{marginLeft: "5px", marginRight: "5px"}}>Zoom</span>
          <button className='zoom-button' style={{fontSize: "20px"}} onClick={zoomOut}>-</button>
        </div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`} style={{backgroundColor: 'green'}} >
          <svg></svg>
          {xScale.ticks().map(tickValue => (
            <g transform={`translate(${xScale(tickValue)},0)`} style={{backgroundColor: 'green'}} className='tick'>
              {/* <line  y2={innerHeight} /> */}
              <text y={innerHeight+5} dy=".71em" style={{textAnchor: 'middle', fontSize: "12px"}}>{tickValue}</text>
            </g>
          ))}
          {yScale.ticks().map(tickValue => (
            <g transform={`translate(0,${yScale(tickValue)})`} className='tick'> 
              {/* <line x2={innerWidth} /> */}
              <text style={{textAnchor: 'end', fontSize: '12px'}} dy="0.1em" x={-5}>{tickValue}</text>
            </g>
          ))}
          {data.map(d => (
            <g>
              
              <text className='grptext' x={pointRadial(Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)} y={pointRadial(Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?30:''}</text>
              <text className='grptext' x={pointRadial(Math.PI/3, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)} y={pointRadial(Math.PI/3, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?60:''}</text>
              <text className='grptext' x={pointRadial(Math.PI/2, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)} y={pointRadial(Math.PI/2, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?90:''}</text>
              <text className='grptext' x={pointRadial(2*Math.PI/3, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)} y={pointRadial(2*Math.PI/3, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?120:''}</text>
              <text className='grptext' x={pointRadial(5*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)+3} y={pointRadial(5*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?150:''}</text>
              <text className='grptext' x={pointRadial(Math.PI, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-7} y={pointRadial(Math.PI, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+10}>{d.mmsi==28?180:''}</text>
              <text className='grptext' x={pointRadial(7*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-19} y={pointRadial(7*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?210:''}</text>
              <text className='grptext' x={pointRadial(8*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-17} y={pointRadial(8*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?240:''}</text>
              <text className='grptext' x={pointRadial(9*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-17} y={pointRadial(9*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?270:''}</text>
              <text className='grptext' x={pointRadial(10*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-16} y={pointRadial(10*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?300:''}</text>
              <text className='grptext' x={pointRadial(11*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-14} y={pointRadial(11*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)+3}>{d.mmsi==28?330:''}</text>
              <text className='grptext' x={pointRadial(12*Math.PI/6, radius3)[0]+(d.mmsi==28?xScale(xValue(d)):0)-4} y={pointRadial(12*Math.PI/6, radius3)[1]+(d.mmsi==28?yScale(yValue(d)):0)}>{d.mmsi==28?0:''}</text>
              <circle cx={d.mmsi==28?xScale(xValue(d)):0} cy={d.mmsi==28?yScale(yValue(d)):0} r={d.mmsi==28?radius3:0} style={{fill: "red", opacity: 0.25}}></circle>
              <circle cx={d.mmsi==28?xScale(xValue(d)):0} cy={d.mmsi==28?yScale(yValue(d)):0} r={d.mmsi==28?radius2:0} style={{fill: "blue", opacity: 0.25}}></circle>
              <circle cx={d.mmsi==28?xScale(xValue(d)):0} cy={d.mmsi==28?yScale(yValue(d)):0} r={d.mmsi==28?radius1:0} style={{fill: "green", opacity: 0.25}}></circle>
              <polygon points={`${xScale(xValue(d))},${yScale(yValue(d))-15} ${xScale(xValue(d))+8},${yScale(yValue(d))+10} ${xScale(xValue(d))-8},${yScale(yValue(d))+10}`} style={{fill: `${riskiest==d.mmsi? "red" :data[1].mmsi==d.mmsi?"orange":data[2].mmsi==d.mmsi?"yellow": "black"}`, stroke: `${riskiest==d.mmsi? "red" :data[1].mmsi==d.mmsi?"orange": "black"}`}} onMouseOver={(e) => mouseover(e, d.mmsi)} onMouseOut={mouseout} transform={`rotate(${d.mmsi == 28? rotateAngle :d.course}, ${xScale(xValue(d))},${yScale(yValue(d))})`}>{data[0].mmsi==d.mmsi || data[1].mmsi== d.mmsi || data[2].mmsi == d.mmsi ? <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />:<></>}<title>{`(${d.lat}, ${d.lon})\n mmsi: ${d.mmsi}  roc: ${d.roc}  cpa:${d.cpa}  tcpa: ${d.tcpa}  course: ${d.course}  heading: ${d.heading}`}</title></polygon>
            
            </g>
            
            )
              
            )
          }
          
        </g>
      
      </svg>
      </div>
      
      <div>
        <div>
          <label htmlFor="riskFactorSelect">Sort By:</label>
          <select name="" id="riskFactorSelect" onChange={columnChange} style={{marginBottom: "5px", marginLeft: "5px"}}>
            <option value="ROC">ROC</option>
            <option value="TCPA">TCPA</option>
            <option value="CPA">CPA</option>
          </select>
        </div>
        <div id="tableContainer" style={{marginBottom: "20px"}}>
          <table>
            <tr>
              <th>MMSI</th>
              <th>Lat</th>
              <th>Lon</th>
              <th>Course</th>
              <th>heading</th>
              <th>Speed</th>
              <th>{sortColumn}</th>
            </tr>
            {data.map(d => (<tr style={{border: `${d.mmsi==shipMmsi? "5px solid black": "1px solid black"}`}}><td>{d.mmsi}</td><td>{d.lat}</td><td>{d.lon}</td><td>{d.course}</td><td>{d.heading}</td><td>{d.speed}</td><td>{d[sortColumn.toLowerCase()]}</td></tr>))}
          </table>
        </div>
        <div className='toggle-buttons' style={{display: "flex"}}>
          <div style={{display: "flex", flexDirection: "column", margin: "15px"}}>
            <label className="switch">
              <input type="checkbox" id="-60" value={inpState1} onChange={rotateShip1}/>
              <span className="slider round"></span>
            </label>
            <span>-60</span>
          </div>
          <div style={{display: "flex", flexDirection: "column", margin: "15px"}}>
            <label className="switch">
              <input type="checkbox" id="-30" value={inpState2} onChange={rotateShip2}/>
              <span className="slider round"></span>
            </label>
            <span>-30</span>
          </div>
          <div style={{display: "flex", flexDirection: "column", margin: "15px"}}>
            <label className="switch">
              <input type="checkbox" id="+30" value={inpState3} onChange={rotateShip3}/>
              <span className="slider round"></span>
            </label>
            <span>+30</span>
          </div>
          <div style={{display: "flex", flexDirection: "column", margin: "15px"}}>
            <label className="switch">
              <input type="checkbox" id="+60" value={inpState4} onChange={rotateShip4}/>
              <span className="slider round"></span>
            </label>
            <span>+60</span>
          </div>
        </div>
        <div className='radii-controllers'>
          <span>rad1:</span>
          <input type="number" id="rad1" min={0} max={80} style={{margin: "10px"}} onChange={handleRad1}/>
          <span>rad2:</span>
          <input type="number" id="rad2" min={80} max={120} style={{margin: "10px"}} onChange={handleRad2}/>
          <span>rad3:</span>
          <input type="number" id="rad3" min={120} style={{margin: "10px"}} onChange={handleRad3}/>
        </div>
        <div className='angleController'>
            <span>Rotate ship: </span>
            <input type="number" id='angleinput'/>
            <button onClick={handleAngle} style={{margin: "5px"}}>Submit</button>
        </div>
        
      </div>
      

    </div>
    
      
  );
}

export default App;
