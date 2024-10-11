package main

import (
	"database/sql" // สำหรับการใช้งานกับฐานข้อมูล SQL
	"euro/models"  // โมเดลของคุณ
	"euro/utils"   // ฟังก์ชันช่วยเหลือของคุณ
	"strconv" // สำหรับการแปลง string เป็น int

	"github.com/gofiber/fiber/v2" // สำหรับใช้งานกับ Fiber
	_ "github.com/lib/pq"         // PostgreSQL driver
)

type CreateReceiptRequest struct {
	OrderID int `json:"order_id" validate:"required"`
	CustomerID int `json:"customer_id" validate:"required"`
	ProductID int `json:"product_id" validate:"required"`
}

func CreateReceipt(c *fiber.Ctx) error {
	request := new(CreateReceiptRequest)
	if err := c.BodyParser(request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Validate request
	if err := utils.ValidateStruct(request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if order exists
	order := new(models.Order)
	err := db.QueryRow(`
		SELECT 
			order_id,
			order_status
		FROM orders
		WHERE order_id = $1
	`, request.OrderID).Scan(&order.OrderID, &order.OrderStatus)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Order not found"})
	}

	// Check if order is paid
	if order.OrderStatus != "PAID" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Order is not paid"})
	}

	// Check if customer exists
	customer := new(models.Customer)
	err = db.QueryRow(`
		SELECT
			customer_id
		FROM customer
		WHERE customer_id = $1
	`, request.CustomerID).Scan(&customer.CustomerID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Customer not found"})
	}

	// Check if receipt already exists
	var existingReceiptID int
	err = db.QueryRow(`
		SELECT 
			receipt_id 
		FROM receipt 
		WHERE order_id = $1 AND customer_id = $2 AND product_id = $3
	`, request.OrderID, request.CustomerID, request.ProductID).Scan(&existingReceiptID)

	if err == nil {
		// If no error, it means the receipt already exists
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Receipt already exists for this order, customer, and product"})
	}

	// Create receipt
	_, err = db.Exec(`
		INSERT INTO receipt (
			order_id, 
			customer_id, 
			product_id,
			receipt_status
		) VALUES ($1, $2, $3, 'PENDING')
	`, request.OrderID, request.CustomerID, request.ProductID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Receipt created"})
}


type GetReceiptByCustomerIdRequest struct {
	CustomerID int `json:"customer_id" validate:"required"`
}


type GetReceiptByCustomerIdResponse struct {
    ReceiptID   int          `json:"receipt_id"`
    OrderID     int          `json:"order_id"`
    CustomerID  int          `json:"customer_id"`
    ProductID   int          `json:"product_id"`
    ReceiptStatus string      `json:"receipt_status"` // เปลี่ยนชื่อฟิลด์ให้เป็นตัวพิมพ์ใหญ่
    Order       models.Order  `json:"order"`
    Customer    models.Customer `json:"customer"`
    Product     models.Product  `json:"product"`
}


func GetReceiptByCustomerId(c *fiber.Ctx) error {
    id := c.Params("id")
    CustomerID, err := strconv.Atoi(id)
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid customer ID"})
    }

    // Check if receipts exist for the given CustomerID
    receipts := []models.Receipt{}
    rows, err := db.Query(`
        SELECT 
            receipt_id,
            order_id,
            customer_id,
            product_id,
            receipt_status
        FROM receipt
        WHERE customer_id = $1
    `, CustomerID)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
    }
    defer rows.Close()

    for rows.Next() {
        receipt := models.Receipt{}
        if err := rows.Scan(&receipt.ReceiptID, &receipt.OrderID, &receipt.CustomerID, &receipt.ProductID, &receipt.ReceiptStatus); err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning receipt"})
        }
        receipts = append(receipts, receipt)
    }

    if len(receipts) == 0 {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No receipts found for the given customer"})
    }

    var response []GetReceiptByCustomerIdResponse
    for _, receipt := range receipts {
        // Get Order Info
        order := new(models.Order)
        err = db.QueryRow(`
            SELECT
                order_id,
                order_status,
                order_total
            FROM orders
            WHERE order_id = $1
        `, receipt.OrderID).Scan(&order.OrderID, &order.OrderStatus, &order.OrderTotal)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
        }

        // Get Customer Info
        customer := new(models.Customer)
        err = db.QueryRow(`
            SELECT
                customer_id,
                customer_name,
                customer_phone,
                customer_status,
                customer_username,
                customer_password
            FROM customer
            WHERE customer_id = $1
        `, receipt.CustomerID).Scan(&customer.CustomerID, &customer.CustomerName, &customer.CustomerPhone, &customer.CustomerStatus, &customer.CustomerUsername, &customer.CustomerPassword)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
        }

        // Get Product Info
        product := new(models.Product)
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
        `, receipt.ProductID).Scan(&product.ProductID, &product.ProductName, &product.ProductDescription, &product.ProductMin, &product.ProductStatus, &product.ProductPicture)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
        }

        response = append(response, GetReceiptByCustomerIdResponse{
            ReceiptID:   receipt.ReceiptID,
            OrderID:     receipt.OrderID,
            CustomerID:  receipt.CustomerID,
            ProductID:   receipt.ProductID,
			ReceiptStatus: receipt.ReceiptStatus,
            Order:       *order,
            Customer:    *customer,
            Product:     *product,
        })
    }

    return c.JSON(response)
}

func GetAllReceipt(c *fiber.Ctx) error {
    // Check if receipts exist for the given CustomerID
    receipts := []models.Receipt{}
    rows, err := db.Query(`
        SELECT 
            receipt_id,
            order_id,
            customer_id,
            product_id,
            receipt_status
        FROM receipt
    `)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
    }
    defer rows.Close()

    for rows.Next() {
        receipt := models.Receipt{}
        if err := rows.Scan(&receipt.ReceiptID, &receipt.OrderID, &receipt.CustomerID, &receipt.ProductID, &receipt.ReceiptStatus); err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning receipt"})
        }
        receipts = append(receipts, receipt)
    }

    if len(receipts) == 0 {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No receipts found for the given customer"})
    }

    var response []GetReceiptByCustomerIdResponse
    for _, receipt := range receipts {
        // Get Order Info
        order := new(models.Order)
        err = db.QueryRow(`
            SELECT
                order_id,
                order_status,
                order_total
            FROM orders
            WHERE order_id = $1
        `, receipt.OrderID).Scan(&order.OrderID, &order.OrderStatus, &order.OrderTotal)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
        }

        // Get Customer Info
        customer := new(models.Customer)
        err = db.QueryRow(`
            SELECT
                customer_id,
                customer_name,
                customer_phone,
                customer_status,
                customer_username,
                customer_password
            FROM customer
            WHERE customer_id = $1
        `, receipt.CustomerID).Scan(&customer.CustomerID, &customer.CustomerName, &customer.CustomerPhone, &customer.CustomerStatus, &customer.CustomerUsername, &customer.CustomerPassword)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
        }

        // Get Product Info
        product := new(models.Product)
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
        `, receipt.ProductID).Scan(&product.ProductID, &product.ProductName, &product.ProductDescription, &product.ProductMin, &product.ProductStatus, &product.ProductPicture)
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
        }

        response = append(response, GetReceiptByCustomerIdResponse{
            ReceiptID:   receipt.ReceiptID,
            OrderID:     receipt.OrderID,
            CustomerID:  receipt.CustomerID,
            ProductID:   receipt.ProductID,
			ReceiptStatus: receipt.ReceiptStatus,
            Order:       *order,
            Customer:    *customer,
            Product:     *product,
        })
    }

    return c.JSON(response)
}



func UpdateReceiptStatus(c *fiber.Ctx) error {
	// รับ receipt_id จากพารามิเตอร์
	receiptIDParam := c.Params("id")
	receiptID, err := strconv.Atoi(receiptIDParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid receipt ID"})
	}

	// ตรวจสอบว่าใบเสร็จมีอยู่ในฐานข้อมูล
	var existingReceiptID int
	err = db.QueryRow(`
		SELECT receipt_id
		FROM public.receipt
		WHERE receipt_id = $1
	`, receiptID).Scan(&existingReceiptID)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Receipt not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// อัปเดตสถานะใบเสร็จ
	_, err = db.Exec(`
		UPDATE public.receipt
		SET receipt_status='FINISH'
		WHERE receipt_id = $1
	`, receiptID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// ดึง product_id จากใบเสร็จ
	var productID int
	err = db.QueryRow(`
		SELECT product_id
		FROM public.receipt
		WHERE receipt_id = $1
	`, receiptID).Scan(&productID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// อัปเดตสถานะผลิตภัณฑ์
	_, err = db.Exec(`
		UPDATE public.products
		SET product_status='closed'
		WHERE product_id = $1
	`, productID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}


	// คืนค่าข้อมูลใบเสร็จที่อัปเดต
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Receipt status updated successfully"})
}
