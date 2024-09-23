package models

type Bid struct {
	BidID        int     `json:"bid_id"`
	CustomerID   int     `json:"customer_id"`
	ProductID    int     `json:"product_id"`
	BidTimestamp string  `json:"bid_timestamp"`
	BidPrice     float64 `json:"price"`
}
