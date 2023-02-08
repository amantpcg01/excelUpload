const {NextFunction} = require("express");
const {dataCrud} = require("../services");
const multer = require("multer");
const xlsx = require("xlsx");
const uploadExcel = require("../middlewares/upload.middleware");
const connectTable = require("../dbConfig/connectTable");
const table = require("../dbConfig/collectations");
const {Collection} = require("mongodb");
const ExcelJS = require('exceljs');
const fs = require("fs/promises");
var excelToJson = require('convert-excel-to-json');
const { count } = require("console");
var crypto = require('crypto');
const authHelper = require("../helpers/auth.helper");
const { RegisterSchema } = require("../schema/RegisterSchema");
const formatZodErrors = require("../helpers/errorFormatter.helper");
const jwt = require("jsonwebtoken");
const adminConfig = require("../../firebase");

class HomeController{
    
    async get(req, res, next) {
        const result = await dataCrud.findAll();
        res.json({
            message: "Home Controller",
            data: result
        });
    }   
    
    async insert(req, res, next) {
        const allData = req.body;
        var result = await connectTable(table.USERS).insertMany(allData);
        if (result) {
            res.status(200).json({message: "successfully inserted."});
        }else{
            throw new Error("Something went wrong!");
        }
    }

    async list(req, res, next) {
        var filterData = '';
        let page = (parseInt(req.query.page) || 1) - 1;
        let searchData = req.query.search || '';
        //  Make insensitive filter
        //  var regex = new RegExp(["^", searchData, "$"].join(""), "i");
        var regex = new RegExp(searchData);
        const pageSize = 5;
        if(searchData != '' && searchData != null){
            filterData = { "name": {'$regex' : regex, '$options' : 'i'} };
        }
        const result = await connectTable(table.USERS).find(filterData).skip(page * pageSize).limit(pageSize).toArray();
        const resultCount = await connectTable(table.USERS).find(filterData).toArray();
        const pagesCount = parseFloat((resultCount.length) / pageSize);

        res.json({
            message: "Home Controller", 
            data: result,
            totalPages: Math.ceil(pagesCount)
        });
    }

    async getData(req, res, next) {
        const result = await connectTable(table.USERS).aggregate( [
            
             // Stage 2: Group remaining documents by date and calculate results
             {
                $group:
                {
                   _id: "$name",
                   averageOrderQuantity: { $avg: "$age" }
                }
             }
         ] ).toArray();
        res.json({
            message: "Home Controller",
            result: result
        });
    }

    delete(req, res, next) {
        throw new Error("Method not implemented.");
    }
    
    async uploadExcel(req, res, next) {
        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        // res.json({message: fullUrl }); return;

        let file = req.file;
        const workbook = new ExcelJS.Workbook();
        const data = await workbook.xlsx.readFile(file.path);
        const worksheet = workbook.worksheets[0];
        const imageArray = worksheet.getImages();

        for (const image of worksheet.getImages()) {
            // fetch the media item with the data (it seems the imageId matches up with m.index?)
            const img = workbook.model.media.find(m => m.index === image.imageId);
            const filename = `src/public/uploads/images/${image.range.tl.nativeRow}.${image.range.tl.nativeCol}.${img.name}.${img.extension}`;
            const imgfile =  await fs.writeFile(filename, img.buffer);
        }
        
        let fileData = xlsx.readFile(file.path);
        const sheetNames = fileData.SheetNames;
        const tempData = xlsx.utils.sheet_to_json(fileData.Sheets[sheetNames],{raw: false,});
        var dataArray = [];
        for (let i = 0; i < tempData.length; i++) {
            var imageName = '';
            var singleImage = imageArray.find(img => img.range.tl.nativeRow == i+1);
            if(singleImage != '' && singleImage != null){
                let img = workbook.model.media.find(m => m.index === singleImage.imageId);
                imageName = `src/public/uploads/images/${singleImage.range.tl.nativeRow}.${singleImage.range.tl.nativeCol}.${img.name}.${img.extension}`;
            }

            const getSingleData = await connectTable(table.USERS).findOne({"name": tempData[i]["name"]});

            if(getSingleData){
                console.log("Found : ", tempData[i]["name"]);
                continue;
            }else{
                var singleRow = {
                    name: tempData[i]["name"],
                    age: tempData[i]["age"],
                    phone: tempData[i]["phone"],
                    gender: tempData[i]["gender"],
                    image: imageName
                };
                dataArray.push(singleRow);
            }
        }

        if(dataArray.length > 0){
            const result = await connectTable(table.USERS).insertMany(dataArray);
            if (result) {
                res.status(200).json({message: "successfully uploaded excel."});
            }else{
                throw new Error("Something went wrong!");
            }
        }
        console.log("End");
    }

    async register(req, res, next){
        try{
            const body = RegisterSchema.parse(req.body)
        
            const finalPassword = await authHelper.hashPassword(body.password);

            const dataArray = {
                username: body.username,
                password: finalPassword,
                originalPassword: body.password
            }

            var result = await connectTable(table.REGISTER).insertOne(dataArray);
            if (result) {
                res.status(200).json({message: "successfully inserted."});
            }else{
                throw new Error("Something went wrong!");
            }
        }catch(e){
            res.json(formatZodErrors(e));
        }
    }

    async login(req, res, next){

        let username = req.body.username;
        let password = req.body.password;

        var getUserData = await connectTable(table.REGISTER).findOne({ username: username });
        if(getUserData != null){
            const userPassword = getUserData.password;
            const finalPassword = await authHelper.comparePassword(password, userPassword);
            if(finalPassword == true){
                const token = jwt.sign(
                    { user_id: getUserData._id, username },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: process.env.JWT_EXPIRES_IN,
                    }
                );
                // console.log(token);
                res.status(200).json({message: "successfully login.  ", token});
            }else{
                res.status(200).json({message: "Username or Password not matched!"});
            }
        }else{
            console.log("Username or Password not matched!");
        }
    }

    pushNotification(req, res, next){
        
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        console.log(notification_options);

        //Brave FCM Token
        const registrationToken = [
            "eCLGro02WwuKTvEQxK8Wug:APA91bGfzJLqf5EcEUATzFnjzZ02ob7nKcm9KGJ_Lf9wNtASFUmmZYWTPmeANJ_MXZ_00Y7DiVVwAC2C45BoF-t5ZBbTVop8tv4nXHkNcLLnL1fNuT8ddm782DR548Gu5z7FhDJci9Rc"
        ];

        //Chrome FCM Token
        // const registrationToken = [
        //     "fMxGjd0UavGVH0k_JXuQ_v:APA91bFOmydHL-VCMJeFiG8IEp7GkAy_Y1kzfM7pmarMhQqWhSJDGrVyIFzWNgGgDsbPSP95pYpgexycvg7p9mVTQIRKEeqSNnerwDRdpYFejElVuo0gy2Jr5XJSLDEOY_O-7_ydwaC6"
        // ];

        const options = notification_options
        const message = {
            notification: {
                title: "Title Test",
                body: "Royal Banda Lassan Kumar",
                image: "https://www.indiacarnews.com/wp-content/uploads/2022/07/2022-Hero-Xtreme-160R-Price-1200x900.jpg",
                data: ""
            },
            data: {
                
            }
        };

        console.log(message);

        adminConfig.messaging().sendToDevice(registrationToken, message, options)
            .then((response) => {
                res.status(200).send("Notification sent successfully")
            })
            .catch((error) => {
                console.log(error);
        });
    }


// class NotificationController {
//     
// }

} 

// export default new HomeController();
module.exports = new HomeController();
