import React, {useState, useEffect} from 'react';

import {getNow_Wunderground, getAirQ_Wunderground, get24Hour_Wunderground} from '../../../../function/weather/data';
import {airq_status_txt} from '../../../../function/weather/calculate';

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
}
function WundergroundNow(props:OuterFunctionProps) {

    const [NowWunderground, setNowWunderground] = useState<any>({
        temp: '0',
        temp_feel: '0',
        rain: 0,
        cond_txt: '',
        cond: 0,
        time: '',
        air_quality:{}
    });

    const [Hourly, setHourly] = useState<any>([]);

    // สถานะการโหลดข้อมูล
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getTMD_today(lat:number, lon:number){
        try{

            //แสดง loading
            setLoadingStatus(true);

            //ดึงข้อมูล
            const now_data:any = await getNow_Wunderground(lat, lon);
            const airq_data:any = await getAirQ_Wunderground(lat, lon);
            
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
            const hourly_data:any = await get24Hour_Wunderground(lat, lon);
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
        if (props.useFrom === 'wunderground') {
            // Only call getTMD_today when the necessary props or state values change
            if(props.position !== null){
                getTMD_today(props.position.lat, props.position.lon);
            }
        } else {
            //console.log('useFrom', props.useFrom);
        }
    }, [props.position, props.showStatus , props.useFrom]);
    

            

    const [lang, setLang] = useState<any>(translate(localStorage.getItem('languages') as string));
    useEffect(() => {
        setLang(translate(localStorage.getItem('languages') as string));
    }, [props.LangRe])

    const data_for_map:Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8 ,9 ,10 ,11]

    const listHourly = Hourly["validTimeLocal"] !== undefined?  data_for_map.map((item:any) => (
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
                <img alt='icon_weather_wunder' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${Hourly["iconCode"][item]}.svg`} className='max-w-[15vh] h-[8.5vh]'/>
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
        <>
        <p className='text-[3vh] mb-[0.5vh] font-normal font-name-kanit'>
            {lang['title']['now']}
        </p>


        {/* แสดง error หาก errorStatus เป็น true */}
        {errorStatus ? (
          <div className="w-[100%] h-[50vh] flex items-center justify-center">
            <p className="text-[3vh] font-semibold font-name-kanit text-center">
              {lang["error_message"]["wunderground"]}
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

        {/* ตรวจสอบว่าไม่มี error */}
        { errorStatus === false ? (
            <>
            {/* ****** แสดงข้อมูลที่ดึงมาได้ ****** */}
            <div className='relative'>
                <div className='bg-rose-200 rounded-lg w-[100%] h-fit py-[1vh] shadow-md shadow-neutral-800/40 px-[2vh]'>
                    <div className='grid grid-cols-6 h-[12vh]'>
                        <div className='col-span-4'>
                            <p className='text-[5vh] leading-[5vh] font-semibold font-name-kanit'>{Math.floor(NowWunderground.temp)}°</p>
                            <p className='text-[2.7vh] font-normal leading-[3vh] font-name-kanit'>{NowWunderground.cond_txt}</p>
                            <p className='text-[2.7vh] font-normal leading-[4vh] font-name-kanit'>{lang['temp_feel_like']} {Math.floor(NowWunderground.temp_feel)}°</p>
                        </div>

                        <div className='col-span-2 h-[12vh]'>
                            <div className='w-full h-full flex justify-center items-center'>
                                <div className='h-[11vh]'>
                                    <img alt='wunderground_cloud' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${NowWunderground.cond}.svg`} className="max-w-[15vh] h-[12vh]"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className='mt-[2vh]'>

                    <div className=' bg-slate-50 rounded-lg h-[29vh] shadow-md shadow-neutral-800/40 pt-[1vh] px-[2vh]'>
                        <p className='text-[2.3vh] font-[550] leading-[3vh] font-name-kanit'>{lang['now_header']['hourly_forecast']}</p>

                        <div className='relative h-[82%] w-full mt-[1vh]'>
                            <div className='max-w-[90vw] mx-auto h-[100%]'>
                                <div className='overflow-x-scroll flex h-[100%]'>
                                    {listHourly}
                                </div>
                            </div>
                        </div>

                    </div>
            </div>
            
            <div className='mb-[0.5rem]'>
                <div className='bg-orange-100 rounded-lg w-full h-fit shadow-md shadow-neutral-800/40 mt-[2vh] mb-[1vh] px-[2vh] py-[2vh]'>
                    <p className='text-[2.7vh] font-semibold font-name-kanit'>{lang['now_header']['prophecy_air_quality']}</p>
                    {NowWunderground.air_quality.have ? 
                    <div className='grid grid-cols-12 gap-x-[2vh] mt-[0.5vh]'>
                        <div className='col-span-3'>
                            <div className='w-full h-full pl-[1.3vh] grid place-items-center'>
                            <div>
                                <p className='text-[6vh] font-bold font-name-kanit text-center'>
                                    {NowWunderground.air_quality.api}
                                </p>
                            </div>
                            </div>
                        </div>

                        <div className='col-span-9'>
                            <p className='text-[2rem] leading-[2rem] font-extrabold font-name-kanit'>{NowWunderground.air_quality.aqi_text}</p>
                            <p className='text-[1.4rem] font-normal leading-[1.4rem] font-name-kanit'>{lang['tmd_airq_name_data'][NowWunderground.air_quality.mainPollutant]}</p>
                            <p className='text-[1.4rem] font-extralight leading-[1.4rem] font-name-kanit'>{NowWunderground.air_quality.concentration} µg/m³</p>
                        </div>
                    </div>
                    :
                    <div className='h-[10vh] grid place-items-center'> 
                        <div><p className='text-[3.3vh] font-bold font-name-kanit text-center'>{lang['tmd_not_station_airq']}</p></div>
                    </div>
                    }

                </div>
            </div>
            </>
        ) : null}

        </>
        )}
        </>
    )
};

export default WundergroundNow;