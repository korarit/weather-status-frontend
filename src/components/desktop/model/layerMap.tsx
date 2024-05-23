import React,{useState, useEffect} from "react";

import translate from "../../../function/languages";

import "../../../css/font.css";
import "../../../css/animation.css";

interface OuterFunctionProps {
    open: boolean;
    mapsetting: any;
    SelectLayer:Function;
    closeLayer: Function;
    LangCode: string;
}

export default function LayerMapModel({open, mapsetting, SelectLayer, closeLayer, LangCode}:OuterFunctionProps) {
    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]); 

    useEffect(() => {
        if(mapsetting.use_map === "street"){
            document.getElementById(`map-layer-icon-street`)?.classList.add('border-sky-400');
            
            document.getElementById(`map-layer-icon-satelite`)?.classList.remove('border-sky-400');
            document.getElementById(`map-layer-icon-terrain`)?.classList.remove('border-sky-400');
        }
        if(mapsetting.use_map === "satelite"){
            document.getElementById(`map-layer-icon-satelite`)?.classList.add('border-sky-400');
            
            document.getElementById(`map-layer-icon-street`)?.classList.remove('border-sky-400');
            document.getElementById(`map-layer-icon-terrain`)?.classList.remove('border-sky-400');
        }
        if(mapsetting.use_map === "terrain"){
            document.getElementById(`map-layer-icon-terrain`)?.classList.add('border-sky-400');
            
            document.getElementById(`map-layer-icon-satelite`)?.classList.remove('border-sky-400');
            document.getElementById(`map-layer-icon-street`)?.classList.remove('border-sky-400');
        }
    }, [mapsetting.use_map, open]);


    const [open_modal, set_open_modal] = useState<boolean>(false);

    useEffect(() => {
        set_open_modal(open);
    }, [open]);

    function closeModal(){
        set_open_modal(false);
        setTimeout(() => {
            closeLayer();
        }, 200);
    }


    return (
        <div className={`w-[550px] h-fit bg-white rounded-xl border-slate-500 border drop-shadow-2xl p-4 flex flex-col modal ${open_modal ? 'open' : 'close'}`}>

            <div className="w-[100%] grid grid-cols-6">
                <p className="col-span-5 text-2xl font-bold font-name-kanit">
                    {lang['layer_setting']}
                </p>
                <div className='col-span-1 text-right' onClick={() => closeModal()}>
                    <i className='icon-cross text-[1.6rem]'></i>
                </div>
            </div>

            {/* button เลือก map */}
            <div className='w-[100%] grid grid-cols-3 h-fit gap-3 mt-[0.5rem]'>
                {/* ปุ่มเลือกแผนที่ street */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('use_map','street')}>
                    <i id="map-layer-icon-street" className='h-[8vh] rounded-lg border-2 map-layer-icon-street'></i>
                    <p className='mt-[4px] max-[300px]:text-sm md:text-3xl text-md laptop:text-2xl text-center font-normal font-name-kanit'>
                        {lang['layer_select']['default']}
                    </p>
                </div>

                {/* ปุ่มเลือกแผนที่ satelite (ดาวเทียม) */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('use_map','satelite')}>
                    <i id="map-layer-icon-satelite" className='h-[8vh] rounded-lg border-2 map-layer-icon-satelite'></i>
                    <p className='mt-[4px] max-[300px]:text-sm md:text-3xl text-md laptop:text-2xl text-center font-normal font-name-kanit'>
                            {lang['layer_select']['satelite']}
                    </p>
                </div>

                {/* ปุ่มเลือกแผนที่ terrain (ภูมิประเทศ) */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('use_map','terrain')}>
                    <i id="map-layer-icon-terrain" className='h-[8vh] rounded-lg border-2 map-layer-icon-terrain'></i>
                    <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                        {lang['layer_select']['terrain']}
                    </p>
                </div>
            </div>

            <hr className="mt-[0.5rem]"/>

            <div className='w-[100%] grid grid-cols-3 h-fit gap-3 mt-[0.8rem]'>
                {/* ปุ่มเพิ่ม layer เฆฆฝน ลงแผนที่ */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('rain', !mapsetting.rain)}>
                    <i className={`h-[9vh] rounded-lg border-2 ${mapsetting.rain ? "border-sky-400" : ""} map-layer-icon-rain`}></i>
                    <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                        {lang['layer_select']['rain']}
                    </p>
                </div>

                {/* ปุ่มเพิ่ม layer คุณภาพอากาศจาก iqair ลงแผนที่ */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('air_quality', !mapsetting.air_quality)}>
                    <i className={`h-[9vh] rounded-lg border-2 ${mapsetting.air_quality ? "border-sky-400" : ""} map-layer-icon-airquality`}></i>
                    <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                        {lang['layer_select']['air_quality']}
                    </p>
                </div>

                {/* ปุ่มเพิ่ม layer จุด hotspot (จุดความร้อน/ไฟป่า) ลงแผนที่ */}
                <div className='flex flex-col items-center' onClick={() => SelectLayer('fire', !mapsetting.fire)}>
                    <i className={`h-[9vh] rounded-lg border-2 ${mapsetting.fire ? "border-sky-400" : ""} map-layer-icon-firms`}></i>
                    <p className='mt-[4px] max-[300px]:text-sm text-md md:text-3xl laptop:text-2xl text-center font-normal font-name-kanit'>
                        {lang['layer_select']['fire']}
                    </p>
                </div>
            </div>

        </div>
    );
}