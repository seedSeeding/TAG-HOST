export const toFixPatterns = [
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "104015",
      "id": 44
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105223",
      "id": 45
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105212",
      "id": 46
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105243",
      "id": 47
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105217",
      "id": 48
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105287",
      "id": 49
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105290",
      "id": 50
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105203",
      "id": 51
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105204",
      "id": 52
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105205",
      "id": 53
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105206",
      "id": 54
    },
    {
      "brand": "COLE HAAN",
      "category": "hats",
      "pattern_number": "105207",
      "id": 55
    },
    {
      "brand": "Frances Valentine",
      "category": "gloves",
      "pattern_number": "101564",
      "id": 229
    },
    {
      "brand": "Frances Valentine",
      "category": "gloves",
      "pattern_number": "101566",
      "id": 230
    },
    {
      "brand": "Frances Valentine",
      "category": "gloves",
      "pattern_number": "101565",
      "id": 231
    },
    {
      "brand": "Frances Valentine",
      "category": "gloves",
      "pattern_number": "101567",
      "id": 232
    }
  ]

  /***
   * useEffect(() => {
        const fixData = async (brandName, id) => {
            try {
                const res = await patternApi.updateBrandName(brandName, id);
                console.log("Updated:", id);
            } catch (error) {
                console.error("Error updating brand:", error);
            }
        };
    
        const fix = toFixPatterns;
    
        for (let i = 0; i < fix.length; i++) {
            const val = fix[i];
            if (val.brand === "COLE HAAN") {
                console.log("Updating COLE HAAN for ID:", val.id);
               // fixData("COLEHAAN", val.id);
            } else {
                console.log("Updating FRANCES VALENTINE for ID:", val.id);
               // fixData("FRANCES VALENTINE", val.id);
            }
        }
    }, [toFixPatterns]);
    
   */