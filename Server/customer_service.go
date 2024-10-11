package main

import (
	"database/sql"
	"fmt"
	"strconv"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Customer struct {
	CustomerID       int    `json:"customer_id"`
	CustomerName     string `json:"customer_name"`
	CustomerPhone    string `json:"customer_phone"`
	CustomerStatus   string `json:"customer_status"`
	CustomerUsername string `json:"customer_username"`
	CustomerPassword string `json:"customer_password"`
}

type LoginRequest struct {
	Username string `json:"customer_username"`
	Password string `json:"customer_password"`
}

func GetCustomerByusername(c *fiber.Ctx) error {
	username := c.Params("username")
	var p Customer

	// Retrieve customer from database
	err := db.QueryRow("SELECT customer_id, customer_name, customer_phone, customer_status, customer_username, customer_password FROM public.customer WHERE customer_username = $1", username).Scan(
		&p.CustomerID,
		&p.CustomerName,
		&p.CustomerPhone,
		&p.CustomerStatus,
		&p.CustomerUsername,
		&p.CustomerPassword,
	)

	if err != nil {
		// Handle different types of errors
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(p)
}

func GetCustomerByID(c *fiber.Ctx) error {
	var p Customer
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// Retrieve customer from database
	err := db.QueryRow("SELECT customer_id, customer_name, customer_phone, customer_status, customer_username, customer_password FROM public.customer where customer_id = $1;", id).Scan(
		&p.CustomerID,
		&p.CustomerName,
		&p.CustomerPhone,
		&p.CustomerStatus,
		&p.CustomerUsername,
		&p.CustomerPassword,
	)

	if err != nil {
		// Handle different types of errors
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(p)
}

func CreateCustomer(c *fiber.Ctx) error {
	p := new(Customer)
	if err := c.BodyParser(p); err != nil {
		return err
	}

	// ตรวจสอบว่า password มีอย่างน้อย 8 ตัว
	if len(p.CustomerPassword) < 8 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password must be at least 8 characters long",
		})
	}

	// ตรวจสอบว่า phone เป็นเลข 10 หลัก
	if len(p.CustomerPhone) != 10 || !isNumeric(p.CustomerPhone) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number must be exactly 10 digits long",
		})
	}

	// ตรวจสอบว่า username ซ้ำหรือไม่
	var usernameExists bool
	err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM public.customer WHERE customer_username=$1)`, p.CustomerUsername).Scan(&usernameExists)
	if err != nil {
		return err
	}
	if usernameExists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username is already taken",
		})
	}

	// ตรวจสอบว่า phone ซ้ำหรือไม่
	var phoneExists bool
	err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM public.customer WHERE customer_phone=$1)`, p.CustomerPhone).Scan(&phoneExists)
	if err != nil {
		return err
	}
	if phoneExists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number is already registered",
		})
	}

	// ตั้งค่าสถานะลูกค้า
	p.CustomerStatus = "Normal"

	// Insert ข้อมูลลูกค้าเข้าฐานข้อมูล
	_, err = db.Exec(`INSERT INTO public.customer(customer_name, customer_phone, customer_status, customer_username, customer_password) 
		VALUES ($1, $2, $3, $4, $5);`, p.CustomerName, p.CustomerPhone, p.CustomerStatus, p.CustomerUsername, p.CustomerPassword)
	if err != nil {
		return err
	}

	return c.JSON(p)
}

// ฟังก์ชันตรวจสอบว่า string เป็นตัวเลขทั้งหมดหรือไม่
func isNumeric(s string) bool {
	for _, char := range s {
		if char < '0' || char > '9' {
			return false
		}
	}
	return true
}


func LoginCustomer(c *fiber.Ctx) error {
	// รับค่า username และ password จาก request body
	var loginRequest LoginRequest

	// แปลง request body ให้เป็น LoginRequest struct
	if err := c.BodyParser(&loginRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse request",
		})
	}

	// ดึงข้อมูลลูกค้าจากฐานข้อมูลตาม username ที่ส่งมา
	var p Customer
	err := db.QueryRow("SELECT customer_id, customer_name, customer_phone, customer_status, customer_username, customer_password FROM public.customer WHERE customer_username = $1", loginRequest.Username).Scan(
		&p.CustomerID,
		&p.CustomerName,
		&p.CustomerPhone,
		&p.CustomerStatus,
		&p.CustomerUsername,
		&p.CustomerPassword,
	)

	// ตรวจสอบว่า username มีอยู่หรือไม่
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// ตรวจสอบว่า password ที่รับมาตรงกับที่เก็บในฐานข้อมูลหรือไม่
	if p.CustomerPassword != loginRequest.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	// หาก username และ password ถูกต้อง ให้ส่งข้อมูลลูกค้ากลับไป
	return c.JSON(p)
}



func UpdateCustomer(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	p := new(Customer)
	if err := c.BodyParser(p); err != nil {
		return err
	}
  
	_, err := db.Exec("UPDATE public.customer SET customer_id= $1, customer_name= $2, customer_phone= $3, customer_status= $4, customer_username= $5, customer_password= $6 WHERE customer_id = $7;",p.CustomerID,p.CustomerName,p.CustomerPhone,p.CustomerStatus,p.CustomerUsername,p.CustomerPassword,id)
	if err != nil {
	  return err
	}
  	return c.JSON(p)
  }


  func BanCustomer(c *fiber.Ctx) error {
    id := c.Params("id")

    // Update product in the database
    _, err := db.Exec("UPDATE public.customer SET customer_status = $1 WHERE customer_id = $2;", "Ban", id)
    if err != nil {
        return err
    }
    // ส่งคืน JSON แทนข้อความธรรมดา
    return c.JSON(fiber.Map{
        "message": fmt.Sprintf("User %s has been banned", id),
    })
}

func UnBanCustomer(c *fiber.Ctx) error {
	username := c.Params("username")
  
	// Update product in the database
	_, err := db.Exec("UPDATE public.customer SET customer_status = $1 WHERE customer_username = $2;", "Normal", username)
	if err != nil {
	  return err
	}
	return c.SendString(fmt.Sprintf("Un Ban %s", username))
}


