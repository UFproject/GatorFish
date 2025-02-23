package models

type User struct {
	Username string `gorm:"unique"`
	Password string
	Phone    string
	Email    string
}
