import { InsertDataToDB , GetLastedDataFromDB, GetDataAllFromDB } from './db';

interface DBSearch  {
    name: string;
    address: string;
    icon: string;
    location: {
        lat: number;
        lng: number;
    };
}

/*
* searchAlgorithm: search algorithm for search function
* @param keyword: text for search
* @param data: data for search
* @param searchFields: fields for search
* @return: result of search (List) from local database
*/
function searchAlgorithm(keyword:string, data:any, searchFields:Array<string>) {
    const keywords = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(' ');
    let searchField = searchFields.map((field) => {
        const normalizedField = field.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return { original: field, normalized: normalizedField };
    });
    const filteredData:DBSearch[] = [];
    const numKeywords = keywords.length;
    const numFields = searchField.length;
    const nonStringFields = new Set();
    for (let i = 0; i < numFields; i++) {
        const field = searchField[i];
        const value = data[0][field.original];
        if (typeof value !== 'string') {
            nonStringFields.add(field.normalized);
        }
    }
    data.map((item:any) => {
        let matches = true;
        for (let j = 0; j < numKeywords && matches; j++) {
            const keyword = keywords[j];
            let fieldMatch = false;
            for (let k = 0; k < numFields && !fieldMatch; k++) {
                const field = searchField[k];
                if (!nonStringFields.has(field.normalized)) {
                    const value = item[field.original];
                    const normalizedValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                    fieldMatch = normalizedValue.includes(keyword) || normalizedValue.localeCompare(keyword, 'en', { sensitivity: 'base' }) === 0;
                }
            }
            matches = matches && fieldMatch;
        }
        if (matches) {
            filteredData.push(item);
        }
    });
    return filteredData;
}

/*
* InsertSearchDB: insert data to local database
* @param data: data to insert to local database type DBSearch
*/
export function InsertSearchDB(data:DBSearch) {
    //check ว่ามีข้อมูลอยู่ใน local database หรือยัง
    let query: Boolean | undefined = InsertDataToDB('search', data);
    if (query === false) {
        return false;
    } else if (query === true) {
        return true;
    }
}

export async function searchLocal(keyword:string) {
    if (keyword === '') {
        return null;
    }
    //ดึงข้อมูลจาก local database (indexedDB)
    const localData = await GetDataAllFromDB('search');
    //console.log('searchLocalData',localData);
    
    if(localData === null){
        return null;
    }
    //ค้นหาจาก local database
    const searchFields = ['name'];
    if(localData.length > 0){
        const searchLocalDB:DBSearch[] = searchAlgorithm(keyword, localData, searchFields);
        return searchLocalDB;
    }else{
        return null;
    }
}

export async function LastedHistory(){
    const listLocalData: any = [];

    const LocalData:any = await GetLastedDataFromDB("search", 5);
    //console.log('LastedHistory',LocalData);
    if (LocalData !== null) {
        LocalData.map((item:any) => {
            listLocalData.push({
                name: item.name,
                type: 'history',
                location:{
                    lat: item.location.lat,
                    lng: item.location.lng
                }
            });
        });
        
        //console.log('LastedHistory',listLocalData);
        return listLocalData;
    }else{
        return null;
    }
}

export async function HistorySearch() {
    const LocalData:any = await GetLastedDataFromDB("search", 30);

    if (LocalData !== null) {
        return LocalData;
    }
    return null;
}