
/*
* CreateDB: create local database (indexedDB)
* @param db_name: name of database to create (string)
*/
export function createDB(db_name:string) {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }

    const request =  indexedDB.open(db_name, 1);

    request.onupgradeneeded = (event:any) => {
        const db = event.target.result;
        let tx = db.createObjectStore("data", { autoIncrement: true });
        tx.createIndex('name', 'name', {unique: true});
        tx.onsuccess = () => {
            console.log('Create database '+db_name+' success');
            return true;
        }
        tx.onerror = () => {
            console.log('Create database '+db_name+' error');
            return false;
        }
    };
    console.log('Create database '+db_name+' test');

    request.onerror = (envent) => {
        console.log(envent);
    }

}

/*
* @Func InsertDataToDB: insert data to local database (indexedDB)
* @param db_name: name of database
* @param data: data to insert to local database (Array)
* @return: true if success, error if fail
*/
export function InsertDataToDB(db_name:string,data: any) {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        return false;
    }

    console.log('Insert data to database '+db_name);

    const request = indexedDB.open(db_name, 1);

    request.onsuccess = (event:any) => {
        const db = event.target.result;
        if (db) {
            const tx = db.transaction("data", "readwrite");
            const store = tx.objectStore("data");
            const query = store.put(data);

            query.oncomplete = () => {
                console.log('Insert data success');
                db.close();
                return true;
            };
            query.onerror = (error2:any) => {
                console.log(error2.name);
                db.close();
                return false;
            };
        }else{
            console.log('Error not database');
            return false;
        }
    }

    request.onerror = () => {
        console.log('Error opening database');
        return false;
    }

}
/*
* GetDataAllFromDB: get all data from local database (indexedDB)
* @param db_name: name of database
* @return: all data in database (Array) or null if not found
*/
export async function GetDataAllFromDB(db_name: string): Promise<any[]> {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(db_name, 1);

        request.onsuccess = (event: any) => {
            const db = event.target.result;

            if (db) {
                const transaction = db.transaction("data", "readonly");
                const objectStore = transaction.objectStore("data");

                objectStore.getAll().onsuccess = (event2: any) => {
                    const data = event2.target.result;
                    //console.log(data);
                    resolve(data);
                };

                objectStore.getAll().onerror = (error2: any) => {
                    console.log("error");
                    reject(error2);
                };
            } else {
                console.log('Error not database');
                reject(Error('No database found'));
            }
        };

        request.onerror = () => {
            reject(Error('Error opening database'));
        };
    });
}

/*
* GetLastedDataFromDB: get lasted data by count from local database (indexedDB)
* @paramdb_name: name of database (string)
* @param count: number of data to get (number)
* @return: lasted data by count in database (Array) or null if not found
*/
export async function GetLastedDataFromDB(db_name:string, count: number) {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(db_name, 1);

        request.onsuccess = (event: any) => {
            const db = event.target.result;

            if (db) {
                const transaction = db.transaction("data", "readonly");
                const objectStore = transaction.objectStore("data");

                objectStore.getAll().onsuccess = (event2: any) => {
                    const data = event2.target.result.slice(-count);
                    //console.log(data);
                    resolve(data);
                };

                objectStore.getAll().onerror = (error2: any) => {
                    console.log("error");
                    reject(error2);
                };
            } else {
                console.log('Error not database');
                reject(Error('No database found'));
            }
        };

        request.onerror = () => {
            reject(Error('Error opening database'));
        };
    });
}

/*
* GetDataByIdFromDB: get data by id from local database (indexedDB)
* @param db_name: name of database (string)
* @param id: id of data to get (number)
* @return: data with id (Object) or null if not found
*/
export async function GetDataByIdFromDB(db_name:string, id: number) {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }

    const request = indexedDB.open(db_name, 1);

    request.onsuccess = (event:any) => {
        const db = event.target.result;

        if(db){

            const tx = db.transaction("data", "readonly");
            const store = tx.objectStore("data");
            const data = store.get(id);

            data.oncomplete = (envent2:any) => {
                if (!envent2.target.result) {
                    db.close();
                    console.log(`The contact with ${id} not found`);
                    return null;
                } else {
                    db.close();
                    return envent2.target.result;
                }
            };
            data.onerror = (error2:any) => {
                //console.log("error");
                throw Error(error2);
            };
        }else{
            console.log('Error not database');
        }
    }

    request.onerror = () => {
        throw Error('Error opening database');
    }

}

export async function GetDataByIndexFromDB(db_name:string, index: string, value: any) {
    if(!window.indexedDB){
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }
    
    const request = indexedDB.open(db_name, 1);

    request.onsuccess = (event:any) => {
        const db = event.target.result;
        if(db){
            const tx = db.transaction("data", "readonly");
            const store = tx.objectStore("data");
            const indexDB = store.index(index);
            const data = indexDB.get(value);

            data.oncomplete = (event2:any) => {
                if (!event2.target.result) {
                    db.close();
                    //console.log(`The contact with ${value} not found`);
                    return null;
                } else {
                    db.close();
                    return event2.target.result;
                }
            };
            data.onerror = (error2:any) => {
                console.log("error");
                throw Error(error2);
            };
        }else{
            console.log('Error not database');
        }
    }

    request.onerror = () => {
        throw Error('Error opening database');
    }
}

/*
* DeleteDataByIdFromDB: delete data by id from local database (indexedDB)
* @paramd db_name: name of database (string)
* @param id: id of data to detele (number)
* @return: true if success, error if fail
*/
export async function DeleteDataByIdFromDB(db_name:string, id: number) {
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        throw Error("Not_supportIndexedDB");
    }

    const request = indexedDB.open(db_name, 1);


    request.onsuccess = (event:any) => {
        const db = event.target.result;

        if(db){
            const tx = db.transaction("data", "readwrite");
            const store = tx.objectStore("data");
            const query = store.delete(id);

            query.oncomplete = () => {
                db.close();
                return true;
            };
            query.onerror = () => {
                db.close();
                return false;
            };
        }else{
            console.log('Error not database');
        }
    }

    request.onerror = () => {
        throw Error('Error opening database');
    }

}