package models

type Pic struct {
	PicID        int     `json:"pic_id"`
	ProductID   int     `json:"product_id"`
	PicLink string  `json:"pic_link"`
}
