
import axios from 'axios';

import L from 'leaflet';
import papaparse from 'papaparse';
/*
* ถึงข้อมูลจาก api ของ nasa แล้ว return ข้อมูลเป็น array
* ถ้า error จะ return null
*/
export async function get_data_firms(satellite:string) {

    try {
        const response:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/firms/today/${satellite}`, {
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_session')}`
            }
        });
        if (response.status === 200) {
            const csvStream = response.data;

            //console.log(csvStream);
            const parsePromise = new Promise((resolve, reject) => {
                const parser = papaparse.parse(csvStream, {
                    header: true, // Specify that the first row is the header
                    dynamicTyping: true, // Automatically parse data types
                    complete: (result:any) => {
                        resolve(result.data); // Resolve the promise with the parsed data
                    },
                    error: (error:any) => {
                        reject(error); // Reject the promise if there's an error
                    },
                });
            });

            const parsedData = await parsePromise;
            //console.log(parsedData);
            return parsedData;
        }else{
            console.log('error');
            return null;
        }
    } catch (error:any) {
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }else if(error.response.status === 500){
            return null;
        }
    }

}

export async function firms_cache_location(mapBounds:any) {
    const Satelite:string = process.env.REACT_APP_LIST_SATELITE as string;
    const ListSatelite:Array<string> = Satelite.split(',');
    //สร้าง cache ชื่อ จาก .env
    const cache = await caches.open(process.env.REACT_APP_CACHE_NAME as string);
    //console.log(ListSatelite);
    async function get_loaction_data(satellite:string) {

        try {
            const data: any = await get_data_firms(satellite);
            if(data === null){
                return null;
            }
            //เวลา cache หมดอายุ ตามใน .env หน่วยเป็น นาที่
            const outTime = Date.now() + (1000 * 60 * parseInt(process.env.REACT_APP_FIMS_CACHE_TIME as string));
            const data_firms = {
                outtime_cache: outTime,
                data: data
            };

            
            const responsePayload = new Response((JSON.stringify(data_firms)), {
                headers: {
                'Content-Type': 'application/json'
                }
            });


            //กันกรณีข้อมูลจากดาวเทียมของ nasa ยังไม่มี จะไม่เก็บ cache
            if (data.length > 0) {
                //localStorage.setItem(`firms_cache_${satellite}`, JSON.stringify(data_firms));
                await cache.put(`firmsCache_${satellite}.json`, responsePayload);
            }

            return data;
        } catch (error) {
            console.log(error);
        }
    }

    let data_list_location = [];

    try {

        for (let i = 0; i < ListSatelite.length; i++) {

            const match = await cache.match(`firmsCache_${ListSatelite[i]}.json`);
            //check ว่ามี cache หรือไม่
            if (match === undefined) {

                //console.log('no cache');
                let get_location: any = get_loaction_data(ListSatelite[i]);
                //เพิ่มข้อมูลลง data_list_location
                for (let j = 0; j < get_location.length; j++) {
                    const latlng = new L.LatLng(get_location[j].latitude, get_location[j].longitude);
                    if(mapBounds.contains(latlng)){
                        data_list_location.push(get_location[j]);
                    }
                }

            } else {

                const cacheData = await match.json();
                //check ว่า cache หมดอายุหรือไม่
                if (cacheData.outtime_cache < Date.now()) {

                    ////////////////// cache หมดอายุ //////////////////
                    await cache.delete(`firmsCache_${ListSatelite[i]}.json`);
                    let get_location: any = get_loaction_data(ListSatelite[i]);
                    //เพิ่มข้อมูลลง data_list_location
                    for (let j = 0; j < get_location.length; j++) {
                        const latlng = new L.LatLng(get_location[j].latitude, get_location[j].longitude);
                        if(mapBounds.contains(latlng)){
                            data_list_location.push(get_location[j]);
                        }
                    }

                } else {
                    
                    ////////////////// cache ยังไม่หมดอายุ //////////////////
                    let get_location = cacheData.data;
                    //เพิ่มข้อมูลลง data_list_location
                    for (let j = 0; j < get_location.length; j++) {
                        const latlng = new L.LatLng(get_location[j].latitude, get_location[j].longitude);
                        if(mapBounds.contains(latlng)){
                            data_list_location.push(get_location[j]);
                        }
                    }

                }
            }
        }

        //console.log("testss", data_list_location);
        return data_list_location;

    } catch (error) {
        console.log(error);
    }

}