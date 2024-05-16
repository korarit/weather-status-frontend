import React,{useState,  useRef, useEffect} from "react";

import translate from "../../../../function/languages";

import LoadingSpin from '../../loading_spin';

import {getDataToday_TMD, cond_status_txt} from "../../../../function/weather/data";
import {heat_index, Calcius_to_fahrenheit, airq_status_txt} from "../../../../function/weather/calculate";
import {DustboyNear} from "../../../../function/weather/airqualityCMU";

interface NowType{
    open: boolean;
    LangCode: string;
    position: {lat:number, lon:number} | null;
}
function TMDNow({open, LangCode, position}:NowType){

    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode])


    const [NowTMD, setNowTMD] = useState<any>(null);
    const [HourlyTMD, setHourlyTMD] = useState<any>(null);

    async function getTMD_today(lat:number, lng:number){
        try{

            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const data = await getDataToday_TMD(lat, lng);
            const WeatherForecasts = data.WeatherForecasts[0].forecasts;
            const temp_feel = heat_index(Calcius_to_fahrenheit(WeatherForecasts[0].data.tc), WeatherForecasts[0].data.rh);
            
            //ดึงขนาดพื้นที่เพื่อดึงข้อมูลจาก AirQ
            let MapBounds = await JSON.parse(localStorage.getItem(`Bound_mapForAieQ`) || '{}');
            console.log("MapBounds",MapBounds);

            //ดึงข้อมูล PM2.5 จาก AirQ
            //const PM2_5_AirQ = await getNow_PM2_5_AirQ(MapBounds, 8, lat, lng);
            const PM2_5_AirQ = await DustboyNear(lat, lng);
            console.log("DustboyNear",PM2_5_AirQ);

            //ข้อมูลปัจจุบัน
            if(PM2_5_AirQ !== null && PM2_5_AirQ[0].data.aqi_full !== undefined){
                let aqiData = 0;
                let mainPollutantText = 'pm25';
                let concentrationData = PM2_5_AirQ[0].data.pm25;

                if(PM2_5_AirQ[0].data.aqi_full !== null && PM2_5_AirQ[0].data.aqi_full.us_pm25 !== undefined){
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
                        api: aqiData,
                        aqi_text: airq_status_txt(aqiData),
                        concentration: concentrationData,
                        mainPollutant: mainPollutantText
                    }
                });
            }else{
                setNowTMD({
                    temp: WeatherForecasts[0].data.tc,
                    temp_feel: temp_feel,
                    humidity: WeatherForecasts[0].data.rh,
                    rain: WeatherForecasts[0].data.rain,
                    cond_txt: cond_status_txt(WeatherForecasts[0].data.cond),
                    cond: WeatherForecasts[0].data.cond,
                    time: WeatherForecasts[0].time,
                    air_quality:{
                        have: false
                    }
                });
            }
            console.log('test', NowTMD);

            //ข้อมูลรายชั่วโมง
            setHourlyTMD(WeatherForecasts);     


            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

        }catch(error){
            setErrorStatus(true);
            setLoadingStatus(false);
        }
    }
    useEffect(() => {
        if(open){
            if(position !== null){
                getTMD_today(position['lat'], position['lon']);
                console.log("NowTMD",NowTMD);
            }else{
                const default_lat = Number(process.env.REACT_APP_DEFAULT_LAT);
                const default_lon = Number(process.env.REACT_APP_DEFAULT_LON);
                getTMD_today(default_lat, default_lon);
            }
        }
    }, [open, position]);

    /////////////////////////////// contorl Range ///////////////////////////////
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const [startDrag, setStartDrag] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const elementRange = useRef<HTMLDivElement>(null);

    function RangeMouseDown(event){
        setIsDrag(true);
        if(elementRange.current){
            setStartDrag(event.pageX - elementRange.current.offsetLeft);
            setScrollLeft(elementRange.current.scrollLeft);
        }
    }
    function RangeMouseLeave(event){
        setIsDrag(false);
    }
    function RangeMouseMove(event){
        if(isDrag){
            if(elementRange.current){
                event.preventDefault();
                const x:number = event.pageX - elementRange.current.offsetLeft;
                const walk:number = (x - startDrag) * 1.5; //scroll-fast
                elementRange.current.scrollLeft = scrollLeft - walk;
            }
        }
    }

    const listHourly = HourlyTMD !== null? HourlyTMD.map((item, index) => (
        <div key={index} className='w-1/3 flex-none h-full border-r-2 last:border-r-0 border-black pt-[1vh] select-none'>
          <p className='text-center text-[2.1vh] font-normal leading-[2.2vh] font-name-kanit'>
            {new Date(item.time).getHours() <= 9 ? 
              '0'+new Date(item.time).getHours()+':00' : 
              new Date(item.time).getHours()+':00'}
          </p>
          <p className='text-center text-[2.1vh] font-normal mt-[0.5vh] leading-[2.2vh] font-name-kanit'>{item.data.tc}°</p>
                                  
          <div className='w-[50%] h-[7vh] mx-auto mt-[1vh] mb-[1vh] flex items-center justify-center'>
                {new Date(item.time).getHours() < 18 && new Date(item.time).getHours() > 6 ?
                    <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className="w-[15vh] h-[8.5vh]"/>
                : 
                    <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/night/${item.data.cond}.svg`} className="w-[15vh] h-[8.5vh]"/>
                }
          </div>

          <p className='text-center text-[2vh] font-normal leading-[2.1vh] font-name-kanit'>{lang['rain_count']}</p>
          <p className="text-center text-[2vh] font-semibold leading-[2.1vh] font-name-kanit"> {item.data.rain} mm</p>
        </div>
    )):(
        <div>
            {lang['error_message']['not_data']}
        </div>
    );


    return(
    <div className="max-h-[95%] overflow-y-auto">
        <p className="text-[1.8rem] mb-[0.5rem] font-normal font-name-kanit">
          {lang["title"]["now"]}
        </p>

        {(errorStatus || NowTMD === null || HourlyTMD.length === 0) && loadingStatus === false ? (
            <div className="w-[100%] h-[60vh] flex items-center justify-center">
            <p className="text-[1.5rem] font-semibold font-name-kanit text-center">
                {lang["error_message"]["tmd"]}
            </p>
            </div>
        ) : null}

        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        {loadingStatus  ? (
          <div className="w-[100%] h-[60dvh] flex items-center justify-center">
            <LoadingSpin />
          </div>
        ) :
        <>
        { errorStatus === false && NowTMD !== null && HourlyTMD !== null ? (
        <>
            <div className="bg-rose-200 rounded-lg w-[100%] h-fit py-[1vh] px-[2vh] shadow-md shadow-neutral-800/40">
                <div className="grid grid-cols-6">
                    <div className="col-span-4 max-h-[13vh]">
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

                    <div className="col-span-2 max-h-[13vh]">
                        <div className="w-full h-full flex items-center justify-center pt-[0.5rem]">
                        {new Date(NowTMD.time).getHours() < 18 &&
                        new Date(NowTMD.time).getHours() > 6 ? (
                            <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${NowTMD.cond}.svg`} className="max-w-[15vh] h-[10vh]"/>
                        ) : (
                            <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/night/${NowTMD.cond}.svg`} className="max-w-[15vh] h-[10vh]"/>
                        )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[2vh] bg-slate-50 rounded-lg h-[29vh] shadow-md shadow-neutral-800/40 pt-[1vh] px-[2vh]">
                <p className="text-[2.5vh] font-[550] leading-[3vh] font-name-kanit">
                {lang["now_header"]["hourly_forecast"]}
                </p>

                <div className="relative h-[78%] w-full mt-[1vh]">
                    <div className="max-w-[98%] mx-auto h-[100%]">
                        <div className="overflow-x-scroll flex h-[100%]"
                            ref={elementRange}

                            onMouseDown={(e) => RangeMouseDown(e)}
                            onMouseLeave={(e) => RangeMouseLeave(e)}
                            onMouseUp={(e) => RangeMouseLeave(e)}
                            onMouseMove={(e) => RangeMouseMove(e)}
                        >
                            {listHourly}
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="bg-orange-100 rounded-lg w-full h-fit shadow-md shadow-neutral-800/40 mt-[2vh] mb-[1vh] px-[2vh] py-[1.5vh]">
                    <p className="text-[2.5vh] font-semibold font-name-kanit">
                        {lang["now_header"]["air_quality_tmd"]}
                    </p>
                    {NowTMD.air_quality.have ? (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                                <div className="w-full h-full grid place-items-center">
                                    <p className="text-[3rem] font-bold font-name-kanit text-center">
                                        {NowTMD.air_quality.api}
                                    </p>
                            </div>
                        </div>

                        <div className="col-span-8">
                            <p className="text-[1.8rem] font-extrabold font-name-kanit">
                                {NowTMD.air_quality.aqi_text}
                            </p>
                            <p className="text-[1.25rem] font-normal leading-[2.5vh] font-name-kanit">
                                {
                                    lang["tmd_airq_name_data"][NowTMD.air_quality.mainPollutant]
                                }
                            </p>
                            <p className="text-[1.25rem] font-extralight font-name-kanit">
                                {NowTMD.air_quality.concentration} µg/m³
                            </p>
                        </div>
                    </div>
                     ) : (
                    <div className="h-[10vh] grid place-items-center">
                        <div>
                            <p className="text-[1.5rem] font-bold font-name-kanit text-center">
                                {lang["tmd_not_station_airq"]}
                            </p>
                        </div>
                    </div>
                    )}
                    </div>
            </div>
        </>
        ): null}
        </>
        }

    </div>
    );
}

export default TMDNow;