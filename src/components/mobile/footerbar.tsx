import React, {useState, useEffect} from 'react';

import translate from '../../function/languages';

//import '../../css/App.css';

function Footerbar(props) {
    const [lang, setLang] = useState<any>(translate());

    useEffect(() => {
        setLang(translate());
      }, [props.LangRe])      
    return (
        <>
        <div className="footerbar h-full flex justify-center items-center" onClick={props.onPress}>
            <p className="max-[300px]:text-2xl text-3xl md:text-[2.5rem] landscape:text-2xl text-center font-normal font-name-kanit">
                {lang['weather_button']}
            </p>
        </div>
        </>
    );
}

export default Footerbar;
