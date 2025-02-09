package controllers

import (
	"GatorFish/global"
	"GatorFish/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InsertUserBehavior(c *gin.Context) {
	var behavior models.UserBehavior

	if err := c.ShouldBindJSON(&behavior); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if behavior.Username == "" {
		return
	}

	if err := global.Db.Create(&behavior).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User behavior recorded successfully"})
}
