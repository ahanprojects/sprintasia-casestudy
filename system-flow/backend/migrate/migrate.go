package main

import (
	"github.com/ahanprojects/motion/initializers"
	"github.com/ahanprojects/motion/models"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.Task{})
}