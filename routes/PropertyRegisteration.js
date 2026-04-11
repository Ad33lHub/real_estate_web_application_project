const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connectToDb, sql } = require('./db');
const { MAX } = require('mssql');

const router = express.Router();

const uploadDir = 'images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', upload.array('propertyImages'), async (req, res) => {
    try {
        console.log("✅ /upload route hit");
        const {
            propertyType, propertyLocation, propertySize, askingPrice,
            contactName, contactPhone, contactEmail = '', propertyDescription
        } = req.body;

        if (!req.files.length || !propertyType || !propertyLocation || !propertySize || !askingPrice || !contactName || !contactPhone || !propertyDescription) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const imageNames = req.files.map(f => f.filename).join(',');

        const pool = await connectToDb();
        try {
            const pool = await connectToDb();
            console.log("✅ Database connection successful");

            // Optional: Test a simple query
            const result = await pool.request().query('SELECT 1 AS test');
            console.log("Query test successful:", result.recordset);

            return pool;
        } catch (err) {
            console.error("❌ Database connection failed:", err);
            throw err; // Re-throw if you want calling code to handle it
        }
        await pool.request()
            .input('PropertyType', sql.NVarChar(50), propertyType)
            .input('PropertyLocation', sql.NVarChar(255), propertyLocation)
            .input('PropertySize', sql.NVarChar(50), propertySize)
            .input('AskingPrice', sql.Decimal(18, 2), parseFloat(askingPrice))
            .input('ContactName', sql.NVarChar(100), contactName)
            .input('ContactPhone', sql.NVarChar(20), contactPhone)
            .input('ContactEmail', sql.NVarChar(100), contactEmail)
            .input('PropertyDescription', sql.NVarChar(sql.MAX), propertyDescription)
            .input('PropertyImages', sql.NVarChar(sql.MAX), imageNames)
            .query(`
                INSERT INTO PropertyDetails (
                    PropertyType, PropertyLocation, PropertySize,
                    AskingPrice, ContactName, ContactPhone,
                    ContactEmail, PropertyDescription, PropertyImages
                )
                VALUES (
                    @PropertyType, @PropertyLocation, @PropertySize,
                    @AskingPrice, @ContactName, @ContactPhone,
                    @ContactEmail, @PropertyDescription, @PropertyImages
                )
            `);

        res.status(200).json({ message: "Property details submitted successfully!" });


    } catch (err) {
        console.error("Upload failed:", err);
        req.files.forEach(f => {
            try {
                fs.unlinkSync(path.join(uploadDir, f.filename));
            } catch (e) {
                console.error("File cleanup failed:", e);
            }
        });
        res.status(500).json({ message: "Internal server error", error: err.message });

    }
});

module.exports = router;
