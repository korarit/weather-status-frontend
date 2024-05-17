import React,{useEffect, useState, useRef} from "react";

import Search_data from '../../function/location/search';
import {LastedHistory} from '../../function/localDatabase/search';

import "../../css/font.css";
import "../../css/desktop/components/searchbox.css"

interface SearchBoxInterface {
    useclose: boolean;
    usesearch: boolean;
    searchValue: string | null;
    closeSuggest: boolean;
    openResult: Function;
    closeSidePop: Function;
    setKeyword: Function;
    setSearchValue: Function;
    setLatLonWeather: Function;
    setLocationType: Function;
}

function SeacrhBox({useclose, usesearch, searchValue, closeSuggest, setKeyword, setSearchValue, setLatLonWeather, setLocationType, openResult, closeSidePop}: SearchBoxInterface) {
    const [focus, setFocus] = useState<boolean>(false);
    const [mouseLeave , setMouseLeave] = useState<boolean>(false);
    const [suggestList, setSuggestList] = useState<any>(null);

    const searchInput = useRef<HTMLInputElement>(null);
    const suggestBox = useRef<HTMLDivElement>(null);

    function CheckFocus(event:any){
        if(focus){
            event.target.blur();
        }else{
            setFocus(false)
            event.target.blur();
        }
    }
    

    function getLocation(event) {
        CheckFocus(event);

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((position) => {
                setLatLonWeather({lat: position.coords.latitude, lon: position.coords.longitude});
                setLocationType('gps');
                setSearchValue('');
            });
        }
    }

    function openSideResult(){
        setFocus(false);
        openResult();
    }

    function closeSide(){
        setFocus(false);
        closeSidePop()
        if(searchInput.current){
            searchInput.current.value = '';
        }
    }

    function checkMouseLeave(){
        if(mouseLeave){
            setFocus(false);
            setMouseLeave(false);
        }
    }

    async function GetSuggetList(event){
        let prvInput:string = '';
        let input:string = event.target.value;
        const searchFunc = new Search_data();
        if(input.length > prvInput.length + 1){
            const listLocal:any = await searchFunc.SearchSuggest(input);
            //console.log(listLocal);
            prvInput = input;

            setSuggestList(listLocal);

            return listLocal;
        }else{
            return null
        }

    }

    async function SearchFocus(event){
        if(event.target.value === ''){
            const data = await LastedHistory();
            setSuggestList(data);
            console.log(data);
            if(data !== null && data.length > 0){
                setFocus(true);
            }
        }else{
            setFocus(true);
            GetSuggetList(event);
        }
    }

    function SelectSuggest(type:string,key:number){
        if(type === 'history'){
            //ไปยัง location ที่เลือก
            setLatLonWeather({lat: suggestList[key]['location']['lat'], lon: suggestList[key]['location']['lng']});
            setLocationType('place');
            if(searchInput.current){
                searchInput.current.value = suggestList[key]['name'];
            }
            setSearchValue(suggestList[key]['name']);   
            setFocus(false);
        }else if(type === 'suggest'){
            console.log('suggest');
            //ไปยังการค้นหา
            if(searchInput.current){
                searchInput.current.value = suggestList[key]['name'];
            }
            setKeyword(suggestList[key]['name']);
            openSideResult();
        }
    }

    async function SearchLongdoMap(){
        if(searchInput.current){
            const keyword:any = searchInput.current.value;
            if(keyword !== ''){
                setKeyword(keyword);
                setSearchValue(keyword);
                openSideResult();
            }else{
                //focus search
                searchInput.current.focus();
                //get 5 last search
                const data = await LastedHistory();
                setSuggestList(data);
            }
        }
    }

    function searchKeyPress(e:any){
        if((e.key === 'Enter' || e.key === 13) && focus){
            SearchLongdoMap();
            searchInput.current?.blur();
        }
    }

    useEffect(() => {
        if(searchValue !== null && searchInput.current){
            searchInput.current.value = searchValue;
        }
    }, [searchValue]);

    useEffect(() => {
        if(searchValue !== null && searchValue !== '' && searchInput.current){
            searchInput.current.value = searchValue;
        }
    });

    useEffect(() => {
        if(searchInput.current){
            searchInput.current.blur();
        }
    }, [closeSuggest]);

    const SearchSuggestList = suggestList !== null ? suggestList.map((item:any, key:number) => (
        <div className="w-full hover:bg-gray-200 active:bg-gray-200 suggestlist"

        >
            <div className="w-[94%] h-fit flex items-center py-1 mx-auto">
                <div className="inline-flex text-left items-center select-none w-[87%] mr-[3%] truncate h-[100%]"
                     onClick={(event) => {
                        event.preventDefault();
                        SelectSuggest(item['type'], key);
                    }}
                    tabIndex={0}
                >
                {item['type'] === 'history' ?
                    <i  className="icon-history text-center text-[2.5vw] h-[100%] w-[2.5vw] xl:text-[2.2rem] xl:w-[2.2rem] text-gray-500 mr-[3%]"
                    />
                : item['type'] === 'suggest' ?
                    <i className="icon-search text-center text-[2.1vw] h-[100%] w-[2.5vw] xl:text-[2rem] xl:w-[2.2rem] text-gray-500 mr-[3%]"
                    />
                : 
                    <i className="icon-history text-center text-[2.5vw] h-[100%] w-[2.5vw] xl:text-[2.2rem] xl:w-[2.2rem] text-gray-500 mr-[3%]"
                    />
                }
                <p className="font-name-kanit w-[82%] 2xl:w-[82%] h-[100%] text-[1.5rem] truncate text-gray-400"
                >
                    {item['name']}
                </p>
                </div>
                <div id='close-icon' className="remove-button flex items-center pt-[6px]">
                    <i className="icon-close text-center text-[2.1vw] font-bold w-[2.1vw] h-[100%] 2xl:text-[1.5rem] 2xl:w-[1.5rem] text-gray-500" />
                </div>
            </div>
        </div>
    )) : null;

    return(
        <div onBlur={()=> checkMouseLeave()} onMouseLeave={() => setMouseLeave(true)}>
        <div className={`w-full h-[50px] z-[50] bg-white rounded-t-[20px] ${focus && usesearch ? '' : 'rounded-b-[20px] drop-shadow-lg'}`}>
            <div className="w-[100%] h-[100%] flex items-center justify-center">
                <input className="w-[71%] h-[90%] font-name-kanit focus:outline-none text-xl disabled:cursor-not-allowed" 
                     id="search-input"
                     type="text" 
                     ref={searchInput}
                     placeholder="ค้นหาด้วย Longdo map" 
                     disabled={usesearch ? false : true}

                     onFocus={(event) => SearchFocus(event)} 
                     onInput={(event) => GetSuggetList(event)}
                     onKeyDown={(event) => searchKeyPress(event)}
                     autoComplete="off"
                />
                <div className=" w-[8%]">
                    { usesearch ?
                    <button title="SearchLongdoMap" className="w-full h-[100%] flex items-center justify-center" 
                        onClick={() => SearchLongdoMap()}

                    >
                        <i className="icon-search text-[1.8rem] text-gray-500" />
                    </button>
                    : null
                    }
                </div>
                <div className="ml-[3%] w-[8%]">
                    { useclose ?
                    <button title="closeSide" className="w-full h-[100%] flex items-center justify-center"
                        onClick={() => closeSide()}
                    >
                        <i className="icon-close font-bold text-[1.8rem] text-gray-500  " />
                    </button>
                    :
                    <button title="gps-location" className="w-full h-[100%] flex items-center justify-center"
                        onClick={(e) => getLocation(e)}
                    >
                        <i className="icon-gps-location font-bold text-[2.1rem] text-red-600" />
                    </button>
                    }
                </div>
            </div>
        </div>
        <div className="w-full h-fit"
        tabIndex={1}
        onFocus={() => setFocus(true)}
        ref={suggestBox}
        >
        {focus && usesearch ?
        <div className="w-full h-fit pb-4 z-[50] bg-white border-t border-gray-200 rounded-b-[20px] drop-shadow-lg">
            <div className="w-[100%] mt-[1%] h-[90%] flex items-center justify-center">
                <div className="w-full h-full flex flex-col bg-white">
                    {SearchSuggestList}
                </div>
            </div>
        </div>
        : null
        }
        </div>
        </div>
    )
}

export default SeacrhBox;