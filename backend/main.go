package main

import (
	"context"
	"geographyTestApi/controllers"
	"geographyTestApi/routes"
	"geographyTestApi/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

var ctx = context.TODO()

func setupMongoDB(uri string, db string) *mongo.Database {
	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	return client.Database(db)
}

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	db := setupMongoDB(os.Getenv("MONGODB_URI"), os.Getenv("MONGODB_DB"))

	server := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"*"}
	//corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowCredentials = true

	server.Use(cors.New(corsConfig))
	server.Use(gzip.Gzip(gzip.DefaultCompression))

	testService := services.NewTestService(db.Collection("test"), ctx)
	testController := controllers.NewTestController(testService)
	testRouteController := routes.NewTestRouteController(testController)

	router := server.Group("/api")
	testRouteController.TestRoute(router, testService)

	if err := server.Run(":8080"); err != nil {
		log.Fatal("Unable to start the server")
	}
}
