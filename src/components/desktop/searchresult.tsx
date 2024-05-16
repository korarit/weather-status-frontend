import React,{useState,useEffect} from "react";


import translate from "../../function/languages";
import Search_data from "../../function/location/search";
import {InsertSearchDB} from "../../function/localDatabase/search";

import "../../css/font.css";

interface SearchResultInterface {
    open: boolean;
    keyword: string | null;
    setSearchValue: Function;
    setLatLonWeather: Function;
    setLocationType: Function;
}
function SearchResult({ open, keyword , setSearchValue, setLatLonWeather, setLocationType }: SearchResultInterface) {

    const [searchData, setSearchData] = useState<any>(null);


    async function searchResult(keyword: string | null) {
        const searchFunc = new Search_data();
        if (keyword === null) {
            return;
        }
        const data:any = await searchFunc.getSearchLogdomap(keyword);
        console.log('search Data',data['data']);
        setSearchData(data['data']);
    }
    useEffect(() => {
        if(open){
            searchResult(keyword);
        }
    }, [open, keyword]);


    interface LatLonInterface{
        lat: number;
        lon: number;
    }
    function openWeather(LatLon: LatLonInterface,name:any,index:number){
        setLatLonWeather(LatLon);
        setSearchValue(name);
        setLocationType('place');

        //บันทึกค่าลง localstorage
        let dataSave = {
            name: searchData[index]['name'],
            address: searchData[index]['address'],
            icon: searchData[index]['icon'],
            location:{
                lat: searchData[index]['lat'],
                lng: searchData[index]['lon']
            }
        }
        InsertSearchDB(dataSave);
        
    }
    const listSearch = searchData !== null?  searchData.map((item:any, key:number) => (
        <div className="w-full h-100 border-b-[1px] first:py-[0.5vh] hover:bg-gray-200 active:bg-gray-200 last:border-b-0 border-gray-400 py-[1rem]"
            onClick={() => openWeather({lat: item['lat'], lon: item['lon']}, item['name'], key)}
         >
            <div className="w-[94%] mx-auto">
                <div className="grid grid-cols-8 gap-2 sm:gap-4 h-100 min-h-[50px] ">

                    <div className="col-span-1 sm:col-span-1 grid place-items-center h-100">
                        {/* ตรวจสอบว่ามี icon จากข้อมูลที่ดึงมา ไม่มี หรือเป็น จุด ให้แสดง ปักหมุด */}
                        {item['icon'] !== '' && item['icon'] !== 'reddot.png' ?
                        <img
                            className="w-[50%] h-[60%]"
                            src={`https://mmmap15.longdo.com/mmmap/images/icons_2x/${item['icon']}`}
                            alt=""
                        />
                        :
                        <img
                            className="w-[50%] h-[60%]"
                            src={`https://cdn.discordapp.com/attachments/943868917330374718/1169164824542990348/maps-pin-black-icon.png`}
                            alt=""
                        />
                        }
                    </div>

                    <div className="col-span-7 h-100">
                        <p className="text-[1.5rem] leading-[1.6rem] w-[98%] truncate font-normal font-name-kanit">
                            {item['name']}
                        </p>
                        <p className="text-[1.2rem] w-[98%] truncate font-normal font-name-kanit text-zinc-700">
                            {item['address']}
                        </p>
                     </div>

                </div>
            </div>
        </div>
    )):null;
    return (
        <div id={"WeatherResult"} className="h-full w-[100%] bg-slate-50 overflow-y-auto">
            <div className="w-[100%] mx-auto h-full flex flex-col">

                {listSearch}

            </div>
        </div>
    );
}

export default SearchResult;
