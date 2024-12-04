import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Async function to generate the report
async function generateReport() {
    // Create a new PDF Document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Load the image (this assumes the image is accessible as a URL or Blob)
    const imageUrl = './Picture1.png'; // Replace with the actual path to your image
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
    let image;
    try {
        image = await pdfDoc.embedPng(imageBytes); // For PNG images
    } catch (error) {
        console.error("Error embedding PNG image: ", error);
        image = await pdfDoc.embedJpg(imageBytes); // Fallback for JPEG images
    }

    // Get the image dimensions
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Set margins in points (2.54 cm = 72 points)
    const margin = 72;
    const { width, height } = page.getSize();
    const contentWidth = width - 2 * margin;
    const contentHeight = height - 2 * margin;
    const fontSize = 12;
    const lineSpacing = 18;
    let yPosition = height - margin - imageHeight; // Adjust yPosition to account for image height

    // Embed a font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(helveticaFont);
    page.setFontSize(fontSize);

    async function drawText(text, x, y, bold = false) {
        if (bold) {
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            page.setFont(boldFont);
        } else {
            page.setFont(helveticaFont);
        }

        page.drawText(text, { x: x + margin, y });
        page.setFont(helveticaFont); // Reset to regular font
    }

    // Draw the header
    await drawText("Pattern Development Report : Number", 0, yPosition, true);
    yPosition -= 18;
    await drawText("Report Title: Category Report", 0, yPosition);
    yPosition -= 18;
    await drawText("Status of the Pattern", 0, yPosition);
    yPosition -= 18;

    // Draw image at the top (header)
    page.drawImage(image, {
        x: margin,
        y: height - margin - imageHeight, // Position the image at the top of the page
        width: imageWidth,
        height: imageHeight,
    });

    // Title Section
    drawText("Pattern Development Report : Number", 0, yPosition, true);
    yPosition -= lineSpacing;
    drawText("Report Title: Category Report", 0, yPosition);
    yPosition -= lineSpacing;
    drawText("Status of the Pattern", 0, yPosition);
    yPosition -= lineSpacing;
    drawText("Date Generated: [Insert Date Here]", 0, yPosition);
    yPosition -= lineSpacing;
    drawText("Prepared By: [Name]", 0, yPosition);
    yPosition -= 2 * lineSpacing;

    // Section 1: Status of the Pattern
    drawText("1. Status of the Pattern", 0, yPosition, true);
    yPosition -= lineSpacing;
    drawText("Brand: Brand", 0, yPosition);
    yPosition -= lineSpacing;

    const statusTable = [
        ["Size Category", "Total Patterns", "Approved", "Revised", "Dropped"],
        ["Small", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Medium", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Large", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Extra Large", "[Value]", "[Value]", "[Value]", "[Value]"],
    ];

    statusTable.forEach((row) => {
        row.forEach((text, colIndex) => {
            drawText(text, colIndex * 100, yPosition);
        });
        yPosition -= lineSpacing;
    });

    yPosition -= lineSpacing;
    drawText(
        "The Status of the Pattern report highlights the performance and efficiency...",
        0,
        yPosition
    );
    yPosition -= 3 * lineSpacing;

    // Section 2: Fit Issues Analysis
    drawText("2. Fit Issues Analysis", 0, yPosition, true);
    yPosition -= lineSpacing;
    drawText("Brand: Brand", 0, yPosition);
    yPosition -= lineSpacing;

    const fitIssuesTable = [
        ["Reason", "All Sizes", "Small", "Medium", "Large", "X-Large"],
        ["Strap Width Too Loose", "[Value]", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Body Crown, Width Too Loose", "[Value]", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Body Crown, Improper Curve", "[Value]", "[Value]", "[Value]", "[Value]", "[Value]"],
        ["Crown, Diameter Too Wide", "[Value]", "[Value]", "[Value]", "[Value]", "[Value]"],
    ];

    fitIssuesTable.forEach((row) => {
        row.forEach((text, colIndex) => {
            drawText(text, colIndex * 80, yPosition);
        });
        yPosition -= lineSpacing;
    });

    yPosition -= lineSpacing;
    drawText(
        "The Fit Issues Analysis Report provides valuable insights into the common challenges...",
        0,
        yPosition
    );
    yPosition -= 3 * lineSpacing;

    // Section 3: Performance Overview
    drawText("3. Performance Overview", 0, yPosition, true);
    yPosition -= lineSpacing;

    const performanceTable = [
        ["Brand Company", "Total Submitted", "Approved", "Frequency"],
        ["UGG", "105", "86", "81.9%"],
        ["VANS", "40", "28", "70%"],
        ["THE NORTH FACE", "52", "37", "71.15%"],
        ["COLEHAAN", "44", "34", "77.27%"],
    ];

    performanceTable.forEach((row) => {
        row.forEach((text, colIndex) => {
            drawText(text, colIndex * 100, yPosition);
        });
        yPosition -= lineSpacing;
    });

    yPosition -= lineSpacing;
    drawText(
        "The Performance Overview Report provides a summary of pattern submission and approval...",
        0,
        yPosition
    );

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Pattern_Development_Report.pdf'; // Set the filename for download
    document.body.appendChild(link);
    link.click(); // Programmatically click the link to trigger download
    document.body.removeChild(link); // Clean up
}

export const generateRep = generateReport;
