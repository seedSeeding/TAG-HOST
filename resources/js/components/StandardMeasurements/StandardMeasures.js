import { getSizeID } from "../dataTools";

export const getStandardMeasureSmall = (parts) => {
    switch (parts) {
        // Gloves
        case "Palm Shell":
            return [4.65, 3.34];
        case "Black Shell":
            return [4.65, 3.34];
        case "Palm Thumb":
            return [4.99, 1.6];
        case "Back Thumb":
            return [4.94, 1.8];
        case "Index Finger":
            return [3.32, 1.88];
        case "Middle Finger":
            return [3.76, 2.12];
        case "Ring Finger":
            return [3.48, 1.88];
        case "Little Finger":
            return [2.61, 1.55];
        case "Wrist":
            return [2.3, 5.31];
        // Scarves
        case "Body":
            return [44.8, 6.87];
        case "Fringers":
            return [3.78, 0.19];
        case "Edges":
            return [3.72, 6.87];
        // Hats
        case "Bill":
            return [7.05, 3.47];
        case "Strap":
            return [5.94, 0.55];
        case "Crown":
            return [23.72, 6.57];
        case "Brim":
            return [37.13, 3.47];
        case "Body Crown":
            return [3.99, 23.72];
        default:
            return [0, 0];
    }
};



export const getStandardMeasureMedium = (parts) => {
    switch (parts) {
        // Gloves
        case "Palm Shell":
            return [4.9, 3.59];
        case "Black Shell":
            return [4.9, 3.59];
        case "Palm Thumb":
            return [5.24, 1.85];
        case "Back Thumb":
            return [5.19, 2.05];
        case "Index Finger":
            return [3.57, 2.13];
        case "Middle Finger":
            return [4.01, 2.37];
        case "Ring Finger":
            return [3.73, 2.13];
        case "Little Finger":
            return [2.86, 1.8];
        case "Wrist":
            return [2.55, 5.56];
        // Scarves
        case "Body":
            return [60.05, 8.86];
        case "Fringers":
            return [4.05, 0.44];
        case "Edges":
            return [3.97, 8.86];
        // Hats
        case "Bill":
            return [7.83, 4.25];
        case "Strap":
            return [6.74, 1.33];
        case "Crown":
            return [24.5, 7.35];
        case "Brim":
            return [37.91, 4.25];
        case "Body Crown":
            return [4.77, 24.5];
        default:
            return [0, 0];
    }
};

export const getStandardMeasureLarge = (parts) => {
    switch (parts) {
        // Gloves
        case "Palm Shell":
            return [5.15, 3.84];
        case "Black Shell":
            return [5.15, 3.84];
        case "Palm Thumb":
            return [5.49, 2.1];
        case "Back Thumb":
            return [5.44, 2.3];
        case "Index Finger":
            return [3.82, 2.38];
        case "Middle Finger":
            return [4.26, 2.62];
        case "Ring Finger":
            return [3.98, 2.38];
        case "Little Finger":
            return [3.11, 2.05];
        case "Wrist":
            return [2.8, 5.81];
        // Scarves
        case "Body":
            return [75.3, 10.83];
        case "Fringers":
            return [4.3, 0.69];
        case "Edges":
            return [4.22, 10.83];
        // Hats
        case "Bill":
            return [8.61, 5.03];
        case "Strap":
            return [7.52, 2.11];
        case "Crown":
            return [25.28, 8.13];
        case "Brim":
            return [38.69, 5.03];
        case "Body Crown":
            return [5.55, 25.28];
        default:
            return [0, 0];
    }
};

export const getStandardMeasureXLarge = (parts) => {
    switch (parts) {
        // Gloves
        case "Palm Shell":
            return [5.4, 4.09];
        case "Black Shell":
            return [5.4, 4.09];
        case "Palm Thumb":
            return [5.74, 2.35];
        case "Back Thumb":
            return [5.69, 2.55];
        case "Index Finger":
            return [4.07, 2.63];
        case "Middle Finger":
            return [4.51, 2.87];
        case "Ring Finger":
            return [4.23, 2.63];
        case "Little Finger":
            return [3.36, 2.3];
        case "Wrist":
            return [3.05, 6.06];
        // Scarves
        case "Body":
            return [90.55, 12.99];
        case "Fringers":
            return [4.55, 0.94];
        case "Edges":
            return [4.47, 12.99];
        // Hats
        case "Bill":
            return [9.39, 5.81];
        case "Strap":
            return [8.3, 2.89];
        case "Crown":
            return [26.06, 8.91];
        case "Brim":
            return [39.47, 5.81];
        case "Body Crown":
            return [6.33, 26.06];
        default:
            return [0, 0];
    }
};

export const getStandardMeasurements_LW = (size,part) => {
    const sizeID = getSizeID(size);
    const getStandardSize = sizeID === 1 ? getStandardMeasureSmall :
        sizeID === 2 ? getStandardMeasureMedium :
            sizeID === 3 ? getStandardMeasureLarge : getStandardMeasureXLarge;
    const standard = getStandardSize(part);
    return {
        length: standard[0],
        width: standard[1]
    }
};

export const getStandardMeasurements_HW = (size,part) => {
    const sizeID = getSizeID(size);
    const getStandardSize = sizeID === 1 ? getStandardMeasureSmall :
        sizeID === 2 ? getStandardMeasureMedium :
            sizeID === 3 ? getStandardMeasureLarge : getStandardMeasureXLarge;
    const standard = getStandardSize(part);
    return {
        height: standard[0],
        width: standard[1]
    }
};

export const getStandardMeasurements_CD = (size,part) => {
    const sizeID = getSizeID(size);
    const getStandardSize = sizeID === 1 ? getStandardMeasureSmall :
        sizeID === 2 ? getStandardMeasureMedium :
            sizeID === 3 ? getStandardMeasureLarge : getStandardMeasureXLarge;
    const standard = getStandardSize(part);
    return {
        circumference: standard[0],
        diameter: standard[1]
    }
};