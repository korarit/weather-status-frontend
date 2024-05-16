import React, {useState, useEffect} from 'react';

import {getData48Hour_TMD, cond_status_txt} from '../../../../function/weather/data';
import {Calcius_to_fahrenheit, heat_index} from '../../../../function/weather/calculate';

import translate from '../../../../function/languages';

//import '../../../../css/App.css';

import '../../../../css/font.css';
import '../../../../css/icon.css';

import '../../../../css/components/weather.css'
//import Air_quality_icon from '../../map/map_airQ';
import LoadingSpin from '../../loading_spin';

interface LatLonInterface{
    lat: number;
    lon: number;
}
interface OuterFunctionProps {
    position: LatLonInterface | null;
    showStatus: boolean;
    useFrom: string;
    LangRe: string;
}
function TMD_48hour(props:OuterFunctionProps) {

    const [HourlyTMD, setHourlyTMD] = useState<any>(null);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getTMD_48hour(lat:number, lon:number){
        try{
            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const data:any = await getData48Hour_TMD(lat, lon);
            //console.log("data",data);
            const WeatherForecasts:any = data.WeatherForecasts[0].forecasts;        
            //ข้อมูลรายชั่วโมง
            setHourlyTMD(WeatherForecasts);

            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

        }catch(error){
            //console.log(error);
            setErrorStatus(true);
        }
    }
    useEffect(() => {
        if(props.showStatus && props.useFrom === 'tmd'){
            if(props.position !== null){
                getTMD_48hour(props.position?.lat, props.position?.lon)
            }
        }
        
    }, [props.position, props.showStatus , props.useFrom]);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe])


    const listHourly = HourlyTMD !== null ? HourlyTMD.map((item:any, index:number) => (
      <div key={index}
        className="w-full flex-none h-full border-b-2 pt-[1vh] pb-[1vh] first:pt-0 last:pb-0 last:border-b-0 border-black "
      >
        <p className=" text-[2.8vh] font-normal text-indigo-900 font-name-kanit">
          {new Date(item.time).getHours() <= 9
            ? "0" + new Date(item.time).getHours() + ":00 "+ lang['day_title'][new Date(item.time).getDay()]
            : new Date(item.time).getHours() + ":00 "+ lang['day_title'][new Date(item.time).getDay()] }
        </p>
        <div className="grid grid-cols-6 h-[12vh]">
            <div className="col-span-4 flex items-center h-[12vh]">
                <div>
                <p className="text-[4vh] font-medium leading-[4vh] font-name-kanit">
                     {Math.floor(item.data.tc)}°
                </p>
                <p className="text-[2.8vh] font-medium leading-[3.2vh] font-name-kanit">
                    {cond_status_txt(item.data.cond)}
                </p>
                <p className="text-[2.3vh] font-normal leading-[2.3vh] font-name-kanit">
                    {lang["temp_feel_like"]} {Math.floor(heat_index(Calcius_to_fahrenheit(item.data.tc), item.data.rh))}°
                </p>
                <p className="text-[2.5vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                    {lang['rain_count']} {item.data.rain} mm
                </p>
                </div>
            </div>

            <div className="col-span-2 h-[12vh]">
                <div className="w-full h-full flex items-center justify-center">
                    {new Date(item.time).getHours() < 18 && new Date(item.time).getHours() > 6 ? (
                        <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className='max-w-[15vh] h-[12vh]'/>
                    ) : (
                        <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/night/${item.data.cond}.svg`} className='max-w-[15vh] h-[12vh]'/>
                    )}
                </div>
            </div>
        </div>
      </div>
    )):(
        <div>
            {lang['error_message']['not_data']}
        </div>
    );  

    return (
        <>

        <p className='text-[3vh] leading-[3vh] mt-[1.2vh] mb-[0.5vh] font-normal font-name-kanit'>
            {lang['now_header']['hourly_forecast']}
        </p>

        {/* แสดง error หาก errorStatus เป็น true */}
        {(errorStatus || HourlyTMD === null) && loadingStatus === false ? (
          <div className="w-[100%] h-[50vh] flex items-center justify-center">
            <p className="text-[3vh] font-semibold font-name-kanit text-center">
              {lang["error_message"]["tmd"]}
            </p>
          </div>
        ) : null}


        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        { loadingStatus ? (
            <div className="w-[100%] h-[50vh] flex items-center justify-center">
                <LoadingSpin />
            </div>
        ):(
            /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
            <>
            {/* ตรวจสอบว่าไม่มี error */}
            { errorStatus === false && HourlyTMD !== null ? (

                <div className='h-[85%] w-full'>
                    <div className='max-w-[90vw] mx-auto h-[100%] overflow-y-auto'>
                        <div className='flex flex-col'>
                            {listHourly}
                        </div>
                    </div>
                </div>

            ) : null}
            </>
        )}
        
        </>
    )
};

export default TMD_48hour;