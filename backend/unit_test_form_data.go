package main

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"GatorFish/config"
	"GatorFish/router"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

const JWTtoken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEwNjIwNzQsInVzZXJuYW1lIjoiQW5uYSJ9.fyWVeszvyhRpOvu9G43FeKk1O2rG4S_shNfiFSuBc7c"

// include fileupload request
func performMultipartRequest(r *gin.Engine, method, path string, formData map[string]string, filePath string) *httptest.ResponseRecorder {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	for key, val := range formData {
		_ = writer.WriteField(key, val)
	}

	if filePath != "" {
		file, err := os.Open(filePath)
		if err == nil {
			defer file.Close()
			part, _ := writer.CreateFormFile("file", "test_image.jpg")
			_, _ = io.Copy(part, file)
		}
	}

	writer.Close()

	req, _ := http.NewRequest(method, path, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestUploadItem(t *testing.T) {
	config.InitConfig()
	gin.SetMode(gin.TestMode)
	r := router.SetupRouter()

	testImagePath := "./test_image.jpg"
	generateTestImage(testImagePath)
	defer os.Remove(testImagePath)
	tests := []struct {
		name          string
		formData      map[string]string
		filePath      string
		wantStatus    int
		expectMessage string
	}{
		{
			name: "Valid Item Upload With Image",
			formData: map[string]string{
				"seller_jwt":    JWTtoken,
				"category_name": "Electronics",
				"title":         "Smartphone",
				"description":   "A great phone",
				"price":         "599.99",
				"status":        "active",
			},
			filePath:      testImagePath,
			wantStatus:    http.StatusCreated,
			expectMessage: "Item uploaded successfully",
		},
		{
			name: "Valid Item Upload Without Image",
			formData: map[string]string{
				"seller_jwt":    JWTtoken,
				"category_name": "Books",
				"title":         "Go Programming",
				"description":   "A book about Go",
				"price":         "29.99",
				"status":        "active",
			},
			filePath:      "",
			wantStatus:    http.StatusCreated,
			expectMessage: "Item uploaded successfully",
		},
		{
			name: "Invalid Seller JWT",
			formData: map[string]string{
				"seller_jwt":    "invalid_jwt",
				"category_name": "Clothing",
				"title":         "T-shirt",
				"description":   "A nice t-shirt",
				"price":         "19.99",
				"status":        "active",
			},
			filePath:      "",
			wantStatus:    http.StatusBadRequest,
			expectMessage: "Failed to parse username",
		},
		{
			name: "Invalid Price Format",
			formData: map[string]string{
				"seller_jwt":    JWTtoken,
				"category_name": "Furniture",
				"title":         "Sofa",
				"description":   "Comfortable sofa",
				"price":         "invalid_price",
				"status":        "active",
			},
			filePath:      "",
			wantStatus:    http.StatusBadRequest,
			expectMessage: "Invalid price format",
		},
		{
			name: "Invalid File Type",
			formData: map[string]string{
				"seller_jwt":    JWTtoken,
				"category_name": "Accessories",
				"title":         "Watch",
				"description":   "Stylish watch",
				"price":         "79.99",
				"status":        "active",
			},
			filePath:      "./test_invalid_file.txt",
			wantStatus:    http.StatusBadRequest,
			expectMessage: "Invalid file type",
		},
	}

	generateTestInvalidFile("./test_invalid_file.txt")
	defer os.Remove("./test_invalid_file.txt")

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := performMultipartRequest(r, "POST", "/items/create", tt.formData, tt.filePath)

			assert.Equal(t, tt.wantStatus, w.Code)

			if tt.expectMessage != "" {
				assert.Contains(t, w.Body.String(), tt.expectMessage)
			}
		})
	}
}

func generateTestImage(path string) {
	file, _ := os.Create(path)
	defer file.Close()
	file.Write([]byte("\xFF\xD8\xFF"))
}

func generateTestInvalidFile(path string) {
	file, _ := os.Create(path)
	defer file.Close()
	file.Write([]byte("Invalid file content"))
}

func performFormRequest(r *gin.Engine, method, path string, formData map[string]string) *httptest.ResponseRecorder {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	for key, val := range formData {
		_ = writer.WriteField(key, val)
	}

	// Close the writer to finalize form-data
	writer.Close()

	// Create a new HTTP request
	req, _ := http.NewRequest(method, path, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+JWTtoken) // Mock Authorization header

	// Send the request using httptest
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestInsertUserBehavior(t *testing.T) {
	config.InitConfig()
	gin.SetMode(gin.TestMode)
	r := router.SetupRouter()

	tests := []struct {
		name       string
		formData   map[string]string
		wantStatus int
	}{
		{
			name: "Valid Form Data",
			formData: map[string]string{
				"user_jwt":      JWTtoken,
				"item_id":       "1",
				"behavior_type": "view",
			},
			wantStatus: http.StatusOK,
		},
		{
			name: "Missing JWT",
			formData: map[string]string{
				"item_id":       "1",
				"behavior_type": "view",
			},
			wantStatus: http.StatusBadRequest,
		},
		{
			name: "Invalid Item ID",
			formData: map[string]string{
				"user_jwt":      JWTtoken,
				"item_id":       "invalid",
				"behavior_type": "view",
			},
			wantStatus: http.StatusBadRequest,
		},
		{
			name: "Missing Behavior Type (Should Default to 'unknown')",
			formData: map[string]string{
				"user_jwt": JWTtoken,
				"item_id":  "1",
			},
			wantStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := performFormRequest(r, "POST", "/behavior/view", tt.formData)
			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}
func TestRecommendItems(t *testing.T) {
	config.InitConfig()
	gin.SetMode(gin.TestMode)
	r := router.SetupRouter()

	tests := []struct {
		name          string
		formData      map[string]string
		wantStatus    int
		expectResults bool // get recommend results or not
	}{
		{
			name: "Valid JWT & Default Product Number",
			formData: map[string]string{
				"user_jwt": JWTtoken,
			},
			wantStatus:    http.StatusOK,
			expectResults: true,
		},
		{
			name: "Valid JWT & Custom Product Number",
			formData: map[string]string{
				"user_jwt":       JWTtoken,
				"product_number": "10",
			},
			wantStatus:    http.StatusOK,
			expectResults: true,
		},
		{
			name: "Invalid JWT",
			formData: map[string]string{
				"user_jwt": "invalid_jwt",
			},
			wantStatus:    http.StatusUnauthorized,
			expectResults: false,
		},
		{
			name: "Invalid Product Number",
			formData: map[string]string{
				"user_jwt":       JWTtoken,
				"product_number": "invalid_number",
			},
			wantStatus:    http.StatusUnauthorized,
			expectResults: false,
		},
		{
			name:          "No JWT (Random Recommendation)",
			formData:      map[string]string{},
			wantStatus:    http.StatusOK,
			expectResults: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := performFormRequest(r, "POST", "/items/recommend", tt.formData)

			assert.Equal(t, tt.wantStatus, w.Code)

			if tt.expectResults {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "recommended_items")
			}
		})
	}
}
