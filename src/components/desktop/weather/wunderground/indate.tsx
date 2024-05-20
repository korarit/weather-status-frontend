import React, { useLayoutEffect, useState, useEffect } from 'react';

import { getDataInDate_Wunderground, getHourly15Day_Wunderground } from '../../../../function/weather/data';

import translate from '../../../../function/languages';

//import '../../../../css/App.css';

import '../../../../css/font.css';
import '../../../../css/icon.css';

import '../../../../css/components/weather.css'
import LoadingSpin from '../../loading_spin';


interface LatLonInterface {
  lat: number;
  lon: number;
}
interface OuterFunctionProps {
  position: LatLonInterface | null;
  LangCode: string;
  request_data: any;
  open: boolean;
  useRange: (range: string, count: number) => void;
}
function WundergroundInDate(props: OuterFunctionProps) {

  const [WundergroundInday, setWunderground] = useState<any>({
    temp: '0',
    temp_max: '0',
    temp_min: '0',
    rain_total: 0,
    cond_txt: '',
    cond: 0,
    time: '',
    date_title: ''
  });

  const [daytimeData, setDaytimeData] = useState<any>(null);
  const [nighttimeData, setNighttimeData] = useState<any>(null);


  const [Hourly, setHourly] = useState<any>([]);
  const [filterIndex, setFilteIndex] = useState<any>([]);

  const [request_data] = useState<any>(props.request_data);

  // สถานะการโหลดข้อมูล
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);

  async function getData_inday(lat: number, lon: number, count_day: number) {
    try {

      //แสดง loading
      setLoadingStatus(true);

      //ดึงข้อมูล
      var data_inday: any = await getDataInDate_Wunderground(lat, lon, count_day);

      //console.log('data_inday',data_inday);
      setWunderground({
        temp: data_inday["daypart"][0]["temperature"][request_data['index_filter']],
        temp_max: data_inday["calendarDayTemperatureMax"][request_data['day']],
        temp_min: data_inday["calendarDayTemperatureMin"][request_data['day']],
        rain_total: data_inday["qpf"][request_data['day']],
        cond_txt: data_inday["daypart"][0]["wxPhraseLong"][request_data['index_filter']],
        cond: data_inday["daypart"][0]["iconCode"][request_data['index_filter']],
        time: data_inday["validTimeLocal"][request_data['day']],
        date_title: data_inday["daypart"][0]["daypartName"][request_data['index_filter']],
      });

      //ข้อมูลพยากรณ์กรณีที่เป็นเต็มวัน
      if (request_data['index_filter'] % 2 === 0) {
        setDaytimeData({
          cond: data_inday["daypart"][0]["iconCode"][request_data['index_filter']],
          narrative: data_inday["daypart"][0]["narrative"][request_data['index_filter']],
          cloudCover: data_inday["daypart"][0]["cloudCover"][request_data['index_filter']],
          rain_precip: data_inday["daypart"][0]["precipChance"][request_data['index_filter']],
          rain_total: data_inday["daypart"][0]["qpf"][request_data['index_filter']],
          humidity: data_inday["daypart"][0]["relativeHumidity"][request_data['index_filter']],
          temp: data_inday["daypart"][0]["temperature"][request_data['index_filter']],
          uvIndex: data_inday["daypart"][0]["uvIndex"][request_data['index_filter']]
        });
        setNighttimeData({
          cond: data_inday["daypart"][0]["iconCode"][request_data['index_filter'] + 1],
          narrative: data_inday["daypart"][0]["narrative"][request_data['index_filter'] + 1],
          cloudCover: data_inday["daypart"][0]["cloudCover"][request_data['index_filter'] + 1],
          rain_precip: data_inday["daypart"][0]["precipChance"][request_data['index_filter'] + 1],
          rain_total: data_inday["daypart"][0]["qpf"][request_data['index_filter'] + 1],
          humidity: data_inday["daypart"][0]["relativeHumidity"][request_data['index_filter'] + 1],
          temp: data_inday["daypart"][0]["temperature"][request_data['index_filter'] + 1],
          uvIndex: data_inday["daypart"][0]["uvIndex"][request_data['index_filter'] + 1]
        });
        console.log('daytimeData');
      } else {
        //ข้อมูลพยากรณ์กรณีที่ไม่เต็มวัน
        setNighttimeData({
          cond: data_inday["daypart"][0]["iconCode"][request_data['index_filter']],
          narrative: data_inday["daypart"][0]["narrative"][request_data['index_filter']],
          cloudCover: data_inday["daypart"][0]["cloudCover"][request_data['index_filter']],
          rain_precip: data_inday["daypart"][0]["precipChance"][request_data['index_filter']],
          rain_total: data_inday["daypart"][0]["qpf"][request_data['index_filter']],
          humidity: data_inday["daypart"][0]["relativeHumidity"][request_data['index_filter']],
          temp: data_inday["daypart"][0]["temperature"][request_data['index_filter']],
          uvIndex: data_inday["daypart"][0]["uvIndex"][request_data['index_filter']]
        });
        console.log('nighttimeData');
      }

      console.log('aaazzz');

      //ข้อมูลรายชั่วโมง
      const hourly_data: any = await getHourly15Day_Wunderground(lat, lon);
      //
      //console.log('aa',hourly_data);
      setHourly(hourly_data);

      if (hourly_data["validTimeLocal"] !== undefined) {
        var listDaily: any = [];
        const hour_start_loop: number | any = 23 - new Date(hourly_data["validTimeLocal"][0]).getHours();
        let start_loop: number = hour_start_loop + 1;
        if (data_inday["daypart"][0]["iconCode"][0] === null) {
          listDaily.unshift([0, hour_start_loop])
        }
        data_inday["daypart"][0]["dayOrNight"].map((element, index) => {
          if (element === "D") {
            listDaily.push([start_loop, start_loop + 23]);
            start_loop += 24;

          }
        });
        //console.log('hour_start_stop', listDaily);

        setFilteIndex(listDaily);
      }

      //ซ่อน loading
      setTimeout(function () {
        setLoadingStatus(false);
      }, 200);

      return hourly_data;

    } catch (error) {
      //console.log(error);
      setErrorStatus(true);
    }
  }

  //////////////////////////////////////// ดึงข้อมูล ////////////////////////////////////////
  useLayoutEffect(() => {
    if (props.position !== null) {
      getData_inday(props.position.lat, props.position.lon, request_data['count_day']);
    }

  }, []);

  useEffect(() => {
    if (props.position !== null) {
      getData_inday(props.position.lat, props.position.lon, request_data['count_day']);
    }

  }, [props.position, props.request_data, props.open]);

  ///////////////////////////////////////// Language /////////////////////////////////////////
  const [lang, setLang] = useState<any>(translate(localStorage.getItem('languages') as string));

  useEffect(() => {
    setLang(translate(localStorage.getItem('languages') as string));
  }, [props.LangCode])


  const listHourly = Hourly["validTimeLocal"] !== undefined ? Hourly["validTimeLocal"].map((a: any, item: number) => (
    <div key={item} className="w-full flex-none border-b-2 first:pt-[0vh] last:border-b-0 border-black pt-[1vh]">
      <div className="grid grid-cols-12 gap-1 min-h-[5vh] h-auto items-center">

        <div className='col-span-3 '>
          <p className="text-[2.1vh] font-normal leading-[4.3vh] font-name-kanit">
            {new Date(Hourly["validTimeLocal"][item]).getHours() <= 9
              ? "0" + new Date(Hourly["validTimeLocal"][item]).getHours() + ":00"
              : new Date(Hourly["validTimeLocal"][item]).getHours() + ":00"}
          </p>
        </div>

        <div className='col-span-2'>
          <p className="text-center text-[2.3vh] font-bold leading-[4.4vh] font-name-kanit">
            {Hourly["temperature"][item]}°
          </p>
        </div>

        <div className='col-span-3'>
          <div className='w-[80%] h-full mx-auto flex items-center'>

            <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${WundergroundInday.cond}.svg`} className="w-[100%] h-[100%]" />
          </div>
        </div>


        <div className='col-span-1 grid place-items-center'>
          <div className='w-[60%] h-[60%]'>
            <div className='icon-weather-rain'></div>
          </div>
        </div>
        <div className='col-span-2'>
          <p className="text-[2.3vh] leading-[4.4vh] font-normal font-name-kanit">
            {Hourly["precipChance"][item]} %
          </p>
        </div>
      </div>
    </div>
  )).slice(filterIndex[request_data['day']][0], filterIndex[request_data['day']][1] + 1)
    : (
      <div>
        {lang['error_message']['not_data']}
      </div>
    );
  return (
    <div className='h-[95%] overflow-y-auto'>
      {/* แสดง error หาก errorStatus เป็น true */}
      {errorStatus ? (
        <div className="w-[100%] h-[50vh] flex items-center justify-center pr-4">
          <p className="text-[3vh] font-semibold font-name-kanit text-center">
            {lang["error_message"]["wunderground"]}
          </p>
        </div>
      ) : null}

      {/* แสดง loading spin ขณะกำลังดึงข้อมูลเพื่อมาแสดง */}
      {loadingStatus ? (
        <div className="w-[100%] h-[50vh] flex items-center justify-center">
          <LoadingSpin />
        </div>
      ) : (
          <>
          {/* ตรวจสอบว่าไม่มี error */}
          {errorStatus === false ? (
            <>
              {/* ****** แสดงข้อมูลที่ดึงมาได้ ****** */}
              <div className="relative pr-3">
                <div className="grid grid-cols-12">
                  <div
                    className="col-span-1"
                    onClick={() =>
                      props.useRange("day", props.request_data["count_day"])
                    }
                  >
                    <button title='close' className="w-[100%] h-[100%] mx-auto grid place-content-center">
                      <i className="icon-arrow-left2 text-[3vh]"></i>
                    </button>
                  </div>
                  <div className="col-span-11">
                    <p className="text-[3vh] mb-[0.5vh] font-normal font-name-kanit">
                      {lang["title"]["inday_forecast"]}{" "}
                      {WundergroundInday.date_title}
                    </p>
                  </div>
                </div>
                <div className="bg-rose-200 rounded-lg w-[100%] h-fit p-[1rem] shadow-md shadow-neutral-800/40">
                  <div className="grid grid-cols-6">
                    <div className="col-span-4">
                      <p className="text-[6vh] leading-[4.8vh] font-semibold font-name-kanit">
                        {Math.floor(WundergroundInday.temp)}°
                      </p>
                      <p className="text-[2.3vh] font-normal leading-[3vh] font-name-kanit">
                        {WundergroundInday.cond_txt}
                      </p>
                      <p className="text-[2.1vh] font-normal leading-[4vh] font-name-kanit">
                        {lang["temp_min"]}{" "}
                        {Math.floor(WundergroundInday.temp_min)}°{" "}
                        {lang["max"]} {Math.floor(WundergroundInday.temp_max)}
                        °
                      </p>
                    </div>

                    <div className='col-span-2 flex justify-center items-center'>
                      <div className='h-[11vh]'>
                        <img alt='weather-icon' src={process.env.PUBLIC_URL + `icon/weather_icon/wunderground/${WundergroundInday.cond}.svg`} className="max-w-[15vh] h-[12vh]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[2vh] mb-[2vh] pr-3">
                <div className=" bg-orange-100 rounded-lg min-h-fit max-h-[25vh] shadow-md shadow-neutral-800/40 pt-[1vh] pb-[1vh] px-[1rem] mb-[1vh]">
                  <p className="text-[2.5vh] font-semibold leading-[3vh] font-name-kanit">
                    {lang["now_header"]["hourly_forecast"]}
                  </p>

                  <div className="relative h-[70%] w-full">
                    <div className="max-w-[100%] mx-auto h-[100%]">
                      <div className="max-h-[19vh] overflow-y-auto flex flex-col select-none">
                        {listHourly}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {daytimeData !== null ? (
                <div className="mb-[2vh] pr-3">
                  <div className=" bg-gray-100 rounded-lg h-fit  border shadow-md shadow-neutral-800/40 pt-[1vh] pb-[1vh] pl-[1vh] pr-[1vh] mb-[1vh]">
                    <p className="ml-[1vw] text-[2.5vh] font-semibold leading-[3vh] font-name-kanit">
                      {lang['title']['daytime']} {WundergroundInday.date_title}
                    </p>

                    <p className="ml-[1vw] mt-[0.5rem] text-[2vh] font-name-kanit">
                      {daytimeData.narrative}
                    </p>

                    <div className="my-[0.5rem] w-[98%] h-fit p-4 mx-auto border-2 border-sky-600 rounded-md">

                      <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem]">
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-thermometer-half text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["temp"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData['temp']} °</p>
                        </div>
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-cloud text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["cloudcover"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData['cloudCover']} %</p>
                        </div>
                      </div>

                      <hr className=' border-zinc-400 mt-[1rem] mb-[1rem]' />

                      <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem] ">
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-umbrella text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["rain_perchine"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData.rain_precip} %</p>
                        </div>
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-rain text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["rain_count"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData.rain_total} mm</p>
                        </div>
                      </div>

                      <hr className=' border-zinc-400 mt-[1rem] mb-[1rem]' />

                      <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem]">
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-droplet text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["humidity"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData.humidity} %</p>
                        </div>
                        <div className="col-span-1">
                          <div className='flex items-center gap-x-3'>
                            <i className='icon-sun text-[3vh] text-center text-sky-600'></i>
                            <p className='font-name-kanit text-[2vh]'>{lang["uv_index"]}</p>
                          </div>

                          <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{daytimeData.uvIndex}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : null}

              {nighttimeData !== null ? (

                    <div className="mb-[1vh] pr-3">
                      <div className="bg-gray-100 rounded-lg h-fit border shadow-md shadow-neutral-800/40 pt-[1vh] pb-[1vh] pl-[1vh] pr-[1vh]">
                        <p className="ml-[1vw] text-[2.5vh] font-semibold leading-[3vh] font-name-kanit overflow-hidden text-ellipsis whitespace-nowrap">
                          {lang['title']['nighttime']} {WundergroundInday.date_title}
                        </p>

                        <p className="ml-[1vw] mt-[0.5rem] text-[1.8vh] font-name-kanit">
                          {nighttimeData.narrative}
                        </p>

                        <div className="my-[0.5rem] w-[98%] h-fit p-4 mx-auto border-2 border-zinc-600 rounded-md">
                          <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem]">
                            <div className="col-span-1">
                              <div className='flex items-center gap-x-3'>
                                <i className='icon-thermometer-half text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["temp"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.temp} °</p>
                            </div>
                            <div className="col-span-1">
                              <div className='flex items-center gap-x-3'>
                                <i className='icon-cloud text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["cloudcover"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.cloudCover} %</p>
                            </div>
                          </div>

                          <hr className='border-zinc-400 mt-[1rem] mb-[1rem]' />

                          <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem]">
                            <div className="col-span-1">
                              <div className='flex items-center gap-x-3'>
                                <i className='icon-umbrella text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["rain_perchine"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.rain_precip} %</p>
                            </div>
                            <div className="col-span-1 w-full">
                              <div className='flex items-center gap-x-3 w-full'>
                                <i className='icon-rain text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["rain_count"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.rain_total} mm</p>
                            </div>
                          </div>

                          <hr className='border-zinc-400 mt-[1rem] mb-[1rem]' />

                          <div className="w-[94%] mx-auto grid grid-cols-2 gap-[1.5rem]">
                            <div className="col-span-1">
                              <div className='flex items-center gap-x-3'>
                                <i className='icon-droplet text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["humidity"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.humidity} %</p>
                            </div>
                            <div className="col-span-1">
                              <div className='flex items-center gap-x-3'>
                                <i className='icon-sun text-[3vh]'></i>
                                <p className='font-name-kanit text-[2vh]'>{lang["uv_index"]}</p>
                              </div>
                              <p className='font-name-kanit text-[2.2vh] font-bold ml-[4.3vh]'>{nighttimeData.uvIndex}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ) : null}
                  </>
            ) : null}
                </>
              )}
            </div>
          );
};

          export default WundergroundInDate;