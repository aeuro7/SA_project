package models

type Customer struct {
	CustomerID       int    `json:"customer_id"`
	CustomerName     string `json:"customer_name"`
	CustomerPhone    string `json:"customer_phone"`
	CustomerStatus   string `json:"customer_status"`
	CustomerUsername string `json:"customer_username"`
	CustomerPassword string `json:"customer_password"`
}