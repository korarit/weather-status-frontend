import React, {useEffect, useState} from 'react';

import translate from '../../function/languages';
import { InsertSearchDB } from '../../function/localDatabase/search';
// import { GetDataAllFromDB } from '../../function/localDatabase/db';

import '../../css/font.css';

import LoadingSpin from './loading_spin';

 function Search_result({searchData, useSearch, goToLocation, LangRe}) {
    const [data, setData] = useState<any>('');
    const [haveData, setHaveData] = useState<boolean>(false);


    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [LangRe]); 

    async function setSearch(data:any){
        //setUseSearch(true);
        console.log(data);
        setData(data);

        if(data["data"].length !== 0 && data["data"] !== undefined){
            setHaveData(true);
            console.log("not data");
        }

    }

    function goLocation(lat:number, lon:number,keyData:number){
        goToLocation(lat, lon);
        const insertdata = {
            name: data['data'][keyData]['name'],
            address: data['data'][keyData]['address'],
            icon: data['data'][keyData]['icon'],
            location: {
                lat: data['data'][keyData]['lat'],
                lng: data['data'][keyData]['lon']
            }
        }
        InsertSearchDB(insertdata);
    }

    useEffect(() => {
        if(useSearch){
            setSearch(searchData);
        }
    }, [searchData, useSearch]);
    /* สร้างรายการผลการค้นหา โดยการ loop data['data'] */
    const listSearch = data["data"] !== undefined?  data["data"].map((item, key) => (
        <div key={key} 
             className="w-full h-100 border-b-[1px] first:py-[0.5vh] hover:bg-gray-100 active:bg-gray-100 last:border-b-0 border-black py-[0.5vh]"
             onClick={() => goLocation(item['lat'], item['lon'], key)}
        >
            <div className="grid grid-cols-12 gap-2 sm:gap-4 h-100 min-h-[50px] ">
                <div className='col-span-2 sm:col-span-1 grid place-items-center h-100'>

                    {/* ตรวจสอบว่ามี icon จากข้อมูลที่ดึงมา ไม่มี หรือเป็น จุด ให้แสดง ปักหมุด */}
                    { item['icon'] !== "" && item['icon'] !== "reddot.png" ?
                        <img className="w-[65%] h-[65%] " src={`https://mmmap15.longdo.com/mmmap/images/icons_2x/${item['icon']}`} alt="" />
                    :
                        <img className="w-[50%] h-[60%]" src={`https://cdn.discordapp.com/attachments/943868917330374718/1169164824542990348/maps-pin-black-icon.png`} alt="" />
                    }

                </div>
                <div className='col-span-10 sm:col-span-11 h-100'>

                    {/* ตรวจสอบว่ามี address ไม่มีให้แสดงแค่ชื่อ สถานที่ ไว้ตรงกลาง */}
                    { item["address"] !== "" ? (
                    <>
                        <p className="text-[2vh] w-[98%] truncate font-normal font-name-kanit">
                            {item["name"]}
                        </p>
                        <p className="text-[1.5vh] w-[98%] truncate font-normal font-name-kanit text-zinc-700">
                                {item["address"]}
                        </p>
                    </>
                    )
                    : (
                        <>
                        <div className='flex items-center h-full w-full'>
                            <p className="text-[2vh] font-normal font-name-kanit">
                                {item["name"]}
                            </p>
                        </div>
                        </>
                        )
                    }
                </div>
            </div>
        </div>
        ))
        : (
        <div>
            <div className="w-[100%] h-[100%] flex items-center justify-center">
            <LoadingSpin />
          </div>
        </div>
        );
    return (
      <div className=" mt-[0vh] mb-[1vh]">
        <div className="relative w-full">
        {/* ตรวจสอบว่าพบข้อมูลใน longdo Map */}
        { haveData === false ? (
            <div className="w-[99%] h-[100%] mx-auto">
            <div className="w-full h-[93vh] flex items-center justify-center">
                <p className="text-[3vh] font-semibold font-name-kanit">
                    {lang['error_message']['longdomap']}
                </p>
            </div>
        </div>
        ):(
            /* แสดงรายการข้อการค้นหา */
            <div className="w-[99%] h-[100%] mx-auto">
                <div className="flex flex-col">
                    {listSearch}
                </div>
            </div>
        )
        }
        </div>
      </div>
    );
}

export default Search_result;
