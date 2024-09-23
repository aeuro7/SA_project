package main

import (
	"euro/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func CreateProduct(c *fiber.Ctx) error {
	var p models.Product

	// Use &p to pass a pointer to the BodyParser
	if err := c.BodyParser(&p); err != nil {
		return err
	}

	_, err1 := db.Exec(`
		INSERT INTO public.products(
		staff_id, product_name, product_description, product_min, product_status, product_start, product_end)
	VALUES ($1, $2, $3, $4, $5, $6, $7);`, 
		p.StaffID, p.ProductName, p.ProductDescription, p.ProductMin, p.ProductStatus, p.ProductBidStartTime, p.ProductBidEndTime)

	if err1 != nil {
		return err1
	}

	return c.JSON(p)
}


func GetProducts(c *fiber.Ctx) error {
	products, err := db.Query(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end
		FROM public.products`)
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
		)
		response = append(response, p)
	}

	return c.JSON(response)
}
func GetProductsActive(c *fiber.Ctx) error {
	products, err := db.Query(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end
		FROM public.products where product_status = 'active' order by product_end`)
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
		)
		response = append(response, p)
	}

	return c.JSON(response)
}
func GetProductsinActive(c *fiber.Ctx) error {
	products, err := db.Query(`
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end
		FROM public.products where product_status = 'inactive'`)
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
		SELECT product_id, staff_id, product_name, product_description, product_min, product_status, product_start, product_end FROM public.products where product_id = $1
	`, id).Scan(
		&p.ProductID,
		&p.StaffID,
		&p.ProductName,
		&p.ProductDescription,
		&p.ProductMin,
		&p.ProductStatus,
		&p.ProductBidStartTime,
		&p.ProductBidEndTime,
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
	SET staff_id=$1, product_name=$2, product_description=$3, product_min=$4, product_status=$5, product_start=$6, product_end=$7
	WHERE product_id = $8;
    `, p.StaffID ,p.ProductName ,p.ProductDescription,p.ProductMin,p.ProductStatus,p.ProductBidStartTime,p.ProductBidEndTime,id)
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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete product"})
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
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete product"})
	}

	return c.SendStatus(fiber.StatusOK)
}
