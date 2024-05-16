import React,{useState, useEffect} from "react";

import translate from "../../../../function/languages";

import LoadingSpin from '../../loading_spin';

import {getDataDay_TMD, cond_status_txt} from '../../../../function/weather/data';
import {heat_index, Calcius_to_fahrenheit} from '../../../../function/weather/calculate';

interface TMDDailyInterface {
    open: boolean;
    LangCode: string;
    position: {lat:number, lon:number} | null;
    count_day: number;

}
function TMDDaily({open ,LangCode, position, count_day}: TMDDailyInterface){

    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]);

    const [DailyTMD, setDailyTMD] = useState<any>([]);

    async function getTMD_Day(lat:number, lng:number, day:number){
        try{
            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const data = await getDataDay_TMD(lat, lng, day);
            //console.log("data",data);
            const WeatherForecasts = data;        
            //console.log(NowTMD);

            //ข้อมูลรายชั่วโมง
            setDailyTMD(WeatherForecasts);

            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

        }catch(error){
            setErrorStatus(true);
        }
    }
    useEffect(() => {
        if(open && count_day !== null){
            if(position !== null){
                getTMD_Day(position['lat'], position['lon'], count_day)
            }else{
                const default_lat = Number(process.env.REACT_APP_DEFAULT_LAT);
                const default_lon = Number(process.env.REACT_APP_DEFAULT_LON);
                getTMD_Day(default_lat, default_lon, count_day);
            }
        }
        console.log("props.count_day",count_day);
        
    }, [open, position , count_day]);


    const [atdate, setatdate] = useState<string>(localStorage.getItem('languages') === "th-TH" ? 'ที่ ' : '');
    const listDaily = DailyTMD.map((item:any, index:number) => (
        <div key={index}
          className="w-full flex-none h-full border-b-2 pb-[1vh] pt-[0.5vh] first:pt-[0vh] last:border-b-0 border-black "
        >
          <p className=" text-[2.5vh] font-normal text-indigo-900 font-name-kanit">
              { 
              lang['day_title'][new Date(item.time).getDay()]+ atdate +new Date(item.time).getDate()+" "+
              lang['month_title'][new Date(item.time).getMonth()]+" "+(new Date(item.time).getFullYear()+543)
              }
          </p>
          <div className="grid grid-cols-6">
              <div className="col-span-4">
                  <p className="text-[3.5vh] font-bold leading-[4vh] font-name-kanit">
                      {Math.floor(item.data.tc)}°
                  </p>
                  <p className="text-[2.8vh] font-medium leading-[3vh] font-name-kanit">
                      {cond_status_txt(item.data.cond)}
                  </p>
                  <p className="text-[2.3vh] font-normal font-name-kanit ">
                      {lang["temp_feel_like"]} {Math.floor(heat_index(Calcius_to_fahrenheit(item.data.tc), item.data.rh))}°
                  </p>
                  <p className="text-[2.1vh] font-normal font-name-kanit text-sky-700">
                      {lang['temp_min']} {item.data.tc_min}° {lang['max']} {item.data.tc_max}°
                  </p>
                  <p className="text-[2.5vh] font-normal text-amber-800 leading-[2.5vh] font-name-kanit">
                      {lang['rain_count']} {item.data.rain} mm
                  </p>
              </div>
  
              <div className="col-span-2 flex items-center justify-center">
                    <div className="h-[9.5vh]">
                        {new Date(item.time).getHours() < 18 && new Date(item.time).getHours() > 6 ? (
                          <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                        ) : (
                            <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/night/${item.data.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                        )}
                    </div>
              </div>
          </div>
        </div>
    ));  
    return (
    <>
        <p className='text-[1.8rem] mb-[0.5vh] font-normal font-name-kanit'>
            {lang['title']['daily_forecast']}
        </p>

        {/* แสดง error หาก errorStatus เป็น true */}
        {(errorStatus || DailyTMD.length === 0) && loadingStatus === false ? (
        <div className="w-[100%] h-[90%] flex items-center justify-center">
            <p className="text-[1.5rem] font-semibold font-name-kanit text-center">
              {lang["error_message"]["tmd"]}
            </p>
        </div>
        ) : null}

        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        { loadingStatus ? (
            <div className="w-[100%] h-[90%] flex items-center justify-center overflow-y-hidden ">
                <LoadingSpin />
            </div>
        ): null}

        {/* ตรวจสอบว่าไม่มี error */}
        { errorStatus === false && DailyTMD.length !== 0 && loadingStatus === false ? (
            /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
            <div className=' max-h-[90%] w-full mx-auto overflow-y-auto'>
                <div className='flex flex-col'>
                    {listDaily}
                </div>
            </div>
        ) : null}

    </>
    );
}

export default TMDDaily;