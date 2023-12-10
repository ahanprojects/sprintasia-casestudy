package controllers

import "github.com/gin-gonic/gin"

func GenerateRoutes(r *gin.Engine) {
	r.GET("/tasks", GetTasks)
	// r.GET("/tasks/:id", GetPost)
	r.POST("/tasks", CreateTask)
	r.PATCH("/tasks/:id", UpdateTask)
	r.DELETE("/tasks/:id", DeleteTask)
}