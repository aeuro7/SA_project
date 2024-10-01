package main

import (
	"database/sql"
	"fmt"
	"strconv"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Staff struct {
	StaffID       int    `json:"staff_id"`
	StaffName     string `json:"staff_name"`
	StaffPhone    string `json:"staff_phone"`
	StaffStatus   string `json:"staff_status"`
	StaffUsername string `json:"staff_username"`
	StaffPassword string `json:"staff_password"`
}

type LoginRequestStaff struct {
	Username string `json:"staff_username"`
	Password string `json:"staff_password"`
}

// Get staff by username
func GetStaffByusername(c *fiber.Ctx) error {
	username := c.Params("username")
	var p Staff

	// Retrieve staff from database
	err := db.QueryRow("SELECT staff_id, staff_name, staff_phone, staff_status, staff_username, staff_password FROM public.staff WHERE staff_username = $1", username).Scan(
		&p.StaffID,
		&p.StaffName,
		&p.StaffPhone,
		&p.StaffStatus,
		&p.StaffUsername,
		&p.StaffPassword,
	)

	if err != nil {
		// Handle different types of errors
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Staff not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(p)
}

// Get staff by ID
func GetStaffByID(c *fiber.Ctx) error {
	var p Staff
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// Retrieve staff from database
	err := db.QueryRow("SELECT staff_id, staff_name, staff_phone, staff_status, staff_username, staff_password FROM public.staff WHERE staff_id = $1", id).Scan(
		&p.StaffID,
		&p.StaffName,
		&p.StaffPhone,
		&p.StaffStatus,
		&p.StaffUsername,
		&p.StaffPassword,
	)

	if err != nil {
		// Handle different types of errors
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Staff not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(p)
}

// Create staff
func CreateStaff(c *fiber.Ctx) error {
	p := new(Staff)
	if err := c.BodyParser(p); err != nil {
		return err
	}

	// ตรวจสอบ password อย่างน้อย 8 ตัวอักษร
	if len(p.StaffPassword) < 8 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Password must be at least 8 characters long",
		})
	}

	// ตรวจสอบ phone เป็นเลข 10 หลัก
	if len(p.StaffPhone) != 10 || !isNumeric(p.StaffPhone) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number must be exactly 10 digits long",
		})
	}

	// ตรวจสอบว่า username ซ้ำหรือไม่
	var usernameExists bool
	err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM public.staff WHERE staff_username=$1)`, p.StaffUsername).Scan(&usernameExists)
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
	err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM public.staff WHERE staff_phone=$1)`, p.StaffPhone).Scan(&phoneExists)
	if err != nil {
		return err
	}
	if phoneExists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number is already registered",
		})
	}

	// ตั้งค่าสถานะ staff
	p.StaffStatus = "Normal"

	// Insert ข้อมูล staff เข้าฐานข้อมูล
	_, err = db.Exec(`INSERT INTO public.staff(staff_name, staff_phone, staff_status, staff_username, staff_password) 
		VALUES ($1, $2, $3, $4, $5);`, p.StaffName, p.StaffPhone, p.StaffStatus, p.StaffUsername, p.StaffPassword)
	if err != nil {
		return err
	}

	return c.JSON(p)
}

// Update staff
func UpdateStaff(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	p := new(Staff)
	if err := c.BodyParser(p); err != nil {
		return err
	}
  
	_, err := db.Exec("UPDATE public.staff SET staff_id= $1, staff_name= $2, staff_phone= $3, staff_status= $4, staff_username= $5, staff_password= $6 WHERE staff_id = $7;", p.StaffID, p.StaffName, p.StaffPhone, p.StaffStatus, p.StaffUsername, p.StaffPassword, id)
	if err != nil {
		return err
	}
	return c.JSON(p)
}

// Ban staff
func BanStaff(c *fiber.Ctx) error {
	username := c.Params("username")

	// Update staff status to "Ban"
	_, err := db.Exec("UPDATE public.staff SET staff_status = $1 WHERE staff_username = $2;", "Ban", username)
	if err != nil {
		return err
	}
	return c.SendString(fmt.Sprintf("Ban %s", username))
}

// Unban staff
func UnBanStaff(c *fiber.Ctx) error {
	username := c.Params("username")

	// Update staff status to "Normal"
	_, err := db.Exec("UPDATE public.staff SET staff_status = $1 WHERE staff_username = $2;", "Normal", username)
	if err != nil {
		return err
	}
	return c.SendString(fmt.Sprintf("Unban %s", username))
}


// Staff login
func LoginStaff(c *fiber.Ctx) error {
	var loginRequest LoginRequestStaff

	// Parse request body to LoginRequest struct
	if err := c.BodyParser(&loginRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse request",
		})
	}

	// Retrieve staff information by username
	var p Staff
	err := db.QueryRow("SELECT staff_id, staff_name, staff_phone, staff_status, staff_username, staff_password FROM public.staff WHERE staff_username = $1", loginRequest.Username).Scan(
		&p.StaffID,
		&p.StaffName,
		&p.StaffPhone,
		&p.StaffStatus,
		&p.StaffUsername,
		&p.StaffPassword,
	)

	// Handle cases when username doesn't exist
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// Check if password is correct
	if p.StaffPassword != loginRequest.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	// Return staff information if login is successful
	return c.JSON(p)
}

