package payments

import (
	"context"
	"errors"
	"log"

	"github.com/segmentio/kafka-go"
)

type KafkaProducer struct {
	writer *kafka.Writer
}

// NewKafkaProducer initializes and returns a KafkaProducer instance
func NewKafkaProducer(brokers []string, topic string) (*KafkaProducer, error) {
	if len(brokers) == 0 || topic == "" {
		return nil, errors.New("kafka producer initialization failed: brokers or topic not provided")
	}

	producer := &KafkaProducer{
		writer: &kafka.Writer{
			Addr:     kafka.TCP(brokers...),
			Topic:    topic,
			Balancer: &kafka.LeastBytes{},
		},
	}

	log.Printf("KafkaProducer initialized for topic: %s with brokers: %v\n", topic, brokers)
	return producer, nil
}

// Publish sends a message to the Kafka topic
func (kp *KafkaProducer) Publish(message string) error {
	if kp == nil || kp.writer == nil {
		return errors.New("KafkaProducer is not initialized")
	}

	msg := kafka.Message{
		Key:   []byte("key"),
		Value: []byte(message),
	}

	err := kp.writer.WriteMessages(context.Background(), msg)
	if err != nil {
		log.Printf("Failed to publish message: %v", err)
		return err
	}

	log.Println("Message published successfully to Kafka")
	return nil
}

// Close shuts down the Kafka writer
func (kp *KafkaProducer) Close() error {
	if kp.writer != nil {
		return kp.writer.Close()
	}
	return nil
}
