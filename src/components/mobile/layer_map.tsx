import React, {useEffect,useState} from 'react';

import translate from '../../function/languages';

import '../../css/font.css';
import '../../css/icon.css';

import '../../css/components/layer_map.css';

interface OuterFunctionProps {
    show: boolean;
    mapsetting: any;
    onPrees:any;
    closeLayer: () => void;
    LangRe: string;
}
function Layer_map(props:OuterFunctionProps) {

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe]); 

    if(props.mapsetting.use_map === "street"){
        document.getElementById(`map-layer-icon-${props.mapsetting.use_map}`)?.classList.add('border-sky-400');
        
        document.getElementById(`map-layer-icon-satelite`)?.classList.remove('border-sky-400');
        document.getElementById(`map-layer-icon-terrain`)?.classList.remove('border-sky-400');
    }
    if(props.mapsetting.use_map === "satelite"){
        document.getElementById(`map-layer-icon-${props.mapsetting.use_map}`)?.classList.add('border-sky-400');
        
        document.getElementById(`map-layer-icon-street`)?.classList.remove('border-sky-400');
        document.getElementById(`map-layer-icon-terrain`)?.classList.remove('border-sky-400');
    }
    if(props.mapsetting.use_map === "terrain"){
        document.getElementById(`map-layer-icon-${props.mapsetting.use_map}`)?.classList.add('border-sky-400');
        
        document.getElementById(`map-layer-icon-satelite`)?.classList.remove('border-sky-400');
        document.getElementById(`map-layer-icon-street`)?.classList.remove('border-sky-400');
    }
    
    return (
        <div className={`layer_map-box ${props.show ? 'show' : ''}`}
        >

            <div className='box mt-2'>
                {/* หัวข้อ */}
                <div className='col-span-12 grid grid-cols-6 sm:grid-cols-12'>
                    <div className='font-name-kanit col-span-5 sm:col-span-11 text-left text-xl md:text-4xl laptop:text-3xl'>{lang['layer_setting']}</div>
                    <div className='col-span-1 text-right' onClick={props.closeLayer}>
                        <i className='icon-cross text-xl md:text-4xl laptop:text-3xl'></i>
                    </div>
                </div>

                {/* wheather box */}
                <div className='col-span-12 px-0 mb-3'>

                    {/* button เลือก map */}
                    <div className='grid grid-cols-3 max-h-full gap-3 mt-[1vh]'>
                        {/* ปุ่มเลือกแผนที่ street */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_street}>
                            <i id="map-layer-icon-street" className='h-[8vh] rounded-lg border-2 map-layer-icon-street'></i>
                            <p className='mt-[4px] max-[300px]:text-sm md:text-3xl text-md laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['default']}
                            </p>
                        </div>

                        {/* ปุ่มเลือกแผนที่ satelite (ดาวเทียม) */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_satelite}>
                            <i id="map-layer-icon-satelite" className='h-[8vh] rounded-lg border-2 map-layer-icon-satelite'></i>
                            <p className='mt-[4px] max-[300px]:text-sm md:text-3xl text-md laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['satelite']}
                            </p>
                        </div>

                        {/* ปุ่มเลือกแผนที่ terrain (ภูมิประเทศ) */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_terrain}>
                            <i id="map-layer-icon-terrain" className='h-[8vh] rounded-lg border-2 map-layer-icon-terrain'></i>
                            <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['terrain']}
                            </p>
                        </div>
                    </div>

                    <hr className='mt-[1vh]'/>

                    <div className='grid grid-cols-3 max-h-full gap-[2vw] mt-[2vh]'>

                        {/* ปุ่มเพิ่ม layer เฆฆฝน ลงแผนที่ */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_layer.rain}>
                            <i className={`h-[9vh] rounded-lg border-2 ${props.mapsetting.rain ? "border-sky-400" : ""} map-layer-icon-rain`}></i>
                            <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['rain']}
                            </p>
                        </div>

                        {/* ปุ่มเพิ่ม layer คุณภาพอากาศจาก iqair ลงแผนที่ */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_layer.air_quality}>
                            <i className={`h-[9vh] rounded-lg border-2 ${props.mapsetting.air_quality ? "border-sky-400" : ""} map-layer-icon-airquality`}></i>
                            <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['air_quality']}
                            </p>
                        </div>

                        {/* ปุ่มเพิ่ม layer จุด hotspot (จุดความร้อน/ไฟป่า) ลงแผนที่ */}
                        <div className='flex flex-col items-center' onClick={props.onPrees.use_layer.fire}>
                            <i className={`h-[9vh] rounded-lg border-2 ${props.mapsetting.fire ? "border-sky-400" : ""} map-layer-icon-firms`}></i>
                            <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                                {lang['layer_select']['fire']}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Layer_map;
