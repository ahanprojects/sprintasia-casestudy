package models

import (
	"time"
	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Name string `json:"name"`
	Due time.Time `json:"due"`
	Completed bool `json:"completed" gorm:"default:false"`
	ParentID null.Int `json:"parent_id,omitempty"`
}
