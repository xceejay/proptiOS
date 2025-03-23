package handler

import (
	"fmt"
	"io"
	"log"
	"net/http"

	kafka "github.com/segmentio/kafka-go"
)

func ProducerHandler(kafkaWriter *kafka.Writer) http.HandlerFunc {
	return func(wrt http.ResponseWriter, req *http.Request) {
		defer req.Body.Close() // Ensure request body is closed

		body, err := io.ReadAll(req.Body) // Use io.ReadAll instead of ioutil.ReadAll
		if err != nil {
			http.Error(wrt, "Failed to read request body", http.StatusBadRequest)
			log.Println("Error reading request body:", err)
			return
		}

		msg := kafka.Message{
			Key:   []byte(fmt.Sprintf("address-%s", req.RemoteAddr)),
			Value: body,
		}

		err = kafkaWriter.WriteMessages(req.Context(), msg)
		if err != nil {
			http.Error(wrt, "Failed to write message", http.StatusInternalServerError)
			log.Println("Error writing Kafka message:", err)
			return
		}

		wrt.WriteHeader(http.StatusOK)
		wrt.Write([]byte("Message published successfully"))
	}
}
