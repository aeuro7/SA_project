# BlueBid Website เว็บไซต์ประมูลสินค้า

## ภาพรวม  
โครงการนี้เป็น **ระบบประมูลสินค้าออนไลน์** ที่ให้แอดมินจัดการสินค้าและการประมูล และลูกค้าสามารถเข้าร่วมการประมูลสินค้าได้ โดยระบบนี้มีการพัฒนา:  


![Home](/sorce/usecase/home.png)
![List](/sorce/usecase/auction.png)
![Auction](/sorce/usecase/auction2.png)


## ฟีเจอร์  

- **Frontend**: ใช้ HTML และ CSS (ไม่ใช้ Framework ใดๆ)  
- **Backend**: ใช้ Golang พร้อม Fiber Framework เชื่อมต่อกับฐานข้อมูล PostgreSQL  


### ฟีเจอร์สำหรับแอดมิน:  
1. **เพิ่มสินค้า**: แอดมินสามารถเพิ่มสินค้าที่จะประมูลได้  
2. **ตั้งเวลาเปิดประมูล**: กำหนดวันและเวลาสำหรับการเปิดประมูลสินค้า  
3. **สร้างคำสั่งซื้อ (Order)**: เมื่อการประมูลสิ้นสุด แอดมินสามารถสร้างคำสั่งซื้อให้ลูกค้าที่ชนะการประมูลได้  
4. **ตรวจสอบการจ่ายเงิน**: ตรวจสอบและยืนยันการจ่ายเงินของลูกค้าผ่านหลักฐานการชำระเงิน  
5. **อัปเดตสต็อกสินค้า**: แอดมินสามารถอัปเดตสถานะสต็อกสินค้าเมื่อสินค้าถูกจัดส่งหรือมีลูกค้ามารับสินค้าแล้ว  

### ฟีเจอร์สำหรับลูกค้า:  
1. **สมัครสมาชิก**: ลูกค้าสามารถสมัครบัญชีเพื่อใช้งานระบบ  
2. **เข้าสู่ระบบ**: ล็อกอินเข้าสู่ระบบเพื่อเข้าร่วมการประมูล  
3. **ประมูลสินค้า**: วางราคาเสนอเพื่อประมูลสินค้าในช่วงเวลาที่กำหนด  
   - ระบบจะขยายเวลาประมูลออกไปอีก 5 นาที หากมีการประมูลใน 5 นาทีสุดท้ายของรอบ  
4. **ดูคำสั่งซื้อ**: ตรวจสอบคำสั่งซื้อหลังจากชนะการประมูล  

## โครงสร้างระบบ  

### Frontend  
- ใช้ HTML และ CSS เพื่อสร้างหน้าเว็บไซต์แบบง่าย เน้นความเรียบง่ายและตอบสนองต่อการใช้งานของผู้ใช้  

### Backend  
- พัฒนาโดยใช้ภาษา Go ร่วมกับ Fiber Framework เพื่อจัดการ API และการประมวลผลต่างๆ  
- เชื่อมต่อกับฐานข้อมูล PostgreSQL เพื่อจัดเก็บข้อมูลสินค้า ลูกค้า การประมูล และการชำระเงิน  

### Database ใช้ PostgreSQL สำหรับเก็บข้อมูล เช่น:  
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
3. ตั้งค่าการเชื่อมต่อฐานข้อมูลในไฟล์ SA_24_10_2024 ใน postgreSQL และแก้ config ให้ตรงตาม
   ```
    DBhost     = "localhost"  // or the Docker service name if running in another container
    DBport     = 5432         // default PostgreSQL port
    DBuser     = "myuser"     // as defined in docker-compose.yml
    DBpassword = "mypassword" // as defined in docker-compose.yml
    DBname   = "SA_DB_1" // as defined in docker-compose.yml
   ```
4. รันเซิร์ฟเวอร์:  
   ```bash
   go run main.go
   ```  

### การใช้งาน Frontend  
1. เปิดไฟล์ HTML home.html หลักในโฟลเดอร์ `frontend` ผ่านเบราว์เซอร์  

---

# BlueBid Website: Online Auction Platform



## Overview  
BlueBid is an **online auction system** that allows administrators to manage products and auctions, while customers can participate in bidding. This platform is developed using:  



## Features  

- **Frontend**: Built with HTML and CSS (no frameworks used)  
- **Backend**: Developed with Golang using the Fiber framework, connected to a PostgreSQL database  



### Features for Admin:  
1. **Add Products**: Admins can add products for auction.  
2. **Set Auction Time**: Define the start date and time for product auctions.  
3. **Create Orders**: After the auction ends, admins can generate orders for the winning customers.  
4. **Verify Payments**: Check and confirm customer payments through payment slips.  
5. **Update Stock**: Admins can update the stock status once customers collect their items or when items are delivered.  



### Features for Customers:  
1. **Register**: Customers can create an account to use the system.  
2. **Login**: Log in to participate in auctions.  
3. **Bid on Products**: Place bids during the auction period.  
   - The auction will extend by an additional 5 minutes if there are bids in the last 5 minutes.  
4. **View Orders**: Check orders after winning an auction.  



## System Architecture  

### Frontend  
- Built using HTML and CSS for a simple, user-friendly interface.  



### Backend  
- Developed using Go with the Fiber framework to manage APIs and backend processing.  
- Connected to a PostgreSQL database for storing product, customer, auction, and payment information.  



### Database  
PostgreSQL is used to store various data, including:  
- Product information  
- User accounts  
- Auction details  
- Orders  



## Installation and Usage  



### Backend Installation  
1. Install Go and PostgreSQL.  
2. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```  
3. Configure database settings in the `SA_24_10_2024` PostgreSQL file and adjust the configuration:  
   ```go
   DBhost     = "localhost"  // or the Docker service name if running in another container
   DBport     = 5432         // default PostgreSQL port
   DBuser     = "myuser"     // as defined in docker-compose.yml
   DBpassword = "mypassword" // as defined in docker-compose.yml
   DBname     = "SA_DB_1"    // as defined in docker-compose.yml
   ```  
4. Run the server:  
   ```bash
   go run main.go
   ```  



### Frontend Usage  
1. Open the `home.html` file in the `frontend` folder using a web browser.  

