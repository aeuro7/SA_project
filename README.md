# BlueBid Website เว็บไซต์ประมูลสินค้า

## ภาพรวม  
โครงการนี้เป็น **ระบบประมูลสินค้าออนไลน์** ที่ให้แอดมินจัดการสินค้าและการประมูล และลูกค้าสามารถเข้าร่วมการประมูลสินค้าได้ โดยระบบนี้มีการพัฒนา:  

- **Frontend**: ใช้ HTML และ CSS (ไม่ใช้ Framework ใดๆ)  
- **Backend**: ใช้ Golang พร้อม Fiber Framework เชื่อมต่อกับฐานข้อมูล PostgreSQL  

## ฟีเจอร์  

### ฟีเจอร์สำหรับแอดมิน:  
1. **เพิ่มสินค้า**: แอดมินสามารถเพิ่มสินค้าที่จะประมูลได้  
2. **ตั้งเวลาเปิดประมูล**: กำหนดวันและเวลาสำหรับการเปิดประมูลสินค้า  
3. **สร้างคำสั่งซื้อ (Order)**: เมื่อการประมูลสิ้นสุด แอดมินสามารถสร้างคำสั่งซื้อให้ลูกค้าที่ชนะการประมูลได้  
4. **ตรวจสอบการจ่ายเงิน**: ตรวจสอบและยืนยันการจ่ายเงินของลูกค้าผ่านหลักฐานการชำระเงิน  

### ฟีเจอร์สำหรับลูกค้า:  
1. **สมัครสมาชิก**: ลูกค้าสามารถสมัครบัญชีเพื่อใช้งานระบบ  
2. **เข้าสู่ระบบ**: ล็อกอินเข้าสู่ระบบเพื่อเข้าร่วมการประมูล  
3. **ประมูลสินค้า**: วางราคาเสนอเพื่อประมูลสินค้าในช่วงเวลาที่กำหนด  
4. **ดูคำสั่งซื้อ**: ตรวจสอบคำสั่งซื้อหลังจากชนะการประมูล  

## โครงสร้างระบบ  

### Frontend  
- ใช้ HTML และ CSS เพื่อสร้างหน้าเว็บไซต์แบบง่าย เน้นความเรียบง่ายและตอบสนองต่อการใช้งานของผู้ใช้  

### Backend  
- พัฒนาโดยใช้ภาษา Go ร่วมกับ Fiber Framework เพื่อจัดการ API และการประมวลผลต่างๆ  
- เชื่อมต่อกับฐานข้อมูล PostgreSQL เพื่อจัดเก็บข้อมูลสินค้า ลูกค้า การประมูล และการชำระเงิน  

### Database  
- ใช้ PostgreSQL สำหรับเก็บข้อมูล เช่น:  
  - ข้อมูลสินค้า  
  - ข้อมูลผู้ใช้งาน  
  - ข้อมูลการประมูล  
  - ข้อมูลคำสั่งซื้อ  

## การติดตั้งและการใช้งาน  

### การติดตั้ง Backend  
1. ติดตั้ง Go และ PostgreSQL  
2. Clone โครงการนี้:  
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```  
3. ตั้งค่าการเชื่อมต่อฐานข้อมูลในไฟล์ `.env`  
4. ติดตั้ง Dependencies:  
   ```bash
   go mod tidy
   ```  
5. รันเซิร์ฟเวอร์:  
   ```bash
   go run main.go
   ```  

### การใช้งาน Frontend  
1. เปิดไฟล์ HTML หลักในโฟลเดอร์ `frontend` ผ่านเบราว์เซอร์  

## License  
โครงการนี้อยู่ภายใต้ลิขสิทธิ์ MIT สามารถปรับใช้และพัฒนาได้ตามต้องการ  
