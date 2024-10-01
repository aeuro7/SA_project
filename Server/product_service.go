package main

import (
	"euro/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateProduct(c *fiber.Ctx) error {
	var p models.Product

	// Use &p to pass a pointer to the BodyParser
	if err := c.BodyParser(&p); err != nil {
		return err
	}

	// สร้างตัวแปรเพื่อเก็บ product_id ที่สร้างขึ้น
	var productID int

	// ใช้คำสั่ง INSERT พร้อม RETURNING เพื่อดึง product_id
	err := db.QueryRow(`
		INSERT INTO public.products(
		staff_id, product_name, product_description, product_min, product_status, product_start, product_end, product_picture)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING product_id;`, 
		p.StaffID, p.ProductName, p.ProductDescription, p.ProductMin, p.ProductStatus, p.ProductBidStartTime, p.ProductBidEndTime, p.ProductPicture).Scan(&productID)

	if err != nil {
		return err
	}

	// เพิ่ม product_id ลงใน struct ก่อนส่งกลับ
	p.ProductID = productID

	return c.JSON(p)
}

func GetProducts(c *fiber.Ctx) error {
	products, err := db.Query(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end, product_picture
		FROM public.products
		WHERE product_status IN ('active', 'inactive')
		ORDER BY product_end;
		`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve products"})
	}
	defer products.Close()

	var response []models.Product
	for products.Next() {
		var p models.Product
		products.Scan(
			&p.ProductID,
			&p.StaffID,
			&p.ProductName,
			&p.ProductDescription,
			&p.ProductMin,
			&p.ProductStatus,
			&p.ProductBidStartTime,
			&p.ProductBidEndTime,
			&p.ProductPicture, // เพิ่มฟิลด์ ProductPicture
		)
		response = append(response, p)
	}

	return c.JSON(response)
}

func GetProductsActive(c *fiber.Ctx) error {
	products, err := db.Query(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end, product_picture
		FROM public.products 
		WHERE product_status = 'active' 
		ORDER BY product_end;
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve products"})
	}
	defer products.Close()

	var response []models.Product
	for products.Next() {
		var p models.Product
		products.Scan(
			&p.ProductID,
			&p.StaffID,
			&p.ProductName,
			&p.ProductDescription,
			&p.ProductMin,
			&p.ProductStatus,
			&p.ProductBidStartTime,
			&p.ProductBidEndTime,
			&p.ProductPicture, // เพิ่มฟิลด์ ProductPicture
		)
		response = append(response, p)
	}

	return c.JSON(response)
}

func GetProductByID(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	var p models.Product

	err := db.QueryRow(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end, product_picture 
		FROM public.products 
		WHERE product_id = $1;
	`, id).Scan(
		&p.ProductID,
		&p.StaffID,
		&p.ProductName,
		&p.ProductDescription,
		&p.ProductMin,
		&p.ProductStatus,
		&p.ProductBidStartTime,
		&p.ProductBidEndTime,
		&p.ProductPicture, // เพิ่มฟิลด์ ProductPicture
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(p)
}

func UpdateProduct(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	var p models.Product
	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	_, err1 = db.Exec(`
        UPDATE public.products
	SET staff_id=$1, product_name=$2, product_description=$3, product_min=$4, product_status=$5, product_start=$6, product_end=$7, product_picture=$8
	WHERE product_id = $9;
    `, p.StaffID, p.ProductName, p.ProductDescription, p.ProductMin, p.ProductStatus, p.ProductBidStartTime, p.ProductBidEndTime, p.ProductPicture, id)
	if err1 != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update product"})
	}

	return c.Status(fiber.StatusOK).JSON(p)
}

func inActiveProduct(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	_, err := db.Exec(`
		UPDATE public.products
		SET product_status = 'inactive'
		WHERE product_id = $1;
	`, id)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update product status"})
	}

	return c.SendStatus(fiber.StatusOK)
}

func ActiveProduct(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	_, err := db.Exec(`
		UPDATE public.products
		SET product_status = 'active'
		WHERE product_id = $1;
	`, id)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update product status"})
	}

	return c.SendStatus(fiber.StatusOK)
}
