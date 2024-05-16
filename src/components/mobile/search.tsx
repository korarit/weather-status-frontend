import React, {useLayoutEffect, useEffect, useState} from 'react';

import translate from '../../function/languages';

//import '../../css/App.css';
import '../../css/components/search.css';
import '../../css/font.css';

function Search(props) {
    const [search_focus, setSearchFocused] = useState<boolean>(false);
    const [search_status, setSearchStatus] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
    }, [props.LangRe]);    

    async function setSearch(){
        let search_text = document.getElementById('search-input')?.value;
        
        //ตรวจสอบว่ามีอักษรมากกว่า 2 ตัวหรือไม่
        if(search_text.length >= 2){
            // แสดง loading
            setSearchStatus(true);
            var status_search:boolean = props.FuncSearch(search_text);
            if(status_search){
                // ซ่อน loading
                setSearchStatus(false);
                console.log('search success');
            }else{
                // ซ่อน loading
                setSearchStatus(false);
            }
        }

    }

    function searchKeyPress(e:any){
        if((e.key === 'Enter' || e.key === 13) && search_focus){
            setSearch();
            document.getElementById('search-input')?.blur();
        }
    }

    function closeSearch(){
        props.setUseSearch(false)
    }


    useLayoutEffect(() => {
        console.log(search_focus);
        if(search_focus){
            document.getElementById('icon-microphone-box')?.style.setProperty('display', 'none');
        }else{
            document.getElementById('icon-microphone-box')?.style.setProperty('display', 'block');
        }
    }, [search_focus]);

    return (
        <div className="search-box">
            <input type="search" 
                placeholder={`${lang['search_placeholder']}`}
                className="search-input-have-button font-name-kanit text-xl md:text-3xl min-[1025px]:text-[1.3rem] text-slate-700" 
                id="search-input"
                onFocus={() => setSearchFocused(true)} 
                onBlur={() => setSearchFocused(false)}
                onKeyDown={(e) => searchKeyPress(e)}

                autoComplete='off'
            />
            {/*<button id='icon-search-box' onClick={() => openVoiceSearch()} className='icon-microphone-box'>
             <i  className="icon-microphone-box icon-microphone"></i>
            </button>*/}
            { search_status === false ?
            <button title='search-btn' id='icon-search-box' onClick={() => setSearch()} className='icon-search-box'>
                <div className=' h-[100%] flex items-center justify-center'>
                    <i className="icon-search text-[1.4rem] md:text-[3.2vh] min-[1025px]:text-3xl"></i>
                </div>
            </button>
            :
            <div className='icon-loading-box'>
                <div className=' h-[100%] flex items-center justify-center'>

                    <svg className="animate-spin h-[1.3rem] w-[1.3rem] md:h-[3vh] md:w-[3vh] min-[1025px]:h-[2.5vh] min-[1025px]:w-[2.5vh] text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>

                </div>
            </div>
            }

            { props.useSearch === false ?
            /* แสดง burger หากไม่ได้ค้นหา */
                <button title='burger' id='icon-burger-box' className='icon-burger-box' onClick={props.SideBar}>
                    <div className=' h-[100%] flex items-center justify-center'>
                        <i  className="icon-th-menu text-[1.5rem] md:text-[3.5vh] min-[1025px]:text-3xl"></i>
                    </div>
                </button>
            :
                /* แสดง ลูกศร ซ้าย เพื่อออกจากหน้าการค้นหา */
                <button title='arrow' id='icon-arrow-box' onClick={() => closeSearch()} className='icon-burger-box'>
                    <div className=' h-[100%] flex items-center justify-center'>
                        <i  className="icon-arrow-left2 text-[1.5rem] md:text-[3.2vh] min-[1025px]:text-3xl"></i>
                    </div>
                </button>
            }

        </div>
    );
}

export default Search;
