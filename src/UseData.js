import { useState, useEffect } from "react";
import {csv} from 'd3';

export const useData = () => {
    const [data, setData] = useState(null);
    const csvURL = 'https://gist.githubusercontent.com/R4d104ct1v1ty/3486bf06a199b9188e4a1cccaa55b513/raw/e641f5771c84e18f4e36a1cdb0394d3587243207/ship_data.csv';
  
    useEffect(() => {
      // fetchText(csvURL).then(text => {
      //   // setData(d3.csvParse(text));
      //   console.log(d3.csvParse(text));
      
      // })
      const row = d => {
        d.lat = +d.lat;
        d.mmsi = +d.mmsi;
        d.lon = +d.lon;
        d.roc = +d.roc;
        d.cpa = +d.cpa;
        d.tcpa = +d.tcpa;
        d.speed = +d.speed;
        d.course = +d.course;
        d.heading = +d.heading;
        return d;
      }
      
      csv(csvURL).then(data => {
        const arr = [];
        for(let i = 0; i < data.length; i++){
          let isUnique = true;
          for(let j = 0; j < arr.length; j++){
            if(arr[j].mmsi === data[i].mmsi){
              isUnique = false;
              break;
            }else{
              continue;
            }
          }
          if(isUnique){
            arr.push(data[i]);
          }
        }
        setData(arr);
      })
    }, []);
    return data;
  }