import React,{useEffect, useRef, useState} from "react";

import translate from "../../../../function/languages";

import {getNow_Wunderground, getAirQ_Wunderground, get24Hour_Wunderground} from '../../../../function/weather/data';
import {airq_status_txt} from '../../../../function/weather/calculate';


import "../../../../css/font.css";
import LoadingSpin from '../../loading_spin';

interface WundergroundNowInterface {
    open: boolean;
    LangCode: string;
    position: {lat: number, lon: number} | null;
}
function WundergroundNow ({open, LangCode, position}:WundergroundNowInterface){

    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]);

    const [NowWunderground, setNowWunderground] = useState<any>(null);
    const [Hourly, setHourly] = useState<any>(null);

    async function getData(lat:number, lng:number){
        try{

            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const now_data = await getNow_Wunderground(lat, lng);
            const airq_data = await getAirQ_Wunderground(lat, lng);
            
            //ข้อมูลปัจจุบัน
            setNowWunderground({
                temp: now_data.temperature,
                temp_feel: now_data.temperatureFeelsLike,
                rain: now_data.precip1Hour,
                cond_txt: now_data.wxPhraseLong,
                cond: now_data.iconCode,
                time: now_data.validTimeLocal,
                air_quality:{
                    have: true,
                    api: airq_data.globalairquality.airQualityIndex,
                    aqi_text: airq_status_txt(airq_data.globalairquality.airQualityIndex),
                    concentration: airq_data.globalairquality.pollutants['PM2.5'].amount,
                    mainPollutant: airq_data.globalairquality.primaryPollutant,
                }
            });
            
            //console.log(NowWunderground);

            //ข้อมูลรายชั่วโมง
            const hourly_data = await get24Hour_Wunderground(lat, lng);
            console.log('aa',hourly_data);
            setHourly(hourly_data);

            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

            return hourly_data;

        }catch(error){
            //console.log(error);
            setErrorStatus(true);
        }
    }
    useEffect(() => {
        if (open && position !== null) {
            // Only call getTMD_today when the necessary props or state values change
            if(position !== null){
                getData(position['lat'], position['lon']);
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

    const data_for_map = [0,1,2,3,4,5,6,7,8,9,10,11]
    const listHourly = Hourly !== null?  data_for_map.map((item) => (
        <div key={item} className="w-1/3 flex-none h-full border-r-2 last:border-r-0 border-black pt-[1vh]">
            <p className="text-center text-[2.1vh] font-normal leading-[2.2vh] font-name-kanit">
                {new Date(Hourly["validTimeLocal"][item]).getHours() <= 9
                ? "0" + new Date(Hourly["validTimeLocal"][item]).getHours() + ":00"
                : new Date(Hourly["validTimeLocal"][item]).getHours() + ":00"}
            </p>
            <p className="text-center text-[2.1vh] font-normal mt-[0.5vh] leading-[2.2vh] font-name-kanit">
                {Hourly["temperature"][item]}°
            </p>

            <div className="w-[35%] h-[7vh] mx-auto mt-[1vh] mb-[1vh] flex items-center justify-center">
                <img alt='' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${Hourly["iconCode"][item]}.svg`} className='max-w-[15vh] h-[8.5vh]'/>
            </div>

            <p className="text-center text-[2vh] font-normal font-name-kanit">
                {lang['rain_perchine']}
            </p>
            <p className='text-center text-[2vh] font-semibold font-name-kanit'>
                {Hourly["precipChance"][item]} %
            </p>
        </div>
    ))
        : (
        <div>
            {lang['error_message']['not_data']}
        </div>
    );


    return (
    <div className="max-h-[95%] overflow-y-auto">
        <p className='text-[3vh] mb-[0.5vh] font-normal font-name-kanit'>
            {lang['title']['now']}
        </p>


        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        { loadingStatus ? (
            <div className="w-[100%] h-[60dvh] flex items-center justify-center">
                <LoadingSpin />
            </div>
        ): null}


        {/* แสดง error หาก errorStatus เป็น true */}
        {(errorStatus || NowWunderground === null || Hourly === null) && loadingStatus === false  ? (
            <div className="w-[100%] h-[60dvh] flex items-center justify-center">
              <p className="text-[3vh] font-semibold font-name-kanit text-center">
                {lang["error_message"]["wunderground"]}
              </p>
            </div>
        ) : null}


        {/* ตรวจสอบว่าไม่มี error */}
        { errorStatus === false && NowWunderground !== null && Hourly !== null && loadingStatus === false ? (
            <>
            {/* ****** แสดงข้อมูลที่ดึงมาได้ ****** */}
            <div className='bg-rose-200 rounded-lg w-[100%] h-fit p-[2vh] shadow-md shadow-neutral-800/40'>

                <div className='grid grid-cols-6 h-[12vh]'>
                    <div className='col-span-4 '>
                        <p className='text-[5vh] leading-[5vh] font-semibold font-name-kanit'>{Math.floor(NowWunderground.temp)}°</p>
                        <p className='text-[2.7vh] font-normal leading-[3vh] font-name-kanit'>{NowWunderground.cond_txt}</p>
                        <p className='text-[2.7vh] font-normal leading-[4vh] font-name-kanit'>{lang['temp_feel_like']} {Math.floor(NowWunderground.temp_feel)}°</p>
                    </div>

                <div className='col-span-2 h-[12vh]'>
                        <div className='w-full h-full flex justify-center items-center'>
                            <div className='h-[11vh]'>
                                    <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${NowWunderground.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className='mt-[2vh] bg-slate-50 rounded-lg h-[29vh] shadow-md shadow-neutral-800/40 pt-[1vh] pl-[2vh] pr-[2vh]'>
                <p className='text-[2.5vh] font-[550] leading-[3vh] font-name-kanit'>{lang['now_header']['hourly_forecast']}</p>

                <div className='relative h-[82%] w-full mt-[1vh]'>
                    <div className='max-w-[90vw] mx-auto h-[100%]'>
                        <div className='overflow-x-scroll flex h-[100%]'
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
            
            <div className=' mb-[0.5rem] bg-orange-100 rounded-lg w-full h-fit shadow-md shadow-neutral-800/40 mt-[2vh] px-[2vh] pt-[1vh] pb-[1.5vh]'>
                <p className='text-[2.5vh] font-semibold font-name-kanit'>{lang['now_header']['prophecy_air_quality']}</p>
                
                {NowWunderground.air_quality.have ? 
                <div className='grid grid-cols-12 gap-6'>
                    <div className='col-span-4'>
                        <div className='w-full h-full grid place-items-center'>
                            <div>
                                <p className='text-[6vh] font-bold font-name-kanit text-center'>
                                    {NowWunderground.air_quality.api}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='col-span-8'>
                        <p className='text-[1.8rem] font-extrabold font-name-kanit'>{NowWunderground.air_quality.aqi_text}</p>
                        <p className='text-[1.25rem] font-normal leading-[2.5vh] font-name-kanit'>
                            {lang['tmd_airq_name_data'][NowWunderground.air_quality.mainPollutant]}
                            </p>
                        <p className='text-[1.25rem] font-extralight leading-[2.5vh] font-name-kanit'>
                            {NowWunderground.air_quality.concentration} µg/m³
                            </p>
                    </div>
                </div>
                    :
                <div className='h-[10vh] grid place-items-center'> 
                    <p className='text-[3.3vh] font-bold font-name-kanit text-center'>{lang['tmd_not_station_airq']}</p>
                </div>
                    }

                </div>
            </>
        ) : null}

    </div>
    )
}

export default WundergroundNow;