import React, {useEffect, useState} from 'react';
//function ค้นหาสถานที่ โดยใช้ api จาก logdomap
import Search_data from '../function/location/search';

//import logo from '../logo.svg';
import '../css/main.css';

//component แผนที่
import MapComponent from '../components/mobile/map';

//component ส่วนการค้นหา
import Search from '../components/mobile/search';
import Search_result from '../components/mobile/search_result';

//component footer bar
import Footerbar from '../components/mobile/footerbar';
//component ปุ่มในแผนที่
import { Gps_Button, Layer_Button } from '../components/mobile/button';
//component layer map
import Layer_map from '../components/mobile/layer_map';
//component ส่วนแสดงผลสภาพอากาศ
import Weather from '../components/mobile/weather';
//component side bar
import SideBar from '../components/mobile/SideBar';

interface MapLayerSettingType {
  use_map: string;
  air_quality: boolean;
  fire: boolean;
  rain: boolean;
}
interface LatLonInterface{
  lat: number;
  lon: number;
}
interface OuterFunction {
  Device: string;

  MapLocation: LatLonInterface | null;
  LocationType: string;
  searchValue: string;
  mapLayerSetting: MapLayerSettingType;

  setMapLocation: Function;
  setLocationType: Function;
  setSearchValue: Function;
  setMapLayerSetting: Function;
}

function MobileView({Device, MapLocation, LocationType, searchValue, mapLayerSetting, setMapLocation, setLocationType, setSearchValue, setMapLayerSetting}:OuterFunction) {

  //language
  const [refreshlanguage, setRefreshlanguage] = useState<string>('');
  useEffect(() => {
    setRefreshlanguage(refreshlanguage);
    console.log("refreshlanguage");
  }, [refreshlanguage]);


  //////////////////////////////////////////////// OPEN Layer Map Setting Data ////////////////////////////////////////////////

  const [MapSettingLayerShow, setMapSettingLayerShow] = useState<boolean>(false);

  //////////////////////////////////////////////// Layer Map Setting Data ////////////////////////////////////////////////


  interface MapLayerSetting {
    use_map: string;
    air_quality: boolean;
    fire: boolean;
    rain: boolean;
  }

  const handleChangeMapLayerSettingData = (key: string, newValue: any) => {

    if(key !== ""){
    
      let updatedMapLayerSetting: MapLayerSetting = {
          ...mapLayerSetting,
          [key]: newValue,
      }

      setMapLayerSetting(updatedMapLayerSetting); // Added this line
    }

  }

  //list รายการ fuction สำหรับการแสดงผลแผนที่
  interface MapLayerSettingList {
    use_street: () => void;
    use_satelite: () => void;
    use_terrain: () => void;
    use_layer: {
      air_quality: () => void;
      fire: () => void;
      rain: () => void;
    };
  }
  const mapLayerSettingListFunc:MapLayerSettingList = {
    use_street: () => handleChangeMapLayerSettingData("use_map", "street"),
    use_satelite: () => handleChangeMapLayerSettingData("use_map", "satelite"),
    use_terrain: () => handleChangeMapLayerSettingData("use_map", "terrain"),
    use_layer:{
      air_quality: () => handleChangeMapLayerSettingData("air_quality", !mapLayerSetting.air_quality),
      fire: () => handleChangeMapLayerSettingData("fire", !mapLayerSetting.fire),
      rain: () => handleChangeMapLayerSettingData("rain", !mapLayerSetting.rain),
    }
  };
  

  //////////////////////////////////////////////// User Location ////////////////////////////////////////////////

  // สถานะการอนุญาติใช้งาน gps
  const [can_use_gps , setPermissionGps] = useState<boolean>();

  function GetuserLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {

        // ตั้งค่าตำแหน่งแผนที่ ตามตำแหน่งที่ได้จาก gps
        // ตั้งค่าประเภทของตำแหน่ง
        setLocationType("gps");
        setMapLocation({lat: position.coords.latitude, lon: position.coords.longitude});
        setPermissionGps(true);

        //console.log(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        if(error.code === 1){
          setPermissionGps(false);
          console.log("Permission Denied");
        }
      });
    }
  }


  //////////////////////////////////////////////// GO TO Place Location ////////////////////////////////////////////////
  function goToLocation(lat: number, lon: number){
    setLocationType("place");
    setUseSearch(false);
    setTimeout(() => {
      setMapLocation({lat: lat, lon: lon});
    }, 3000);

    console.log("Go to location", [lat, lon]);
  }

  //////////////////////////////////////////////// OPEN Wheather Data ////////////////////////////////////////////////

  const [WeatherHeight, setWeatherHeight] = useState<string>("0%");
  const [WeatherShow, seWeatherShow] = useState<boolean>(false);
  
  function openWeatherLayer(){
    seWeatherShow(true);
    setWeatherHeight("70vh");
    if(MapSettingLayerShow){
      setMapSettingLayerShow(false); 
    }
  }
  
  function closeWeatherLayer(){
    seWeatherShow(false); 
    setWeatherHeight("0%");

  }

  //////////////////////////////////////////////// Search Result ////////////////////////////////////////////////
  const [searchData, setsearchData] = useState<any>();
  const [useSearch, setUseSearch] = useState<boolean>(false);

  async function setSearchText(text: string){
    const search_func = new Search_data();
    const search_result = await search_func.getSearchLogdomap(text);
    if(search_result !== undefined){
      setsearchData(search_result);
      setUseSearch(true);
      if(WeatherShow){
        closeWeatherLayer();
      }
      console.log(searchData);
      return true;
    }
    return false;
  }
  //////////////////////////////////////////////// Side Bar ////////////////////////////////////////////////
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  function openNav(){
    seWeatherShow(false);
    setOpenSideBar(true);
  }

  //////////////////////////////////////////////// Render ////////////////////////////////////////////////
  return (
    <>
      {/* modal */}
      <div className="App bg-white">

        {/* search bar */}
        <div className='row h-[7%] min-[400px]:h-[6%] flex justify-center items-center'>
          <Search LangRe={refreshlanguage} SideBar={() => openNav()} FuncSearch={setSearchText} useSearch={useSearch} setUseSearch={setUseSearch}/>
        </div>

        {/* search result (ผลการค้นหา) */}
        <div className={`row ${useSearch ? 'h-[93%] min-[400px]:h-[94%]' : 'h-[0]'} w-[98%] bg-white mx-auto overflow-y-auto`}>
          <Search_result LangRe={refreshlanguage} searchData={searchData} goToLocation={goToLocation} useSearch={useSearch}/>
        </div>


        {/* map */}
        <div className={`row ${useSearch ? 'h-[0]' : 'h-[87%]  min-[400px]:h-[88%]'} w-full`}>
          <div className='width-of-map'>
            {/* ปุ่มแสดง layer แผนที่ + GPS*/}
            <div className={`layout-button-map ${useSearch ? 'hidden' : null}`}>
              <Gps_Button onPress={() => GetuserLocation()} can_use_gps={can_use_gps} />
              <Layer_Button onPress={() => setMapSettingLayerShow(true)} />
            </div>
          </div>
          {/* แผนที่ */}
          <MapComponent 
            Device={Device} 
            layername={mapLayerSetting.use_map} 
            mapsetting={mapLayerSetting} 
            map_location={MapLocation} 
            LocationType={LocationType}   
          />
        </div>

        {/* Footer bar */}
        <div className={`row ${useSearch ? 'hidden' : 'h-[6%]'} w-[100%] absolute`}>
          <Footerbar LangRe={refreshlanguage} onPress={() => openWeatherLayer()} />
        </div>
        
        {/* Layer popup */}
        <Layer_map LangRe={refreshlanguage} show={MapSettingLayerShow} mapsetting={mapLayerSetting} onPrees={mapLayerSettingListFunc} closeLayer={() => setMapSettingLayerShow(false)}/>

        {/* Wheather Data */}
        <Weather LangRe={refreshlanguage} height={WeatherHeight} showStatus={WeatherShow} position={MapLocation} closeLayer={() => closeWeatherLayer()}/>

        {/* Side bar */}
        <SideBar LangRe={refreshlanguage} open={openSideBar} Refresh={setRefreshlanguage} closeSideBar={() => setOpenSideBar(false)}/>
      </div>
    </>

  );

}

export default MobileView;
