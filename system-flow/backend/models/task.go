package models

import (
	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
	"time"
)

type Task struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Name      string         `json:"name"`
	Due       time.Time      `json:"due"`
	Completed bool           `json:"completed" gorm:"default:false"`
	ParentID  null.Int       `json:"parent_id,omitempty"`
}
