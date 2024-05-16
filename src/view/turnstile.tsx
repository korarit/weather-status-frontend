import React, {useState, useEffect} from 'react';

import { Turnstile } from '@marsidev/react-turnstile'
import axios from 'axios';
//import { LatLngTuple } from 'leaflet';

import MobileView from './mobileView';
import DesktopView from './desktopView';

import translate from '../function/languages';
import {cacheDustboyReset} from '../function/weather/airqualityCMU';
import { createDB } from '../function/localDatabase/db';

//modal
import Accept_rule from '../components/mobile/modal/accept_rule';
//import Voice_search from '../components/mobile/modal/voice_search';

import '../css/router/turnstile.css';
import '../css/scroll.css';
import '../css/icon.css';
import '../css/cloud_svg.css';


function Bot_check() {

  // status bot checker กรณีที่เปิดใช้งาน
  const [status, setStatus] = useState<boolean>(process.env.REACT_APP_TURNSTILE_USE === 'true' ? false : true);
  
  // ข้อตกลง
  const [agreeRule, setAgreeRule] = useState<boolean>(localStorage.getItem('agree_rule') === null ? false : true);
  // เปิด modal ข้อตกลง กรณีที่ยังไม่ได้กดยอมรับ และ การตั้งค่าใน .env ให้ใช้
  const [openRule] = useState<boolean>(localStorage.getItem('agree_rule') === null && process.env.REACT_APP_RULE_USE === 'true' ? true : false);
  const [rule_setting] = useState<string>(process.env.REACT_APP_RULE_USE as string);

  //language
  const [lang] = useState<any>(translate(localStorage.getItem('languages') === null ? 'th-TH' : localStorage.getItem('languages') as string));

  
  //กรณีที่ setting rule เป็น false ให้ agreeRule = true
  useEffect(() => {
    if(rule_setting === 'false'){
      setAgreeRule(true)
    }
  }, [rule_setting]);

  async function vertifly(token) {
    if (token) {
      try{
        const vertifly:any = await axios.post(`${process.env.REACT_APP_API_MAIN}/security/bot_checker`, { tokens: token });
        console.log(vertifly.data);
        if(vertifly.status === 200){
          if(vertifly.data.bot_past === true){
            await setStatus(true);
            await localStorage.setItem('token_session', vertifly.data.jwt);
            //DustboyData();
            cacheDustboyReset(vertifly.data.jwt);
            createDB('search');
          }else{
            setStatus(false);
            localStorage.removeItem('token_session');
          }
        } 
      }catch(err){
        console.log(err);
        if(err.response.status === 500){
          setStatus(false);
          localStorage.removeItem('token_session');
        }
      }
    }

  }

  function setAgree(){
    setAgreeRule(true);
    localStorage.setItem('agree_rule', 'true');
  }

  useEffect(() => {
    if(localStorage.getItem('languages') === null){
      localStorage.setItem('languages', 'th-TH');
    }
  },[]);
  

  //////////////////////////////////////////////////////// Share State ///////////////////////////////////////////////////////
  // ตำแหน่งของผู้ใช้งาน
  interface LatLonInterface{
    lat: number;
    lon: number;
  }
  const [MapLocation, setMapLocation] = useState<LatLonInterface | null>(null);
  // ประเภทของตำแหน่ง
  const [LocationType, setLocationType] = useState<string>("place");
  // searchValue
  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    console.log('searchValue-ShareState', searchValue);
  }, [searchValue]);

  interface MapLayerSetting {
    use_map: string;
    air_quality: boolean;
    fire: boolean;
    rain: boolean;
  }
    
    //fuction ไว้อัพเดท leeflet ตามที่เลือก 
  const [mapLayerSetting, setMapLayerSetting] = useState<MapLayerSetting>({
    use_map: 'street',
    air_quality: false,
    fire: false,
    rain: false,
  });

  //////////////////////////////////////////////////////// View Size ///////////////////////////////////////////////////////
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const [Device, setDevice] = useState<string>('');
  useEffect(() => {
    if(windowSize.innerWidth < windowSize.innerHeight){
      if(Device !== 'mobile'){
        setDevice('mobile');
      }
    }else{
      if(Device !== 'desktop'){
        setDevice('desktop');
      }
    }
  }, [windowSize]);


  return (
    <>
    {/* ยังไม่ผ่าน bot check / ไม่รับข้อตกลง */}
    { status === false || agreeRule === false ?
    <div className='flex flex-col items-center justify-center landscape:bg-gray-400'>
    <div className='width-web bg-white'>
    <div className='h-[100dvh]'>

      <Accept_rule isopen={openRule} setAgree={setAgree} />
      <div className='h-[70%] flex flex-col items-center justify-center'>
        <div className='grid grid-cols-6  w-[90%] sm:w-[60%] lg:w-[80%] h-[20%] mb-[15vh] sm:mb-[10vh] lg:mb-[15vh]'>

          <div className='col-span-2 flex flex-col items-center justify-center'>
            <div className="w-[100%] h-[100%]">
                <div className='icon-cloud-welcome'></div>
            </div>
          </div>

          <div className='col-span-4 flex flex-col items-center justify-center'>
            <p className='text-center text-xl md:text-4xl sm:text-2xl laptop:text-3xl font-name-kanit'>Weather Forecast Project</p>
          </div>
        </div>
        { agreeRule === true || rule_setting === 'false'?
            <Turnstile
              siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY as string}
              onError={() => setStatus(false)}
              onExpire={() => setStatus(false)}
              onSuccess={(token) => vertifly(token)} 
            />
        : null
        }
      </div>

      {/* รายชื่อแหล่งข้อมูล */}
      <div className='h-[30%] flex flex-col items-center justify-center'>

            <p className='text-center text-xl sm:text-4xl lg:text-2xl font-name-kanit'>{lang['thank_data']}</p>
            <div className='grid items-center grid-cols-3 w-[90%] my-[2vh]'>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-lg text-light font-name-kanit'>Google Map</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>NASA's FIRMS</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>Longdo Map</p>
              </div>

              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>pm2_5.nrct.go.th</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>wunderground</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>GISTDA</p>
              </div>

              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>rainviewer.com</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>คลังข้อมูลน้ำแห่งชาติ</p>
              </div>
              <div className='col-span-1'>
                <p className='text-center sm:text-2xl laptop:text-xl text-light font-name-kanit'>กรมอุตุนิยมวิทยา</p>
              </div>
              
            </div>
      </div>
      
    </div>
    </div>
    </div>
    : null
  }
  {/* ผ่าน bot check & รับข้อตกลง */}
  { status === true && agreeRule === true && process.env.REACT_APP_RULE_USE === 'true' ?
  <>
  {
    windowSize.innerWidth < windowSize.innerHeight ?
    <div className='flex flex-col items-center justify-center scrollbar-mobile landscape:bg-gray-400'>
      <div className='width-web'>
        <MobileView
          Device={Device}

          MapLocation={MapLocation}
          setMapLocation={setMapLocation}

          LocationType={LocationType}
          setLocationType={setLocationType}

          mapLayerSetting={mapLayerSetting}
          setMapLayerSetting={setMapLayerSetting}

          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
    </div>
    : 
    <DesktopView
      Device={Device}

      LatLonWeather={MapLocation}
      setLatLonWeather={setMapLocation}

      LocationType={LocationType}
      setLocationType={setLocationType}

      mapLayerSetting={mapLayerSetting}
      setMapLayerSetting={setMapLayerSetting}

      searchValue={searchValue}
      setSearchValue={setSearchValue}
    />
  }
  </>
  : null
  }
  {/* ผ่าน bot check & รับข้อตกลง */}
  { status === true && process.env.REACT_APP_RULE_USE === 'false' ?
  <>
  {
    windowSize.innerWidth < windowSize.innerHeight ?
    <div className='flex flex-col items-center justify-center scrollbar-mobile landscape:bg-gray-400'>
      <div className='width-web'>
        <MobileView
          Device={Device}

          MapLocation={MapLocation}
          setMapLocation={setMapLocation}

          LocationType={LocationType}
          setLocationType={setLocationType}

          mapLayerSetting={mapLayerSetting}
          setMapLayerSetting={setMapLayerSetting}

          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
    </div>
    : 
    <DesktopView
      Device={Device}

      LatLonWeather={MapLocation}
      setLatLonWeather={setMapLocation}

      LocationType={LocationType}
      setLocationType={setLocationType}

      mapLayerSetting={mapLayerSetting}
      setMapLayerSetting={setMapLayerSetting}

      searchValue={searchValue}
      setSearchValue={setSearchValue}
    />
  }
  </>
  : null
  }
    </>
  );

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

}

export default Bot_check;
