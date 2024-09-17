import React,{ useState, useEffect, useLayoutEffect } from 'react';

import L from "leaflet";
import { Marker, useMapEvents, useMap} from 'react-leaflet'

import { Location_icon_aqi , color_aqi_us } from '../../../function/location_icon_aqi';
import { chunkDustboy , cacheDustboyData } from '../../../function/weather/airqualityCMU';
//import getAirqualityData from '../../../function/weather/airqualityCMU';

export default function AirqualityIcon({use_aqi, openModal}) {

    //console.log("map", await location_icon(map));
    const [data, setData] = useState<any>([]);
  
    async function get_markers(e){
      if(e.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)){
        const maker_location = await Location_icon_aqi(e);
        //console.log("abc", maker_location)
  
        //กันกรณีดึงข้อมูลไม่ทัน เกินปัญหาจาก API ที่ไปดึงไม่ทัน
        if(maker_location && maker_location.markers){
          
          setData(maker_location.markers); 
        }
      }
    }

    async function get_markersDustBoy(e){
      //console.time("DustboyTimer");
      const bounds = e.getBounds();
      const chunk = await chunkDustboy(bounds);
      const maker_location = await cacheDustboyData(chunk);

      const list_marker :any[] = [];
      maker_location.map((item:any) => {
        if(bounds.contains([item.dustboy_lat,item.dustboy_lon])){
          list_marker.push(item);
        }
      });
      //console.time("DustboyTimer");
      //console.log("list_marker_dustboy", list_marker);
      if(list_marker.length > 0){
        setData(list_marker);
        //console.log("length_marker_chunk", chunk);
        //console.log("length_marker_chuck", maker_location.length);
      }
    }
  
  
    useMapEvents({
      dragend: async (e) => {
        //เช็คว่า zoom เยอะหน่อยไม่งั้น lag
        if(e.target.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)){
          //get_markers(e.target)
          //console.log("test chunk", chunkDustboy(e.target.getBounds()))
          get_markersDustBoy(e.target)
        }
      },  
      zoom: async (e) => {
        //เช็คว่า zoom เยอะหน่อยไม่งั้น lag
        if(e.target.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)){
          //get_markers(e.target)
          //console.log("test chunk", chunkDustboy(e.target.getBounds()))
          get_markersDustBoy(e.target)
        }
      }
    });
  
    //เช็คว่า load ครั้งแรกไหม
    const [firstLoading, setStatusLoading] = useState<boolean>(true);
  
    useLayoutEffect(() => {
      if (firstLoading) {
        setStatusLoading(false);
        return;
      }
  
      //console.log("componentDidUpdateFunction");
    });
  
  
    const map = useMap();
    const get_first_data = async () => {
      if(firstLoading === false){
        //get_markers(map)
        get_markersDustBoy(map)
      }else{
        //console.log("first loading");
        //get_markers(map);
        get_markersDustBoy(map)
      }
    }
    
    useEffect(() => {
      get_first_data();
    }, [use_aqi]);
  
    //marker icon 
    const svgIcon = (aqi) => L.divIcon({
      html: `
      <svg
          width="30"
          height="30"
          fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
       <circle r="15" cx="15" cy="15" fill="${color_aqi_us(aqi)}" opacity="1" />
       <text x='50%' y='53%' fill="#FFFFFF" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="0.9rem">${aqi}</text>
    </svg>`,
      className: "svg-icon",
      iconSize: [24, 24],
    });
  
    return (
      // Make sure you're returning JSX here
      <>
      {use_aqi && (map.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)) ? data.map((marker: any, index: number) => (
          <Marker
          key={index}
          position={[marker.dustboy_lat, marker.dustboy_lon]}
          icon={svgIcon(marker.us_aqi)}
          eventHandlers={{
            click: () => {
              openModal(marker);
            },
            mousedown: () => {
              openModal(marker);
            },
          }}
        >
          {/* You can add a popup to the marker */}
        </Marker>
        )) : null }
      </>
    );
}