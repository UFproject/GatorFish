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

func TestLikeControllers(t *testing.T) {
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
			name:       "Add Like - Valid",
			method:     "POST",
			url:        "/items/AddLike",
			body:       map[string]interface{}{"username": "Anna", "item_id": 42},
			wantStatus: http.StatusOK,
		},
		{
			name:       "Add Like - Missing Username",
			method:     "POST",
			url:        "/items/AddLike",
			body:       map[string]interface{}{"item_id": 42},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "Add Like - Invalid Item ID",
			method:     "POST",
			url:        "/items/AddLike",
			body:       map[string]interface{}{"username": "Anna", "item_id": -1},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "Remove Like - Valid",
			method:     "POST",
			url:        "/items/RemoveLike",
			body:       map[string]interface{}{"username": "Anna", "item_id": 42},
			wantStatus: http.StatusOK,
		},
		{
			name:       "Remove Like - Like Not Exist",
			method:     "POST",
			url:        "/items/RemoveLike",
			body:       map[string]interface{}{"username": "nouser", "item_id": 9999},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "Remove Like - Missing Item ID",
			method:     "POST",
			url:        "/items/RemoveLike",
			body:       map[string]interface{}{"username": "Anna"},
			wantStatus: http.StatusBadRequest,
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
func TestProfileController(t *testing.T) {
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
			name:       "Valid Profile Request",
			method:     "POST",
			url:        "/auth/profile",
			body:       map[string]string{"username": "Anna"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "Missing Username",
			method:     "POST",
			url:        "/auth/profile",
			body:       map[string]string{},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "Invalid JSON Format",
			method:     "POST",
			url:        "/auth/profile",
			body:       "not a json object",
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var jsonBody []byte
			if s, ok := tt.body.(string); ok {
				// turn to byte format for wrong json format
				jsonBody = []byte(s)
			} else {
				jsonBody, _ = json.Marshal(tt.body)
			}
			w := performRequest(r, tt.method, tt.url, jsonBody)
			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}
func TestChangePasswordController(t *testing.T) {
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
			name:   "Valid Password Change",
			method: "POST",
			url:    "/auth/change",
			body: map[string]string{
				"username":     "Anna",
				"old_password": "abcdef",
				"new_password": "newpass123",
			},
			wantStatus: http.StatusOK,
		},
		{
			name:   "Wrong Old Password",
			method: "POST",
			url:    "/auth/change",
			body: map[string]string{
				"username":     "Anna",
				"old_password": "wrongpass",
				"new_password": "newpass123",
			},
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:   "User Not Found",
			method: "POST",
			url:    "/auth/change",
			body: map[string]string{
				"username":     "nonexistent",
				"old_password": "oldpass",
				"new_password": "newpass123",
			},
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:   "Missing Fields",
			method: "POST",
			url:    "/auth/change",
			body: map[string]string{
				"username": "Anna",
			},
			wantStatus: http.StatusBadRequest,
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
