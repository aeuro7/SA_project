package models

// type Product struct {
// 	ProductID           int     `json:"product_id"`
// 	ProductStatus       string  `json:"product_status"`
// 	ProductName         string  `json:"product_name"`
// 	ProductMinimumPrice float64 `json:"product_minimum_price"`
// 	ProductBidStartTime string  `json:"product_bid_start_time"`
// 	ProductBidEndTime   string  `json:"product_bid_end_time"`
// 	ProductDescription  string  `json:"product_description"`
// 	CreatorId           string  `json:"creator_id"`
// }
type Product struct {
	ProductID			int     `json:"product_id"` 
	StaffID				int		`json:"staff_id"`
	ProductName         string  `json:"product_name"`
	ProductDescription  string  `json:"product_description"`
	ProductMin 			int 	`json:"product_min"`
	ProductStatus 		string  `json:"product_status"`
	ProductBidStartTime string  `json:"product_bid_start_time"`
	ProductBidEndTime   string  `json:"product_bid_end_time"`
	ProductPicture 		string  `json:"product_picture"`
}