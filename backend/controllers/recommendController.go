package controllers

import (
	"math"
	"net/http"
	"sort"
	"strconv"

	"GatorFish/global"
	"GatorFish/models"
	"GatorFish/utils"

	"github.com/gin-gonic/gin"
)

func RecommendItems(c *gin.Context) {

	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10MB limit
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form data", "details": err.Error()})
		return
	}
	tmp1 := c.PostForm("user_jwt")
	username := ""
	if tmp1 != "" {
		un, err := utils.ParseJWT(tmp1)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse username"})
			return
		}
		username = un
	}
	tmp2 := c.PostForm("product_number")
	productNumber := 5
	if tmp2 != "" {
		pn, err := strconv.ParseFloat(tmp2, 64)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid product number format"})
			return
		}
		productNumber = int(math.Max(pn, 5.0))
	}

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
				//fmt.Print(i)
				//fmt.Print(": ")
				//fmt.Print(categoryName)
				//fmt.Print(" ")
				//fmt.Println(recommendedCount)
				var categoryItems []models.Item
				if err := global.Db.Where("category_name = ? AND status = ?", categoryName, "active").
					Limit(recommendedCount).
					Find(&categoryItems).Error; err == nil {
					recommendedItems = append(recommendedItems, categoryItems...)
				}
			}
			recommendedCount := productNumber - len(recommendedItems)
			//fmt.Print("final: ")
			//fmt.Print(categoryOrder[0])
			//fmt.Print(" ")
			//fmt.Println(recommendedCount)
			var categoryItems []models.Item
			if err := global.Db.Where("category_name = ? AND status = ?", categoryOrder[0], "active").
				Limit(recommendedCount).
				Find(&categoryItems).Error; err == nil {
				recommendedItems = append(recommendedItems, categoryItems...)
			}

		}
	}

	var leftItems []models.Item
	//random recommnd for not logged in user
	if len(recommendedItems) < productNumber {
		productNumber -= len(recommendedItems)
		if err := global.Db.Where("status = ?", "active").
			Order("RAND()").
			Limit(productNumber).
			Find(&leftItems).Error; err == nil {
			recommendedItems = append(recommendedItems, leftItems...)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"recommended_items": recommendedItems,
	})
}
