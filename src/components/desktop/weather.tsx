import React,{useEffect, useRef, useState} from "react";

import translate from "../../function/languages";

import TMDNow from "./weather/tmd/now";
import TMDHourly from "./weather/tmd/hourly";
import TMDDaily from "./weather/tmd/daily";

import WundergroundNow from "./weather/wunderground/now";
import WundergroundHourly from "./weather/wunderground/hourly";
import WundergroundDaily from "./weather/wunderground/daily";

import "../../css/font.css";

interface LatLonInterface {
    lat: number;
    lon: number;
}
interface weatherInterface {
  open: boolean;
  LatLon: LatLonInterface | null;
  LangCode: string;
}
function WeatherShow({ open, LangCode, LatLon }: weatherInterface) {
    const [LocationNow, setLocationNow] = useState<LatLonInterface | null>(null);
    useEffect(() => {
        if(open){

            const default_lat = Number(process.env.REACT_APP_DEFAULT_LAT);
            const default_lon = Number(process.env.REACT_APP_DEFAULT_LON);
            if(LatLon !== null && LatLon.lat !== default_lat && LatLon.lon !== default_lon){
                setLocationNow(LatLon);
            }else{
                setLocationNow({lat: default_lat, lon: default_lon});
            }
            
        }
    }, [open, LatLon]);

    const [lang, setLang] = useState<any>(translate(null));

    useEffect(() => {
        setLang(translate(null));
    }, [LangCode]);

    const [useFrom, setUseFrom] = useState<string>("tmd");
    const [range, setRange] = useState<any>({
        now: true,
        hourly: false,
        day: false,
        inday: false
    });

    const [countRange, setCountRange] = useState<number>(0);
    function setUseRange(key:string, count:number = 0){
        let newRange = {
            now: false,
            hourly: false,
            day: false,
            inday: false
        }
        newRange[key] = true;
        setRange(newRange);
        setCountRange(count);
    }

    interface indayInterface {
        day: number;
        date: number;
        count_day: number;
        index_filter: number;
    }
    const [inday, setInday] = useState<indayInterface>({
        day: 0,
        date: 0,
        count_day: 0,
        index_filter: 0
    });
    function viewInday(day:number, count_day:number, date:number, index_filter:number){
        setInday({
            day: day,
            date: date,
            count_day: count_day,
            index_filter: index_filter
        });
        setUseRange("inday");

    }

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

    return (
      <div
        id={"SearchResult"}
        className="h-full w-[100%] bg-white overflow-y-auto"
      >
        <div className="w-[94%] mx-auto h-full flex flex-col">
            <div className="grid grid-cols-2 gap-x-[8px] mt-[8px]">
                <div>
                    <button
                        className={`w-full h-[4.5vh] ${
                        useFrom === "tmd" ? "bg-neutral-800" : "bg-zinc-50"
                        } rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 ${
                        useFrom == "tmd" ? "text-white" : "text-black"
                        }  text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                        onClick={() => setUseFrom("tmd")}
                    >
                        <div className="w-[3.2vh] h-[3.2vh] mr-[1vh]">
                        <i className="weather-layer-icon-tmd"></i>
                        </div>
                        กรมอุตุนิยมวิทยา
                    </button>
                </div>
                <div>
                    <button
                        className={`w-full h-[4.5vh] ${useFrom === "wunderground" ? "bg-neutral-800" : "bg-zinc-50"} rounded-md border-neutral-950 border  shadow-md shadow-neutral-800/20 ${useFrom == "wunderground" ? "text-white" : "text-black"} text-[1.9vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                        onClick={() => setUseFrom("wunderground")}
                    >
                        <div className="w-[3vh] h-[3vh] mr-[1vh] rounded-md">
                        {useFrom === "wunderground" ? (
                            <i className="weather-layer-icon-wunderground-white rounded-md"></i>
                        ) : (
                            <i className="weather-layer-icon-wunderground rounded-md"></i>
                        )}
                        </div>
                        wunderground
                    </button>
                </div>
            </div>

            <div className=" h-[4vh] w-[100%] mt-[4px] mb-[0.5vh]">
                <div className="w-[100%] mx-auto h-[100%]">
                    <div className="overflow-x-auto flex space-x-2"
                    ref={elementRange}

                    onMouseDown={(e) => RangeMouseDown(e)}
                    onMouseLeave={(e) => RangeMouseLeave(e)}
                    onMouseUp={(e) => RangeMouseLeave(e)}
                    onMouseMove={(e) => RangeMouseMove(e)}
                    >

                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("now")}
                                className={`w-full h-[4vh] ${range.now === true ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["now"]}
                            </button>
                        </div>

                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("hourly")}
                                className={`w-full h-[4vh] ${range.hourly === true ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["48hour"]}
                            </button>
                        </div>

                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("day", 3)}
                                className={`w-full h-[4vh] ${ range.day && countRange === 3 ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["3day"]}
                            </button>
                        </div>

                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("day", 5)}
                                className={`w-full h-[4vh] ${range.day && countRange === 5 ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["5day"]}
                            </button>
                        </div>

                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("day", 7)}
                                className={`w-full h-[4vh] ${range.day && countRange === 7 ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["7day"]}
                            </button>
                        </div>
                        <div className="w-1/4 flex-none h-full">
                            <button
                                onClick={() => setUseRange("day", 10)}
                                className={`w-full h-[4vh] ${range.day && countRange === 10 ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                                {lang["range_title"]["10day"]}
                            </button>
                        </div>

                        {useFrom === "wunderground" ? (
                        <div className="w-1/4 flex-none h-full">
                            <button
                            onClick={() => setUseRange("day", 15)}
                            className={`w-full h-[4vh] ${range.day && countRange === 15 ? "bg-teal-500" : "bg-blue-500"} rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit`}
                            >
                            {lang["range_title"]["15day"]}
                            </button>
                        </div>

                        ) : null}
                    </div>
                </div>
            </div>


            <div className="mt-[8px] w-full h-[100%] overflow-hidden">
                {useFrom === "tmd" ? (
                    <>
                    {range.now ? (
                        <TMDNow open={range.now} LangCode={LangCode} position={LocationNow} />
                    ): range.hourly ? (
                        <TMDHourly open={range.hourly} LangCode={LangCode} position={LocationNow} />
                    ): range.day ? (
                        <TMDDaily open={range.day} LangCode={LangCode} position={LocationNow} count_day={countRange} />
                    ): null}
                    </>
                ):
                <>
                {useFrom === "wunderground" ? (
                    <>
                    {range.now ? (
                        <WundergroundNow open={range.now} LangCode={LangCode} position={LocationNow} />
                    ): range.hourly ? (
                        <WundergroundHourly open={range.hourly} LangCode={LangCode} position={LocationNow} />
                    ): range.day ? (
                        <WundergroundDaily open={range.day} LangCode={LangCode} position={LocationNow} count_day={countRange} viewInday={viewInday} />
                    ): null}
                    </>
                ): null
                }
                </>
                }
            </div>
        </div>
      </div>
    );
}

export default WeatherShow;
