package main

import (
	"github.com/ahanprojects/motion/controllers"
	"github.com/ahanprojects/motion/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}
func main() {
	router := gin.Default()
	controllers.GenerateRoutes(router)
	router.Run()
}