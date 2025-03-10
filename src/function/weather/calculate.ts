import L from 'leaflet';

import translate from '../languages';
/*
* This function converts the temperature from calcius to fahrenheit
* @param calcius: number - อุณหภูมิในหน่วยเซลเซียส

* @return: number - อุณหภูมิในหน่วยฟาเรนไฮต์
*/
export function Calcius_to_fahrenheit(calcius: number){
    return ((9/5)*calcius) + 32;
}

/*
* This function converts the temperature from fahrenheit to calcius
* @param temp: number - อุณหภูมิในหน่วยฟาเรนไฮต์
* @param humidity: number - ความชื้นสัมพัทธ์

* @return: number - ดัชนีความร้อน หน่วยองศาเซลเซียส
*/
export function heat_index(temp: number, humidity: number){
    const heat_index:number = -42.379 + (2.04901523*temp) + (10.14333127*humidity) - (0.22475541*temp*humidity) - ((6.83783*(10**-3)) * (temp**2)) - ((5.481717*(10**-2)) * (humidity**2)) + ((1.22874*(10**-3)) * (temp**2) * humidity) + ((8.5282*(10**-4)) * temp * (humidity**2)) - ((1.99*(10**-6)) * (temp**2) * (humidity**2));
    const covert_to_calcius:number = (5/9)*(heat_index - 32);

    return covert_to_calcius;
}

export function get_StationArea(e : any, location : any, zoom : number){
    const bounds = e?.getPixelBounds(location, zoom);
    const sw = e?.unproject(bounds.getBottomLeft(), zoom);
    const ne = e?.unproject(bounds.getTopRight(), zoom);
  
    return L.latLngBounds(sw, ne);
}


/*
* This function converts the air quality value to text
* @param aqi: number - ดัชนีคุณภาพอากาศ
* @return: string - ข้อความสภาพอากาศ
*/
export function airq_status_txt(aqi:number){
    const list_cond:any = translate(localStorage.getItem("languages") as string)["tmd_status_airq"] as any;

    if(aqi <= 25){
        return list_cond[0];
    }else if(aqi <= 50 && aqi > 25){
        return list_cond[1];
    }else if(aqi <= 100 && aqi > 50){
        return list_cond[2];
    }else if(aqi <= 150 && aqi > 100){
        return list_cond[3];
    }else if(aqi <= 200 && aqi > 150){
        return list_cond[4];
    }else if(aqi <= 300 && aqi > 200){
        return list_cond[5];
    }else if(aqi > 300){
        return list_cond[6];
    }
}

/*
* This function converts pm2.5 value to aqi value
* @param pm25: number - ค่า pm2.5
* @return: number - aqi value
* @see: https://www.airvisual.com/th/air-pollution-levels
*/
function lerp(ylo:number, yhi:number, xlo:number, xhi:number, x:number) {
    return ((x - xlo) / (xhi - xlo)) * (yhi - ylo) + ylo;
}

export function pm25_to_aqi(pm25:number){
    const c = Math.floor(10 * pm25) / 10;
  const a = c < 0 ? 0 // values below 0 are considered beyond AQI
    : c <  12.1 ? lerp(  0,  50,   0.0,  12.0, c)
    : c <  35.5 ? lerp( 51, 100,  12.1,  35.4, c)
    : c <  55.5 ? lerp(101, 150,  35.5,  55.4, c)
    : c < 150.5 ? lerp(151, 200,  55.5, 150.4, c)
    : c < 250.5 ? lerp(201, 300, 150.5, 250.4, c)
    : c < 350.5 ? lerp(301, 400, 250.5, 350.4, c)
    : c < 500.5 ? lerp(401, 500, 350.5, 500.4, c)
    : 500; // values above 500 are considered beyond AQI
  return Math.round(a);
}

export function airq_status_explain(aqi:number){
    const list_cond:any = translate(localStorage.getItem("languages") as string)["tmd_explain_airq"] as any;

    if(aqi <= 25){
        return list_cond[0];
    }else if(aqi <= 50 && aqi > 25){
        return list_cond[1];
    }else if(aqi <= 100 && aqi > 50){
        return list_cond[2];
    }else if(aqi <= 150 && aqi > 100){
        return list_cond[3];
    }else if(aqi <= 200 && aqi > 150){
        return list_cond[4];
    }else if(aqi <= 300 && aqi > 200){
        return list_cond[5];
    }else if(aqi > 300){
        return list_cond[6];
    }
}
