package controllers

import (
	"GatorFish/global"
	"GatorFish/models"
	"GatorFish/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func InsertUserBehavior(c *gin.Context) {
	var behavior models.UserBehavior
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10MB limit
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data", "details": err.Error()})
		return
	}

	behavior.Username, _ = utils.ParseJWT(c.PostForm("user_jwt"))
	if behavior.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No username"})
		return
	}
	itemId, err := strconv.ParseFloat(c.PostForm("item_id"), 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item id"})
		return
	}
	behavior.ItemID = int(itemId)
	behavior.BehaviorType = c.PostForm("behavior_type")
	if behavior.BehaviorType == "" {
		behavior.BehaviorType = "unknown"
	}

	if err := global.Db.Create(&behavior).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User behavior recorded successfully"})
}
