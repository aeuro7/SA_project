package main

import (
	"euro/models"
	"euro/utils"
	"strconv"
	"time"
	"database/sql" // ตรวจสอบให้แน่ใจว่ามีการ import นี้
	"github.com/gofiber/fiber/v2"
)

type CreateOrderRequest struct {
	ProductID  int `json:"product_id" validate:"required"`
}

// CreateOrder API for Admin
func CreateOrder(c *fiber.Ctx) error {
	CreateOrderRequest := new(CreateOrderRequest)
	if err := c.BodyParser(CreateOrderRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Validate order
	if err := utils.ValidateStruct(CreateOrderRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Get product price and customer ID of the highest bidder
	var CustomerID int
	var MaxBidPrice int
	err := db.QueryRow(`
		SELECT customer_id, MAX(bid_price)
		FROM bid
		WHERE product_id = $1
		GROUP BY customer_id
		ORDER BY MAX(bid_price) DESC
		LIMIT 1
	`, CreateOrderRequest.ProductID).Scan(&CustomerID, &MaxBidPrice)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	// Check if order already exists for this customer and product
	var existingOrderCount int
	err = db.QueryRow(`
		SELECT COUNT(*)
		FROM orders
		WHERE customer_id = $1 AND product_id = $2
	`, CustomerID, CreateOrderRequest.ProductID).Scan(&existingOrderCount)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	if existingOrderCount > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Order already exists for this customer and product",
		})
	}

	// Create order
	newOrder := models.Order{
		CustomerID:  CustomerID,
		ProductID:   CreateOrderRequest.ProductID,
		OrderStatus: "PENDING",
		OrderExpire: time.Now().Add(time.Hour * 24).Format("2006-01-02 15:04:05"),
		OrderTotal:  MaxBidPrice,
	}
	if _, err := db.Exec(`
		INSERT INTO orders (
			customer_id, 
			product_id, 
			order_expire,
			order_status,
			order_total
		) VALUES ($1, $2, $3, $4, $5)
	`, newOrder.CustomerID, newOrder.ProductID, newOrder.OrderExpire, newOrder.OrderStatus, newOrder.OrderTotal); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Order created",
		"data":    newOrder,
	})
}


// Get all orders
func GetOrders(c *fiber.Ctx) error {

	orders, err := db.Query(`
		SELECT 
			order_id, 
			customer_id, 
			product_id, 
			order_expire, 
			order_status, 
			order_slip,
			order_total
		FROM orders
		
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}
	defer orders.Close()

	var response []struct {
		Order   models.Order   `json:"order"`
		Product models.Product  `json:"product"`
	}

	for orders.Next() {
		var o models.Order
		var orderSlip sql.NullString // ใช้ sql.NullString เพื่อจัดการกับค่า NULL
		if err := orders.Scan(
			&o.OrderID,
			&o.CustomerID,
			&o.ProductID,
			&o.OrderExpire,
			&o.OrderStatus,
			&orderSlip, // รับค่าจากฐานข้อมูล
			&o.OrderTotal,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error scanning order"})
		}

		// ตรวจสอบค่า orderSlip
		if orderSlip.Valid {
			o.OrderSlip = orderSlip.String // ถ้ามีค่าให้ใช้ค่า
		} else {
			o.OrderSlip = "" // ถ้าไม่มีค่าให้เป็น string เปล่า
		}

		// Get Product Info
		var product models.Product
		err = db.QueryRow(`
			SELECT
				product_id,
				product_name,
				product_description,
				product_min,
				product_status,
				product_picture
			FROM products
			WHERE product_id = $1
		`, o.ProductID).Scan(&product.ProductID, &product.ProductName, &product.ProductDescription, &product.ProductMin, &product.ProductStatus, &product.ProductPicture)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product not found"})
		}

		response = append(response, struct {
			Order   models.Order   `json:"order"`
			Product models.Product  `json:"product"`
		}{
			Order:   o,
			Product: product,
		})
	}

	return c.JSON(response)
}

// Get order by Customer ID
type Order struct {
	OrderID     int     `json:"order_id"`
	CustomerID  int     `json:"customer_id"`
	ProductID   int     `json:"product_id"`
	OrderExpire string   `json:"order_expire"`
	OrderStatus string   `json:"order_status"`
	OrderSlip   *string  `json:"order_slip"` // เปลี่ยนเป็น *string
	OrderTotal  int     `json:"order_total"`
}

func GetOrdersByCustomerID(c *fiber.Ctx) error {
	customerID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid customer ID",
		})
	}

	orders, err := db.Query(`
		SELECT 
			order_id, 
			customer_id, 
			product_id, 
			order_expire, 
			order_status, 
			order_slip,
			order_total
		FROM orders
		WHERE customer_id = $1
	`, customerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}
	defer orders.Close()

	var response []struct {
		Order   models.Order   `json:"order"`
		Product models.Product  `json:"product"`
	}

	for orders.Next() {
		var o models.Order
		var orderSlip sql.NullString // ใช้ sql.NullString เพื่อจัดการกับค่า NULL
		if err := orders.Scan(
			&o.OrderID,
			&o.CustomerID,
			&o.ProductID,
			&o.OrderExpire,
			&o.OrderStatus,
			&orderSlip, // รับค่าจากฐานข้อมูล
			&o.OrderTotal,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error scanning order"})
		}

		// ตรวจสอบค่า orderSlip
		if orderSlip.Valid {
			o.OrderSlip = orderSlip.String // ถ้ามีค่าให้ใช้ค่า
		} else {
			o.OrderSlip = "" // ถ้าไม่มีค่าให้เป็น string เปล่า
		}

		// Get Product Info
		var product models.Product
		err = db.QueryRow(`
			SELECT
				product_id,
				product_name,
				product_description,
				product_min,
				product_status,
				product_picture
			FROM products
			WHERE product_id = $1
		`, o.ProductID).Scan(&product.ProductID, &product.ProductName, &product.ProductDescription, &product.ProductMin, &product.ProductStatus, &product.ProductPicture)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product not found"})
		}

		response = append(response, struct {
			Order   models.Order   `json:"order"`
			Product models.Product  `json:"product"`
		}{
			Order:   o,
			Product: product,
		})
	}

	return c.JSON(response)
}





// UpdateOrderSlip updates the order slip for a given order
func UpdateOrderSlip(c *fiber.Ctx) error {
	// Struct to handle order slip request
	type OrderSlipRequest struct {
		OrderID   int    `json:"order_id" validate:"required"`
		OrderSlip string `json:"order_slip" validate:"required"`
	}

	// Parse the request body
	orderSlipRequest := new(OrderSlipRequest)
	if err := c.BodyParser(orderSlipRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Validate the request body
	if err := utils.ValidateStruct(orderSlipRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Update the order slip in the database
	_, err := db.Exec(`
		UPDATE public.orders
		SET order_slip = $1
		WHERE order_id = $2
	`, orderSlipRequest.OrderSlip, orderSlipRequest.OrderID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Order slip updated successfully",
	})
}

func UpdateOrderStatus(c *fiber.Ctx) error {
	// Struct to handle order status request
	type OrderStatusRequest struct {
		OrderID int `json:"order_id" validate:"required"`
	}

	// Parse the request body
	orderStatusRequest := new(OrderStatusRequest)
	if err := c.BodyParser(orderStatusRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Validate the request body
	if err := utils.ValidateStruct(orderStatusRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Update the order status in the database
	_, err := db.Exec(`
		UPDATE public.orders
		SET order_status = 'PAID'
		WHERE order_id = $1
	`, orderStatusRequest.OrderID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal server error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Order status updated successfully",
	})
}

