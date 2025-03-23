package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	kafka "github.com/segmentio/kafka-go"
	"github.com/xceejay/api.events.proptios.com/internal/auth"
	"github.com/xceejay/api.events.proptios.com/internal/config"
	"github.com/xceejay/api.events.proptios.com/internal/example"
	"github.com/xceejay/api.events.proptios.com/internal/payments"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

const Version = "1.0.0"

var flagConfig = flag.String("config", "./config/local.yml", "path to the config file")

func getKafkaWriter(kafkaURL, topic string) *kafka.Writer {
	return &kafka.Writer{
		Addr:     kafka.TCP(kafkaURL),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
}

func main() {
	logger := log.New() // Initialize logger

	kafkaURL := os.Getenv("kafkaURL")
	topic := os.Getenv("topic")

	if kafkaURL == "" || topic == "" {
		logger.Error("Missing required environment variables: kafkaURL or topic")
		os.Exit(1) // Exit after logging the error
	}

	kafkaWriter := getKafkaWriter(kafkaURL, topic)
	defer kafkaWriter.Close()

	r, err := initiateRoutes(kafkaWriter)
	if err != nil {
		logger.Error("Failed to initialize routes")
		os.Exit(1) // Exit after logging the error
	}

	example.PrintExample()
	fmt.Println("start producer-api ... !!")

	if err := http.ListenAndServe(":8080", r); err != nil {
		logger.Errorf("Server failed to start: %v", err)
		os.Exit(1) // Log the error and exit
	}
}

func initiateRoutes(kafkaWriter *kafka.Writer) (*mux.Router, error) {
	r := mux.NewRouter()
	logger := log.New().With(nil, "version", Version)

	// load application configurations
	cfg, err := config.Load(*flagConfig, logger)
	if err != nil {
		logger.Errorf("failed to load application configuration: %s", err)
		return nil, err
	}

	r.HandleFunc("/produce", payments.ProducerHandler(kafkaWriter))
	r.HandleFunc("/auth", auth.LoginHandler(auth.NewService(cfg.JWTSigningKey, cfg.JWTExpiration, logger), logger))

	return r, nil
}
