package main

import (
	"database/sql"
	"strconv"
	"fmt"
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
	p.CustomerStatus = "Normal"

	// Insert product into database
	_, err := db.Exec(`INSERT INTO public.customer(customer_name, customer_phone, customer_status,customer_username, customer_password) VALUES ($1, $2, $3, $4, $5);`,p.CustomerName, p.CustomerPhone, p.CustomerStatus,p.CustomerUsername, p.CustomerPassword)
	if err != nil {
		return err
	}

	return c.JSON(p)
}


func UpdateCustomer(c *fiber.Ctx) error {
	username := c.Params("username")
	password := c.Params("password")
  
	// Update product in the database
	_, err := db.Exec("UPDATE public.customer SET customer_password = $1 WHERE customer_username = $2;", password, username)
	if err != nil {
	  return err
	}
  	return c.SendString("password change!")
  }


func BanCustomer(c *fiber.Ctx) error {
	username := c.Params("username")

	// Update product in the database
	_, err := db.Exec("UPDATE public.customer SET customer_status = $1 WHERE customer_username = $2;", "Ban", username)
	if err != nil {
	  return err
	}
	return c.SendString(fmt.Sprintf("Ban %s", username))
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


