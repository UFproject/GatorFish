package controllers

import (
	"math"
	"net/http"
	"sort"

	"GatorFish/global"
	"GatorFish/models"

	"github.com/gin-gonic/gin"
)

type RecommendRequest struct {
	Username      string `json:"username"`
	ProductNumber int    `json:"product_number" binding:"required"`
}

func RecommendItems(c *gin.Context) {

	var req RecommendRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body", "details": err.Error()})
		return
	}

	username := req.Username
	productNumber := int(math.Max(float64(req.ProductNumber), 5.0))

	var recommendedItems []models.Item

	if username != "" {
		var userBehaviors []models.UserBehavior
		err := global.Db.Where("username = ?", username).
			Order("created_at desc").
			Limit(50).
			Find(&userBehaviors).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user behaviors"})
			return
		}

		if len(userBehaviors) > 0 {
			categoryMap := make(map[string]int)
			var categoryOrder []string

			for _, behavior := range userBehaviors {
				var item models.Item
				if err := global.Db.Where("item_id = ?", behavior.ItemID).First(&item).Error; err == nil {
					categoryMap[item.Category_name]++
				}
			}

			// calculate number of occurrences of the category
			countedBehavior := 0
			for category := range categoryMap {
				categoryOrder = append(categoryOrder, category)
			}
			sort.Slice(categoryOrder, func(i, j int) bool {
				return categoryMap[categoryOrder[i]] > categoryMap[categoryOrder[j]]
			})
			for i := 0; i < len(categoryOrder) && i < 5; i++ {
				countedBehavior += categoryMap[categoryOrder[i]]
			}

			for i := 1; i < len(categoryOrder) && i < 5; i++ {
				categoryName := categoryOrder[i]
				recommendedCount := int(math.Max(math.Floor(float64(productNumber)*float64(categoryMap[categoryName])/float64(countedBehavior)), 1))

				var categoryItems []models.Item
				if err := global.Db.Where("category_name = ? AND status = ?", categoryName, "active").
					Limit(recommendedCount).
					Find(&categoryItems).Error; err == nil {
					recommendedItems = append(recommendedItems, categoryItems...)
				}
			}
			recommendedCount := productNumber - len(recommendedItems)
			var categoryItems []models.Item
			if err := global.Db.Where("category_name = ? AND status = ?", categoryOrder[0], "active").
				Limit(recommendedCount).
				Find(&categoryItems).Error; err == nil {
				recommendedItems = append(recommendedItems, categoryItems...)
			}

		}
	}

	//random recommnd for not logged in user
	if len(recommendedItems) == 0 {
		if err := global.Db.Where("status = ?", "active").
			Order("RAND()").
			Limit(productNumber).
			Find(&recommendedItems).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch random items"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"recommended_items": recommendedItems,
	})
}
