import React, { useEffect } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default function EditDoc(props) {
    const {rowData,dataToDownload,setDownload} = props;
   

    const handleDownload = async () => {
        const fileUrl = '/format.docx';

        const response = await fetch(fileUrl);
        if (!response.ok) {
            console.error('Failed to fetch the DOCX file');
            return;
        }

        const arrayBuffer = await response.arrayBuffer();

        const zip = new PizZip(arrayBuffer);
        const docx = new Docxtemplater(zip);

        // Directly use sampleData instead of destructuring
        const {
            number,
            category,
            name,
            brand,
            smallValue,
            smallApproved,
            smallRevised,
            smallDropped,
            mediumValue,
            mediumApproved,
            mediumRevised,
            mediumDropped,
            largeValue,
            largeApproved,
            largeRevised,
            largeDropped,
            extraLargeValue,
            extraLargeApproved,
            extraLargeRevised,
            extraLargeDropped,

            uggSubmitted,
            uggApproved,
            uggFrequency,
            vansSubmitted,
            vansApproved,
            vansFrequency,
            colehaanSubmitted,
            colehaanApproved,
            colehaanFrequency,
            // add these also
            koolaburraSubmitted,
            koolaburraApproved,
            koolaburraFrequency,
            hokaSubmitted,
            hokaApproved,
            hokaFrequency,
            dillardsSubmitted,
            dillardsApproved,
            dillardsFrequency,
            francesValentineSubmitted,
            francesValentineApproved,
            francesValentineFrequency,
            eccoSubmitted,
            eccoApproved,
            eccoFrequency,
            aquaSubmitted,
            aquaApproved,
            aquaFrequency,
            belkSubmitted,
            belkApproved,
            belkFrequency,
            theNorthFaceSubmitted,
            theNorthFaceApproved,
            theNorthFaceFrequency,

        } = dataToDownload;

        // Convert rowData to the structure Docxtemplater expects
        const fitIssuesRows = rowData.map(row => ({
            Reason: row.reason,
            AllSizes: row.allSizes,
            Small: row.small,
            Medium: row.medium,
            Large: row.large,
            ExtraLarge: row.extraLarge
        }));

        // Set data in the DOCX template
        docx.setData({
            number,
            Category: category,
            InsertDate: new Date().toLocaleDateString(),
            Name: name,
            Brand: brand,
            SmallValue: smallValue,
            SmallApproved: smallApproved,
            SmallRevised: smallRevised,
            SmallDropped: smallDropped,
            MediumValue: mediumValue,
            MediumApproved: mediumApproved,
            MediumRevised: mediumRevised,
            MediumDropped: mediumDropped,
            LargeValue: largeValue,
            LargeApproved: largeApproved,
            LargeRevised: largeRevised,
            LargeDropped: largeDropped,
            ExtraLargeValue: extraLargeValue,
            ExtraLargeApproved: extraLargeApproved,
            ExtraLargeRevised: extraLargeRevised,
            ExtraLargeDropped: extraLargeDropped,

            UGGSubmitted: uggSubmitted,
            UGGApproved: uggApproved,
            UGGFrequency: uggFrequency,
            VANSSubmitted: vansSubmitted,
            VANSApproved: vansApproved,
            VANSFrequency: vansFrequency,
            COLEHAANSubmitted: colehaanSubmitted,
            COLEHAANApproved: colehaanApproved,
            COLEHAANFrequency: colehaanFrequency,
            KOOLABURRASubmitted: koolaburraSubmitted,
            KOOLABURRAApproved: koolaburraApproved,
            KOOLABURRAFrequency: koolaburraFrequency,
            HOKASubmitted: hokaSubmitted,
            HOKAApproved: hokaApproved,
            HOKAFrequency: hokaFrequency,
            DILLARDSSubmitted: dillardsSubmitted,
            DILLARDSApproved: dillardsApproved,
            DILLARDSFrequency: dillardsFrequency,
            FRANCESVALENTINESubmitted: francesValentineSubmitted,
            FRANCESVALENTINEApproved: francesValentineApproved,
            FRANCESVALENTINEFrequency: francesValentineFrequency,
            ECCOSubmitted: eccoSubmitted,
            ECCOApproved: eccoApproved,
            ECCOFrequency: eccoFrequency,
            AQUASubmitted: aquaSubmitted,
            AQUAApproved: aquaApproved,
            AQUAFrequency: aquaFrequency,
            BELKSubmitted: belkSubmitted,
            BELKApproved: belkApproved,
            BELKFrequency: belkFrequency,
            FitIssuesRows: fitIssuesRows ,
            TNFSubmitted:theNorthFaceSubmitted,
            TNFApproved:theNorthFaceApproved,
            TNFFrequency:theNorthFaceFrequency,
        });

        try {
            docx.render();
        } catch (error) {
            console.error(error);
            return;
        }

        const modifiedDocx = docx.getZip().generate({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(modifiedDocx);
        link.download = `TAG ${category} Report ${number}.docx`;
        link.click();
        setDownload({});
    };
    useEffect(() => {
        handleDownload();
    }, [dataToDownload,rowData]);
    return (
       <></>
    );
}
