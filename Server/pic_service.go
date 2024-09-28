package main

import (
	"euro/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)


func GetPic_byProductID(c *fiber.Ctx) error {
	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	var p models.Pic

	err := db.QueryRow(`
		SELECT pic_id, product_id, pic_link FROM public.picture where product_id = $1 order by pic_id
	`, id).Scan(
		&p.PicID,
		&p.ProductID,
		&p.PicLink,
	)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(p)
}

func GetAllPic_byProductID(c *fiber.Ctx) error {

	id, err1 := strconv.Atoi(c.Params("id"))
	if err1 != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	pics, err := db.Query(`
	SELECT pic_id, product_id, pic_link FROM public.picture where product_id = $1
	`,id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve pics"})
	}
	defer pics.Close()

	var response []models.Pic
	for pics.Next() {
		var p models.Pic
		pics.Scan(
			&p.PicID,
			&p.ProductID,
			&p.PicLink,
		)
		response = append(response, p)
	}

	return c.JSON(response)
}

func CreatePic(c *fiber.Ctx) error {
	var p models.Pic

	// Use &p to pass a pointer to the BodyParser
	if err := c.BodyParser(&p); err != nil {
		return err
	}

	_, err1 := db.Exec(`
	INSERT INTO public.picture (product_id, pic_link) VALUES ($1, $2);`, 
		p.ProductID, p.PicLink)

	if err1 != nil {
		return err1
	}

	return c.JSON(p)
}

func DeletePic(c *fiber.Ctx) error {
	// Get the pic_id from the URL parameters
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		// If the pic_id is invalid, return a bad request status
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid picture ID"})
	}

	// Execute the DELETE SQL query
	result, err := db.Exec(`
		DELETE FROM public.picture WHERE pic_id = $1`, id)

	if err != nil {
		// If there is an error executing the query, return an internal server error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete picture"})
	}

	// Return success message if picture is deleted
	return c.JSON(result)
}

func UpdatePic(c *fiber.Ctx) error {
	// Get the pic_id from the URL parameters
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid picture ID"})
	}

	var p models.Pic
	// Parse the request body to get the new picture link
	if err := c.BodyParser(&p); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	// Execute the UPDATE SQL query
	_, err = db.Exec(`
		UPDATE public.picture SET pic_link = $1 WHERE product_id = $2`,
		p.PicLink, id)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update picture"})
	}

	// Return the updated picture information
	return c.JSON(p)
}

