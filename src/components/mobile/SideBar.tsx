import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";

import translate from '../../function/languages';

import '../../css/components/sidebar.css';
//import '../../css/App.css';
import '../../css/font.css';

interface OuterFunctionProps {
    open: boolean;
    closeSideBar: (open:boolean) => void;
    Refresh: (language:string) => void;
    LangRe: string;
}
function SideBar({open, closeSideBar, Refresh, LangRe}:OuterFunctionProps){
    const [width, setWidth] = useState<string>('0px');
    const [bgwidth, setBGWidth] = useState<string>('0px');
    const [openSideBar, setOpenSideBar] = useState<boolean>(false);

    const [lang, setLang] = useState<any>(translate(null));
    useEffect(() => {
        setLang(translate(null));
      }, [LangRe]);

    // เปิด sidebar
    useEffect(() => {
        // ถ้า open เป็น true ให้เปิด sidebar
        if(open){
            const width:string = process.env.REACT_APP_MOBILE_SIDEBAR_WIDTH as string;
            console.log(width);
            setWidth(width);
            setBGWidth('100%');
            // ปรับจูน animation
            setTimeout(function(){
                setOpenSideBar(true);
            }, 300);
        }else{
            setWidth('0px');
            setBGWidth('0px');
            // ปรับจูน animation
            setTimeout(function(){
                setOpenSideBar(false);
            }, 300);
        }
    }, [open]);

    function close(){
        closeSideBar(false);
    }

    //เปลี่ยนภาษา
    function changeLanguage(e:any){
        console.log(e.target.value);
        localStorage.setItem('languages', e.target.value);
        Refresh(e.target.value);
    }

    return(
        <>
            <div className="bg-sidebar" style={{width:  bgwidth}}></div>
            <div className={`sidebar`} style={{ transition: "1s", width: width }}>
                {openSideBar ?
                    <div className="mt-[1vh]">
                        <div className="ml-[4%] grid grid-cols-8 lg:grid-cols-12">
                            <div className='col-span-7 lg:col-span-10 flex items-center'>
                                <div className="w-[46px] h-[46px] mr-[8px]">
                                    <div className='icon-cloud-welcome'></div>
                                </div>
                                <p className=" font-name-kanit text-gray-700 text-2xl min-[1025px]:text-3xl">Weather Project</p>
                            </div>
                            <div className="col-span-1 lg:col-span-2 flex items-center">
                                <button className="focus:outline-none" onClick={close}>
                                    <i className="icon-cross text-2xl min-[1025px]:text-2xl "></i>
                                </button>
                            </div>
                        </div>

                        <hr className="my-[16px]" />

                        {/* รายการทั้งหมด */}

                        <div className="flex flex-col mt-[1.2vh]">
                            <Link to='/' className="pl-[4%] focus:outline-none flex items-center">
                                <i className='icon-cloud text-[2.2rem] text-center w-[13%] mr-[8px]'></i>
                                <p className="font-name-kanit md:text-2xl min-[1025px]:text-[1.4rem] text-left">
                                    {lang['sidebar']['forecast']}
                                </p>
                            </Link>

                            <hr className="mb-[24px] mt-[16px]"/>

                            <button title="d" className="pl-[4%] focus:outline-none flex items-center">
                                <i className='icon-files-empty text-[1.8rem] text-center w-[13%] mr-[8px]'></i>
                                <p className="font-name-kanit md:text-2xl min-[1025px]:text-[1.4rem] text-left">
                                    {lang['sidebar']['rule']}
                                </p>
                            </button>

                            <Link to='/reference' className="pl-[4%] focus:outline-none flex items-center mt-[16px]">
                                <i className='icon-database text-[1.6rem] text-center w-[13%] mr-[8px]'></i>
                                <p className="font-name-kanit md:text-2xl min-[1025px]:text-[1.4rem] text-left">
                                    {lang['sidebar']['reference']}
                                </p>
                            </Link>

                        </div>
                        <div className="w-full absolute bottom-[8%] text-[2vh]">
                            <select 
                            title="Select Language"
                            className="select-language py-3 mx-auto px-4 pe-9 block w-[80%] font-name-kanit border-gray-500 border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            onChange={changeLanguage}
                            >
                                {localStorage.getItem('languages') === 'th-TH' ?
                                    <option value={'th-TH'} className="text-[0.9rem]" selected>ภาษาไทย - Thai</option>
                                    :
                                    <option value={'th-TH'} className="text-[0.9rem]">ภาษาไทย - Thai</option>
                                }
                                {localStorage.getItem('languages') === 'en-US' ?
                                    <option value={'en-US'} className="text-[0.9rem]" selected>ภาษาอังกฤษ - English</option>
                                    :
                                    <option value={'en-US'} className="text-[0.9rem]">ภาษาอังกฤษ - English</option>
                                }
                            </select>
                        </div>
                        <div className="w-full absolute bottom-[1%] text-[2vh]">
                            <hr className="mb-[2%]"/>
                            <p className="font-name-kanit text-center text-[0.9rem] font-normal">Power By Vercel & Cloudflare</p>
                        </div>
                    </div>
                    : null}
            </div>
        </>
    );
}

export default SideBar;