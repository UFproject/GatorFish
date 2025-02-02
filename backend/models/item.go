package models

import "time"

type Item struct {
	Item_id       int32
	Seller_name   string
	Category_name string
	Title         string
	Description   string
	Price         float32
	Posted_date   time.Time
	Status        string
	Pic           string //location of picture
}
