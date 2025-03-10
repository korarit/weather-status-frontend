import React, {useState, useEffect} from 'react';

import {getDataToday_TMD, cond_status_txt , getPM2_5_GISTDA} from '../../../../function/weather/data';
import {Calcius_to_fahrenheit, heat_index, airq_status_txt, pm25_to_aqi } from '../../../../function/weather/calculate';
import {DustboyNear} from '../../../../function/weather/airqualityCMU';

import translate from '../../../../function/languages';
//import Air_quality_icon from '../../map/map_airQ';


//import '../../../../css/App.css';

import '../../../../css/font.css';
import '../../../../css/icon.css';

import '../../../../css/components/weather.css'

import LoadingSpin from '../../loading_spin';
interface LatLonInterface{
    lat: number;
    lon: number;
}
interface OuterFunctionProps {
    position: LatLonInterface | null;
    showStatus: boolean;
    showheight: string;
    useFrom: string;
    LangRe: string;
}

interface TMDNowData {
    temp: number;
    temp_feel: number;
    humidity: number;
    rain: number;
    cond_txt: string;
    cond: number;
    time: string;
    air_quality:{
        have: boolean;
        name: string;
        api?: number;
        aqi_text?: string;
        concentration?: number | string;
        mainPollutant?: string;
    }
}

function TMDNow(props:OuterFunctionProps) {

    const [NowTMD, setNowTMD] = useState<TMDNowData|null>(null);

    const [HourlyTMD, setHourlyTMD] = useState<any>([]);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getTMD_today(lat:number, lon:number){
        try{

            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const data = await getDataToday_TMD(lat, lon);
            const WeatherForecasts = data.WeatherForecasts[0].forecasts;
            const temp_feel = heat_index(Calcius_to_fahrenheit(WeatherForecasts[0].data.tc), WeatherForecasts[0].data.rh);
            
            //ดึงขนาดพื้นที่เพื่อดึงข้อมูลจาก AirQ
            // let MapBounds = await JSON.parse(localStorage.getItem(`Bound_mapForAieQ`) || '{}');
            // console.log("MapBounds",MapBounds);

            //ดึงข้อมูล PM2.5 จาก AirQ
            const PM2_5_AirQ = await DustboyNear(lat, lon);

            //ข้อมูลปัจจุบัน
            if(PM2_5_AirQ !== null && PM2_5_AirQ[0].data.pm25 !== undefined){
                let aqiData:number = 0;
                let mainPollutantText:string = 'pm25';
                let concentrationData:number | string = PM2_5_AirQ[0].data.pm25;

                if(PM2_5_AirQ[0].data.aqi_full !== null && PM2_5_AirQ[0].data.aqi_full !== undefined){
                    aqiData = PM2_5_AirQ[0].data.aqi_full.us_pm25;
                }
                if( 
                    (PM2_5_AirQ[0].data.aqi_full === null || PM2_5_AirQ[0].data.aqi_full.us_aqi === undefined) 
                    && PM2_5_AirQ[0].data.us_aqi !== undefined
                ) {
                    aqiData = PM2_5_AirQ[0].data.us_aqi;
                }
                if(PM2_5_AirQ[0].data.pm25 === 0) mainPollutantText = 'pm10';
                if(PM2_5_AirQ[0].data.pm25 === 0) concentrationData = PM2_5_AirQ[0].data.pm10;

                 setNowTMD({
                    temp: WeatherForecasts[0].data.tc,
                    temp_feel: temp_feel,
                    humidity: WeatherForecasts[0].data.rh,
                    rain: WeatherForecasts[0].data.rain,
                    cond_txt: cond_status_txt(WeatherForecasts[0].data.cond),
                    cond: WeatherForecasts[0].data.cond,
                    time: WeatherForecasts[0].time,
                    air_quality:{
                        have: true,
                        name: 'station',
                        api: aqiData,
                        aqi_text: airq_status_txt(aqiData),
                        concentration: concentrationData,
                        mainPollutant: mainPollutantText
                    }
                });
            }else{
                const gistda_airq = await getPM2_5_GISTDA(lat, lon);
                console.log("gistda_airq",gistda_airq);

                setNowTMD({
                    temp: WeatherForecasts[0].data.tc,
                    temp_feel: temp_feel,
                    humidity: WeatherForecasts[0].data.rh,
                    rain: WeatherForecasts[0].data.rain,
                    cond_txt: cond_status_txt(WeatherForecasts[0].data.cond),
                    cond: WeatherForecasts[0].data.cond,
                    time: WeatherForecasts[0].time,
                    air_quality:{
                        have: true,
                        name: "gistda",
                        api: pm25_to_aqi(gistda_airq.data.pm25[0]),
                        aqi_text: airq_status_txt(pm25_to_aqi(gistda_airq.data.pm25[0])),
                        concentration: parseFloat(Number(gistda_airq.data.pm25[0]).toFixed(2)),
                        mainPollutant: 'pm25'
                    }
                });
            }
            console.log(NowTMD);

            //ข้อมูลรายชั่วโมง
            setHourlyTMD(WeatherForecasts);     


            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);
        }catch(error){
            setErrorStatus(true);
        }
    }
    useEffect(() => {
        if(props.showStatus && props.showheight !== '0%'){
            if(props.position !== null){
                getTMD_today(props.position.lat, props.position.lon)
            }
        }
        
    }, [props.position, props.showStatus , props.useFrom,props.showheight]);

    const [lang, setLang] = useState<any>(translate(localStorage.getItem('languages') as string));
    useEffect(() => {
        setLang(translate(localStorage.getItem('languages') as string));
    }, [props.LangRe])


    const listHourly = HourlyTMD.map((item:any, index:number) => (
        <div key={index} className='w-1/3 flex-none h-full border-r-2 last:border-r-0 border-black pt-[1vh]'>
          <p className='text-center text-[2.1vh] font-normal leading-[2.2vh] font-name-kanit'>
            {new Date(item.time).getHours() <= 9 ? 
              '0'+new Date(item.time).getHours()+':00' : 
              new Date(item.time).getHours()+':00'}
          </p>
          <p className='text-center text-[2.1vh] font-normal mt-[0.5vh] leading-[2.2vh] font-name-kanit'>{item.data.tc}°</p>
                                  
          <div className='w-[40%] h-[40%] mx-auto mt-[1vh] flex items-center'>
            {new Date(item.time).getHours() < 18 && new Date(item.time).getHours() > 6 ?
                <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className='max-w-[15vh] h-[8.5vh]'/>
            : 
                <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className='max-w-[15vh] h-[8.5vh]'/>
            }
          </div>

          <p className='text-center text-[2vh] font-normal leading-[2.1vh] font-name-kanit'>{lang['rain_count']} {item.data.rain} mm</p>
        </div>
    ));  

    return (
      <>
        <p className="text-[3vh] mb-[0.5vh] font-normal font-name-kanit">
          {lang["title"]["now"]}
        </p>


        {/* แสดง error หาก errorStatus เป็น true */}
        {errorStatus ? (
          <div className="w-[100%] h-[47dvh] flex items-center justify-center">
            <p className="text-[3vh] font-semibold font-name-kanit text-center">
              {lang["error_message"]["tmd"]}
            </p>
          </div>
        ) : null}


        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        {loadingStatus && errorStatus !== true ? (
          <div className="w-[100%] h-[47dvh] flex items-center justify-center">
            <LoadingSpin />
          </div>
        ) : (
          <>
          
          {/* ตรวจสอบว่าไม่มี error */}
          { errorStatus === false && NowTMD ? (
            <>
            {/* ****** แสดงข้อมูลที่ดึงได้มา ****** */}
            <div className="relative">
                <div className="bg-rose-200 rounded-lg w-[100%] h-fit py-[1.2vh] shadow-md shadow-neutral-800/40">
                    <div className="grid grid-cols-6">
                        <div className="col-span-4 ml-[3vw]">
                            <p className="text-[5vh] font-semibold leading-[5vh] font-name-kanit">
                            {Math.floor(NowTMD.temp)}°
                            </p>
                            <p className="text-[2.7vh] font-normal leading-[3vh] font-name-kanit">
                            {NowTMD.cond_txt}
                            </p>
                            <p className="text-[2.7vh] font-normal leading-[4vh] font-name-kanit">
                            {lang["temp_feel_like"]} {Math.floor(NowTMD.temp_feel)}°
                            </p>
                        </div>

                        <div className="col-span-2 ">
                            <div className="w-full h-full flex items-center justify-center">
                                <div className='h-[10.5vh]'>
                                {new Date(NowTMD.time).getHours() < 18 &&
                                new Date(NowTMD.time).getHours() > 6 ? (
                                    <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${NowTMD.cond}.svg`} className='max-w-[15vh] h-[12vh]'/>
                                ) : (
                                    <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${NowTMD.cond}.svg`} className='max-w-[15vh] h-[12vh]'/>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="mt-[2vh]">
                    <div className=" bg-slate-50 rounded-lg h-[26vh] shadow-md shadow-neutral-800/40 pt-[1vh] pl-[1vh] pr-[1vh]">
                        <p className="text-[2.3vh] font-[550] leading-[3vh] font-name-kanit">
                        {lang["now_header"]["hourly_forecast"]}
                        </p>

                        <div className="relative h-[78%] w-full mt-[1vh]">
                            <div className="max-w-[98%] mx-auto h-[100%]">
                                <div className="overflow-x-scroll flex h-[100%]">
                                {listHourly}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="bg-orange-100 rounded-lg w-full h-fit shadow-md shadow-neutral-800/40 mt-[2vh] mb-[1vh] px-[2vh] py-[2vh]">
                        <p className="text-[2.7vh] font-semibold font-name-kanit">
                        {lang["now_header"]["air_quality_tmd"]} {lang["tmd_airq_refer"][NowTMD.air_quality.name]}
                        </p>
                        {NowTMD.air_quality.have ? (
                        <div className="grid grid-cols-12 gap-x-[2vh] mt-[0.5vh]">
                            <div className="col-span-3">
                                <div className="w-full h-full grid place-items-center">
                                    <div>
                                        <p className="text-[6vh] font-bold font-name-kanit text-center">
                                            {NowTMD.air_quality.api}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-9 ">
                                <p className="text-[2rem] leading-[2rem] font-extrabold font-name-kanit">
                                    {NowTMD.air_quality.aqi_text}
                                </p>
                                <p className="text-[1.4rem] font-normal leading-[1.5rem] font-name-kanit">
                                    {NowTMD.air_quality.mainPollutant &&(
                                        lang["tmd_airq_name_data"][NowTMD.air_quality.mainPollutant]
                                    )}
                                </p>
                                <p className="text-[1.4rem] font-extralight leading-[1.4rem] font-name-kanit">
                                    {NowTMD.air_quality.concentration} µg/m³
                                </p>
                            </div>
                        </div>
                        ) : (
                        <div className="h-[10vh] grid place-items-center">
                            <div>
                                <p className="text-[3.3vh] font-bold font-name-kanit text-center">
                                    {lang["tmd_not_station_airq"]}
                                </p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </>
            ) : null}
          </>
        )}
      </>

    );
};

export default TMDNow;