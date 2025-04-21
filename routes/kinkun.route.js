// ไฟล์ที่ใช้ในการกำหนดเส่นทางในการเรียกใช้ api เป็นการกำหนด Endpoint ของ api
const express = require("express");
const router = express.Router();

const kinkunController = require('../controllers/kinkun.controller');

// เพิ่ม
router.post('/',kinkunController.upload,kinkunController.createkinkun);

// แก้ไข
router.put('/:kinkunId', kinkunController.upload, kinkunController.editkinkun);


// ลบ
router.delete('/:kinkunId', kinkunController.deletekinkun);

// ค้นหา ตรวจสอบ ดึง ดู
router.get('/kinkunall/:userId',kinkunController.showAllkinkun);
router.get('/kinkunonly/:kinkunId',kinkunController.showOnlykinkun);

// ****
module.exports = router