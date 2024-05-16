import React, {useState, useEffect} from 'react';

import {get48Hour_Wunderground} from '../../../../function/weather/data';
import translate from '../../../../function/languages';

import '../../../../css/font.css';
import '../../../../css/icon.css';
import '../../../../css/components/weather.css'

import LoadingSpin from '../../loading_spin';

interface  LatLonInterface{
    lat: number;
    lon: number;
}
interface OuterFunctionProps {
    position: LatLonInterface | null;
    showStatus: boolean;
    useFrom: string;
    LangRe: string;
}
function Wunderground_48hour(props:OuterFunctionProps) {

    const [Hourly, setHourly] = useState<any>([]);

    // สถานะการโหลดข้อมูล
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getWondergroundData(lat:number, lon:number){
        try{
            //แสดง loading
            setLoadingStatus(true);

            //ข้อมูลรายชั่วโมง
            const hourly_data:any = await get48Hour_Wunderground(lat, lon);
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

    ////////////////////////////////////// ดึงข้อมูล //////////////////////////////////////
    useEffect(() => {
        if (props.useFrom === 'wunderground') {
            // Only call getTMD_today when the necessary props or state values change
            if (props.position !== null) {
                getWondergroundData(props.position.lat, props.position.lon);
            }
        } else {
            console.log('useFrom', props.useFrom);
        }
    }, [props.position, props.showStatus , props.useFrom]);
    

    //////////////////////////////////////// Lang Translate ////////////////////////////////////////
    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe])

    // แสดงข้อมูลรายชั่วโมง
    const listHourly = Hourly["validTimeLocal"] !== undefined?  Hourly["validTimeLocal"].map((data:any, item:number) => (
        <div key={item} className="w-full flex-none h-full border-b-2 pb-[1vh] pt-[1vh] first:pt-[0vh] last:border-b-0 border-black  last:mb-[1vh]">
            <p className="  text-[2.8vh] font-normal text-indigo-900 font-name-kanit">
            {new Date(Hourly["validTimeLocal"][item]).getHours() <= 9
                ? "0" + new Date(Hourly["validTimeLocal"][item]).getHours() + ":00 "+ lang['day_title'][new Date(Hourly["validTimeLocal"][item]).getDay()]
                : new Date(Hourly["validTimeLocal"][item]).getHours() + ":00 "+ lang['day_title'][new Date(Hourly["validTimeLocal"][item]).getDay()] }
            </p>
            <div className="grid grid-cols-6">
                <div className="col-span-4">
                    <p className="text-[4vh] font-medium leading-[4vh] font-name-kanit">
                        {Hourly["temperature"][item]}°
                    </p>
                    <p className="text-[2.8vh] font-medium leading-[3.2vh] font-name-kanit">
                    {Hourly["wxPhraseLong"][item]}
                    </p>
                    <p className="text-[2.3vh] font-normal leading-[2.4vh] font-name-kanit">
                        {lang["temp_feel_like"]} {Math.floor(Hourly["temperatureFeelsLike"][item])}°
                    </p>
                    <p className="text-[2.5vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                        {lang['rain_perchine']} {Hourly["precipChance"][item]} %
                    </p>
                </div>

                <div className="col-span-2">
                    <div className="w-full h-full flex items-center justify-center">
                        <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${Hourly["iconCode"][item]}.svg`} className="max-w-[15vh] h-[12vh]" />
                    </div>
                </div>
            </div>
        </div>
        ))
        : (
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
            /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
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

export default Wunderground_48hour;