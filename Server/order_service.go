package main

import (
	"database/sql"
	"strconv"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Order struct {
	OrderID     int    `json:"order_id"`
	BidID       int    `json:"bid_id"`
	OrderStatus string `json:"order_status"`
	OrderSlip   string `json:"order_slip"`
	OrderExpire  string `json:"expire"`
}

// Get order by ID
func GetOrderByID(c *fiber.Ctx) error {
	var o Order
	orderID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	// Retrieve order from database
	err = db.QueryRow(`SELECT order_id, bid_id, order_status, order_slip, expire FROM public.orders where order_id = $1;
	`, orderID).Scan(
		&o.OrderID,
		&o.BidID,
		&o.OrderStatus,
		&o.OrderSlip,
		&o.OrderExpire,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	return c.JSON(o)
}

// Create a new order
func CreateOrder(c *fiber.Ctx) error {
	o := new(Order)
	if err := c.BodyParser(o); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Unable to parse request body"})
	}

	// Insert order into database
	_, err := db.Exec(`INSERT INTO public.orders(bid_id, order_status, order_slip, expire) VALUES ($1, $2, $3, $4);`,
		o.BidID, o.OrderStatus, o.OrderSlip, o.OrderExpire)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create order"})
	}

	return c.Status(fiber.StatusCreated).JSON(o)
}

// Update order status
func UpdateOrderStatus(c *fiber.Ctx) error {
	orderID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}
	status := c.Params("status")

	// Update order status in database
	result, err := db.Exec(`UPDATE public.orders SET order_status = $1 WHERE order_id = $2;`, status, orderID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update order status"})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}
	return c.SendString("update")
}