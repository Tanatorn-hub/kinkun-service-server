// ไฟล์ที่ใช้ในการกำหนดเส่นทางในการเรียกใช้ api เป็นการกำหนด Endpoint ของ api
const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// เพิ่ม
router.post('/',userController.upload,userController.createUser);

// ค้นหา ตรวจสอบ ดึง ดู
router.get('/:userEmail/:userPassword',userController.checkLogin);

// // **เพิ่ม route สำหรับ HTTP GET ที่ path '/'**
// router.get('/', (req, res) => {
//     res.json({ message: 'API สำหรับผู้ใช้งาน' }); // หรือ logic อื่นๆ ในการดึงข้อมูลผู้ใช้
//   });
  

// แก้ไข
router.put('/:userId',userController.upload,userController.editUser);

// ******
module.exports = router
