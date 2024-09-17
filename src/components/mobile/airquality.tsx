import React, {useEffect,useState, createRef} from 'react';

import translate from '../../function/languages';
import {airq_status_explain} from "../../function/weather/calculate";


import '../../css/font.css';
import '../../css/icon.css';

import '../../css/components/layer_map.css';

interface OuterFunctionProps {
    show: boolean;
    mapsetting: any;
    onPrees:any;
    closeLayer: () => void;
    LangRe: string;

    dustboyData: {
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
function AirQuality(props:OuterFunctionProps) {

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe]); 

    //aqi color
    const element_pm25 = createRef<HTMLParagraphElement>();
    const element_usaqi = createRef<HTMLParagraphElement>();
    const element_text = createRef<HTMLDivElement>();

    useEffect(() => {
        if(props.dustboyData?.us_aqi){
            if(props.dustboyData.us_aqi <= 25){
                element_text.current?.classList.add('bg-green-400');
                
                element_pm25.current?.classList.add('text-green-600');
                element_usaqi.current?.classList.add('text-green-600');
            }else if(props.dustboyData?.us_aqi <= 50 && props.dustboyData?.us_aqi > 25){
                element_text.current?.classList.add('bg-green-400');

                element_pm25.current?.classList.add('text-green-600');
                element_usaqi.current?.classList.add('text-green-600');
            }else if(props.dustboyData?.us_aqi <= 100 && props.dustboyData?.us_aqi > 50){
                element_text.current?.classList.add('bg-yellow-400');

                element_pm25.current?.classList.add('text-yellow-600');
                element_usaqi.current?.classList.add('text-yellow-600');
            }else if(props.dustboyData?.us_aqi <= 150 && props.dustboyData?.us_aqi > 100){
                element_text.current?.classList.add('bg-orange-400');

                element_pm25.current?.classList.add('text-orange-600');
                element_usaqi.current?.classList.add('text-orange-600');
            }else if(props.dustboyData?.us_aqi <= 200 && props.dustboyData?.us_aqi > 150){
                element_text.current?.classList.add('bg-red-400');

                element_pm25.current?.classList.add('text-red-600');
            }else if(props.dustboyData?.us_aqi <= 300 && props.dustboyData?.us_aqi > 200){
                element_text.current?.classList.add('bg-purple-400');

                element_pm25.current?.classList.add('text-purple-600');
                element_usaqi.current?.classList.add('text-purple-600');
            }else if(props.dustboyData?.us_aqi > 300){
                element_text.current?.classList.add('bg-rose-400');

                element_pm25.current?.classList.add('text-rose-600');
                element_usaqi.current?.classList.add('text-rose-600');
            }
        }
    }, [props.dustboyData?.us_aqi]);  
    
    return (
        <div className={`layer_map-box ${props.show ? 'show' : ''}`}
        >

            <div className='box mt-2'>
                {/* หัวข้อ */}
                <div className='col-span-12 grid grid-cols-6 sm:grid-cols-12'>
                    <div className='font-name-kanit col-span-5 sm:col-span-11 text-left text-xl md:text-4xl laptop:text-3xl'>{lang['airquality_modal_station']}</div>
                    <div className='col-span-1 text-right' onClick={props.closeLayer}>
                        <i className='icon-cross text-xl md:text-4xl laptop:text-3xl'></i>
                    </div>
                </div>

                {/* wheather box */}
                <div className='my-2 col-span-12 flex flex-col space-y-2'>
                    <div className='grid grid-cols-2 gap-2'>

                        <div className='col-span-1 h-[10dvh] flex justify-center items-center bg-gray-200 rounded drop-shadow border border-gray-300'>
                            <div className="w-[100%] text-center">
                                <p className="text-2xl font-bold font-name-kanit">
                                {lang['airquality_modal']['aqi']}
                                </p>
                                <p ref={element_usaqi} className={`text-2xl font-bold font-name-kanit`}>
                                    {props.dustboyData?.us_aqi}
                                </p>
                            </div>
                        </div>

                        <div className='col-span-1 h-[10dvh] flex justify-center items-center bg-gray-200 rounded drop-shadow border border-gray-300'>
                            <div className="w-[100%] text-center">
                                <p className="text-2xl font-bold font-name-kanit">
                                    {lang['airquality_modal']['pm25']}
                                </p>
                                <p ref={element_pm25} className={`text-2xl font-bold font-name-kanit`}>
                                    {props.dustboyData?.pm25}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div ref={element_text} className={`p-4 rounded-lg w-[100%] shadow-sm shadow-black/30 mt-4 text-[18px] font-name-kanit`}>
                        {airq_status_explain(props.dustboyData?.us_aqi as number)}
                    </div>

                    <p className="text-mb font-medium font-name-kanit">
                        {lang['airquality_modal']['datetime']} : {new Date(props.dustboyData?.log_datetime as string).toLocaleString('th-TH')}
                    </p>

                </div>

                    
            </div>
        </div>
    );
}

export default AirQuality;
