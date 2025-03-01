package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"GatorFish/config"
	"GatorFish/router"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEwNjIwNzQsInVzZXJuYW1lIjoiQW5uYSJ9.fyWVeszvyhRpOvu9G43FeKk1O2rG4S_shNfiFSuBc7c"

// Helper function to execute tests
func performRequest(r *gin.Engine, method, path string, body []byte) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestAuthControllers(t *testing.T) {
	config.InitConfig()
	gin.SetMode(gin.TestMode)
	r := router.SetupRouter()

	tests := []struct {
		name       string
		method     string
		url        string
		body       interface{}
		wantStatus int
	}{
		{
			name:       "Login Success",
			method:     "POST",
			url:        "/auth/login",
			body:       map[string]string{"Username": "testUser", "Password": "password123"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "Profile Fetch",
			method:     "POST",
			url:        "/auth/profile",
			body:       map[string]string{"Username": "testUser"},
			wantStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonBody, _ := json.Marshal(tt.body)
			w := performRequest(r, tt.method, tt.url, jsonBody)
			print(w)
			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}

func TestItemControllers(t *testing.T) {
	config.InitConfig()
	gin.SetMode(gin.TestMode)
	r := router.SetupRouter()

	tests := []struct {
		name       string
		method     string
		url        string
		body       interface{}
		wantStatus int
	}{
		{
			name:       "Get Items By Category",
			method:     "POST",
			url:        "/items/Category",
			body:       map[string]string{"category_name": "Electronics"},
			wantStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonBody, _ := json.Marshal(tt.body)
			w := performRequest(r, tt.method, tt.url, jsonBody)

			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}
