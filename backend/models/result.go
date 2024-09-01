package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestType int32

const (
	Click TestType = 1
	Type  TestType = 2
)

type PointResult struct {
	Id      string `json:"id" bson:"id" validate:"required"`
	Correct bool   `json:"correct" bson:"correct" validate:"required"`
	//Attempt int32  `json:"attempt" bson:"attempt" validate:"required"` //for TestType=Click
}

type Result struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	UserId primitive.ObjectID `json:"userId" bson:"userId"`
	TestId primitive.ObjectID `json:"testId" bson:"testId" validate:"required"`
	Type   TestType           `json:"t" bson:"t" validate:"required"`
	IsFull bool               `json:"is_full" bson:"is_full"` //does it contain all points from test so we can include it on leaderboard?

	Accuracy     float32       `json:"x" bson:"x" validate:"required"`
	Time         float32       `json:"y" bson:"y" validate:"required"`
	PointsResult []PointResult `json:"points" bson:"points" validate:"required"`
}
