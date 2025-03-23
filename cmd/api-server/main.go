package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	kafka "github.com/segmentio/kafka-go"
	"github.com/xceejay/api.events.proptios.com/internal/example"
	"github.com/xceejay/api.events.proptios.com/internal/handler"
)

func getKafkaWriter(kafkaURL, topic string) *kafka.Writer {
	return &kafka.Writer{
		Addr:     kafka.TCP(kafkaURL),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
}

func main() {
	kafkaURL := os.Getenv("kafkaURL")
	topic := os.Getenv("topic")

	if kafkaURL == "" || topic == "" {
		log.Fatal("Missing required environment variables: kafkaURL or topic")
	}

	kafkaWriter := getKafkaWriter(kafkaURL, topic)
	defer kafkaWriter.Close()

	r := initiateRoutes(kafkaWriter)

	example.PrintExample()
	fmt.Println("start producer-api ... !!")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func initiateRoutes(kafkaWriter *kafka.Writer) *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/", handler.ProducerHandler(kafkaWriter))
	return r
}
