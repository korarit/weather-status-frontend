import React, { useState, useEffect, useLayoutEffect } from 'react';
import L from "leaflet";
import { Marker, useMapEvents, useMap } from 'react-leaflet'
import { color_aqi_us } from '../../../function/location_icon_aqi';
import { chunkDustboy, cacheDustboyData } from '../../../function/weather/airqualityCMU';

export default function Air_quality_icon({ use_aqi, openModal }) {
    const [data, setData] = useState<any>([]);
    const [firstLoading, setStatusLoading] = useState<boolean>(true);
    
    async function get_markersDustBoy(e) {
      try {
        const bounds = e.getBounds();
    
        // ตรวจสอบว่า bounds ถูกต้องหรือไม่
        if (!bounds || !(bounds instanceof L.LatLngBounds)) {
          console.error("Invalid bounds object", bounds);
          return;
        }
    
        // ดึงข้อมูล chunk จาก bounds ที่ได้
        const chunk = await chunkDustboy(bounds);
    
        // ตรวจสอบว่า chunk เป็น array ที่ถูกต้อง
        if (!Array.isArray(chunk)) {
          console.error("chunkDustboy did not return an array", chunk);
          return;
        }
    
        const maker_location = await cacheDustboyData(chunk);
    
        // ตรวจสอบว่า maker_location เป็น array หรือไม่
        if (!Array.isArray(maker_location)) {
          console.error("maker_location is not an array", maker_location);
          return;
        }
    
        const list_marker: any[] = [];
    
        maker_location.forEach((item: any) => {
          if (item && item.dustboy_lat && item.dustboy_lon) {
            // ตรวจสอบว่า LatLng ของ marker อยู่ใน bounds หรือไม่
            const markerLatLng = new L.LatLng(item.dustboy_lat, item.dustboy_lon);
            if (bounds.contains(markerLatLng)) {
              list_marker.push(item);
            }
          }
        });
    
        if (list_marker.length > 0) {
          // อัปเดต state ด้วย marker ที่ได้
          setData(list_marker);
        } else {
          console.log("No valid markers found in the bounds.");
        }
      } catch (error) {
        console.error("Error in get_markersDustBoy:", error);
      }
    }
    
  
    useMapEvents({
      dragend: async (e) => {
        try {
          if(e.target.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)){
            get_markersDustBoy(e.target);
          }
        } catch (error) {
          console.error("Error in dragend event:", error);
        }
      },  
      zoom: async (e) => {
        try {
          if(e.target.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string)){
            get_markersDustBoy(e.target);
          }
        } catch (error) {
          console.error("Error in zoom event:", error);
        }
      }
    });
  
    useLayoutEffect(() => {
      if (firstLoading) {
        setStatusLoading(false);
        return;
      }
    });
  
    const map = useMap();
    
    const get_first_data = async () => {
        get_markersDustBoy(map);
    }
    
    useEffect(() => {
      get_first_data();
    }, [use_aqi]);
  
    // ใช้ฟังก์ชันสร้าง icon ที่ไม่ใช้ JSX
    const svgIcon = (aqi) => {
      const colorValue = color_aqi_us(aqi);
      return L.divIcon({
        html: `
          <svg width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle r="13" cx="13" cy="13" fill="${colorValue}" opacity="1"></circle>
            <text x="50%" y="50%" fill="#FFFFFF" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="1rem">${aqi}</text>
          </svg>
        `,
        className: "svg-icon",
        iconSize: [24, 24],
      });
    };
  
    return (
      <>
        {use_aqi && map.getZoom() >= parseInt(process.env.REACT_APP_ZOOM_MIN_AQI as string) ? 
          data.map((marker: any, index: number) =>  (
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
              />
            )
          ) 
        : null}
      </>
    );
}