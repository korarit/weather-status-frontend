

import React, { useState, useEffect, useLayoutEffect } from 'react';

// Leaflet
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// tpye from leaflet
import { LatLngTuple } from 'leaflet';

//rainviews
import RainView from '../../function/map_rainview';
//air quality
import AirqualityIcon from './map/AirQualityStation';
//firms
import MarkerFirms from './map/FirmsPoint';
//rain point
import RainTilePicker from './map/rainPoint';
//calculate bound
import {get_StationArea} from '../../function/weather/calculate'


import '../../css/components/map.css';

interface LatLonInterface{
  lat: number;
  lon: number;
}

interface OuterFunctionProps {
  Device: string;

  layername: string;
  mapsetting: any;

  set_location: Function;
  map_location: LatLonInterface | null;
  LocationType: string;

  OpenAirQualityModal: Function;

  zoom: any;
}

const canvasRenderer = L.canvas();

function MapComponent(props:OuterFunctionProps) {

  //เอา url ของ rainview มาใส่ในตัวแปร
  const [rainviews_url, setRainviews_url] = useState<string>("");
  const [rainview_nowcast, setRainview_nowcast] = useState<string>("");

  useEffect(() => {
    const loadPost = async () => {
        const rainviews = new RainView();
        //เอา url ของ rainview มาใส่ในตัวแปร
        setRainviews_url(await rainviews.getRainviewUrl())
        //ดึง nowcast มาใส่ในตัวแปร
        setRainview_nowcast(await rainviews.getNowcastPath())
    }

    // Call the function

    if (props.mapsetting.rain){
      loadPost();
    }
  }, [props.mapsetting.rain]);



  //เก็บประเภทแผนที่
  const [map_type, setMap_type] = useState<string>("m");
  const [map, setMap] = useState<L.Map | null>(null)
  //เก็บ marker ตามตำแหน่ง
  const [markerGPS, setMarkerGPS] = useState<L.Marker | null>(null)
  //เก็บตำแหน้างเก่าของ marker
  const [old_GPS, setOld_GPS] = useState<LatLonInterface | null>(null)

  useEffect(() => {

    if (props.layername === 'street') {
      setMap_type('m');
    }else if (props.layername === 'satelite') {
      setMap_type('s,h');
    }else if (props.layername === 'terrain') {
      setMap_type('p');
    }

  }, [props.layername]);

  // ไปที่อยู่ตาม gps ที่ได้รับมา โดยไม่ใช่ค่า default ของแผนที่
  const [defaultLocation, setDefaultLocation] = useState<LatLngTuple>([Number(process.env.REACT_APP_DEFAULT_LAT), Number(process.env.REACT_APP_DEFAULT_LON)]);
  useEffect(() => {
    if (props.map_location !== undefined && map !== null) {
      
      if(props.map_location !== null && props.map_location.lat !== undefined){

        const zoom_level:number = Number(process.env.REACT_APP_FLY_TO_ZOOM);

        
        //เพิ่ม marker ตามตำแหน่ง
        if(props.map_location !== old_GPS){
          map?.flyTo([props.map_location.lat, props.map_location.lon], zoom_level);

          //ลบ marker เก่าถ้ามี
          if(markerGPS !== null) map?.removeLayer(markerGPS);

          let marker_url:string = "";
          if (props.LocationType === 'place') marker_url = process.env.REACT_APP_PLACE_MARKER_ICON as string;
          if (props.LocationType === 'gps') marker_url = process.env.REACT_APP_GPS_MARKER_ICON as string;

          setMarkerGPS(L.marker([props.map_location.lat, props.map_location.lon], {
            icon: L.icon({
              iconUrl: marker_url,
              iconSize: [40, 40],
              iconAnchor: [16, 40]
            }),
            draggable: true
          }).addTo(map as L.Map));

          setOld_GPS(props.map_location);
          
        }

        //บันทึก Bound ของ map ไว้ เพื่อให้สำหรับใช้ในการหาสถานีตรวจวัด ของ iqair ที่อยู่ในขอบเขตของแผนที่ เพื่อใช้สำหรับ กรมอุตุนิยมวิทยา
        let mapBound:string = JSON.stringify(Object.assign({}, get_StationArea(map, [props.map_location.lat, props.map_location.lon], 15)));
        localStorage.setItem("Bound_mapForAieQ", mapBound);
      }else{
        const lat:number = Number(process.env.REACT_APP_DEFAULT_LAT);
        const lon:number = Number(process.env.REACT_APP_DEFAULT_LON);

        setDefaultLocation([lat, lon]);
      }

    }
  }, [props.map_location]);

  // เมื่อแผนที่มีการเปลี่ยนแปลง
  useLayoutEffect(() => {
    //บันทึก Bound ของ map ไว้ เพื่อให้สำหรับใช้ในการหาสถานีตรวจวัด ของ iqair ที่อยู่ในขอบเขตของแผนที่ เพื่อใช้สำหรับ กรมอุตุนิยมวิทยา
    if(props.map_location !== null){
      let mapBound:string = JSON.stringify(Object.assign({}, get_StationArea(map, [props.map_location.lat, props.map_location.lon], 15)));
      localStorage.setItem("Bound_mapForAieQ", mapBound);
    }

    //เพิ่ม marker ณ ตำแหน่ง default ของแผนที่
    const lat:number = Number(process.env.REACT_APP_DEFAULT_LAT);
    const lon:number = Number(process.env.REACT_APP_DEFAULT_LON);
    if (props.map_location !== undefined && map !== null) {
      if(props.map_location === null){

        if(markerGPS !== null) map?.removeLayer(markerGPS);

        setMarkerGPS(L.marker([lat, lon], {
          icon: L.icon({
            iconUrl: process.env.REACT_APP_PLACE_MARKER_ICON as string,
            iconSize: [40, 40],
            iconAnchor: [16, 40]
          }),
          draggable: true
        }).addTo(map as L.Map));        
          
        setOld_GPS({lat: lat, lon: lon});
        //
      }
    }
  }, [map]);

  //หากขนาดหน้าจอเปลี่ยนแปลง ให้ทำการเพิ่ม marker ตามตำแหน่งเดิม
  useEffect(() => {
      if (props.map_location !== undefined && props.map_location !== null && map !== null) {
        map?.setView([props.map_location.lat, props.map_location.lon]);

        if(markerGPS !== null) map?.removeLayer(markerGPS);
        
        let marker_url:string = "";
        if (props.LocationType === 'place') marker_url = process.env.PUBLIC_URL as string + process.env.REACT_APP_PLACE_MARKER_ICON as string;
        if (props.LocationType === 'gps') marker_url = process.env.PUBLIC_URL as string + process.env.REACT_APP_GPS_MARKER_ICON as string;

        setMarkerGPS(L.marker([props.map_location.lat, props.map_location.lon], {
          icon: L.icon({
            iconUrl: marker_url as string,
            iconSize: [40, 40],
            iconAnchor: [16, 40]
          }),
          draggable: true
        }).addTo(map as L.Map));        
        
        setOld_GPS({lat: props.map_location.lat, lon: props.map_location.lon});
      }
    console.log("map_location_device", props.map_location);
  }, [props.Device]);

  //เมื่อ zoom ของแผนที่เปลี่ยน ให้เพิ่มหรือลด zoom ของแผนที่
  useEffect(() => {
    if (props.map_location !== undefined && map !== null) {
      if (props.zoom.zoomValue === 1 && map.getZoom() < 18) {
        map?.zoomIn();
      }else if(props.zoom.zoomValue === -1 && map.getZoom() > 6){
        map?.zoomOut();
      }
    }
    //console.log("zoom", props.zoom);
  }, [props.zoom]);


  // drag marker แล้วส่งค่าตำแหน่งกลับไป
  if (markerGPS !== null) markerGPS?.on('dragend', async function(event) {
    let marker = event.target;
    let position = marker.getLatLng();
    console.log(position);
    await setOld_GPS({lat: position.lat, lon: position.lng});
    //ส่งค่าตำแหน่งกลับไป
    props.set_location({lat: position.lat, lon: position.lng});
  });


  //เก็บค่าต่างๆของแผนที่
      
    return (
      <div className='w-[100%] h-[100%]'>
        <MapContainer center={defaultLocation} zoom={16} maxZoom={18} minZoom={6} zoomControl={false} scrollWheelZoom={true}  renderer={canvasRenderer}  ref={setMap}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">Google</a> contributors'
            url={`http://{s}.google.com/vt?lyrs=${map_type}&x={x}&y={y}&z={z}`}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

            {/* rainview พยากรณ์ฝน */}
          {props.mapsetting.rain ? (
          <>
            <TileLayer
              url={`${rainviews_url}${rainview_nowcast}/256/{z}/{x}/{y}/7/1_0.png`}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              opacity={0.3}
              crossOrigin='anonymous'
            />
            <RainTilePicker rainTileUrl={`${rainviews_url}${rainview_nowcast}/256/{z}/{x}/{y}/7/1_0.png`} />
          </>
          ) : null}

          {/* แสดงข้อมูลคุณภาพอากาศ */}
          {props.mapsetting.air_quality ?
            <AirqualityIcon use_aqi={props.mapsetting.air_quality } openModal={props.OpenAirQualityModal} />
            : null  
          }
  
          {/* แสดงข้อมูลจุด hotspot จากดาวเทียมของ NASA */}
          {props.mapsetting.fire ?
            <MarkerFirms use={props.mapsetting.fire } />
            : null  
          }
        </MapContainer>
      </div>
    );
}

export default MapComponent;
