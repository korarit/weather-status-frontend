import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import { Marker, useMapEvent } from "react-leaflet";
import { rgbToHex, findNearestDbz, dBZToRainRate } from "../../../function/weather/rainCalculate";

  

const IconMarker = ({ dbz, rain, loading }: { dbz: number; rain: number; loading:boolean }) => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
    if (dbz < 10) {
      setText("ไม่มีฝน");
    } else if (dbz < 20) {
      setText("ฝนอ่อนมาก");
    } else if (dbz < 30) {
      setText("ฝนอ่อน");
    } else if (dbz < 40) {
      setText("ฝนปานกลาง");
    } else if (dbz < 50) {
      setText("ฝนกำลังแรง");
    } else if (dbz < 58) {
      setText("มีโอกาสเกิดลูกเห็บ");
    } else if (dbz < 75) {
      setText("ลูกเห็บ หรือ น้ำแข็ง");
    } else {
      setText("ลูกเห็บตกหนักมาก");
    }
    }, [dbz]);

    return (
        <div className="flex flex-col ">
            <div className="p-1.5 w-fit bg-black text-white rounded-t-md rounded-br-md">
                {loading ? (
                  <p className="whitespace-nowrap text-sm font-name-kanit">
                    กำลังโหลด...
                  </p>
                ) : (
                  <>
                  {dbz < 58 ? (
                  <>
                    <p className="whitespace-nowrap text-sm font-name-kanit">
                        {rain.toFixed(1)} มม./ชม.
                    </p>
                    <p className="whitespace-nowrap text-xs font-name-kanit">
                        {text}
                    </p>
                  </>
                  ) : (
                    <p className="whitespace-nowrap text-sm font-name-kanit">
                        {text}
                    </p>
                  )}
                  </>
                )}
            </div>
            <div className="relative h-12 w-[3px]">
                <div className="absolute z-50 h-12 w-[3px] bg-black" />

                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-black" />
            </div>
            
        </div>
    );
};
const createCustomIcon = ({ dbz, rain, loading }: { dbz: number; rain: number; loading:boolean }) => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<IconMarker dbz={dbz} rain={rain} loading={loading} />);

    return L.divIcon({
        html: div,
        className: "custom-marker",
        iconSize: [30, 50], // ปรับขนาด icon
        iconAnchor: [1, 80], // กำหนดให้จุดอ้างอิงอยู่ที่ด้านล่างตรงกลาง
    });
};
  

const RainTilePicker = ({ rainTileUrl }: { rainTileUrl: string }) => {
    const [color, setColor] = useState<string | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

    const [latlng, setLatlng] = useState<L.LatLng | null>(null);
    const [rainRate, setRainRate] = useState<number | null>(null);
    const [nearestDbz, setNearestDbz] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
  
    const map = useMapEvent("click", async (e) => {
        const { lat, lng } = e.latlng;

        //loading
        setLoading(true);

        setLatlng(e.latlng);
        const zoom = map.getZoom();
      
        // แปลงพิกัด LatLng เป็น Tile coordinate
        const tileSize = 256; // ขนาด tile ปกติคือ 256x256
        const scale = Math.pow(2, zoom);
      
        // คำนวณตำแหน่ง Tile ที่ใช้
        const xTile = Math.floor(((lng + 180) / 360) * scale);
        const yTile = Math.floor(
          ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
            2) *
            scale
        );
      
        // คำนวณพิกัด pixel ภายใน Tile
        const xPixel = Math.floor(
          (((lng + 180) / 360) * scale - xTile) * tileSize
        );
        const yPixel = Math.floor(
          (((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
            2) *
            scale -
            yTile) *
            tileSize
        );
      
        console.log(`Tile Position: xTile=${xTile}, yTile=${yTile}, Zoom=${zoom}`);
        console.log(`Pixel Position in Tile: xPixel=${xPixel}, yPixel=${yPixel}`);
      
        // โหลด Tile
        const tileUrl = rainTileUrl
          .replace("{x}", xTile.toString())
          .replace("{y}", yTile.toString())
          .replace("{z}", zoom.toString());
      
        const response = await fetch(tileUrl, { mode: "cors" });
        const blob = await response.blob();

        console.log("blob", response);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = URL.createObjectURL(blob);

        console.log("img", img.src);
      
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
      
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
          // ดึงสีที่จุดที่ถูกต้อง
          const pixel = ctx?.getImageData(xPixel, yPixel, 1, 1).data;
          if (pixel) {

            //ไม่เป็น transparent
            if (pixel[3] === 0) {
                setLoading(false);
                setColor(null);
                setPosition(null);
                return;
            }
            const pickedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
            const Dbz = findNearestDbz(pickedColor);
            const rain = dBZToRainRate(Dbz);

            console.log("Nearest dBZ:", Dbz);
            console.log("Rain rate (mm/hr):", rain);

            setRainRate(rain);
            setNearestDbz(Dbz);

            setColor(pickedColor);
            setPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
          }

          setLoading(false);
        };
      });
      
  
    return (
      <>
        {position && latlng && rainRate && nearestDbz && (
          <Marker
            position={latlng}
            icon={createCustomIcon({rain: rainRate, dbz: nearestDbz, loading: loading})}
        />
        )}
      </>
    );
  };
  
export default RainTilePicker;