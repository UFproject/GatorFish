package config

import (
	"GatorFish/global"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func initDatabase() {
	dsn := AppConfig.Database.Dsn
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to init the database:%v", err)
	}
	sqlDB, err := db.DB()

	sqlDB.SetMaxIdleConns(AppConfig.Database.MaxIdleConns)
	sqlDB.SetMaxOpenConns(AppConfig.Database.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err != nil {
		log.Fatalf("Failed to config database:%v", err)
	}
	global.Db = db
}
