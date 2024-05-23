import React,{useState, useEffect, createRef} from "react";

import translate from "../../../function/languages";
import {airq_status_explain} from "../../../function/weather/calculate";

import "../../../css/font.css";
import "../../../css/animation.css";

interface OuterFunctionProps {
    open: boolean;
    closeLayer: Function;
    LangCode: string;
    StationData: {
        dustboy_lat: number;
        dustboy_lon: number;
        id: number;
        log_datetime: string;
        pm10: number;
        pm25: number;
        th_aqi: number;
        us_aqi: number;
    } | null;
}

export default function AirQualityModel({open, closeLayer, LangCode , StationData}:OuterFunctionProps) {
    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]); 

    const [open_modal, set_open_modal] = useState<boolean>(false);


    // Open Modal
    useEffect(() => {
        set_open_modal(true);
    }, [open]);

    //aqi color
    const [aqi_color, set_aqi_color] = useState<string>('');
    const element_pm25 = createRef<HTMLParagraphElement>();
    const element_usaqi = createRef<HTMLParagraphElement>();
    useEffect(() => {
        if(StationData?.us_aqi){
            if(StationData.us_aqi <= 25){
                set_aqi_color('green');
                
                element_pm25.current?.classList.add('text-green-600');
                element_usaqi.current?.classList.add('text-green-600');
            }else if(StationData?.us_aqi <= 50 && StationData?.us_aqi > 25){
                set_aqi_color('green');

                element_pm25.current?.classList.add('text-green-600');
                element_usaqi.current?.classList.add('text-green-600');
            }else if(StationData?.us_aqi <= 100 && StationData?.us_aqi > 50){
                set_aqi_color('yellow');

                element_pm25.current?.classList.add('text-yellow-600');
                element_usaqi.current?.classList.add('text-yellow-600');
            }else if(StationData?.us_aqi <= 150 && StationData?.us_aqi > 100){
                set_aqi_color('orange');

                element_pm25.current?.classList.add('text-orange-600');
                element_usaqi.current?.classList.add('text-orange-600');
            }else if(StationData?.us_aqi <= 200 && StationData?.us_aqi > 150){
                set_aqi_color('red');

                element_pm25.current?.classList.add('text-red-600');
            }else if(StationData?.us_aqi <= 300 && StationData?.us_aqi > 200){
                set_aqi_color('purple');

                element_pm25.current?.classList.add('text-purple-600');
                element_usaqi.current?.classList.add('text-purple-600');
            }else if(StationData?.us_aqi > 300){
                set_aqi_color('rose');

                element_pm25.current?.classList.add('text-rose-600');
                element_usaqi.current?.classList.add('text-rose-600');
            }
        }
    }, [StationData?.us_aqi]);  

    function closeModal(){
        set_open_modal(false);
        setTimeout(() => {
            closeLayer();
        }, 200);
    }


    return (
        <div className={`w-[650px] h-fit bg-white rounded-xl border-slate-500 border drop-shadow-2xl p-4 flex flex-col modal ${open_modal ? 'open' : 'close'}`}>

            <div className="w-[100%] grid grid-cols-6">
                <p className="col-span-5 text-2xl font-bold font-name-kanit">
                    {lang['airquality_modal_station']}
                </p>
                <div className='col-span-1 text-right' onClick={() => closeModal()}>
                    <i className='icon-cross text-[1.6rem]'></i>
                </div>
            </div>

            <div className="w-[100%] h-[1px] bg-slate-500 my-4"></div>

            <div className="w-[100%] h-[50%] flex items-center justify-center space-x-8">
                <div className="w-[50%] h-[100%] flex items-center justify-center">
                    <div className="w-[100%] h-[90%] text-center bg-gray-200 shadow-sm shadow-black/30 rounded-lg p-6">
                        <p className="text-3xl font-bold font-name-kanit">
                            {lang['airquality_modal']['aqi']}
                        </p>
                        <p ref={element_usaqi} className="text-5xl font-bold font-name-kanit">
                            {StationData?.us_aqi}
                        </p>
                    </div>
                </div>
                <div className="w-[50%] h-[100%] flex items-center justify-center">
                    <div className="w-[100%] h-[90%] text-center bg-gray-200 shadow-sm shadow-black/30 rounded-lg p-6">
                        <p className="text-3xl font-bold font-name-kanit">
                            {lang['airquality_modal']['pm25']}
                        </p>
                        <p ref={element_pm25} className={`text-5xl font-bold font-name-kanit`}>
                            {StationData?.pm25}
                        </p>
                    </div>
                </div>
            </div>

            <div className={`p-4 rounded-lg w-[100%] bg-${aqi_color}-400 shadow-sm shadow-black/30 mt-4 text-3xl font-name-kanit`}>
                {airq_status_explain(StationData?.us_aqi as number)}
            </div>

            <div className="w-[100%] h-[1px] bg-slate-500 mt-4 mb-3"></div>
            <p className="text-2xl font-bold font-name-kanit">
                {lang['airquality_modal']['datetime']} : {new Date(StationData?.log_datetime as string).toLocaleString('th-TH')}
            </p>

            

        </div>
    );
}