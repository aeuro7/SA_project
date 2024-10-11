package models


type Order struct {
	OrderID     int `json:"order_id"`
	CustomerID  int       `json:"customer_id"`
	ProductID   int       `json:"product_id"`
	OrderExpire string    `json:"order_expire"`
	OrderStatus string    `json:"order_status"`
	OrderSlip   string    `json:"order_slip"`
	OrderTotal  int       `json:"order_total"`
}
