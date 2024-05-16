import React,{useState, useEffect} from "react";

import translate from "../../../../function/languages";
import { Calcius_to_fahrenheit, heat_index } from "../../../../function/weather/calculate";
import { getData48Hour_TMD , cond_status_txt } from "../../../../function/weather/data";

import LoadingSpin from '../../loading_spin';

import '../../../../css/font.css';

interface TMDHourlyInterface {
    open: boolean;
    LangCode: string;
    position: {lat:number, lon:number} | null;

}
function TMDHourly({open,LangCode, position}:TMDHourlyInterface){

    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]);

    const [HourlyTMD, setHourlyTMD] = useState<any>(null);

    async function getTMD_48hour(lat:number, lng:number){
        try{
            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const data = await getData48Hour_TMD(lat, lng);
            console.log("data",data);
            const WeatherForecasts = data.WeatherForecasts[0].forecasts;        
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
        if(open){
            if(position !== null){
                getTMD_48hour(position['lat'], position['lon'])
            }else{
                const default_lat = Number(process.env.REACT_APP_DEFAULT_LAT);
                const default_lon = Number(process.env.REACT_APP_DEFAULT_LON);
                getTMD_48hour(default_lat, default_lon);
            }
        }
    }, [open, position]);

    const listHourly = HourlyTMD !== null? HourlyTMD.map((item, index) => (
        <div key={index}
          className="w-full flex-none h-full border-b-2 pb-[1vh] pt-[0.5vh] first:pt-[0vh] last:pb-[0rem] last:border-b-0 border-black "
        >
          <p className=" text-[2.5vh] font-normal text-indigo-900 font-name-kanit">
            {new Date(item.time).getHours() <= 9
              ? "0" + new Date(item.time).getHours() + ":00 "+ lang['day_title'][new Date(item.time).getDay()]
              : new Date(item.time).getHours() + ":00 "+ lang['day_title'][new Date(item.time).getDay()] }
          </p>
          <div className="grid grid-cols-6">
              <div className="col-span-3">
                  <p className="text-[3.5vh] font-bold leading-[4vh] font-name-kanit">
                      {Math.floor(item.data.tc)}°
                  </p>
                  <p className="text-[2.8vh] font-medium leading-[3vh] font-name-kanit">
                      {cond_status_txt(item.data.cond)}
                  </p>
                  <p className="text-[2vh] font-normal font-name-kanit text-sky-700">
                      {lang["temp_feel_like"]} {Math.floor(heat_index(Calcius_to_fahrenheit(item.data.tc), item.data.rh))}°
                  </p>
                  <p className="text-[2.3vh] font-normal text-amber-800 leading-[2.5vh] font-name-kanit">
                      {lang['rain_count']} {item.data.rain} mm
                  </p>
              </div>
  
              <section className="col-span-3 flex items-center justify-center">
                    <div className="h-[9.5vh]">
                    {new Date(item.time).getHours() < 18 && new Date(item.time).getHours() > 6 ? (
                        <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/day/${item.data.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                    ) : (
                        <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/tmd/night/${item.data.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                    )}
                    </div>
              </section>
          </div>
        </div>
      )):(
        <div>
            {lang['error_message']['not_data']}
        </div>
      );

    return (
    <>
        <p className='text-[1.8rem] font-normal font-name-kanit'>
            {lang['now_header']['hourly_forecast']}
        </p>

        {/* แสดง error หาก errorStatus เป็น true */}
        {(errorStatus || HourlyTMD === null || HourlyTMD.length === 0) && loadingStatus === false ? (
          <div className="w-[100%] h-[94%] flex items-center justify-center">
            <p className="text-[1.5rem] font-semibold font-name-kanit text-center">
              {lang["error_message"]["tmd"]}
            </p>
          </div>
        ) : null}

        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        { loadingStatus ? (
            <div className="w-[100%] h-[90%] flex items-center justify-center overflow-y-hidden">
                <LoadingSpin />
            </div>
        ): null}
        
        {/* ****** แสดงข้อมูลที่ดึงมาได้ ****** */}
        { errorStatus === false && loadingStatus === false && HourlyTMD !== null && HourlyTMD.length === 0 ? (
        <div className='max-h-[90%] w-full mx-auto overflow-y-auto'>
            <div className=' flex flex-col'>
                {listHourly}
            </div>
        </div>  

        ) : null}
    </>
    );
}

export default TMDHourly;