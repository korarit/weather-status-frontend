import axios from 'axios';
import {searchLocal} from '../localDatabase/search';
//import {GetLastedDataFromDB} from '../localDatabase/db';

class Search_data {

    /*
    * GetSearchLogdomap
    * @params search_text: text for search
    * @return: result of search (Array) from api or null if not found
    */
    public async getSearchLogdomap(search_text:string){
        const language_code:string | null = localStorage.getItem("languages");
        let language = "th";
        if(language_code === "th-TH"){
            language = "th";
        }else if(language_code === "en-US"){
            language = "en";
        }
        try {
            const response:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/location/search?keyword=${search_text}&language=${language}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_session')}`
                }
            });

            //console.log(response.data);
            return response.data;
        } catch (error:any) {
            console.log(error);
            if(error.response.status === 401){
                window.location.reload();
            }else{
                return null;
            }
        }
    }

    /*
    * SearchLogdomap: search location from api and insert to local database (indexedDB)
    * @params search_text: text for search
    * @return: result of search (Array) from api or null if not found
    */
    private async getSuggestLogdomap(search_text:string,limit_result:number){
        try {
            const response:any = await axios.get(`${process.env.REACT_APP_API_MAIN}/data/location/suggest?keyword=${search_text}&limit_result=${limit_result}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token_session')}`
                }
            });

            //console.log(response.data);
            return response.data;
        } catch (error:any) {
            console.log(error);
            if(error.response.status === 401){
                window.location.reload();
            }else{
                return null;
            }
        }
    }

    /*
    * SearchLogdomap: search suggest from api and insert to local database (indexedDB)
    * @params search_text: keyword for search
    * @return: result of suggest (Array) from local database (indexedDB) and api or null if not found
    */
    public async SearchSuggest(search_text:string){

        const listLocalData: any = [];

        const LocalData:any = await searchLocal(search_text);
        let countLocalSuggest = 0;
        if(LocalData !== null) countLocalSuggest = LocalData.length;

        if (LocalData !== null) {
            LocalData.forEach((item:any) => {
                listLocalData.push({
                    name: item.name,
                    type: 'history',
                    location:{
                        lat: item.location.lat,
                        lng: item.location.lng
                    }
                });
            });
        }

        if(countLocalSuggest === 0) countLocalSuggest = 15
        const SuggestData = await this.getSuggestLogdomap(search_text, 20 - countLocalSuggest);
        if (SuggestData.data !== null && SuggestData['data'].length > 0) {
            SuggestData['data'].forEach((item:any) => {
                //check w have in local database 
                if(LocalData !== null){
                    const checkHave = LocalData.find((element:any) => element.name === item.w);
                    if(checkHave === undefined){
                        listLocalData.push({
                            name: item.w,
                            type: 'suggest'
                        });
                    }
                }else{
                    listLocalData.push({
                        name: item.w,
                        type: 'suggest'
                    });
                }
            });
        }
        //เลือก 5อันแรก จาก listLocalData
        const listLocalData5 = listLocalData.slice(0, 5);
        if(listLocalData.length > 0){
            return listLocalData5;
        }else{
            return null;
        }
    }

}

export default Search_data;