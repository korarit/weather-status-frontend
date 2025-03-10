import axios from "axios";
import L from "leaflet";

import translate from "../languages";

/*
* ฟังก์ชันสำหรับเรียกข้อมูลสภาพอากาศปัจจุบันจาก TMD
* @param lat ละติจูด
* @param lon ลองจิจูด
* @return ข้อมูลสภาพอากาศปัจจุบัน
*/
export async function getDataToday_TMD(lat:number, lon:number){
    try{
        const url = `${process.env.REACT_APP_API_MAIN}/data/weather/tmd/today?lat=${lat}&lon=${lon}`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
                headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token_session")}`
                }
            }
        );

        const data = response.data;

        //console.log(data);
        return data;
    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }else{
            //console.log(error);
            return null;
        }
    }
}

/*
* ฟังก์ชันสำหรับเรียกข้อมูลสภาพอากาศปัจจุบันจาก TMD
* @param lat ละติจูด
* @param lon ลองจิจูด
* @return ข้อมูลสภาพอากาศปัจจุบัน
*/
export async function getData48Hour_TMD(lat:number, lon:number){
    try{

        const url = `${process.env.REACT_APP_API_MAIN}/data/weather/tmd/48hour?lat=${lat}&lon=${lon}`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
                headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token_session")}`
                }
            }
        );

        //เปิด cache ชื่อ จาก .env
        const cache = await caches.open(process.env.REACT_APP_CACHE_NAME as string);

        //เพิ่มข้อมูลลง cache
        //เวลาปัจจุบัน
        const Dates = new Date();
        const payload = {
            data: JSON.stringify(response.data),
            timestamp: Date.now(),
            latitude: lat,
            longitude: lon,
            hour: Dates.getHours(),
            timeout: 1000 * 60 * parseInt(process.env.REACT_APP_TMD_HOURLY_CACHE_TIME as string), //หน่วยเป็น นาที
        };
        const responsePayload = new Response((JSON.stringify(payload)), {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        //เช็คว่ามีข้อมูลใน cache หรือไม่
        const match = await cache.match('HourlyTMD1.json');
        if(match !== undefined){
            const cacheData = await match.json();
            //console.log(cacheData.timestamp);
            const check_timestamp = (cacheData.timestamp + cacheData.timeout < Date.now() || (cacheData.hour !== Dates.getHours()));
            const check_position = (cacheData.latitude !== lat || cacheData.longitude !== lon);
            if(check_timestamp || check_position){

                /////////////// cache หมดอายุ ///////////////
                //ลบ cache เก่า
                await cache.delete('HourlyTMD1.json');
                //เพิ่มข้อมูลใหม่
                await cache.put('HourlyTMD1.json',responsePayload);

                console.log('use new tmd forecast 48hour data');
                return response.data;
            }else{
                /////////////// cache ยังไม่หมดอายุ ///////////////
                //return ข้อมูลใน cache
                console.log('use cache tmd forecast 48hour data');
                //console.log((cacheData));
                return JSON.parse(cacheData.data);
            }
        }else{
            /////////////// ไม่มี cache ///////////////
            //console.log('no cache');
            cache.put('HourlyTMD1.json',responsePayload);
            //console.log(response.json());
            return response.data;
        }

    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }else{
            console.log(error);
            return null;
        }
    }
}

/*
* ฟังก์ชันสำหรับเรียกข้อมูลสภาพอากาศปัจจุบันจาก TMD
* @param lat ละติจูด
* @param lon ลองจิจูด
* @return ข้อมูลสภาพอากาศปัจจุบัน
*/
export async function getDataDay_TMD(lat:number, lon:number , day:number){
    try{
        const url = `${process.env.REACT_APP_API_MAIN}/data/weather/tmd/10/day?lat=${lat}&lon=${lon}`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
                headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token_session")}`
                }
            }
        );

        const data = response.data;
        //สร้าง cache ชื่อ จาก .env
        const cache = await caches.open(process.env.REACT_APP_CACHE_NAME as string);
        //เวลาปัจจุบัน
        const Dates = new Date();
        //เพิ่มข้อมูลลง cache
        const payload = {
            data: JSON.stringify(data),
            timestamp: Date.now(),
            latitude: lat,
            longitude: lon,
            hour: Dates.getHours(),
            day: Dates.getDate(),
            timeout: 1000 * 60 * parseInt(process.env.REACT_APP_DAILYTMD_CACHE_TIME as string), //หน่วยเป็น นาที
        };
        const responsePayload = new Response((JSON.stringify(payload)), {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        //เช็คว่ามีข้อมูลใน cache หรือไม่
        const match = await cache.match('TMDDaily3.json');
        if(match !== undefined){
            //มีข้อมูลใน cache
            console.log('cache');
            const cacheData = await match.json();
            //console.log(cacheData.timestamp);
            const check_timestamp = (cacheData.timestamp + cacheData.timeout < Date.now() || (cacheData.hour !== Dates.getHours()) || (cacheData.day !== Dates.getDate()));
            const check_position = (cacheData.latitude !== lat || cacheData.longitude !== lon);
            if(check_timestamp || check_position){
                
                /////////////// cache หมดอายุ ///////////////
                console.log('TMDDaily cache outtime');
                //ลบ cache เก่า
                await cache.delete('TMDDaily3.json');
                //เพิ่มข้อมูลใหม่
                await cache.put('TMDDaily3.json',responsePayload);
                //return ข้อมูลใหม่
                //console.log(data);
                const data_list = [];
                for(let i=0; i<day; i++){
                    data_list.push(data.WeatherForecasts[0].forecasts[i]);
                }
                console.log(data_list);
                return data_list;

            }else{
                /////////////// cache ยังไม่หมดอายุ ///////////////
                console.log('airqualitydataCMU cache not outtime');
                //console.log(cacheData.data);
                //return ข้อมูลใน cache
                console.log(JSON.parse(cacheData.data));
                const cache_data = JSON.parse(cacheData.data);

                const data_list = [];
                const data = cache_data.WeatherForecasts[0].forecasts;
                for(let i=0; i<day && i<data.length; i++){
                    data_list.push(data[i]);
                }
                console.log(data_list);
                return data_list;

            }
        }else{
            /////////////// ไม่มี cache ///////////////
            //console.log('no cache');
            cache.put('TMDDaily3.json',responsePayload);
            //console.log(data);
            return data.WeatherForecasts[0].forecasts;
        }

    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }else{
            //console.log(error);
            return null;
        }
    }
}

/*
* ฟังก์ชันสำหรับแปลงค่าสภาพอากาศเป็นข้อความ
* @param cond ค่าสภาพอากาศ
* @return ข้อความสภาพอากาศ
*/
export function cond_status_txt(cond:number){
    const list_cond = translate(localStorage.getItem("languages") as string)["tmd_status_cond"];

    return list_cond[cond-1];
}
export async function getNow_PM2_5_AirQ(MapBounds:any, zoom_level:number, lat:number, lng:number){

    //ดึงข้อมูล airiq จาก api
    try {
       let bbox = {
           S: parseFloat(MapBounds['_southWest']['lng'].toFixed(2)), 
           S1: parseFloat(MapBounds['_southWest']['lat'].toFixed(2)),
           N: parseFloat(MapBounds['_northEast']['lng'].toFixed(2)),
           N1: parseFloat(MapBounds['_northEast']['lat'].toFixed(2))
       };
 
       const airiq:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/air_quality/iqair_map?bbox=${bbox["S"]},${bbox["S1"]},${bbox["N"]},${bbox["N1"]}&zoomLevel=${zoom_level}` ,{
         headers:{ Authorization: `Bearer ${localStorage.getItem('token_session')}` }
       });
       let PM2_5_data: any | null = null;
       if(airiq.status === 200){

           let data:any = airiq.data;
           //console.log("PM2_5_AirQ",data);
           if(data.total > 0){
               //คำนวนระยะทางหว่างตำแหน่งปัจจุบันกับตำแหน่งที่ดึงข้อมูล PM2.5 จาก AirQ และเรียงลำดับตามระยะทาง
               let PM2_5_AirQ_distance: {distance: number, aqi: number, id:string}[] = [];
               for(let i=0; i<data.total; i++){
                   let distance = L.latLng(lat, lng).distanceTo(L.latLng(data.markers[i].coordinates.latitude, data.markers[i].coordinates.longitude));
                   
                   PM2_5_AirQ_distance.push({
                       distance: distance,
                       aqi: data.markers[i].aqi, 
                       id: data.markers[i].id
                   });

               }
               //เรียงลำดับตามระยะทาง น้อยไปมาก
               PM2_5_AirQ_distance.sort(function(a, b){return a.distance - b.distance});

               try{
               const getIQAIR_full:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/air_quality/iqair_station_full_data/${PM2_5_AirQ_distance[0].id}`,{
                   headers:{ Authorization: `Bearer ${localStorage.getItem('token_session')}` }
                 });
               //console.log("getIQAIR_full",getIQAIR_full);
               if(getIQAIR_full.status === 200){
                   PM2_5_data = getIQAIR_full.data;
                   //console.log("PM2_5_data",PM2_5_data);
               }else{
                   PM2_5_data = null;
               }
               }catch(error:any){
                   console.log(error);
                   if(error.response.status === 401){
                       window.location.reload();;
                   }else if(error.response.status === 500){
                       return null;
                   }
               }
           }else{
               PM2_5_data = null;
           }
           
           return PM2_5_data

       }
 
     }
     catch (error:any) {
 
       console.log(error);
       if(error.response.status === 401){
         window.location.reload();
       }else{
         return null;
       }
 
     }
}


/////////////////////////////////////////////// Wunderground /////////////////////////////////////////////// 


export async function getNow_Wunderground(lat:number, lon:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/observations/current?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&units=m&language=${language_code}&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        if(response.status === 200){
            //console.log(data);
            return data;
        }
    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();;
        }
        return null;
    }
}

export async function getAirQ_Wunderground(lat:number, lon:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/globalAirQuality?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&format=json&scale=EPA`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        if(response.status === 200){
            //console.log(data);
            return data;
        }
    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}

export async function getWillAlert_Wunderground(lat:number, lon:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v1/geocode/${lat}/${lon}/forecast/wwir.json?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&language=${language_code}&units=m`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        if(response.status === 200){
            //console.log(data);
            return data;
        }
    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}

export async function get24Hour_Wunderground(lat:number, lon:number){
    try{
        const language_code:string = localStorage.getItem("languages") as string;

        const url = `https://api.weather.com/v3/wx/forecast/hourly/1day?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&units=m&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        //console.log('cks',data);
        if(response.status === 200){
            return data;
        }
    }catch(error:any){
        //console.log('ddess',error);
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}

export async function get48Hour_Wunderground(lat:number, lon:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/forecast/hourly/2day?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&units=m&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        //console.log('cks',data);
        if(response.status === 200){
            return data;
        }
    }catch(error:any){
        //console.log('ddess',error);
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}


export async function getHourly15Day_Wunderground(lat:number, lon:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/forecast/hourly/15day?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&units=m&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        //console.log('cks',data);
        if(response.status === 200){
            return data;
        }
    }catch(error){
        //console.log('ddess',error);
        return null;
    }
}

export async function getDaily_Wunderground(lat:number, lon:number, count_day:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/forecast/daily/${count_day}day?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&units=m&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        if(response.status === 200){
            //console.log("daily",data);
            return data;
        }
    }catch(error:any){
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}

export async function getDataInDate_Wunderground(lat:number, lon:number, count_day:number){
    try{
        const language_code = localStorage.getItem("languages");

        const url = `https://api.weather.com/v3/wx/forecast/daily/${count_day}day?apiKey=${process.env.REACT_APP_API_WUNDERGROUND_KEY}&geocode=${lat},${lon}&language=${language_code}&units=m&format=json`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000,
            }
        );

        const data = response.data;


        if(response.status === 200){
            //console.log("daily",data);
            return data;
        }
    }catch(error:any){
        if(error.response.status === 401){
            window.location.reload();
        }
        return null;
    }
}


///////////////////////////////////////// เช็คฝุ่น GISTDA /////////////////////////////////////////
export async function getPM2_5_GISTDA(lat:number, lng:number){
    try{
        const url = `https://pm25.gistda.or.th/rest/pred/getPm25byLocation?lat=${lat}&lng=${lng}`;
        const response:any = await axios.get(url, 
            {
                timeout: 5000
            }
        
        );

        if(response.status !== 200){
            console.log(response);
            return null;
        }

        const data = await response.data;
        console.log(data);

        return data;

    }catch(error:any){
        console.log(error);
        if(error.response.status === 401){
            window.location.reload();
        }else{
            //console.log(error);
            return null;
        }
    }
}