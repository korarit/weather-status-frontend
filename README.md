# Weather Website Project (Frontend)

เป็นเว็บไซต์รวบรวมข้อมูลสภาพอากาศ จากหน่วยงานต่าง ๆ ภายในประเทศไทย ที่ค่อยข้างกระจัดกระจาย มาแสดงผล โดยได้ต้นแบบ UX/UI จาก google map มีการรองรับ
**Responsive Support**

[**DEMO LINK**](https://weather.korarit.website/)

## แหล่งข้อมูล
- กรมอุตุวิทยา กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม
- คลังข้อมูลน้ำแห่งชาติ
- สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)
- Air Quality Information Center สำนักงานการวิจัยแห่งชาติ (วช.)
- Nasa Fire Information for Resource Management System
- wunderground.com
- Google Map
- LongdoMap

## Tech Stack
![My Skills Framework](https://go-skill-icons.vercel.app/api/icons?i=nodejs,react,tailwindcss,leaflet,cloudflare,typescript,vercel&theme=dark&perline=11)

## How to install

use **npm install** for install package
```
npm install
```

Example **.env**
```
REACT_APP_CACHE_NAME='weather-project-krt'

########################## cloudflare turnstile ##########################
#ใส่ค่า site key ที่ได้จาก cloudflare turnstile
REACT_APP_TURNSTILE_SITE_KEY=""
#ใช้งาน turnstile หรือไม่ (true ใช้ , false ไม่ใช้ และการตั้งบน backend ต้องตั้งค่าเหมือนกัน)
REACT_APP_TURNSTILE_USE=true

################################ rule ####################################
#เปิดต้องยอมรับ ข้อตกลงการใช้งาน (true เปิด , false ปิด)
REACT_APP_RULE_USE=true

########################## การเรียกใช้งาน API ต่างๆ ##########################
#ที่อยู่ของ API หลัก
REACT_APP_API_MAIN=""

#รายชื่อของดาวเทียมสำหรับดึงข้อมูล จุดความร้อน
REACT_APP_LIST_SATELITE="MODIS_NRT,VIIRS_NOAA20_NRT,VIIRS_SNPP_NRT"
# เวลาหมดอายุของ cache ของข้อมูลจุดความร้อน (นาที)
REACT_APP_FIMS_CACHE_TIME=60

#API KEY สำหรับดึงข้อมูลจาก weather.com ของ wunderground
REACT_APP_API_WUNDERGROUND_KEY=""

#เวลาหมดอายุของ cache ของข้อมูลคุณภาพอากาศ dustboy (นาที)
REACT_APP_DUSTBOY_CACHE_TIME=15

#เวลาหมดอายุของ cache ของข้อมูลพยากรณ์อากาศรายชั่วโมง กรมอุตุ (นาที)
REACT_APP_TMD_HOURLY_CACHE_TIME=15
#เวลาหมดอายุของ cache ของข้อมูลพยากรณ์อากาศรายวัน กรมอุตุ (นาที)
REACT_APP_DAILYTMD_CACHE_TIME=30


########################## การตั้งค่าส่วนของแผนที่ ##########################
#ระดับการซูมของแผนที่สำหรับการแสดงผลค่า AQI
REACT_APP_ZOOM_MIN_AQI=6
#icon file url
REACT_APP_GPS_MARKER_ICON='/person.png'
#icon file url 
REACT_APP_PLACE_MARKER_ICON='/map-pin-place.png'
#ระดับการซูมของแผนที่เมื่อไปยังจุดที่เลือก (GPS , Place)
REACT_APP_FLY_TO_ZOOM='17'
### ค่า lat และ lon ที่ใช้เป็นตำแหน่งเริ่มต้นของแผนที่ ###
# ค่าเริ่มต้นโดยค้นหาจาก IP (true ใช้ , false ปิด)
REACT_APP_DEFAULT_LOCATION_IP=false
# ค่าเริ่มต้นจากการกำหนดเอง
REACT_APP_DEFAULT_LAT='19.027984'
REACT_APP_DEFAULT_LON='99.897197'


########################## การตั้งค่าการแสดงผล ##########################
#ความกว้างของ sidebar สำหรับ mobile และ tablet
REACT_APP_MOBILE_SIDEBAR_WIDTH='60%'

########################## อื่นๆ ##########################
#รัศมีของสถานี dustboy ที่จะดึงข้อมูลออกมาในหน้า now ของกรมอุตุวิทยา (เมตร)
REACT_APP_DUSTBOY_RADIUS=2500
```

before install package and add .env can
```
npm run start
```