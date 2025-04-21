// ไฟล์นี้ประกอบด้วยฟังก์ชั่นในการทำงานกับตารางในฐานข้อมูลผ่านทาง prisma
// ทำงานกับตาราง crud ได้แก่ create เพิ่ม,  read ค้นหา-ตรวจสอบ,  update แก้ไข,  delete ลบ
// ไฟล์นี้ประกอบด้วยฟังก์ชั่นในการทำงานกับตารางในฐานข้อมูลผ่านทาง prisma
// ทำงานกับตาราง crud ได้แก่ create เพิ่ม,  read ค้นหา-ตรวจสอบ,  update แก้ไข,  delete ลบ
const multer = require("multer"); //ใช้สำหรับอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับจัดการที่อยู่ของไฟล์

// ใช้ prisma สําหรับการเชื่อมต่อกับฐานข้อมูล
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // สร้างตัวแปร prisma เพื่อใช้ในการทำงานกับฐานข้อมูล

// ฟังก์ชันอัปโหลดไฟล์รูป--------------------------------------------------------------------
// 1.สร้างที่อยู่สำหรับเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ซ้ำกัน
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/user");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "user_" +
        Math.floor(Math.random() * Date.now()) +
        path.extname(file.originalname)
    );
  },
});
//2. ตัวฟังก์ชันอัปโหลดไฟล์
exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50, // ขนาดไฟล์สูงสุด 50MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; //กำหนดประเภทของไฟล์ที่อนุญาตให้อัปโหลด
    const mimetype = filetypes.test(file.mimetype); //ตรวจสอบประเภทของไฟล์ที่อัปโหลด
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    ); //ตรวจสอบนามสกุลของไฟล์ที่อัปโหลด
    if (mimetype && extname) {
      return cb(null, true); //อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
    } else {
      cb(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      ); //ไม่อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
    }
  },
}).single("userImage");
// ---------------------------------------------------------------------------------------------------------------

// ฟังก์ชันเพิ่มข้อมูลผู้ใช้งานตาราง user--------------------------------------------------------------------------------------------------
exports.createUser = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.user_tb.create({
      //ข้อมูลที่ต้องการจะเพิ่มในตาราง user_tb
      data: {
        userFullname: req.body.userFullname,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        userImage: req.file ? req.file.path.replace("images\\user\\", "") : "",
      },
    });

    // เมื่อทำงานเสร็จรเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง cilent
    res.status(201).json({
      message: "Insert OK",
      info: result,
    });
  } catch (error) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${error.message}` });
  }
};
// ---------------------------------------------------------------------------------------------------------------

// ฟังก์ชัน login เพื่อตรวจสอบ อีเมลและรหัสผ่านในการเข้าสู่ระบบ ของ user-----------------------------------------------------
exports.checkLogin = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.user_tb.findFirst({
      //ระบุเงื่อนไขในการค้นหา ตรวจสอบ ดึง ดู
      where: {
        userEmail: req.params.userEmail,
        userPassword: req.params.userPassword,
      },
    });

    // เมื่อทำงานเสร็จรเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง cilent
    if (result) {
      //ตรวจสอบว่ามีข้อมูลหรือไม่
      res.status(200).json({
        message: "Get OK",
        info: result,
      });
    } else {
      res.status(404).json({
        message: "Get Not Found",
        info: result,
      });
    }
    
  } catch (error) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${error.message}` });
  }
};
// ---------------------------------------------------------------------------------------------------------------

// ฟังก์ชั่นแก้ไข user--------------------------------------------------------------------------------------------------
exports.editUser = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    let result = {};

    //ตรวจสอบว่ามีการอัปโหลดไฟล์เพื่อแก้ไขหรือไม่
    if (req.file) {

      //กรณีที่มีการอัปโลหดไฟล์เพื่อแก้ไข หากมีไฟล์เก่าอยู่ให้ลบไฟล์เก่านั้นออกก่อน
      const user = await prisma.user_tb.findFirst({
        where: {
          userId: parseInt(req.params.userId)
        }
      })

      if (user.userImage) {
        const fs = require("fs");
        fs.unlink(path.join("images/user", user.userImage))
      }
      //----------------------------------------
      result = await prisma.user_tb.update({
        //ข้อมูลที่ต้องการจะเพิ่มในตาราง user_tb   แก้รูป
        data: {
          userFullname: req.body.userFullname,
          userEmail: req.body.userEmail,
          userPassword: req.body.userPassword,
          userImage: req.file
            ? req.file.path.replace("images\\user\\", "")
            : "",
        },
        //เงื่อนไขในการแก้ไข
        where: {
          userId: parseInt(req.params.userId),
        },
      });
    } else {
      result = await prisma.user_tb.update({
        //ข้อมูลที่ต้องการจะเพิ่มในตาราง user_tb  ไม่แก้รูป
        data: {
          userFullname: req.body.userFullname,
          userEmail: req.body.userEmail,
          userPassword: req.body.userPassword,
        },
        //เงื่อนไขในการแก้ไข
        where: {
          userId: parseInt(req.params.userId),
        },
      });
    }

    // เมื่อทำงานเสร็จรเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง cilent
    res.status(200).json({
      message: "Update OK",
      info: result,
    });
  } catch (error) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${error.message}` });
  }
};

// -----------------------------------------------------------------------------------------------------------------
