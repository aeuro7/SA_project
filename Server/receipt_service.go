package main

import (
"database/sql"
"strconv"
"fmt"
"github.com/gofiber/fiber/v2"
_ "github.com/lib/pq"
)

type Receipt struct {
	ReceiptID     int    `json:"receipt_id"`
	StaffID       int    `json:"staff_id"`
	CustomerID    int    `json:"customer_id"`
	ProductID     int    `json:"product_id"`
	BidID         int    `json:"bid_id"`
	ReceiptStatus string `json:"receipt_status"`
}


// Get receipt by ID
func GetReceiptByID(c *fiber.Ctx) error {
	var r Receipt
	receiptID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid receipt ID"})
	}

	// Retrieve receipt from database
	err = db.QueryRow(`SELECT receipt_id, staff_id, customer_id, product_id, bid_id, receipt_status FROM public.receipt WHERE receipt_id = $1`, receiptID).Scan(
		&r.ReceiptID,
		&r.StaffID,
		&r.CustomerID,
		&r.ProductID,
		&r.BidID,
		&r.ReceiptStatus,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Receipt not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(r)
}

// Create a new receipt
func CreateReceipt(c *fiber.Ctx) error {
	r := new(Receipt)
	if err := c.BodyParser(r); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Insert receipt into database
	_, err := db.Exec(`INSERT INTO public.receipt(staff_id, customer_id, product_id, bid_id, receipt_status) VALUES ($1, $2, $3, $4, $5);`,
		r.StaffID, r.CustomerID, r.ProductID, r.BidID, r.ReceiptStatus)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(r)
}

// Update receipt status
func UpdateReceiptStatus(c *fiber.Ctx) error {
	receiptID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid receipt ID"})
	}

	status := c.Params("status")

	// Update receipt status in the database
	result, err := db.Exec("UPDATE public.receipt SET receipt_status = $1 WHERE receipt_id = $2;", status, receiptID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update receipt status"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Receipt not found"})
	}

	return c.SendString(fmt.Sprintf("Receipt %d status updated to %s", receiptID, status))
}
