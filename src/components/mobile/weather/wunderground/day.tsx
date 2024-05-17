import React, {useState, useEffect} from 'react';

import {getDaily_Wunderground} from '../../../../function/weather/data';

import translate from '../../../../function/languages';

//import '../../../../css/App.css';

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
    count_day: number;
    viewInday: (index:number, countDay:number, date:number, filterIndex:number) => void;
}
function WundergroundDay(props:OuterFunctionProps) {

    const [DailyData, setDailyData] = useState<any>([]);
    const [filteredIndexes, setFilteredIndexes] = useState<any>([]);

    // สถานะการโหลดข้อมูล
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);

    async function getWounderground_Day(lat:number, lon:number, day:number){
        try{
        //แสดง loading
        setLoadingStatus(true);

        //ดึงข้อมูล
        const data:any = await getDaily_Wunderground(lat, lon, day);
        console.log("data_day",data);
        //console.log(NowTMD);

        //ข้อมูลรายวัน
        setDailyData(data);

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
    const handleViewDay = (index, countDay:number, filterIndex:number, date:number) => {
        props.viewInday(index, countDay, date, filterIndex);
        console.log('index', index);
    };

    //////////////////////////////////////// ดึงข้อมูล ////////////////////////////////////////
    useEffect(() => {
        if (props.useFrom === 'wunderground' && props.showStatus) {
            // Only call getTMD_today when the necessary props or state values change
            if (props.position !== null) {
                getWounderground_Day(props.position.lat, props.position.lon, props.count_day);
            }
        }
    }, [props.position, props.showStatus , props.useFrom, props.count_day]);

    ///////////////////////////////////////// ภาษา /////////////////////////////////////////
    const [lang, setLang] = useState<any>(translate(localStorage.getItem('languages') as string));
    useEffect(() => {
        setLang(translate(localStorage.getItem('languages') as string));
    }, [props.LangRe])


    const listDaily = DailyData["validTimeLocal"] !== undefined?  DailyData["validTimeLocal"].map((data:any, index:number) => (
      <div key={index}
        className="w-full flex-none h-full border-b-2 pb-[2vh] pt-[2vh] first:pt-[0vh] last:border-b-0 border-black last:pb-0"
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

            <div className="col-span-2 mr-[3vw] mt-[1.4vh]">
                <div className="w-full h-[80%] flex items-center justify-center">
                    <div className='h-[12vh]'>
                        <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${DailyData["daypart"][0]["iconCode"][filteredIndexes[index]]}.svg`} className="w-[20vh] h-[12vh]" />
                    </div>
                </div>
                <button onClick={() => handleViewDay(index, props.count_day, filteredIndexes[index], new Date(DailyData["validTimeLocal"][index]).getDate())} className='w-full h-[20%] bg-red-800 rounded-md border-neutral-400 border  shadow-md shadow-neutral-900/20 text-white text-[1.7vh] font-medium inline-flex justify-center items-center font-name-kanit'>
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
                        {listDaily}
                    </div>
                </div>
            </div>
        ) : null}

        </>
        )}   
        
        </>
    )
};

export default WundergroundDay;