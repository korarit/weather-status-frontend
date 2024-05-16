import React, {useEffect ,useRef } from "react";
import { Link } from "react-router-dom";

// import translate from '../../function/languages';

export default function SideMenu({ open, setOpen, Languages }: { open:boolean, setOpen: Function, Languages: string | null}) {
    const emlementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(open){
            setTimeout(() => {
                if(emlementRef.current){
                    emlementRef.current.style.width = '380px';
                }
            });
        }
    }, [open])
    function closeMenu() {
        if(emlementRef.current){
            emlementRef.current.style.width = '0';
        }
        setTimeout(() => {
            setOpen(false);
        }, 600);
    }

    return (
        <div className="absolute h-[100%] bg-white flex flex-col pt-[2%] overflow-hidden"
            style={{ transition: 'width 0.6s', transitionDelay: '0.1s', width: '0' }}
            ref={emlementRef}
        >
            {/* title */}
            <div className="w-[100%] px-[16px] flex items-center">
                <div className="w-[46px] h-[46px]">
                    <div className='icon-cloud-welcome'></div>
                </div>
                <p className="text-[1.5rem] text-gray-700 font-name-kanit w-[80%]">Weather Project</p>
                <button onClick={() => closeMenu()}>
                    <i className="icon-cross text-lg md:text-3xl min-[1025px]:text-2xl justify-items-end"></i>
                </button>
            </div>

            <hr className="w-[100%] my-[16px]" />

            <button type="button" className="w-[100%] px-[16px] flex items-center">
                <i className='icon-cloud text-[2.2rem] text-center w-[13%] mr-[8px]'></i>
                <p className="text-[1.3rem] font-name-kanit leading-3">พยากรณ์อากาศจากพิกัด</p>
            </button>

            <hr className="w-[100%] mb-[24px] mt-[16px]" />

            <button type="button" className="w-[100%] px-[16px] flex items-center">
                <i className='icon-files-empty text-[1.8rem] text-center w-[13%] mr-[8px]'></i>
                <p className="text-[1.3rem] font-name-kanit leading-3">ข้อตกลงการใช้เว็บไซต์</p>
            </button>

            <Link to='/reference' className="w-[100%] px-[16px] flex items-center mt-[16px]">
                <i className='icon-database text-[1.6rem] text-center w-[13%] mr-[8px]'></i>
                <p className="text-[1.3rem] font-name-kanit leading-3">แหล่งข้อมูลของเว็บไซต์</p>
            </Link>

            <div className="w-full absolute bottom-[8%] text-[2vh] px-[16px]">
                <select
                    title="Select Language"
                    className="select-language py-2 mx-auto px-3 pe-9 block w-[100%] after:text-[2rem] font-name-kanit first:text-[1.1rem] border-gray-500 border rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                >
                    {localStorage.getItem('languages') === 'th-TH' ?
                        <option value={'th-TH'} className="text-[1rem]" selected>ภาษาไทย - Thai</option>
                        :
                        <option value={'th-TH'} className="text-[1rem]">ภาษาไทย - Thai</option>
                    }
                    {localStorage.getItem('languages') === 'en-US' ?
                        <option value={'en-US'} className="text-[1rem]" selected>ภาษาอังกฤษ - English</option>
                        :
                        <option value={'en-US'} className="text-[1rem]">ภาษาอังกฤษ - English</option>
                    }
                </select>
            </div>

            <div className="w-full absolute bottom-[0.5%]">
                <hr className="mb-[1%]" />
                <p className="font-name-kanit text-center text-[1.2rem] font-normal">Power By Vercel & Cloudflare</p>
            </div>
        </div>
    );
}