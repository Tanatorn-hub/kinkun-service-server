// ไฟล์นี้ประกอบด้วยฟังก์ชั่นในการทำงานกับตารางในฐานข้อมูลผ่านทาง prisma
// ทำงานกับตาราง crud ได้แก่ create เพิ่ม,  read ค้นหา-ตรวจสอบ,  update แก้ไข,  delete ลบ
const multer = require("multer"); //ใช้สำหรับอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับจัดการที่อยู่ของไฟล์

// ใช้ prisma สําหรับการเชื่อมต่อกับฐานข้อมูล
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // สร้างตัวแปร prisma เพื่อใช้ในการทำงานกับฐานข้อมูล

// ฟังก์ชันอัปโหลดไฟล์รูป--------------------------------------------------------------------------
// 1.สร้างที่อยู่สำหรับเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ซ้ำกัน
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/kinkun");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "kinkun_" +
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
}).single("kinkunImage");
// --------------------------------------------------------------------------------

// ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.createkinkun = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.kinkun_tb.create({
      //ข้อมูลที่ต้องการจะเพิ่มในตาราง kinkun_tb
      data: {
        kinkunTitle: req.body.kinkunTitle,
        kinkunState: req.body.kinkunState,
        kinkunDate: req.body.kinkunDate,
        kinkunCost: parseFloat(req.body.kinkunCost),
        kinkunImage: req.file
          ? req.file.path.replace("images\\kinkun\\", "")
          : "",
        userId: parseInt(req.body.userId),
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
// -------------------------------------------------------------------------------------
// ฟังก์ชั่นแก้ไขข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.editkinkun = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    let result = {};

    //ตรวจสอบว่ามีการอัปโหลดไฟล์เพื่อแก้ไขหรือไม่
    if (req.file) {
      //กรณีที่มีการอัปโลหดไฟล์เพื่อแก้ไข หากมีไฟล์เก่าอยู่ให้ลบไฟล์เก่านั้นออกก่อน
      const kinkun = await prisma.kinkun_tb.findFirst({
        where: {
          kinkunId: parseInt(req.params.kinkunId),
        },
      });

      const fs = require("fs");
      const path = require("path"); // อย่าลืม require path ด้วยนะครับ

      fs.unlink(path.join("images/kinkun", kinkun.kinkunImage), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
      //----------------------------------------
      result = await prisma.kinkun_tb.update({
        //ข้อมูลที่ต้องการจะเพิ่มในตาราง kinkun_tb   แก้รูป
        data: {
          kinkunTitle: req.body.kinkunTitle,
          kinkunState: req.body.kinkunState,
          kinkunDate: req.body.kinkunDate,
          kinkunCost: parseFloat(req.body.kinkunCost),
          kinkunImage: req.file
            ? req.file.path.replace("images\\kinkun\\", "")
            : "",
          userId: parseInt(req.body.userId),
        },
        //เงื่อนไขในการแก้ไข
        where: {
          kinkunId: parseInt(req.params.kinkunId),
        },
      });
    } else {
      result = await prisma.kinkun_tb.update({
        //ข้อมูลที่ต้องการจะเพิ่มในตาราง kinkun_tb  ไม่แก้รูป
        data: {
          kinkunTitle: req.body.kinkunTitle,
          kinkunState: req.body.kinkunState,
          kinkunDate: req.body.kinkunDate,
          kinkunCost: parseFloat(req.body.kinkunCost),
          userId: parseInt(req.body.userId),
        },
        //เงื่อนไขในการแก้ไข
        where: {
          kinkunId: parseInt(req.params.kinkunId),
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
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นลบข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.deletekinkun = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.kinkun_tb.delete({
        //เงื่อนไขในการลบ
        where: {
            kinkunId: parseInt(req.params.kinkunId)
        }
      });
  
      // เมื่อทำงานเสร็จรเรียบร้อยแล้วส่งผลการทำงานกลับไปยัง cilent
      res.status(200).json({
        message: "Delete OK",
        info: result,
      });
  } catch (error) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${error.message}` });
  }
};
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นดึงข้อมูลการกินทั้งหมดในตาราง kinkun ของ user หนึ่งๆ------------------------------------------------------------
exports.showAllkinkun = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.kinkun_tb.findMany({
      //ระบุเงื่อนไขในการค้นหา ตรวจสอบ ดึง ดู
      where: {
        userId: parseInt(req.params.userId),
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
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นดึงข้อมูลการกินหนึ่งๆในตาราง kinkun ------------------------------------------------------------
exports.showOnlykinkun = async (req, res) => {
  try {
    // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    const result = await prisma.kinkun_tb.findFirst({
      //ระบุเงื่อนไขในการค้นหา ตรวจสอบ ดึง ดู
      where: {
        kinkunId: parseInt(req.params.kinkunId),
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
// -------------------------------------------------------------------------------------
