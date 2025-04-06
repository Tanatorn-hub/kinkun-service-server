// ไฟล์นี้ประกอบด้วยฟังก์ชั่นในการทำงานกับตารางในฐานข้อมูลผ่านทาง prisma
// ทำงานกับตาราง crud ได้แก่ create เพิ่ม,  read ค้นหา-ตรวจสอบ,  update แก้ไข,  delete ลบ
const multer = require("multer"); //ใช้สำหรับอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับจัดการที่อยู่ของไฟล์

// ฟังก์ชันอัปโหลดไฟล์รูป--------------------------------------------------------------------------
// 1.สร้างที่อยู่สำหรับเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ซ้ำกัน
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/kinkun");
},
    filename: (req, file, cb) => {
        cb(null,'kinkun_' + Math.floor(Math.random() * Date.now) + path.extname(file.originalname));
    }
});
//2. ตัวฟังก์ชันอัปโหลดไฟล์ 
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // ขนาดไฟล์สูงสุด 50MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/; //กำหนดประเภทของไฟล์ที่อนุญาตให้อัปโหลด
        const mimetype = filetypes.test(file.mimetype); //ตรวจสอบประเภทของไฟล์ที่อัปโหลด
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //ตรวจสอบนามสกุลของไฟล์ที่อัปโหลด
        if (mimetype && extname) {
            return cb(null, true); //อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes); //ไม่อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
        }
    }
});
// --------------------------------------------------------------------------------


// ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.createkinkun = async (req, res) => {
    try {
        // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    }catch (error) {
        res.status(500).json({ message: 'พบปัญหาในการทำงาน ${err.message}'});
    }
}
// -------------------------------------------------------------------------------------
// ฟังก์ชั่นแก้ไขข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.createkinkun = async (req, res) => {
    try {
        // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    }catch (error) {
        res.status(500).json({ message: 'พบปัญหาในการทำงาน ${err.message}'});
    }
}
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นลบข้อมูลการกินในตาราง kinkun ------------------------------------------------------------
exports.createkinkun = async (req, res) => {
    try {
        // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    }catch (error) {
        res.status(500).json({ message: 'พบปัญหาในการทำงาน ${err.message}'});
    }
}
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นดึงข้อมูลการกินทั้งหมดในตาราง kinkun ------------------------------------------------------------
exports.showAllkinkun = async (req, res) => {
    try {
        // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    }catch (error) {
        res.status(500).json({ message: 'พบปัญหาในการทำงาน ${err.message}'});
    }
}
// -------------------------------------------------------------------------------------

// ฟังก์ชั่นดึงข้อมูลการกินหนึ่งในตาราง kinkun ------------------------------------------------------------
exports.showOnlykinkun = async (req, res) => {
    try {
        // คำสั่งการทำงานกับฐานข้อมูลผ่าน prisma
    }catch (error) {
        res.status(500).json({ message: 'พบปัญหาในการทำงาน ${err.message}'});
    }
}
// -------------------------------------------------------------------------------------

