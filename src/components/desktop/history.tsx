import React,{useEffect, useState} from "react";

import { HistorySearch } from "../../function/localDatabase/search";

import "../../css/font.css";

interface historySearchInterface {
    open: boolean;
    setSearchValue: Function;
    setLatLonWeather: Function;
    setLocationType: Function;
}
function HistorySearchList({ open, setSearchValue, setLatLonWeather, setLocationType }: historySearchInterface) {
    const [historyList, setHistoryList] = useState<any>(null);

    async function getHistory(){
        const data:any = await HistorySearch();
        console.log(data)
        setHistoryList(data)
    };
    useEffect(() => {
        if(open === true){
            getHistory();
        }
    }, [open]);

    interface LatLonInterface{
        lat: number;
        lon: number;
    }
    function openWeather(LatLon: LatLonInterface,name:any){
        setLatLonWeather(LatLon);
        setSearchValue(name);
        setLocationType('place');
    }

    const historyListRender = historyList !== null ? historyList.map((item:any, index:number) => (
        <div className="w-full select-none h-100 border-b-[1px] first:py-[0.5rem] hover:bg-gray-200 active:bg-gray-200 last:border-b-0 border-gray-400 py-[0.5rem]"
            onClick={() => openWeather({lat: item['location']['lat'], lon: item['location']['lng']}, item['name'])}
        >
            <div className="w-[94%] mx-auto">
            <div className="grid grid-cols-8 gap-2 sm:gap-4 h-100 min-h-[50px] ">

                <div className="col-span-1 sm:col-span-1 grid place-items-center h-100">
                    {/* ตรวจสอบว่ามี icon จากข้อมูลที่ดึงมา ไม่มี หรือเป็น จุด ให้แสดง ปักหมุด */}
                    { item['icon'] !== '' && item['icon'] !== 'reddot.png' ?
                        <img
                            className="w-[70%] h-[70%]"
                            src={`https://mmmap15.longdo.com/mmmap/images/icons_2x/${item['icon']}`}
                            alt=""
                        />
                        :
                        <img
                            className="w-[70%] h-[80%]"
                            src={`https://cdn.discordapp.com/attachments/943868917330374718/1169164824542990348/maps-pin-black-icon.png`}
                            alt=""
                        />
                    }
                </div>

                <div className="col-span-7 h-100">
                    <p className="text-[1.3rem] leading-[1.6rem] w-[98%] truncate font-normal font-name-kanit">
                        {item['name']}
                    </p>
                    <p className="text-[0.9rem] w-[98%] truncate font-normal font-name-kanit text-zinc-700">
                        {item['address']}
                    </p>
                </div>

            </div>
            </div>
        </div>
    )): null;
    return (
    <div id={"HistoryResult"} className="h-full w-[100%] bg-slate-50 overflow-y-auto">
        <div className="w-[100%] mx-auto h-full flex flex-col select-none">
            {historyListRender}
        </div>
    </div>
  );
}

export default HistorySearchList;
