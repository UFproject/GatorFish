package router

import (
	"GatorFish/controllers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	auth := r.Group("/auth")
	{
		auth.POST("/login", controllers.Login)

		auth.POST("/register", controllers.Register)

		auth.POST("/profile", controllers.Profile)

		auth.POST("/change", controllers.ChangePassword)
	}

	items := r.Group("/items")
	{
		items.POST("/create", controllers.UploadItem)
		items.POST("/Category", controllers.GetItemsByCategory)
		items.POST("/recommend", controllers.RecommendItems)
		items.POST("/id", controllers.GetItemByID)
		items.POST("/update", controllers.UpdateItem)
		items.POST("/AddLike", controllers.AddLike)
		items.POST("/RemoveLike", controllers.RemoveLike)
		items.POST("/Search", controllers.Search)
	}

	behavior := r.Group("/behavior")
	behavior.POST("/view", controllers.InsertUserBehavior)

	//api.Use(middlewares.AuthMiddleWare())
	{
		//todo
	}
	r.Static("/uploads", "./uploads")
	return r
}
