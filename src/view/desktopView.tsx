import React,{useEffect, useState} from "react";

import SeacrhBox from "../components/desktop/searchbox";
import SearchResult from "../components/desktop/searchresult";
import HistorySearchList from "../components/desktop/history";
import WeatherShow from "../components/desktop/weather";
import MapDesktop from "../components/desktop/map";
import SideMenu from "../components/desktop/sideMenu";

//model
import LayerMapModel from "../components/desktop/model/layerMap";
import AirQualityModel from "../components/desktop/model/airquality";

import "../css/font.css";
import "../css/desktop/main.css";
interface MapLayerSettingType {
    use_map: string;
    air_quality: boolean;
    fire: boolean;
    rain: boolean;
  }
interface LatLonInterface{
    lat: number;
    lon: number;
}
interface OuterFunction {
    Device: string;
    LatLonWeather: LatLonInterface | null;
    LocationType: string;
    searchValue: string;
    mapLayerSetting: MapLayerSettingType;
  
    setLatLonWeather: Function;
    setLocationType: Function;
    setSearchValue: Function;
    setMapLayerSetting: Function;
}
  
function DesktopView({Device, LatLonWeather, LocationType, searchValue, mapLayerSetting, setLatLonWeather, setLocationType, setSearchValue, setMapLayerSetting}:OuterFunction) {

    //////////////////////////////////// contorl search ////////////////////////////////////
    const [seacrhClose, setSeacrhClose] = useState<boolean>(false);

    //////////////////////////////////// contorl more data ////////////////////////////////////
    const [sidePop, setSidePop] = useState<any>({
        search: false,
        history: false,
        weathers: false
    });
    const [oldSidePop, setOldSidePop] = useState<string>('');

    function openSidePop(name: string) {
        const sidePop_new = {
            search: false,
            history: false,
            weathers: false
        }
        setSidePop({
            ...sidePop_new,
            [name]: true
        });
        if(oldSidePop === name){
            setSeacrhClose(true);
        }else{
            setSeacrhClose(true);
            setOldSidePop(name);
        }
        
    }

    function closeSidePopAll() {
        setSidePop({
            search: false,
            history: false,
            weathers: false
        });
        setSeacrhClose(false);
    }

    useEffect(() => {
        console.log('sidePop', sidePop);
    }, [sidePop]);

    //////////////////////////////////// contorl weather data and location ////////////////////////////////////
    interface LatLonInterface{
        lat: number;
        lon: number;
    }
    const [can_use_gps , setPermissionGps] = useState<boolean>();

    function WeatherSide(LatLon: LatLonInterface){
        setLatLonWeather(LatLon);
        openSidePop('weathers');
    }

    function GetGPSLocation (){
        navigator.geolocation.getCurrentPosition((position) => {
            setLatLonWeather({lat: position.coords.latitude, lon: position.coords.longitude});
            setLocationType("gps");
        }, (error) => {
            if(error.code === 1){
                setPermissionGps(false);
            }
        });
    }




    //////////////////////////////////// contorl language ////////////////////////////////////
    const [refreshlanguage] = useState<string>('');
    useEffect(() => {
        console.log("refreshlanguage");
    }, [refreshlanguage]);

    //////////////////////////////////// contorl search ////////////////////////////////////
    const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
    const [closeSuggest, setCloseSuggest] = useState<boolean>(false);

    //////////////////////////////////////////////// Model Manager ////////////////////////////////////////////////

    interface ModalShowType {
        layer_map: boolean;
        air_quality: boolean;
        voice_search: boolean;
        earth_quake: boolean;
    }
    const [modelShow, setModelShow] = useState<ModalShowType>({
        layer_map: false,
        air_quality: false,
        voice_search: false,
        earth_quake: false
    });

    function ManangeModel(key: string, newValue: boolean){
        let modelDefault: ModalShowType = {
            layer_map: false,
            air_quality: false,
            voice_search: false,
            earth_quake: false
        }
        let updatedModel: ModalShowType = {
            ...modelDefault,
            [key]: newValue,
        }
        setModelShow(updatedModel);

    }

    //////////////////////////////////////////////// Side Menu Control ////////////////////////////////////////////////
    const [sideMenu, setSideMenu] = useState<boolean>(false);


    //////////////////////////////////////////////// AirQuality Modal Control ////////////////////////////////////////////////
    interface DustboyStationType {
        dustboy_lat: number;
        dustboy_lon: number;
        id: number;
        log_datetime: string;
        pm10: number;
        pm25: number;
        th_aqi: number;
        us_aqi: number;
    }
        
    const [dustboy_station, setDustboyStation] = useState<DustboyStationType | null>(null);
    function OpenAirQualityStation(stationData: DustboyStationType){
        setDustboyStation(stationData);
        ManangeModel('air_quality', true);
    }

    //////////////////////////////////////////////// Layer Map Setting Data ////////////////////////////////////////////////

    interface MapLayerSetting {
        use_map: string;
        air_quality: boolean;
        fire: boolean;
        rain: boolean;
    }

    const MapLayerSettingData = (key: string, newValue: any) => {

        if(key !== ""){
        
        let updatedMapLayerSetting: MapLayerSetting = {
            ...mapLayerSetting,
            [key]: newValue,
        }

        setMapLayerSetting(updatedMapLayerSetting); // Added this line
        }
    }

    const [zoom, setZoom] = useState<any>({
        zoomIn: false,
        zoomOut: false,
        zoomValue: 0
    });

    function ZoomSet(key: string){
        let zooms = {
            zoomIn: false,
            zoomOut: false,
            zoomValue: 0
        }
        let zoomValue = 0;
        if (key === 'zoomIn') zoomValue = 1;
        if (key === 'zoomOut') zoomValue = -1;
        setZoom({
            ...zooms,
            [key]: !zoom[key],
            zoomValue: zoomValue
        });
    }

    



    return (
        <div className="w-[100dvw] h-[100dvh] flex flex-row overflow-hidden">
            {/* Left Side */}
            <div className="w-[70px] h-[100%]  bg-white border-r border-gray-400 z-[2] desktop-sideleft">
                <div className="mt-[2dvh] h-[98%]">
                    {/* logo */}
                    <div className="h-[60px] w-full flex flex-col items-center justify-center">
                        <div className='mt-[8px] icon-cloud-welcome'></div>
                    </div>
                        
                    {/* menu */}
                    <div className="w-full mt-[1.5rem] h-[5%] flex items-center justify-center">
                        <button title="sidemenu"  className="text-gray-500 w-full h-full "
                                onClick={() => setSideMenu(!sideMenu)}
                        >
                            <div className=' h-[100%] flex items-center justify-center'>
                                <i  className="icon-th-menu text-[2rem]"></i>
                            </div>
                        </button>
                    </div>

                    {/* ดูพยากรณ์อากาศ */}
                    <div className="w-full mt-[1.5rem] h-[6.5%] flex items-center justify-center">
                        <button className="text-gray-500 w-full h-full "
                                onClick={() => {openSidePop('weathers');setCloseSuggest(!closeSuggest);}}
                        >
                            <div className=' h-[100%] flex items-center justify-center'>
                                <div className="flex flex-col">
                                    <i  className="icon-cloud w-[3rem] text-[2.2rem] text-center"></i>
                                    <p className="text-center">ดูข้อมูล</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* history new */}
                    <div className="w-full mt-[1.5rem] h-[6.5%] flex items-center justify-center">
                        <button className="text-gray-500 w-full h-full "
                                onClick={() => {openSidePop('history');setCloseSuggest(!closeSuggest);setSearchValue('');}}
                        >
                            <div className=' h-[100%] flex items-center justify-center'>
                                <div className="flex flex-col">
                                    <i  className="icon-history w-[2.2rem] text-[2rem] text-center"></i>
                                    <p className="text-center">บันทึก</p>
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>


            {/* map */}
            <div className="w-[calc(100dvw-70px)] relative z-[1] bg-slate-200">

                {/* seacrh box */}
                <div className="top-[2%] left-[1.25%] w-[34%] 2xl:w-[450px] h-fit absolute z-[50] bg-white rounded-t-[25px] rounded-b-[25px] drop-shadow-lg">
                    <SeacrhBox 
                        useclose={seacrhClose} 
                        usesearch={true}
                        searchValue={searchValue}
                        closeSuggest={closeSuggest}
                        openResult={() => openSidePop('search')} 
                        closeSidePop={() => closeSidePopAll()}

                        setSearchValue={setSearchValue}
                        setKeyword={setSearchKeyword}

                        setLatLonWeather={WeatherSide}
                        setLocationType={setLocationType}
                    />
                </div>

                {/* layer + gps box */}
                <div className={`bottom-[3%] ${sidePop['search'] || sidePop['history'] || sidePop['weathers'] ? 'left-[37%] 2xl:left-[calc(2.5%+450px+1%)]' : 'left-[1%]'} w-[60px] xl:w-[4.5dvw] h-[16dvh] absolute z-[50]`}>
                    <button title="get-gps" className="w-[100%] h-[47%] bg-white rounded-xl drop-shadow-lg flex items-center justify-center"
                            onClick={() => GetGPSLocation()}
                    >
                        <i className="icon-gps-location font-bold text-[3rem] text-gray-500" />
                    </button>

                    <button title="layer" className="w-[100%] h-[47%] mt-[10%] bg-white rounded-xl drop-shadow-lg flex items-center justify-center"
                            onClick={() => ManangeModel('layer_map', true)}
                    >
                    <i className="icon-layer-map font-bold text-[3rem] text-gray-500" />
                    </button>
                </div>

                {/* zoom box */}
                <div className="bottom-[3%] right-[1%] w-[60px] xl:w-[4.5dvw] h-[16dvh] absolute z-[50]">
                    <div className="w-[100%] h-[100%] m-0 bg-white rounded-xl">
                        <button title="mapZoom" className="border-b border-gray-400 w-[100%] h-[50%] flex items-center justify-center"
                                onClick={() => ZoomSet('zoomIn')}
                        >
                            <i className="icon-plus text-[4dvh] text-gray-500" />
                        </button>
                        <button title="mapOut" className="border-gray-400 w-[100%] h-[50%] flex items-center justify-center"
                                onClick={() => ZoomSet('zoomOut')}
                        >
                            <i className="icon-minus text-[4dvh] text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Model All */}
                {modelShow.layer_map || modelShow.air_quality ?
                <div className=" w-[100%] h-[100%] flex items-center justify-center z-[300] backdrop-opacity-10 backdrop-invert bg-black/20 absolute">
                    {modelShow.layer_map ?
                        <LayerMapModel
                            open={modelShow.layer_map}
                            mapsetting={mapLayerSetting}
                            SelectLayer={MapLayerSettingData}
                            closeLayer={() => ManangeModel('layer_map', false)}
                            LangCode={refreshlanguage}
                        />
                    : null
                    }
                    {modelShow.air_quality ?
                        <AirQualityModel
                            open={modelShow.air_quality}
                            closeLayer={() => ManangeModel('air_quality', false)}
                            LangCode={refreshlanguage}
                            StationData={dustboy_station}
                        />
                    : null
                    }
                </div>
                : null
                }

                {/* side pop box */}
                <div className={`left-[0px] top-[0px] w-full h-full absolute ${sidePop['search'] || sidePop['history'] || sidePop['weathers'] ? '' : 'hidden'}`}>

                    {/* weather result */}
                    <div className={`${sidePop['weathers'] ? 'absolute' : 'hidden'} w-[36.5%] 2xl:w-[calc(2.5%+450px)] pt-[calc(2.5%+50px)] 2xl:pt-[calc(2.2%+50px)] h-[100%] z-[40] bg-white desktop-sideleft`}>
                        <div className="h-full w-full">
                            <p className="font-name-kanit text-[24px] ml-[4%]">การพยากรณ์อากาศ</p>
                            <hr className="bg-gray-400"/>
                            <div className="h-[calc(98.5%-24px)]">
                                <WeatherShow open={sidePop['weathers']} LangCode={refreshlanguage} LatLon={LatLonWeather} />
                            </div>
                        </div>
                    </div>

                    {/* search result */}
                    { sidePop['search'] ?
                    <div className={`absolute w-[36%] 2xl:w-[calc(2.5%+450px)] pt-[calc(2.5%+50px)] 2xl:pt-[calc(2.2%+50px)] h-[100%] z-[40] bg-white desktop-sideleft`}>
                        <div className="h-full w-full">
                            <p className="font-name-kanit text-[24px] ml-[4%]">ผลลัพธ์</p>
                            <hr className="bg-gray-400"/>
                            <div className="h-[calc(98.5%-24px)]">
                                <SearchResult 
                                    open={sidePop['search']} 
                                    keyword={searchKeyword} 
                                    setSearchValue={setSearchValue}
                                    setLatLonWeather={WeatherSide}
                                    setLocationType={setLocationType}
                                />
                            </div>
                        </div>
                    </div>
                    : null
                    }

                    {/* history result */}
                    { sidePop['history'] ?
                    <div className={`absolute w-[36%] 2xl:w-[calc(2.5%+450px)] pt-[calc(2.5%+50px)] 2xl:pt-[calc(2.2%+50px)] h-[100%] z-[40] bg-white desktop-sideleft`}>
                        <div className="h-full w-full">
                            <p className="font-name-kanit text-[24px] ml-[4%]">การค้นหาล่าสุด</p>
                            <hr className="bg-gray-400"/>
                            <div className="h-[calc(98.5%-24px)]">
                                <HistorySearchList 
                                    open={sidePop['history']} 
                                    setSearchValue={setSearchValue} 
                                    setLatLonWeather={WeatherSide}
                                    setLocationType={setLocationType}
                                />
                            </div>
                        </div>
                    </div>
                    : null
                    }

                </div>

                {/* map */}
                <div className="w-[100%] h-[100%] z-[2] absolute" tabIndex={2}>
                    <MapDesktop
                        Device={Device}

                        layername={mapLayerSetting.use_map} 
                        mapsetting={mapLayerSetting} 

                        set_location={setLatLonWeather}
                        map_location={LatLonWeather}
                        LocationType={LocationType} 

                        OpenAirQualityModal={OpenAirQualityStation}

                        zoom={zoom}
                    />
                </div>

            </div>

            {/* menu side */}
            {sideMenu ?
            <div className="absolute w-[100%] h-[100%] z-[300] backdrop-opacity-10 backdrop-invert bg-black/20">
                <SideMenu open={sideMenu} setOpen={setSideMenu} Languages={refreshlanguage}/>
            </div>
            : null
            }

        </div>
    );
}

export default DesktopView;