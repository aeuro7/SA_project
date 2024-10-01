package main

import (
	"database/sql"
	"errors"
	"euro/models"
	"euro/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// BidAttemptRequest struct (adjust as necessary for your project)
type BidAttemptRequest struct {
	CustomerID int `json:"customer_id" validate:"required"`
	ProductID  int `json:"product_id" validate:"required"`
	Price      int `json:"price" validate:"required"`
}

func BidAttempt(c *fiber.Ctx) error {
	var request BidAttemptRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Validate request
	if err := utils.ValidateStruct(request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if customer exists
	var customerID int
	err := db.QueryRow(`
		SELECT customer_id 
		FROM public.customer 
		WHERE customer_id = $1
	`, request.CustomerID).Scan(&customerID)
	if errors.Is(err, sql.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Customer not found"})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if product exists
	var productInfo models.Product
	err = db.QueryRow(`
		SELECT product_id, product_status
		FROM public.products
		WHERE product_id = $1
	`, request.ProductID).Scan(&productInfo.ProductID, &productInfo.ProductStatus)
	if errors.Is(err, sql.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Check if product is active
	if productInfo.ProductStatus != "active" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Product is not active"})
	}

	// Check if bid price is higher than current highest bid
	var currentHighestBid sql.NullInt64
	err = db.QueryRow(`
		SELECT MAX(bid_price)
		FROM public.bid
		WHERE product_id = $1
	`, request.ProductID).Scan(&currentHighestBid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Handle cases where there are no existing bids (NULL value)
	if currentHighestBid.Valid {
		if request.Price <= int(currentHighestBid.Int64) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bid price must be higher than current highest bid"})
		}
	}

	// Insert bid into the database
	_, err = db.Exec(`
		INSERT INTO public.bid (
			customer_id, 
			product_id, 
			bid_price,
			bid_date
		) VALUES ($1, $2, $3, NOW())`, request.CustomerID, request.ProductID, request.Price)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusCreated)
}


func GetBidsByProductID(c *fiber.Ctx) error {
	productID, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	// ตรวจสอบว่าสินค้าหรือ product_id มีอยู่หรือไม่
	var productInfo models.Product
	err := db.QueryRow(`
		SELECT 
			product_id,
			product_status
		FROM public.products 
		WHERE product_id = $1
	`, productID).Scan(&productInfo.ProductID, &productInfo.ProductStatus)
	if errors.Is(err, sql.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// ดึงข้อมูลการประมูลทั้งหมดของสินค้านั้น
	rows, err := db.Query(`
		SELECT 
			bid_id, customer_id, bid_price, bid_date
		FROM public.bid
		WHERE product_id = $1
		ORDER BY bid_price DESC
	`, productID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	defer rows.Close()

	// สร้าง slice เพื่อเก็บข้อมูลการประมูล
	var bids []fiber.Map

	for rows.Next() {
		var bidID int
		var customerID int
		var bidPrice float64
		var bidDate string

		if err := rows.Scan(&bidID, &customerID, &bidPrice, &bidDate); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		bids = append(bids, fiber.Map{
			"bid_id":      bidID,
			"customer_id": customerID,
			"bid_price":   bidPrice,
			"bid_date":    bidDate,
		})
	}

	// ตรวจสอบว่ามีข้อมูลการประมูลหรือไม่
	if len(bids) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No bids found for this product"})
	}

	// ส่งข้อมูลการประมูลกลับไป
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"product_id": productInfo.ProductID,
		"bids":       bids,
	})
}


func GetHighestBidByProductID(c *fiber.Ctx) error {
	productID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
	}

	// ตรวจสอบว่าสินค้ามีอยู่หรือไม่
	var productInfo models.Product
	err = db.QueryRow(`
		SELECT 
			product_id,
			product_status
		FROM public.products 
		WHERE product_id = $1
	`, productID).Scan(&productInfo.ProductID, &productInfo.ProductStatus)
	if errors.Is(err, sql.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// ดึงข้อมูลการประมูลที่มีราคาสูงที่สุด
	var highestBid models.Bid
	err = db.QueryRow(`
		SELECT 
			bid_id, customer_id, product_id, bid_price, bid_date
		FROM public.bid
		WHERE product_id = $1
		ORDER BY bid_price DESC
		LIMIT 1
	`, productID).Scan(&highestBid.BidID, &highestBid.CustomerID, &highestBid.ProductID, &highestBid.BidPrice, &highestBid.BidDate)
	if errors.Is(err, sql.ErrNoRows) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No bids found for this product"})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// ส่งข้อมูลการประมูลราคาสูงสุดกลับไป
	return c.JSON(highestBid)
	
}

func GetAuctionWinnerByProductID(c *fiber.Ctx) error {
    productID, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid product ID"})
    }

    // ตรวจสอบว่าสินค้ามีอยู่หรือไม่
    var productInfo models.Product
    err = db.QueryRow(`
        SELECT 
            product_id, 
            product_name, 
            product_description, 
            product_min, 
            product_status, 
            product_start, 
            product_end 
        FROM public.products 
        WHERE product_id = $1
    `, productID).Scan(
        &productInfo.ProductID,
        &productInfo.ProductName,
        &productInfo.ProductDescription,
        &productInfo.ProductMin,
        &productInfo.ProductStatus,
        &productInfo.ProductBidStartTime,
        &productInfo.ProductBidEndTime,
    )
    if errors.Is(err, sql.ErrNoRows) {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
    } else if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    // ดึงข้อมูลการประมูลที่มีราคาสูงสุดและข้อมูลลูกค้า
    var bidID int
    var bidPrice float64
    var bidDate string
    var customerID int
    var customerName string
    var customerPhone string
    var customerStatus string
    var customerUsername string

    err = db.QueryRow(`
        SELECT 
            b.bid_id, 
            b.bid_price, 
            b.bid_date,
            c.customer_id,
            c.customer_name,
            c.customer_phone,
            c.customer_status,
            c.customer_username
        FROM public.bid b
        JOIN public.customer c ON b.customer_id = c.customer_id
        WHERE b.product_id = $1
        ORDER BY b.bid_price DESC
        LIMIT 1
    `, productID).Scan(
        &bidID,
        &bidPrice,
        &bidDate,
        &customerID,
        &customerName,
        &customerPhone,
        &customerStatus,
        &customerUsername,
    )
    if errors.Is(err, sql.ErrNoRows) {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No bids found for this product"})
    } else if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    // ส่งข้อมูลผู้ชนะการประมูลกลับไป
    return c.JSON(fiber.Map{
        "product": fiber.Map{
            "product_id":          productInfo.ProductID,
            "product_name":        productInfo.ProductName,
            "product_description": productInfo.ProductDescription,
            "product_min":         productInfo.ProductMin,
            "product_status":      productInfo.ProductStatus,
            "product_start":       productInfo.ProductBidStartTime,
            "product_end":         productInfo.ProductBidEndTime,
        },
        "winner": fiber.Map{
            "bid_id":      bidID,
            "bid_price":   bidPrice,
            "bid_date":    bidDate,
            "customer": fiber.Map{
                "customer_id":    customerID,
                "customer_name":  customerName,
                "customer_phone": customerPhone,
                "customer_status": customerStatus,
                "customer_username": customerUsername,
            },
        },
    })
}
