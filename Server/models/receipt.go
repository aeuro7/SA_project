package models

type Receipt struct {
	ReceiptID     int    `json:"receipt_id"`
	OrderID       int    `json:"order_id"`
	CustomerID    int    `json:"customer_id"`
	ProductID     int    `json:"product_id"`
	ReceiptStatus string `json:"receipt_status"`
}
