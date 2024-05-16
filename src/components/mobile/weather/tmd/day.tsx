import React, {useState, useEffect} from 'react';

import {getDataDay_TMD, cond_status_txt} from '../../../../function/weather/data';
import {Calcius_to_fahrenheit, heat_index} from '../../../../function/weather/calculate';

import translate from '../../../../function/languages';

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
    useFrom: string;
    LangRe: string;
    count_day: number;
}

function TMD_Day(props:OuterFunctionProps) {

    const [DailyTMD, setDailyTMD] = useState<any>(null);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getTMD_Day(lat:number, lon:number, day:number){
        try{

            //แสดง loading
            setLoadingStatus(true);
            //ดึงข้อมูล
            const data:any = await getDataDay_TMD(lat, lon, day);
            //console.log("data",data);
            const WeatherForecasts:any = data;        
            //console.log('WeatherForecasts',WeatherForecasts);

            //ข้อมูลรายชั่วโมง
            setDailyTMD(WeatherForecasts);

            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

        }catch(error){
            console.log(error);
            setErrorStatus(true);
            
        }
    }
    useEffect(() => {
        if(props.showStatus){
            if(props.position){
                getTMD_Day(props.position.lat, props.position.lon, props.count_day)
            }
        }
        console.log("props.count_day",props.count_day);
        
    }, [props.position, props.showStatus , props.useFrom, props.count_day]);

    useEffect(() => {
        console.log("DailyTMD",DailyTMD);
    }, [DailyTMD]);

    const [lang, setLang] = useState<any>(translate(localStorage.getItem('languages') as string));
    useEffect(() => {
        setLang(translate(localStorage.getItem('languages') as string));
    }, [props.LangRe])
    const [atdate] = useState<string>(localStorage.getItem('languages') === "th-TH" ? 'ที่ ' : '');


    const listDaily = DailyTMD !== null ? DailyTMD.map((item:any, index:number) => (
      <div key={index}
        className="w-full flex-none h-full border-b-2 pt-[1vh] pb-[1vh] last:pb-0 first:pt-[0vh] last:border-b-0 border-black "
      >
        <p className=" text-[2.8vh] font-normal text-indigo-900 font-name-kanit">
            { 
            lang['day_title'][new Date(DailyTMD[index].time).getDay()]+ atdate +new Date(DailyTMD[index].time).getDate()+" "+
            lang['month_title'][new Date(DailyTMD[index].time).getMonth()]+" "+(new Date(DailyTMD[index].time).getFullYear()+543)
            }
        </p>
        <div className="grid grid-cols-6 h-[14vh]">
            <div className="col-span-4 flex items-center h-[14vh]">
                <div>
                <p className="text-[4vh] font-bold leading-[4vh] font-name-kanit">
                    {Math.floor(DailyTMD[index].data.tc)}°
                </p>
                <p className="text-[2.8vh] font-medium leading-[3vh] font-name-kanit">
                    {cond_status_txt(DailyTMD[index].data.cond)}
                </p>
                <p className="text-[2.3vh] font-normal leading-[2.4vh] font-name-kanit">
                    {lang["temp_feel_like"]} {Math.floor(heat_index(Calcius_to_fahrenheit(DailyTMD[index].data.tc), DailyTMD[index].data.rh))}°
                </p>
                <p className="text-[1.3rem] font-normal leading-[2.4vh] font-name-kanit text-sky-700">
                    {lang['temp_min']} {DailyTMD[index].data.tc_min}° {lang['max']} {DailyTMD[index].data.tc_max}°
                </p>
                <p className="text-[2.3vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                    {lang['rain_count']} {DailyTMD[index].data.rain} mm
                </p>
                </div>
            </div>

            <div className="col-span-2 h-[14vh]">
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
            {lang['title']['daily_forecast']}
        </p>


        {/* แสดง error หาก errorStatus เป็น true */}
        {(errorStatus || DailyTMD === null) && loadingStatus === false ? (
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
        <>
        </>
        )}

        {/* ตรวจสอบว่าไม่มี error แสดงข้อมูลที่ดึงมาได้ */}
        { errorStatus === false && loadingStatus === false && DailyTMD !== null ? (
                /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
                <div className='h-[85%] w-full'>
                    <div className='max-w-[90vw] mx-auto h-[100%] overflow-y-auto'>
                        <div className='flex flex-col'>
                            {listDaily}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
};

export default TMD_Day;