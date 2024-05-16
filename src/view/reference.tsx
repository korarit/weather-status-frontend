import React, { useState , useEffect} from "react";

import translate from "../function/languages";

import SideBar from "../components/mobile/SideBar";
//import "../css/App.css";

function Reference() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [refreshlanguage, setRefreshlanguage] = useState<string>("");
  const [lang, setLang] = useState<any>(translate(localStorage.getItem("languages")));
  useEffect(() => {
    setLang(translate(localStorage.getItem("languages")));
  }, [refreshlanguage]);

  return (
    <div className="flex flex-col items-center justify-center scrollbar-mobile landscape:bg-gray-400 overflow-y-hidden">
      <div className={`width-web bg-white relative h-[100dvh] ${openSideBar ? '' : 'overflow-y-auto'}`}>
        {/* หัวข้อ , ปุ่มเปิด sidebar*/}
        <div className="w-100 h-[6%]">
          <div className="flex flex-row h-full">
            <div className="w-[10%] h-full flex items-center justify-center">
              <button title="openSidebar" className="text-gray-500 w-[80%] h-[80%] border-2 border-gray-700 rounded-lg" onClick={() => setOpenSideBar(true)}>
                  <div className=' h-[100%] flex items-center justify-center'>
                    <i  className="icon-th-menu text-[4.5vh]"></i>
                  </div>
              </button>
            </div>
            <div className="w-[90%] h-full">
              <div className=' h-[100%] flex items-center text-center'>
                <p className="font-name-kanit w-full text-center text-[3vh]">{lang['thank_data']}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[98%] mx-auto h-[94%] grid grid-cols-2 gap-4 select-none">

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              
              <div className="h-[18vh] flex justify-center items-center mb-[1%] ml-[5%]">
                <img
                  alt="Google Map"
                  src="https://cdn.discordapp.com/attachments/943868917330374718/1172561016211648562/Google_Maps_icon_2015-2020.svg"
                  style={{ height: "90%", width: "60%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">Google Map</p>
              </div>
              
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              
              <div className="h-[18vh] flex justify-center items-center mb-[1%] ml-[5%]">
                <img
                  alt="NASA's FIRMS"
                  src="https://cdn.discordapp.com/attachments/943868917330374718/1172591235232448652/NASA_logo_1.svg"
                  style={{ height: "90%", width: "90%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">NASA's FIRMS</p>
              </div>
              
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              
              <div className="h-[18vh] flex justify-center items-center mb-[1%] ml-[5%]">
                <img
                  alt="Longdo Map"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172591881834741771/longdoMap.png"
                  style={{ height: "90%", width: "60%" }}
                  className="rounded-xl border border-neutral-900"
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">Longdo Map</p>
              </div>
              
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              
              <div className="h-[18vh] flex justify-center items-center mb-[1%] ml-[5%]">
                <img
                  alt="NASA Worldview"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172592350204276787/iqair-logo-2022-v2.png"
                  style={{ height: "90%", width: "60%" }}
                  className="rounded-xl border border-neutral-900"
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">iqair.com</p>
              </div>
              
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-full">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              <div className="h-[18vh] flex justify-center items-center mb-[1%]">
                <img
                  alt="wunderground.com"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172592759815806987/Weath_undergr_logo14.png"
                  style={{ height: "90%", width: "70%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center ">wunderground.com</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">

            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              
              <div className="h-[18vh] flex justify-center items-center mb-[1%]">
                <img
                  alt="GISTDA"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172593198888132710/640px-GISTDA_LOGO.png"
                  style={{ height: "100%", width: "90%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ</p>
              </div>

            </div>

          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              <div className="h-[18vh] flex justify-center items-center mb-[1%]">
                <img
                  alt="rainviewer.com"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172593612777869402/rainviewer.png"
                  style={{ height: "90%", width: "60%" }}
                  className="rounded-xl border border-neutral-900"
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">rainviewer.com</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50 p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              <div className="h-[18vh] flex justify-center items-center mb-[1%]">
                <img
                  alt="Thaiwater"
                  src="https://media.discordapp.net/attachments/943868917330374718/1172594092077760605/thaiwater.png"
                  style={{ height: "90%", width: "60%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">คลังข้อมูลน้ำแห่งชาติ</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 h-fit">
            <div className="bg-neutral-50  p-5 w-100 h-full shadow-md shadow-slate-950/30 rounded-lg gird place-items-center border-[1px] border-neutral-900">
              <div className="h-[18vh] flex justify-center items-center mb-[1%]">
                <img
                  alt="Thailand Meteorological Department"
                  src="https://cdn.discordapp.com/attachments/943868917330374718/1172594605217300520/Seal_of_the_Meteorological_Department_of_Thailand_1.svg"
                  style={{ height: "90%", width: "60%" }}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center">
                <p className="text-2xl font-name-kanit font-normal text-center">กรมอุตุนิยมวิทยา</p>
              </div>
            </div>
          </div>

        </div>
        {/* Side bar */}
        <SideBar LangRe={refreshlanguage} open={openSideBar} Refresh={setRefreshlanguage} closeSideBar={() => setOpenSideBar(false)}/>
      </div>
    </div>
  );
}

export default Reference;
