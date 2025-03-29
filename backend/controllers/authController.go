package controllers

import (
	"GatorFish/global"
	"GatorFish/models"
	"GatorFish/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPwd, err := utils.HashPassword(user.Password)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Password = hashedPwd
	token, err := utils.GenerateJWT(user.Username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := global.Db.Table("users").Create(&user).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func Login(ctx *gin.Context) {

	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User

	if err := global.Db.Table("users").Where("username = ?", input.Username).First(&user).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "wrong username"})
		return
	}

	if !utils.CheckPassword(input.Password, user.Password) {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "wrong credentials"})
		return
	}

	token, err := utils.GenerateJWT(user.Username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func Profile(ctx *gin.Context) {
	var requestBody struct {
		Username string `json:"username"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	if requestBody.Username == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "username is required"})
		return
	}

	// Fetch items posted by the user
	var postedItems []models.Item
	if err := global.Db.Table("items").
		Where("seller_name = ?", requestBody.Username).
		Find(&postedItems).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fetch liked item IDs
	var likedItemIDs []int
	if err := global.Db.Table("like").
		Where("username = ?", requestBody.Username).
		Pluck("item_id", &likedItemIDs).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Fetch full liked item data
	var likedItems []models.Item
	if len(likedItemIDs) > 0 {
		if err := global.Db.Table("items").
			Where("item_id IN ?", likedItemIDs).
			Find(&likedItems).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"username":     requestBody.Username,
		"posted_items": postedItems,
		"liked_items":  likedItems,
	})
}

func ChangePassword(ctx *gin.Context) {
	var input struct {
		Username    string `json:"username" binding:"required"`
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	var user models.User
	if err := global.Db.Table("users").Where("username = ?", input.Username).First(&user).Error; err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if !utils.CheckPassword(input.OldPassword, user.Password) {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect old password"})
		return
	}

	hashedPwd, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password"})
		return
	}

	if err := global.Db.Table("users").Where("username = ?", input.Username).Update("password", hashedPwd).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}
func AddLike(ctx *gin.Context) {
	var input struct {
		Username string `json:"username"`
		ItemID   int    `json:"item_id"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	if input.Username == "" || input.ItemID <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "username and valid item_id are required"})
		return
	}

	// Check if the item exists
	var item models.Item
	if err := global.Db.Table("items").
		Where("item_id = ?", input.ItemID).
		First(&item).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Prevent duplicate likes
	var existing int64
	global.Db.Table("like").
		Where("username = ? AND item_id = ?", input.Username, input.ItemID).
		Count(&existing)

	if existing > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Item already liked"})
		return
	}

	// Insert like
	if err := global.Db.Table("like").Create(map[string]interface{}{
		"username": input.Username,
		"item_id":  input.ItemID,
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like item"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Item liked successfully",
	})
}

func RemoveLike(ctx *gin.Context) {
	var input struct {
		Username string `json:"username"`
		ItemID   int    `json:"item_id"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	if input.Username == "" || input.ItemID <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "username and valid item_id are required"})
		return
	}

	// Check if like exists
	var existing int64
	global.Db.Table("like").
		Where("username = ? AND item_id = ?", input.Username, input.ItemID).
		Count(&existing)

	if existing == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Like does not exist"})
		return
	}

	// Remove the like
	if err := global.Db.Table("like").
		Where("username = ? AND item_id = ?", input.Username, input.ItemID).
		Delete(nil).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove like"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Item unliked successfully",
	})
}
