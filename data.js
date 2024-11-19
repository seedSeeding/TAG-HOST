
const data = ["315234", '24524', '245245'];

const updateImages = async (data) => {
    for (const id of data) {
        const image = await getImage(id); 
        if (image) {
            try {
                const message = await updateImage(id, image); 
                console.log(`Image updated for pattern ${id}: ${message}`);
            } catch (error) {
                console.error(`Failed to update image for pattern ${id}: ${error}`);
            }
        } else {
            console.error(`Failed to fetch image for pattern ${id}`);
        }
    }
};


updateImages(data);
