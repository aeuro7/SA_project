package main

import (
	"database/sql"
	"strconv"
	"fmt"
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

func GetStaffByusername(c *fiber.Ctx) error {
	username := c.Params("username")
	var p Staff

	// Retrieve customer from database
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

func GetStaffByID(c *fiber.Ctx) error {
	var p Staff
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// Retrieve customer from database
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

func CreateStaff(c *fiber.Ctx) error {
	p := new(Staff)
	if err := c.BodyParser(p); err != nil {
		return err
	}
	p.StaffStatus = "Normal"

	// Insert product into database
	_, err := db.Exec(`INSERT INTO public.staff(staff_name, staff_phone, staff_status,staff_username, staff_password) VALUES ($1, $2, $3, $4, $5);`,p.StaffName, p.StaffPhone, p.StaffStatus,p.StaffUsername, p.StaffPassword)
	if err != nil {
		return err
	}

	return c.JSON(p)
}


func UpdateStaff(c *fiber.Ctx) error {
	username := c.Params("username")
	password := c.Params("password")
  
	// Update product in the database
	_, err := db.Exec("UPDATE public.staff SET staff_password = $1 WHERE staff_username = $2;", password, username)
	if err != nil {
	  return err
	}
  	return c.SendString("password change!")
  }


func BanStaff(c *fiber.Ctx) error {
	username := c.Params("username")

	// Update product in the database
	_, err := db.Exec("UPDATE public.staff SET staff_status = $1 WHERE staff_username = $2;", "Ban", username)
	if err != nil {
	  return err
	}
	return c.SendString(fmt.Sprintf("Ban %s", username))
}

func UnBanStaff(c *fiber.Ctx) error {
	username := c.Params("username")
  
	// Update product in the database
	_, err := db.Exec("UPDATE public.staff SET staff_status = $1 WHERE staff_username = $2;", "Normal", username)
	if err != nil {
	  return err
	}
	return c.SendString(fmt.Sprintf("Un Ban %s", username))
}


