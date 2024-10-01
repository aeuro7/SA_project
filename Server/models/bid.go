package models

type Bid struct {
	BidID      int     `json:"bid_id"`
	CustomerID int     `json:"customer_id"`
	ProductID  int     `json:"product_id"`
	BidDate    string  `json:"bid_date"`
	BidPrice   float64 `json:"bid_price"`
}
