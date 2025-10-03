const fs = require("fs");
const PDFDocument = require("pdfkit");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const { createCanvas } = require("canvas");
const path = require("path");

// Ensure test-files folder exists
const outputDir = path.join(__dirname, "test-files");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 1️⃣ Generate PDF file
const pdfDoc = new PDFDocument();
pdfDoc.pipe(fs.createWriteStream(path.join(outputDir, "test.pdf")));
pdfDoc.fontSize(25).text("Test PDF file", 100, 100);
pdfDoc.end();

// 2️⃣ Generate TXT file
fs.writeFileSync(path.join(outputDir, "test.txt"), "This is a sample text file for testing.");

// 3️⃣ Generate DOCX file
const doc = new Document({
    creator: "Test Generator", // ✅ Required now
    title: "Test Document",
    description: "Generated for testing purposes",
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun("This is a sample DOCX file generated for testing.")
                    ]
                })
            ]
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(path.join(outputDir, "test.docx"), buffer);
});

// 4️⃣ Generate PNG file
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, 200, 200);
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Test PNG", 50, 100);
const out = fs.createWriteStream(path.join(outputDir, "test.png"));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on("finish", () => console.log("✅ All test files created in ./test-files"));
