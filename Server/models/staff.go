package models

type Staff struct {
	StaffID       int    `json:"staff_id"`
	StaffName     string `json:"staff_name"`
	StaffPhone    string `json:"staff_phone"`
	StaffStatus   string `json:"staff_status"`
	StaffUsername string `json:"staff_username"`
	StaffPassword string `json:"staff_password"`
}