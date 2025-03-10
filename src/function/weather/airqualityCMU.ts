import axios from "axios";
import L from 'leaflet';

const bboxArea:any = {
    box16:{
        0: new L.LatLngBounds(L.latLng(3.67,93.16), L.latLng(7.9175,96.365)),
        1: new L.LatLngBounds(L.latLng(3.67,96.365), L.latLng(7.9175,99.57)),
        2: new L.LatLngBounds(L.latLng(3.67,99.57), L.latLng(7.9175,102.775)),
        3: new L.LatLngBounds(L.latLng(3.67,102.775), L.latLng(7.9175,105.97)),
        4: new L.LatLngBounds(L.latLng(7.9175,93.16), L.latLng(12.165,96.365)),
        5: new L.LatLngBounds(L.latLng(7.9175,96.365), L.latLng(12.165,99.57)),
        6: new L.LatLngBounds(L.latLng(7.9175,99.57), L.latLng(12.165,102.775)),
        7: new L.LatLngBounds(L.latLng(7.9175,102.775), L.latLng(12.165,105.97)),
        8: new L.LatLngBounds(L.latLng(12.165,93.16), L.latLng(16.4125,96.365)),
        9: new L.LatLngBounds(L.latLng(12.165,96.365), L.latLng(16.4125,99.57)),
        10: new L.LatLngBounds(L.latLng(12.165,99.57), L.latLng(16.4125,102.775)),
        11: new L.LatLngBounds(L.latLng(12.165,102.775), L.latLng(16.4125,105.97)),
        12: new L.LatLngBounds(L.latLng(16.4125,93.16), L.latLng(21.66,96.365)),
        13: new L.LatLngBounds(L.latLng(16.4125,96.365), L.latLng(21.66,99.57)),
        14: new L.LatLngBounds(L.latLng(16.4125,99.57), L.latLng(21.66,102.775)),
        15: new L.LatLngBounds(L.latLng(16.4125,102.775), L.latLng(21.66,105.97))
    },
    box8: {
        0: new L.LatLngBounds(L.latLng(3.67,93.16), L.latLng(7.9175,99.565)),
        1: new L.LatLngBounds(L.latLng(3.67,99.565), L.latLng(7.9175,105.97)),
        2: new L.LatLngBounds(L.latLng(7.9175,93.16), L.latLng(12.165,99.565)),
        3: new L.LatLngBounds(L.latLng(7.9175,99.565), L.latLng(12.165,105.97)),
        4: new L.LatLngBounds(L.latLng(12.165,93.16), L.latLng(16.4125,99.565)),
        5: new L.LatLngBounds(L.latLng(12.165,99.565), L.latLng(16.4125,105.97)),
        6: new L.LatLngBounds(L.latLng(16.4125,93.16), L.latLng(21.66,99.565)),
        7: new L.LatLngBounds(L.latLng(16.4125,99.565), L.latLng(21.66,105.97))
    },
    box4: {
        0: new L.LatLngBounds(L.latLng(3.67,93.16), L.latLng(12.165,99.565)),
        1: new L.LatLngBounds(L.latLng(3.67,99.565), L.latLng(12.165,105.97)),
        2: new L.LatLngBounds(L.latLng(12.165,93.16), L.latLng(21.66,99.565)),
        3: new L.LatLngBounds(L.latLng(12.165,99.565), L.latLng(21.66,105.97))
    },
    row4: {
        0: new L.LatLngBounds(L.latLng(3.67,93.16), L.latLng(7.9175,105.97)),
        1: new L.LatLngBounds(L.latLng(7.9175,93.16), L.latLng(12.165,105.97)),
        2: new L.LatLngBounds(L.latLng(12.165,93.16), L.latLng(16.4125,105.97)),
        3: new L.LatLngBounds(L.latLng(16.4125,93.16), L.latLng(21.66,105.97))
    },
    all:{
        0: new L.LatLngBounds(L.latLng(3.67,93.16), L.latLng(21.66,105.97))
    
    }
};

/*
* chunkDustboy
* @params boundPoint: L.LatLngBounds
* @return: chunk name and chunk id
*/
export function chunkDustboy(boundPoint: L.LatLngBounds | L.LatLng) {

    const box8 = bboxArea['box8']
    // box 16 chunk
    if(bboxArea['box16']['0'].contains(boundPoint)){
        return ['box16',0];
    }
    else if(bboxArea['box16']['1'].contains(boundPoint)){
        return ['box16',1];
    }
    else if(bboxArea['box16']['2'].contains(boundPoint)){
        return ['box16',2];
    }
    else if(bboxArea['box16']['3'].contains(boundPoint)){
        return ['box16',3];
    }
    else if(bboxArea['box16']['4'].contains(boundPoint)){
        return ['box16',4];
    }
    else if(bboxArea['box16']['5'].contains(boundPoint)){
        return ['box16',5];
    }
    else if(bboxArea['box16']['6'].contains(boundPoint)){
        return ['box16',6];
    }
    else if(bboxArea['box16']['7'].contains(boundPoint)){
        return ['box16',7];
    }
    else if(bboxArea['box16']['8'].contains(boundPoint)){
        return ['box16',8];
    }
    else if(bboxArea['box16']['9'].contains(boundPoint)){
        return ['box16',9];
    }
    else if(bboxArea['box16']['10'].contains(boundPoint)){
        return ['box16',10];
    }
    else if(bboxArea['box16']['11'].contains(boundPoint)){
        return ['box16',11];
    }
    else if(bboxArea['box16']['12'].contains(boundPoint)){
        return ['box16',12];
    }
    else if(bboxArea['box16']['13'].contains(boundPoint)){
        return ['box16',13];
    }
    else if(bboxArea['box16']['14'].contains(boundPoint)){
        return ['box16',14];
    }
    else if(bboxArea['box16']['15'].contains(boundPoint)){
        return ['box16',15];
    }

    // box 8 chunk
    else if ( box8['0'].contains(boundPoint)) {
        return ['box8',0];
    }
    else if( box8['1'].contains(boundPoint)){
        return ['box8',1];
    }
    else if(box8['2'].contains(boundPoint)){
        return ['box8',2];
    }
    else if(box8['3'].contains(boundPoint)){
        return ['box8',3];
    }
    else if(box8['4'].contains(boundPoint)){
        return ['box8',4];
    }
    else if(box8['5'].contains(boundPoint)){
        return ['box8',5];
    }
    else if(box8['6'].contains(boundPoint)){
        return ['box8',6];
    }
    else if(box8['7'].contains(boundPoint)){
        return ['box8',7];
    }

    //box 4 chunk
    else if (bboxArea['box4']['0'].contains(boundPoint)) {
        return ['box4',0];
    }
    else if(bboxArea['box4']['1'].contains(boundPoint)){
        return ['box4',1];
    }
    else if(bboxArea['box4']['2'].contains(boundPoint)){
        return ['box4',2];
    }
    else if(bboxArea['box4']['3'].contains(boundPoint)){
        return ['box4',3];
    }

    //row 4 chunk
    else if (bboxArea['row4']['0'].contains(boundPoint)) {
        return ['row4',0];
    }
    else if(bboxArea['row4']['1'].contains(boundPoint)){
        return ['row4',1];
    }
    else if(bboxArea['row4']['2'].contains(boundPoint)){
        return ['row4',2];
    }
    else if(bboxArea['row4']['3'].contains(boundPoint)){
        return ['row4',3];
    }else{
        return ['all',0];
    }


}

/*
* DustboyData
* @params JWT_token: JWT_token
* @return: data from api if not found return null
*/
export async function DustboyData(JWT_token:string) {

    //filter data area box
    try{
    const response:any = await axios.get(process.env.REACT_APP_API_MAIN+'/data/air_quality/dustboy',{
        headers:{ Authorization: `Bearer ${JWT_token}` }
    });

    const DataList:any = {
        box16: {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[],13:[],14:[],15:[]},
        box8: {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]},
        box4: {0:[],1:[],2:[],3:[],},
        row4: {0:[],1:[],2:[],3:[],},
        all: {0:[]}
    };

    if(response.status === 200){
        const data:any = response.data;

        console.log(data);
        data.forEach((element:any) => {

            if (element.dustboy_lat === null || element.dustboy_lon === null || element.dustboy_lat === undefined || element.dustboy_lon === undefined) {
                console.log('dustboy_lat or dustboy_lon is null or undefined');
                return;
            }
            let latlng = {lng: element.dustboy_lon, lat: element.dustboy_lat}

            //box 16 chunk
            for(let i = 0; i < 16; i++){
                if(bboxArea['box16'][i].contains(latlng)){
                    DataList['box16'][i].push(element);
                }
            }

            //box 8 chunk
            for(let i = 0; i < 8; i++){
                if(bboxArea['box8'][i].contains(latlng)){
                    DataList['box8'][i].push(element);
                }
            }
            
            //box 4 chunk
            if (bboxArea['box4']['0'].contains(latlng)) {
                DataList['box4'][0].push(element);
            }
            else if (bboxArea['box4']['1'].contains(latlng)) {
                DataList['box4'][1].push(element);
            }
            else if (bboxArea['box4']['2'].contains(latlng)) {
                DataList['box4'][2].push(element);
            }
            else if (bboxArea['box4']['3'].contains(latlng)) {
                DataList['box4'][3].push(element);
            }

            //row 4 chunk
            if (bboxArea['row4']['0'].contains(latlng)) {
                DataList['row4'][0].push(element);
            }
            else if (bboxArea['row4']['1'].contains(latlng)) {
                DataList['row4'][1].push(element);
            }
            else if (bboxArea['row4']['2'].contains(latlng)) {
                DataList['row4'][2].push(element);
            }
            else if (bboxArea['row4']['3'].contains(latlng)) {
                DataList['row4'][3].push(element);
            }

            //all chunk
            if(bboxArea['all']['0'].contains(latlng)){
                DataList['all'][0].push(element);
            }

        });

    }else{
        console.log(response.status);
    }

    console.log(DataList['all'][0].length);
    console.log(DataList);
    return DataList;
    }catch(e:any){
        console.log(e);
        if(e.response !== undefined){
            if(e.response.status === 401){
                // ให้ refresh token
                window.location.reload();
            }else if(e.response.status === 502){
                return 'error_502';
            }
        }
    }
}

const name_file_dustboy:string = 'dustboydata4.json';

/*
* cacheDustboyData
* @params chunk: chunk name and chunk id
* @return: data from cache or api if not found return null
*/
export async function cacheDustboyData(chunk:Array<string|number>) {
    const Dates = new Date();

    const cache = await caches.open(process.env.REACT_APP_CACHE_NAME as string);
    const match = await cache.match(name_file_dustboy);
    
    let chunkName = chunk[0];
    let chunkId = chunk[1];
    if(match !== undefined){

        const cacheData = await match.json();
        const NowMin:number = Dates.getMinutes();

        //ตรวจสอบว่า cache หมดอายุหรือยัง โดยเช็คเวลา timeout และ ชั่วโมงไม่เท่ากัน และ นาทีต้องมากกว่า 12 เพื่อรอให้ dustboy อัพเดทข้อมูลใหม่
        if( ( (cacheData.timestamp + cacheData.timeout < Date.now()) || (cacheData.hour !== Dates.getHours()) ) && (NowMin > 12) ){
            /////////////// cache หมดอายุ ///////////////

            console.log('dustboydata cache outtime');
            try{

                //ดึงข้อมูลใหม่
                const data = await DustboyData(localStorage.getItem('token_session') as string);
                //เพิ่มข้อมูลใหม่
                if(data !== 'error_502' && data !== null){
                    //ลบ cache เก่า
                    await cache.delete(name_file_dustboy);

                    const payload = {
                        data: JSON.stringify(data),
                        timestamp: Date.now(),
                        hour: Dates.getHours(),
                        timeout: 1000 * 60 * parseInt(process.env.REACT_APP_DUSTBOY_CACHE_TIME as string), //หน่วยเป็น นาที
                    };
                    const responsePayload = new Response((JSON.stringify(payload)), {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    });                                                                   
                    await cache.put(name_file_dustboy,responsePayload);
                    //return ข้อมูลใหม่
                    //console.log(data);
                    return data[chunkName][chunkId];
                }else{
                    /////////////// ดึงข้อมูลใหม่ไม่ได้ ใช้ cache ไปก่อน dustboy api ชอบ 502 bad gateway ///////////////
                    console.log('dustboydata cache not outtime');
                    //return ข้อมูลใน cache
                    console.log(JSON.parse(cacheData.data));
                    const json_data = JSON.parse(cacheData.data);
                    return json_data[chunkName][chunkId];
                }
            }catch(e){
            }
        }else{
            /////////////// cache ยังไม่หมดอายุ ///////////////
            //console.log('dustboydata cache not outtime');
            //return ข้อมูลใน cache
            //console.log(JSON.parse(cacheData.data));
            const json_data = JSON.parse(cacheData.data);
            return json_data[chunkName][chunkId];
        }
    }else{
        /////////////// ไม่มี cache ///////////////
        console.log('no cache');
        const data = await DustboyData(localStorage.getItem('token_session') as string);
        if(data !== 'error_502'){
        const payload = {
            data: JSON.stringify(data),
            timestamp: Date.now(),
            hour: Dates.getHours(),
            timeout: 1000 * 60 * parseInt(process.env.REACT_APP_DUSTBOY_CACHE_TIME as string), //หน่วยเป็น นาที
        };
        const responsePayload = new Response((JSON.stringify(payload)), {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        await cache.put(name_file_dustboy,responsePayload);
        //console.log(data);
        return data[chunkName][chunkId];
        }else{
            return null;
        }
    }
}

/*
* cacheDustboyReset
* @params JWT_token: JWT_token
* @return: data from cache or api if not found return null
*/
export async function cacheDustboyReset(JWT_token:string) {
    const Dates = new Date();

    const cache = await caches.open(process.env.REACT_APP_CACHE_NAME as string);
    const match = await cache.match(name_file_dustboy);
    try{
        //ดึงข้อมูลใหม่
        const data = await DustboyData(JWT_token);

        //ตรวจสอบว่ามี cache หรือไม่ ถ้ามีให้ลบออก
        if(match !== undefined && data !== 'error_502'){
            await cache.delete(name_file_dustboy);
        }
        //เพิ่มข้อมูลใหม่
        if(data !== 'error_502'){
            const payload = {
                data: JSON.stringify(data),
                timestamp: Date.now(),
                hour: Dates.getHours(),
                timeout: 1000 * 60 * parseInt(process.env.REACT_APP_DUSTBOY_CACHE_TIME as string), //หน่วยเป็น นาที
            };
            const responsePayload = new Response((JSON.stringify(payload)), {
                headers: {
                'Content-Type': 'application/json'
                }
            });
            await cache.put(name_file_dustboy,responsePayload);
        }
    }catch(e){
        console.log(e);
    }
}

/*
* @Function: DustboyNear
* @params bound: L.LatLngBounds
* @params lat: latitude
* @params lng: longitude
* @return: data of station near location(lat,lon) if not found return null
*/
export async function DustboyNear(lat:number, lng:number){
    try{
        const Locations = L.latLng(lat, lng);

        const chuck = chunkDustboy(Locations);
        const data = await cacheDustboyData(chuck);

        if(data !== 'error_502'){
            //คำนวนระยะทางของตำแหน่งปัจจุบันกับสถานี
            const list_near:{distance:number, data:any}[] = [];
            data.forEach((item:any) => {
                //ระยะทางของสถานี dustboy กับพิกัดปัจจุบัน
                let distance:number = L.latLng(lat, lng).distanceTo(L.latLng(item.dustboy_lat, item.dustboy_lon));
                //ระยะทางน้อยกว่าหรือเท่ากับ REACT_APP_DUSTBOY_RADIUS ใน env
                if(distance <= parseInt(process.env.REACT_APP_DUSTBOY_RADIUS as string)){
                    list_near.push({
                        distance: distance,
                        data: item
                    });
                }
            });

            //เรียงลำดับระยะทาง
            list_near.sort(function(a,b){return a.distance - b.distance});
            //console.log('near list',list_near);
            if(list_near.length > 0){
                return list_near;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }catch(e){
        console.log(e);
        return null;
    }
}