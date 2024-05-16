import React,{useState, useEffect} from "react";

import translate from "../../../../function/languages";
import { get48Hour_Wunderground } from "../../../../function/weather/data";

import "../../../../css/font.css";

import LoadingSpin from "../../loading_spin";

interface WundergroundHourlyInterface {
    open: boolean;
    LangCode: string;
    position: {lat: number, lon: number} | null;
}

function WundergroundHourly ({open, LangCode, position}:WundergroundHourlyInterface){
    const [lang, setLang] = useState<any>(translate(null));
    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]);

    const [Hourly, setHourly] = useState<any>(null);
    async function getWondergroundData(lat:number, lng:number){
        try{
            //แสดง loading
            setLoadingStatus(true);

            //ข้อมูลรายชั่วโมง
            const hourly_data = await get48Hour_Wunderground(lat, lng);
            console.log('aa',hourly_data);
            setHourly(hourly_data);

            //ซ่อน loading
            setTimeout(function(){
                setLoadingStatus(false);
            }, 200);

            return hourly_data;
        }catch(error){
            console.log(error);
            setErrorStatus(true);
        }

    }
    useEffect(() => {
        if (open) {
            // Only call getTMD_today when the necessary props or state values change
            if(position !== null){
                getWondergroundData(position['lat'], position['lon']);
            }
        }
        console.log('hourly');
    }, [position, open]);

    const listHourly = Hourly !== null?  Hourly["validTimeLocal"].map((data, item) => (
        <div key={item} className="w-full flex-none h-full border-b-2 pb-[1vh] pt-[0.5vh] first:pt-[0vh] last:pb-[0rem] last:border-b-0 border-black">
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
                    <p className="text-[2.8vh] font-normal leading-[3.2vh] font-name-kanit">
                    {Hourly["wxPhraseLong"][item]}
                    </p>
                    <p className="text-[2.1vh] font-normal leading-[2.3vh] font-name-kanit">
                        {lang["temp_feel_like"]} {Math.floor(Hourly["temperatureFeelsLike"][item])}°
                    </p>
                    <p className="text-[2.3vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                        {lang['rain_perchine']} {Hourly["precipChance"][item]} %
                    </p>
                </div>

                <div className="col-span-2">
                    <div className="w-full h-full flex items-center justify-center">
                        <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${Hourly["iconCode"][item]}.svg`} className="max-w-[15vh] h-[12vh]" />
                    </div>
                </div>
            </div>
        </div>
    )) : (
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
        {errorStatus && loadingStatus === false ?
            <div className="w-[100%] h-[90%] flex items-center justify-center">
                <p className="text-[3vh] font-semibold font-name-kanit text-center">
                    {lang["error_message"]["wunderground"]}
                </p>
            </div>
        : null
        }

        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        {loadingStatus ?
            <div className="w-[100%] h-[90%] flex items-center justify-center">
                <LoadingSpin />
            </div>
        : null
        }

        {/* แสดงข้อมูล */}
        { errorStatus === false && loadingStatus === false && Hourly !== null ? (
            /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
            <div className='max-h-[90%] w-full mx-auto overflow-y-auto'>
                <div className='flex flex-col'>
                    {listHourly}
                </div>
            </div>
        ) : null}
    </>
    )
}

export default WundergroundHourly;