package controllers

import (
	// "encoding/json"
	// "fmt"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ahanprojects/motion/initializers"
	"github.com/ahanprojects/motion/models"
	"github.com/gin-gonic/gin"
)

func GetTasks(c *gin.Context) {
	completed, ok := c.GetQuery("completed")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request"})
		return
	}

	isCompleted, err := strconv.ParseBool(completed)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid boolean value"})
		return
	}

	type RawTask struct {
		models.Task
		Subtasks string `json:"subtasks"`
	}

	var rawTasks []RawTask

	if err := initializers.DB.Raw(`
		SELECT 
		t.*,
		jsonb_agg(sub.*) subtasks
		FROM tasks t
		LEFT JOIN tasks sub ON t.id = sub.parent_id
		WHERE t.parent_id IS null
		AND	t.completed = ?
		AND t.deleted_at is null 
		AND sub.deleted_at is null
		group by t.id
	`, isCompleted).Scan(&rawTasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tasks"})
		return
	}

	// Parse Result
	type NestedTask struct {
		models.Task
		Subtasks []models.Task `json:"subtasks"`
	}
	var nestedTask []NestedTask

	for _, rt := range rawTasks {
		var task NestedTask
		task.Task = rt.Task

		var subtasks []models.Task
		if err := json.Unmarshal([]byte(rt.Subtasks), &subtasks); err != nil {
			fmt.Printf("Error while unmarshalling JSON: %s", err)
			subtasks = make([]models.Task, 0)
		}
		task.Subtasks = subtasks
		nestedTask = append(nestedTask, task)
	}
	c.JSON(http.StatusOK, nestedTask)
}

func CreateTask(c *gin.Context) {
	var task models.Task

	// Bind the JSON data from the request body to the Task struct
	if err := c.BindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the task in the database
	if err := initializers.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func UpdateTask(c *gin.Context) {
	var task models.Task
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	// Check if the task with the given ID exists
	if err := initializers.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	// Bind the updated JSON data to the task struct
	if err := c.BindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the task in the database
	if err := initializers.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
	{
		var task models.Task
		id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

		// Check if the task with the given ID exists
		if err := initializers.DB.First(&task, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}

		// Delete the task from the database
		if err := initializers.DB.Delete(&task).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
	}
}
