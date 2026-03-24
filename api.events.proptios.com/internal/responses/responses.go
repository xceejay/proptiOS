package responses

import (
	"net/http"
)

// SuccessResponse represents a successful API response.
type SuccessResponse struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// OK creates a new success response representing an HTTP 200 OK response.
func OK(msg string, data interface{}) SuccessResponse {
	if msg == "" {
		msg = "Request processed successfully."
	}
	return SuccessResponse{
		Status:  http.StatusOK,
		Message: msg,
		Data:    data,
	}
}

// Created creates a new success response representing an HTTP 201 Created response.
func Created(msg string, data interface{}) SuccessResponse {
	if msg == "" {
		msg = "Resource created successfully."
	}
	return SuccessResponse{
		Status:  http.StatusCreated,
		Message: msg,
		Data:    data,
	}
}
