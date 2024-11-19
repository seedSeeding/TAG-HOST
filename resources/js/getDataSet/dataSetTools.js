/*
import { getHatsData } from '../../getHatsData';
import { HatAPI } from '../Api/HatApi';

const hatApi = new HatAPI();
    const updateHats = async (record) => {
        try {
            const results = await hatApi.saveFromExcel(record);
            //console.log('All requests completed for record for :', results);
        } catch (error) {
            console.error('Error during updates:', error);
        }
    };

    useEffect(() => {
        const fetchHats = async () => {
            try {
                const datas = await getHatsData();
                //const data = await getHatsDataFromExcel();
                if (datas) {
               
                   //await Promise.all(datas.map(element => updateHats(element)));
                   for (let i = 0; i < datas.length; i++) {
                    await updateHats(datas[i]); 
                    console.log("pattern  #", datas[i].pattern_number, "Completed");
                }
                
                   console.log("All patterns completed!");
                } else {
                    //setError('Failed to load hat data.');
                }
            } catch (err) {
                alert('Error fetching data: ' + err.message);
            }
        };

        //fetchHats();
    }, []);
*/


/*
import { getScarvesData } from '../../getScarvesData'; 
import { ScarfAPI } from '../Api/ScarfApi';

    
    const scarfApi = new ScarfAPI();


    const updateScarves = async (record) => {
        try {
            const results = await scarfApi.saveFromExcel(record);
            //console.log('All requests completed for record for :', results);
        } catch (error) {
            console.error('Error during updates:', error);
        }
    };

    useEffect(() => {
        const fetctScarves = async () => {
            try {
                // const datas = await getScarfData();
                const datas =  scarvesDatSet;//await getHatsDataFromExcelScarves();
                if (datas) {

                    //await Promise.all(datas.map(element => updateHats(element)));
                    for (let i = 0; i < datas.length; i++) {
                        if(datas[i].pattern_number === "106271"){
                            await updateScarves(datas[i]);
                            console.log("pattern  #", datas[i].pattern_number, "Completed");
                            }
                        
                    }

                    console.log("All patterns completed!");
                } else {
                    //setError('Failed to load hat data.');
                }
            } catch (err) {
                alert('Error fetching data: ' + err.message);
            }
        };

        //fetctScarves();
    }, [])
*/

/***
 * 

    

    const glovesApi = new GloveAPI();


    const updateGloves = async (record) => {
        try {
            const results = await glovesApi.saveFromExcel(record);
            //console.log('All requests completed for record for :', results);
        } catch (error) {
            console.error('Error during updates:', error);
        }
    };

    useEffect(() => {
        const fetctGloves = async () => {
            try {
                // const datas = await getExcelDataGloves();
                const datas = await getDataFromExcelGloves();
                //console.log(datas)
                if (datas) {

                    // await Promise.all(datas.map(element => updateGloves(element)));
                    for (let i = 0; i < datas.length; i++) {
                        if (datas[i].pattern_number === "106271") {
                            await updateGloves(datas[i]);
                            console.log("pattern  #", datas[i].pattern_number);
                        }

                    }

                    console.log("All patterns completed!");
                } else {
                    //setError('Failed to load hat data.');
                }
            } catch (err) {
                alert('Error fetching data: ' + err.message);
            }
        };

        //fetctGloves();
    }, [])
 */

    /*
    useEffect(() => {
        const updateImages = async (data) => {
            for (const id of data) {
                const imageBlob = await getImage(id);
                if (imageBlob) {
                    try {
                        const formData = new FormData();
                        formData.append('image', imageBlob);
                        formData.append('pattern_number', id);
    
                        console.log("FormData Entries:", Array.from(formData.entries()));
    
                        const message = await patternAPi.updateImage(formData);
                        if (message) {
                            console.log(`Image updated for pattern ${id}: ${message}`);
                        }
                    } catch (error) {
                        console.error(`Failed to update image for pattern ${id}: ${error}`);
                    }
                } else {
                    console.error(`Failed to fetch image for pattern ${id}, skipping...`);
                    continue;
                }
            }
        };
    
        if (pattern_numbers && pattern_numbers.length > 0) {
            updateImages(pattern_numbers);
        }
    }, []);
*/    



/***
 *     useEffect(() => {
        const dlRevisions = async () => {
            try{
                await getExcelDataRevisons();
            }catch{
                console.log(error);
            }   
        }
       // dlRevisions();
       const update = async (data,count) => {
        try {
            const response = await patternService.setSizeStatus(data);
            
            if (response) {
                console.log("Pattern:",count,"Updated");    
            }
        } catch (error) {
            console.log("error ::", data.pattern_number);
        }
    }
    const data = {
        pattern_number: pattern_number,
        size_id: size_id,
        approval_state: state,
        reason: `${selectedPart},${selectedMeasurement},${selectedIssue}`
    };
    const listOfRevisions  = revisionsData;
    for(let i = 0; i < listOfRevisions.length ; i++){
        //console.log("Pattern:",i,"Updated");
        // update(listOfRevisions[i],i);
    }
    console.log("revisions number",listOfRevisions[227])
   // update(data);

},[]);

 */