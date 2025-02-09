package models

import (
	"time"
)

type UserBehavior struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Username     string    `json:"username" gorm:"size:128;not null" binding:"required"`
	ItemID       int       `json:"item_id" gorm:"not null" binding:"required"`
	BehaviorType string    `json:"behavior_type" gorm:"size:50;not null" binding:"required"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
}
