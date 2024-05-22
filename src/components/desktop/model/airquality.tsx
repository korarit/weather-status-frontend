import React,{useState, useEffect} from "react";

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

    useEffect(() => {
        set_open_modal(open);
        console.log("StationData", StationData);
    }, [open]);


    return (
        <div className={`w-[650px] h-fit bg-white rounded-xl border-slate-500 border drop-shadow-2xl p-4 flex flex-col modal ${open_modal ? 'open' : 'close'}`}>

            <div className="w-[100%] grid grid-cols-6">
                <p className="col-span-5 text-2xl font-bold font-name-kanit">
                    {lang['airquality_modal_station']}
                </p>
                <div className='col-span-1 text-right' onClick={() => closeLayer()}>
                    <i className='icon-cross text-[1.6rem]'></i>
                </div>
            </div>

            <div className="w-[100%] h-[1px] bg-slate-500 my-4"></div>

            <div className="w-[100%] h-[50%] flex items-center justify-center space-x-8">
                <div className="w-[50%] h-[100%] flex items-center justify-center">
                    <div className="w-[100%] h-[90%] text-center bg-gray-200 rounded-lg p-6">
                        <p className="text-3xl font-bold font-name-kanit">
                            {lang['airquality_modal']['aqi']}
                        </p>
                        <p className="text-5xl font-bold font-name-kanit">
                            {StationData?.us_aqi}
                        </p>
                    </div>
                </div>
                <div className="w-[50%] h-[100%] flex items-center justify-center">
                    <div className="w-[100%] h-[90%] text-center bg-gray-200 rounded-lg p-6">
                        <p className="text-3xl font-bold font-name-kanit">
                            {lang['airquality_modal']['pm25']}
                        </p>
                        <p className="text-5xl font-bold font-name-kanit">
                            {StationData?.pm25}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg w-[100%] bg-gray-200 mt-4 text-3xl">
                {airq_status_explain(StationData?.us_aqi as number)}
            </div>

            <div className="w-[100%] h-[1px] bg-slate-500 mt-4 mb-3"></div>
            <p className="text-2xl font-bold font-name-kanit">
                {lang['airquality_modal']['datetime']} : {new Date(StationData?.log_datetime as string).toLocaleString('th-TH')}
            </p>

            

        </div>
    );
}