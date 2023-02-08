// import multer from "multer";
// import path, { dirname } from "path";

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, '../ExcelUpload/src/public/uploads/');
    },
    
    filename (req, file, cb) {
        const newName = Math.random().toString(36).substring(2,15);
        cb(null, newName+'-'+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype ==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel"){
        cb(null, true);
    }else{
        cb(new Error("Please upload only excel file"),false);
    }
}

const uploadExcel = multer({storage:storage, fileFilter:fileFilter}).single('excel');
module.exports = uploadExcel;