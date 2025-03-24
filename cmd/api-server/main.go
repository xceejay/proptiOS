package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/xceejay/api.events.proptios.com/internal/auth"
	"github.com/xceejay/api.events.proptios.com/internal/config"
	"github.com/xceejay/api.events.proptios.com/internal/example"
	"github.com/xceejay/api.events.proptios.com/internal/payments"
	"github.com/xceejay/api.events.proptios.com/pkg/log"
)

const Version = "1.0.0"

var flagConfig = flag.String("config", "./config/local.yml", "path to the config file")

func main() {
	logger := log.New()
	logger.Info("Starting application...")

	kafkaURL := os.Getenv("KAFKA_BROKERS")
	topic := os.Getenv("KAFKA_TOPIC")

	logger.Debugf("Kafka details, brokers: %v, topic: %v", kafkaURL, topic)

	if kafkaURL == "" || topic == "" {
		logger.Error("Missing required environment variables: KAFKA_BROKERS or KAFKA_TOPIC")
		os.Exit(1)
	}

	brokers := strings.Split(kafkaURL, ",")

	// Initialize Kafka Producer
	kafkaProducer, err := payments.NewKafkaProducer(brokers, topic)
	if err != nil {
		logger.Error("Error initializing Kafka producer:", err)
		os.Exit(1)
	}
	defer kafkaProducer.Close() // Ensure producer is closed on shutdown

	// Initialize Router
	r, err := initiateRoutes(kafkaProducer, logger)
	if err != nil {
		logger.Error("Failed to initialize routes")
		os.Exit(1)
	}

	example.PrintExample()
	fmt.Println("Start producer-api ... !!")

	if err := http.ListenAndServe(":8080", r); err != nil {
		logger.Errorf("Server failed to start: %v", err)
		os.Exit(1)
	}
}

func initiateRoutes(kp *payments.KafkaProducer, logger log.Logger) (http.Handler, error) {
	r := chi.NewRouter()

	// Load application configurations
	cfg, err := config.Load(*flagConfig, logger)
	if err != nil {
		logger.Errorf("Failed to load application configuration: %s", err)
		return nil, err
	}

	// Initialize Payments Repository
	paymentRepo := payments.NewMockRepository()

	// Initialize Payments Service
	paymentService := payments.NewService(paymentRepo, kp)

	// Initialize Payments Handler
	paymentHandler := payments.NewHandler(paymentService)

	// Register routes
	authService := auth.NewService(cfg.JWTSigningKey, cfg.JWTExpiration, logger)
	auth.RegisterHandlers(r, authService, logger)

	// Payments routes (with /payments prefix)
	r.Route("/payment", func(r chi.Router) {
		payments.RegisterHandlers(r, paymentHandler)
	})

	return r, nil
}
