import React, {useState, useEffect} from 'react';
// import { LatLngTuple } from 'leaflet';

//import '../../css/App.css';

import '../../css/font.css';
import '../../css/icon.css';

import '../../css/components/weather.css'

import translate from '../../function/languages';

import TMDNow from './weather/tmd/now';
import TMD48hour from './weather/tmd/48hour';
import TMDDay from './weather/tmd/day';


import WundergroundNow from './weather/wunderground/now';
import Wunderground48hour from './weather/wunderground/48hour';
import WundergroundDay from './weather/wunderground/day';
import WundergroundInDate from './weather/wunderground/indate';


interface LatLonInterface{
    lat: number;
    lon: number;
}

interface WeatherProps {
    showStatus: boolean;
    height: string;
    closeLayer: () => void;
    position:LatLonInterface | null;
    LangRe: string;
}
function Weather(props:WeatherProps) {
    let BoxStyle = {
        height: props.height,
        transition: " 1s ",
    }

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe]);


    const [useFrom, setUseFrom] = useState<string>("tmd");
    const [range, setRange] = useState<any>({
        now: true,
        day_2: false,
        day_3: false,
        day_5: false,
        day_7: false,
        day_10: false,
        day_15: false,
        inday: false
    });

    function setUseRange(key:string){
        let newRange = {
            now: false,
            day_2: false,
            day_3: false,
            day_5: false,
            day_7: false,
            day_10: false,
            day_15: false,
            inday: false
        }
        newRange[key] = true;
        setRange(newRange);
    }

    const [inday, setInday] = useState<any>({
        day: 0,
        date: 0,
        count_day: 0,
        index_filter: 0
    });
    // const [UseInday, setUseInday] = useState<boolean>(false);

    function viewInday(day:number, count_day:number, date:number, index_filter:number){
        setInday({
            day: day,
            date: date,
            count_day: count_day,
            index_filter: index_filter
        });
        setUseRange("inday");

    }

    function setUseDataFrom(from:string){
        if(range.inday === false){
            setUseFrom(from);
        }else{
            setUseRange("now");
            setUseFrom(from);
        }
    }

    // กรณีที่ปิดการแสดงผล ให้ รีเซ็ตค่า range กลับไป
    useEffect(() => {
        if(props.showStatus === false){
            setTimeout(function(){
                setRange({
                    now: true,
                    day_2: false,
                    day_3: false,
                    day_5: false,
                    day_7: false,
                    day_10: false,
                    day_15: false,
                    inday: false
                });
            }, 500);
        }
    }, [props.showStatus]);

    const [userPosition, setUserPosition] = useState<LatLonInterface | null>(null);
    useEffect(() => {
        if(props.position !== null){
            setUserPosition(props.position);
        }else{
            setUserPosition({lat: Number(process.env.REACT_APP_DEFAULT_LAT), lon: Number(process.env.REACT_APP_DEFAULT_LON)});
        }
    }, [props.position]);
    return (
        <div className="weather-box" style={BoxStyle}>
            <div className='mt-[3%] w-[94%] mx-auto'>
                {/* หัวข้อ */}
                <div className='flex w-[100%]'>
                    <div className='w-[90%] flex items-center'>
                        <p className='font-semibold text-[2.7vh] font-name-kanit'>
                            {lang['title']['weather']}
                        </p>
                    </div>
                    <div className='w-[10%] h-[4vh] flex items-center justify-end' onClick={props.closeLayer}>
                        <p className='text-[3vh]'><i className='icon-cross'></i></p>
                    </div>
                </div>

                {/* wheather box */}
                <div className='w-[100%] h-full px-0 mt-[1vh]'>
                    <div className='flex w-[100%] gap-x-[8px]'>

                        <div className='w-1/2'>
                            <button onClick={() => setUseDataFrom("tmd")} className={`w-full h-[4vh] ${useFrom === "tmd" ? 'bg-neutral-800' : 'bg-zinc-50'} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 ${useFrom === "tmd" ? 'text-white' : 'text-black'}  text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                <div className='w-[3.5vh] h-[3.5vh] mr-[1.5vw]'>
                                    <i className="weather-layer-icon-tmd"></i>
                                </div>
                                กรมอุตุนิยมวิทยา
                            </button>
                        </div>
                        <div className='w-1/2'>
                            <button onClick={() => setUseDataFrom("wunderground")} className={`w-full h-[4vh] ${useFrom === "wunderground" ? 'bg-neutral-800' : 'bg-zinc-50'} rounded-md border-neutral-950 border  shadow-md shadow-neutral-800/20 ${useFrom === "wunderground" ? 'text-white' : 'text-black'} text-[1.9vh] font-medium inline-flex justify-center items-center font-name-kanit`} >
                                <div className='w-[3.5vh] h-[3.5vh] mr-[1.5vw] rounded-md'>
                                    {useFrom === "wunderground" ?
                                    <i className="weather-layer-icon-wunderground-white rounded-md"></i>
                                    :
                                    <i className="weather-layer-icon-wunderground rounded-md"></i>}
                                </div>
                                wunderground.com
                            </button>
                        </div>
                        
                    </div>
                    <div className=' h-[4vh] w-[100%] mt-[0.7vh] mb-[0.5vh]'>
                            <div className='w-[100%] mx-auto h-[100%]'>
                                <div className='overflow-x-auto flex space-x-2'>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("now")} className={`w-full h-[4vh] ${range.now === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['now']}
                                        </button>
                                    </div>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_2")} className={`w-full h-[4vh] ${range.day_2 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['48hour']}
                                        </button>
                                    </div>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_3")} className={`w-full h-[4vh] ${range.day_3 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['3day']}
                                        </button>
                                    </div>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_5")} className={`w-full h-[4vh] ${range.day_5 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['5day']}
                                        </button>
                                    </div>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_7")} className={`w-full h-[4vh] ${range.day_7 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['7day']}
                                        </button>
                                    </div>
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_10")} className={`w-full h-[4vh] ${range.day_10 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['10day']}
                                        </button>
                                    </div>
                                    { useFrom === "wunderground" ?
                                    <div className='w-1/4 flex-none h-full'>
                                        <button onClick={() => setUseRange("day_15")} className={`w-full h-[4vh] ${range.day_15 === true ? "bg-teal-500":"bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}>
                                            {lang['range_title']['15day']}
                                        </button>
                                    </div>
                                    : null}
                                </div>
                            </div>
                        </div>
                    <div className='block w-full'>
                        {useFrom === "tmd" ? 
                        <>
                            {   range.now ?
                                <div className='overflow-y-auto h-[52vh] w-[100%] mt-[0.5vh]'>
                                    <TMDNow LangRe={props.LangRe} position={userPosition} showStatus={range.now} useFrom={useFrom} showheight={props.height} />
                                </div>
                                : range.day_2 ?
                                <div className=' h-[55vh] mt-[0.5vh]'>
                                    <TMD48hour LangRe={props.LangRe} position={userPosition} showStatus={range.day_2} useFrom={useFrom} />
                                </div>
                                : range.day_3 ?
                                <div className=' h-[55vh] mt-[0.5vh]'>
                                    <TMDDay LangRe={props.LangRe} count_day={3} position={userPosition} showStatus={range.day_3} useFrom={useFrom} />
                                </div>
                                : range.day_5 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <TMDDay LangRe={props.LangRe} count_day={5} position={userPosition} showStatus={range.day_5} useFrom={useFrom} />
                                </div>
                                : range.day_7 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <TMDDay LangRe={props.LangRe} count_day={7} position={userPosition} showStatus={range.day_7} useFrom={useFrom} />
                                </div>
                                : range.day_10 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <TMDDay LangRe={props.LangRe} count_day={10} position={userPosition} showStatus={range.day_10} useFrom={useFrom} />
                                </div>
                                : <></>
                            }

                        </> 
                        : null}
                        {useFrom === "wunderground" ?
                        <>
                            {   range.now ?
                                <div className='overflow-y-auto max-h-[52vh] w-[100%] mt-[0.5vh]'>
                                    <WundergroundNow LangRe={props.LangRe} position={userPosition} showStatus={range.now} useFrom={useFrom} />
                                </div>
                                : range.day_2 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <Wunderground48hour LangRe={props.LangRe} position={userPosition} showStatus={range.day_2} useFrom={useFrom} />
                                </div>
                                : range.day_3 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <WundergroundDay LangRe={props.LangRe} viewInday={viewInday} count_day={3} position={userPosition} showStatus={range.day_3} useFrom={useFrom} />
                                </div>
                                : range.day_5 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <WundergroundDay LangRe={props.LangRe} viewInday={viewInday} count_day={5} position={userPosition} showStatus={range.day_5} useFrom={useFrom} />
                                </div>
                                : range.day_7 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <WundergroundDay LangRe={props.LangRe} viewInday={viewInday} count_day={7} position={userPosition} showStatus={range.day_7} useFrom={useFrom} />
                                </div>
                                : range.day_10 ?
                                <div className='h-[55vh] mt-[0.5vh]'>
                                    <WundergroundDay LangRe={props.LangRe} viewInday={viewInday} count_day={10} position={userPosition} showStatus={range.day_10} useFrom={useFrom} />
                                </div>
                                : range.day_15 ?
                                    <div className='h-[55vh] mt-[0.5vh]'>
                                        <WundergroundDay LangRe={props.LangRe} viewInday={viewInday} count_day={15} position={userPosition} showStatus={range.day_15} useFrom={useFrom} />
                                    </div>
                                : range.inday ?
                                <div className='h-[54vh] mt-[0.5vh]'>
                                    <WundergroundInDate LangRe={props.LangRe} request_data={inday} useRange={setUseRange} position={userPosition} showStatus={range.inday} useFrom={useFrom} />
                                </div>
                                : null
                            }
                        </>
                        : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weather;