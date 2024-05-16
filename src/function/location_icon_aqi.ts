import axios from 'axios';

import L from 'leaflet';

/*
* คำนวณขนาดของแผนที่ เพื่อใช้ในการดึงข้อมูล airiq
* @param e แผนที่
* @param zoom ขนาด zoom
*/
export function calculate_MAPforAirQ_working(e:any, zoom:number){
  const bounds = e.getPixelBounds(e.getCenter(), zoom);
  const sw = e.unproject(bounds.getBottomLeft(), zoom);
  const ne = e.unproject(bounds.getTopRight(), zoom);

  return L.latLngBounds(sw, ne);
}

/*
* สีของ aqi ตามมาตรฐาน US
* @param aqi ค่า aqi
* @return สีของ aqi
*/
export function color_aqi_us(aqi:number){
    if(aqi <= 50){
        return '#65ED65';
    }else if(aqi <= 100){
        return '#F1F153';
    }else if(aqi <= 150){
        return '#FF9C3C';
    }else if(aqi <= 200){
        return '#FF4C4C';
    }else if(aqi <= 300){
        return '#AB59B4';
    }else if(aqi > 300){
        return '#7E0023';
    }else{
        return '#FFFFFF';
    }

}

export async function Location_icon_aqi(e:any) {

    console.log("mapCenter", e.getCenter());
      console.log("map zoom", e.getZoom());
  
      let zoom_level = e.getZoom();
  
      //ปัดเศษของ lat lng ที่ได้จากการเลื่อนแผนที่ bound เก็บไว้ใน bbox เนื่องจาก airiq ใช้ข้อมูลแบบนี้
      let bbox;
      if(zoom_level > 12){
        
        let ZoomLevel12Bounds:any = calculate_MAPforAirQ_working(e,12);
        console.log("zoom 12",ZoomLevel12Bounds);
        bbox = {
          S: parseFloat(ZoomLevel12Bounds['_southWest']['lng'].toFixed(2)), 
          S1: parseFloat(ZoomLevel12Bounds['_southWest']['lat'].toFixed(2)),
          N: parseFloat(ZoomLevel12Bounds['_northEast']['lng'].toFixed(2)),
          N1: parseFloat(ZoomLevel12Bounds['_northEast']['lat'].toFixed(2))
        };
      }else{
        bbox = {
          S: parseFloat(e.getBounds()['_southWest']['lng'].toFixed(2)), 
          S1: parseFloat(e.getBounds()['_southWest']['lat'].toFixed(2)),
          N: parseFloat(e.getBounds()['_northEast']['lng'].toFixed(2)),
          N1: parseFloat(e.getBounds()['_northEast']['lat'].toFixed(2))
        };
      }
  
      if(zoom_level > 12)  zoom_level = 12;
      console.log('final',bbox);
    
  
      //ดึงข้อมูล airiq จาก api
      try {
  
        const airiq:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/air_quality/iqair_map?bbox=${bbox["S"]},${bbox["S1"]},${bbox["N"]},${bbox["N1"]}&zoomLevel=${zoom_level}` ,{
          headers:{ Authorization: `Bearer ${localStorage.getItem('token_session')}` }
        });
  
        if(airiq.status === 200){
          return airiq.data
        }
  
      }
      catch (error:any) {
  
        console.log(error);
        if(error.response.status === 401){
          window.location.reload();
        }else if(error.response.status === 500){
          return null;
        }
  
      }
  }