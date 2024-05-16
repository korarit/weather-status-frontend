import React,{useEffect, useState} from "react";

import translate from "../../../../function/languages";
import {getDaily_Wunderground} from "../../../../function/weather/data";

import "../../../../css/font.css";

import LoadingSpin from "../../loading_spin";

interface WundergroundDailyInterface {
    open: boolean;
    LangCode: string;
    position: {lat: number, lon: number} | null;
    count_day: number;
    viewInday: Function;
}
function WundergroundDaily ({open, LangCode, position, count_day, viewInday}:WundergroundDailyInterface){
    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangCode])

    const [DailyData, setDailyData] = useState<any>(null);
    const [filteredIndexes, setFilteredIndexes] = useState<any>(null);

    // สถานะการโหลดข้อมูล
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getWounderground_Day(lat:number, lng:number, day:number){
        try{
        //แสดง loading
        setLoadingStatus(true);

        //ดึงข้อมูล
        const data = await getDaily_Wunderground(lat, lng, day);
        console.log("data_day",data);
        //console.log(NowTMD);

        //ข้อมูลรายวัน
        setDailyData(data);
        const dates:Date = new Date();

        if(data["validTimeLocal"] !== undefined){
            if(data["daypart"][0]["iconCode"][0] === null){
                const ListIndexPart = data["daypart"][0]["dayOrNight"]
                .map((element, index) => index)
                .filter((index) => (index === 1 || data["daypart"][0]["iconCode"][index] !== null) && data["daypart"][0]["dayOrNight"][index] === "D");
    
    
                ListIndexPart.unshift(1)
                setFilteredIndexes(ListIndexPart);
            }else{
                const ListIndexPart = data["daypart"][0]["dayOrNight"]
                .map((element, index) => index)
                .filter((index) => data["daypart"][0]["dayOrNight"][index] === "D");
    
                setFilteredIndexes(ListIndexPart);
            }
        }

        //ซ่อน loading
        setTimeout(function(){
            setLoadingStatus(false);
        }, 200);

        return data;

        }catch(error){
            //console.log(error);
            setErrorStatus(true);
        }
    }
    useEffect(() => {
        if (open) {
            if(position !== null){
                getWounderground_Day(position['lat'], position['lon'], count_day);
            }else{
                const default_lat = Number(process.env.REACT_APP_DEFAULT_LAT);
                const default_lon = Number(process.env.REACT_APP_DEFAULT_LON);
                getWounderground_Day(default_lat, default_lon, count_day);
            }
        }
    }, [open, position, count_day]);

    function handleViewDay (index: number, countDay:number, filterIndex:number, date:number){
        viewInday(index, countDay, date, filterIndex);
        console.log('index', index);
    };


    const listDaily = DailyData !== null ?  DailyData["validTimeLocal"].map((data, index) => (
        <div key={index}
          className="w-full flex-none h-full border-b-2 pb-[2vh] pt-[1.2vh] first:pt-[0vh] last:border-b-0 border-black last:pb-0"
        >
          <p className=" text-[2.8vh] font-normal text-indigo-900 font-name-kanit">
              { 
              DailyData["daypart"][0]["daypartName"][filteredIndexes[index]]+" "+new Date(DailyData["validTimeLocal"][index]).getDate()+" "+
              lang['month_title'][new Date(DailyData["validTimeLocal"][index]).getMonth()]+" "+(new Date(DailyData["validTimeLocal"][index]).getFullYear()+543)
              }
          </p>
          <div className="grid grid-cols-6">
              <div className="col-span-4">
                  <p className="text-[4vh] font-medium leading-[4vh] font-name-kanit">
                      {DailyData["daypart"][0]["temperature"][filteredIndexes[index]]}°
                  </p>
                  <p className="text-[2.8vh] font-medium leading-[3vh] font-name-kanit">
                      {DailyData["daypart"][0]["wxPhraseLong"][filteredIndexes[index]]}
                  </p>
                  <p className="text-[2.3vh] font-normal leading-[3vh] font-name-kanit">
                      {lang["temp_feel_like"]} {DailyData["daypart"][0]["temperatureHeatIndex"][filteredIndexes[index]]}°
                  </p>
                  <p className="text-[2.3vh] font-normal leading-[3vh] font-name-kanit text-sky-700">
                      {lang["temp_min"]} {DailyData["calendarDayTemperatureMin"][index]}° {lang["max"]} {DailyData["calendarDayTemperatureMax"][index]}°
                  </p>
                  <p className="text-[2.3vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                      {lang['rain_perchine']} {DailyData["daypart"][0]["precipChance"][filteredIndexes[index]]} %
                  </p>
                  <p className="text-[2.3vh] font-normal text-amber-800 leading-[3vh] font-name-kanit">
                      {lang["rain_count"]} {DailyData["qpf"][index]} mm
                  </p>
              </div>
  
              <div className="col-span-2">
                    <div className="w-[94%] h-[80%] flex items-center justify-center">
                        <div className='h-[12vh]'>
                            <img alt="" src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${DailyData["daypart"][0]["iconCode"][filteredIndexes[index]]}.svg`} className="w-[20vh] h-[12vh]" />
                        </div>
                    </div>
                    <button onClick={() => handleViewDay(index, count_day, filteredIndexes[index], new Date(DailyData["validTimeLocal"][index]).getDate())} 
                        className='w-[94%] h-[20%] bg-red-800 rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit'
                    >
                      {lang["more_data"]}
                  </button>
              </div>
          </div>
        </div>
    )): (
        <div>
            {lang['error_message']['not_data']}
        </div>
    );

    return (
    <>
        <p className='text-[3vh] leading-[3vh] mt-[1.2vh] mb-[0.5vh]  font-normal  font-name-kanit'>
            {lang['title']['daily_forecast']}
        </p>

        {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
        { loadingStatus ? (
            <div className="w-[100%] h-[50vh] flex items-center justify-center">
                <LoadingSpin />
            </div>
        ): null}

        {/* แสดง error หาก errorStatus เป็น true */}
        {errorStatus && loadingStatus === false ? (
          <div className="w-[100%] h-[50vh] flex items-center justify-center">
            <p className="text-[3vh] font-semibold font-name-kanit text-center">
              {lang["error_message"]["wunderground"]}
            </p>
          </div>
        ) : null}

        { errorStatus === false && loadingStatus === false ? (
            /* ****** แสดงข้อมูลที่ดึงมาได้ ****** */
            <div className='h-[90%] w-full'>
                <div className='max-w-[90vw] mx-auto h-[100%] overflow-y-auto'>
                    <div className='flex flex-col'>
                        {listDaily}
                    </div>
                </div>
            </div>
        ) : null}
    </>
    )
}

export default WundergroundDaily;