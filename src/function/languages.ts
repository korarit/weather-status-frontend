import th_TH from '../languages/th_TH.json';
import en_US from '../languages/en_US.json';

function translate(lang:string | null) {
    if(lang !== '' && lang !== null){
        if (lang === 'th-TH') {
            return th_TH;
        }
        else if (lang === 'en-US') {
            return en_US;
        }
    }else{
        let langCode:string | null = localStorage.getItem('languages');
        if(langCode !== null){
            if (langCode === 'th-TH') {
                return th_TH;
            }
            else if (langCode === 'en-US') {
                return en_US;
            }
        }else{
            return th_TH;
        }
    }
    return th_TH;
}

export default translate;