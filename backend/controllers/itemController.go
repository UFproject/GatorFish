package controllers

import (
	"GatorFish/global"
	"GatorFish/models"
	"GatorFish/utils"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadItem(ctx *gin.Context) {
	var item models.Item
	// Parse multipart form data
	if err := ctx.Request.ParseMultipartForm(10 << 20); err != nil { // 10MB limit
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data"})
		return
	}

	item.Seller_name, _ = utils.ParseJWT(ctx.PostForm("seller_jwt"))
	item.Category_name = ctx.PostForm("category_name")
	item.Title = ctx.PostForm("title")
	item.Description = ctx.PostForm("description")

	price, err := strconv.ParseFloat(ctx.PostForm("price"), 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}
	item.Price = float32(price)

	item.Posted_date = time.Now()

	item.Status = ctx.PostForm("status")
	if item.Status == "" {
		item.Status = "active"
	}

	file, err := ctx.FormFile("file")
	if err == nil {
		openedFile, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
			return
		}
		defer openedFile.Close()

		// Read first 512 bytes to detect MIME type
		buffer := make([]byte, 512)
		if _, err := openedFile.Read(buffer); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read uploaded file"})
			return
		}

		fileType := http.DetectContentType(buffer)
		if fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/gif" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."})
			return
		}

		// Generate a unique file name to avoid collisions
		fileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
		uploadPath := "./uploads/" + fileName

		if err := ctx.SaveUploadedFile(file, uploadPath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save uploaded file"})
			return
		}

		item.Pic = uploadPath[1:]
	} else {
		item.Pic = ""
	}

	if err := global.Db.Table("items").Create(&item).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Item uploaded successfully",
		"item":    item,
	})
}

func GetItemsByCategory(ctx *gin.Context) {
	type RequestBody struct {
		CategoryName string `json:"category_name"`
		Start        int    `json:"start"`
		End          int    `json:"end"`
	}

	var requestBody RequestBody

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	if requestBody.CategoryName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "category_name is required"})
		return
	}

	if requestBody.Start < 0 || requestBody.End < 0 || requestBody.Start > requestBody.End {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start or end values"})
		return
	}

	limit := requestBody.End - requestBody.Start + 1
	offset := requestBody.Start

	var items []models.Item
	if err := global.Db.Table("items").
		Where("category_name = ?", requestBody.CategoryName).
		Offset(offset).
		Limit(limit).
		Find(&items).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"category_name": requestBody.CategoryName,
		"items":         items,
	})
}

func GetItemByID(ctx *gin.Context) {
	type RequestBody struct {
		ItemID int `json:"item_id"`
	}

	var requestBody RequestBody

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	if requestBody.ItemID <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Valid item_id is required"})
		return
	}

	var item models.Item
	if err := global.Db.Table("items").
		Where("item_id = ?", requestBody.ItemID).
		First(&item).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"item": item,
	})
}

func UpdateItem(ctx *gin.Context) {
	if err := ctx.Request.ParseMultipartForm(10 << 20); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data"})
		return
	}

	itemIDStr := ctx.PostForm("item_id")
	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil || itemID <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item_id"})
		return
	}

	sellerName, err := utils.ParseJWT(ctx.PostForm("seller_jwt"))
	if err != nil || sellerName == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or missing JWT"})
		return
	}

	var existingItem models.Item
	if err := global.Db.Table("items").Where("item_id = ?", itemID).First(&existingItem).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if existingItem.Seller_name != sellerName {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to update this item"})
		return
	}

	// Build update map
	updateData := map[string]interface{}{}

	if title := ctx.PostForm("title"); title != "" {
		updateData["title"] = title
	}
	if desc := ctx.PostForm("description"); desc != "" {
		updateData["description"] = desc
	}
	if category := ctx.PostForm("category_name"); category != "" {
		updateData["category_name"] = category
	}
	if priceStr := ctx.PostForm("price"); priceStr != "" {
		if price, err := strconv.ParseFloat(priceStr, 32); err == nil {
			updateData["price"] = float32(price)
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
			return
		}
	}
	if status := ctx.PostForm("status"); status != "" {
		updateData["status"] = status
	}

	// Handle image upload
	file, err := ctx.FormFile("file")
	if err == nil {
		openedFile, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
			return
		}
		defer openedFile.Close()

		buffer := make([]byte, 512)
		if _, err := openedFile.Read(buffer); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read uploaded file"})
			return
		}

		fileType := http.DetectContentType(buffer)
		if fileType != "image/jpeg" && fileType != "image/png" && fileType != "image/gif" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."})
			return
		}

		fileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
		uploadPath := "./uploads/" + fileName

		if err := ctx.SaveUploadedFile(file, uploadPath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save uploaded file"})
			return
		}

		updateData["pic"] = uploadPath[1:] // remove leading dot
	}

	// Perform update
	if err := global.Db.Table("items").Where("item_id = ?", itemID).Updates(updateData).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Item updated successfully",
		"updates": updateData,
	})
}
