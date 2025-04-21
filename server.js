const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const kinkunRoutes = require("./routes/kinkun.route");
require("dotenv").config();

// สร้าง web server ด้วย express
const app = express();

// กำหนดหมายเลข port เพื่อรอรับการเข้าใช้งาน web server
const PORT = process.env.PORT;


// ตัว MIddleware สจะใช้ในการจัดการงานต่างๆ ของ webserver 
app.use(cors()); // ใช้ cors เพื่อให้สามารถเข้าถึง API ได้จากที่อื่นได้ เรียกใช้งานข้ามโดเมนได้
app.use(express.json()); //ใช้เพื่อให้ web server สามารถiynput ข้อมูลเป็น json ได้


// บอก webserver  ว่าจะใช้ url ที่มี prefix อะไรบ้างในการที่จะเรียกใช้งาน api ต่างๆ
app.use('/user', userRoutes);
app.use('/kinkun', kinkunRoutes);


//  บอก webserver ในการใช้งานไฟล์โฟเดอร์ images
app.use('/images', express.static('images/user'));
app.use('/images', express.static('images/kinkun'));


// คำสั่งเพื่อใช้ทดสอบการเข้าใช้งาน web server (หากไม่ใช้ลบทิ้งได้ หรือจะคอมเมนต์ก็ได้ หรือปล่อยไว้ก็ได้)
app.get("/", (req, res) => {
    res.json({ message: "ยินดีตอยรับสู่ Web server ของเรา!..." });
})


// สร้างคำสั่งให้ web server รอรับ การเข้าใช้งานที่พอร์ตที่กําหนด
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});