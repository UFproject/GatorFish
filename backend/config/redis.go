package config

import (
	"GatorFish/global"
	"log"

	"github.com/go-redis/redis"
)

func initRedis() {
	addr := appConfig.Redis.Addr
	db := appConfig.Redis.DB
	password := appConfig.Redis.Password

	RedisClient := redis.NewClient(&redis.Options{
		Addr:     addr,
		DB:       db,
		Password: password,
	})
	_, err := RedisClient.Ping().Result()
	if err != nil {
		log.Fatalf("Failed to connect redis:%v", err)
	}

	global.RedisDB = RedisClient
}
