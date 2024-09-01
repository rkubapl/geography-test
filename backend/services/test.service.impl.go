package services

import (
	"context"
	"errors"
	"geographyTestApi/models"
	"github.com/patrickmn/go-cache"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type TestServiceImpl struct {
	testCollection *mongo.Collection
	ctx            context.Context
	cache          *cache.Cache
}

func NewTestService(testCollection *mongo.Collection, ctx context.Context) TestService {
	c := cache.New(5*time.Minute, 10*time.Minute) //5 min expiration, 10 min purge

	return &TestServiceImpl{testCollection, ctx, c}
}

func (ts *TestServiceImpl) FindTests() ([]*models.MinifiedTest, error) {
	tests, found := ts.cache.Get("tests")

	if found {
		return tests.([]*models.MinifiedTest), nil
	}

	opt := options.FindOptions{}
	opt.SetSort(bson.M{"created_at": -1})
	opt.SetProjection(bson.M{"_id": 0, "name": 1, "shortId": 1})

	query := bson.M{}
	cursor, err := ts.testCollection.Find(ts.ctx, query, &opt)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ts.ctx)

	var testsDb []*models.MinifiedTest

	for cursor.Next(ts.ctx) {
		test := &models.MinifiedTest{}
		err := cursor.Decode(test)

		if err != nil {
			return nil, err
		}

		testsDb = append(testsDb, test)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	ts.cache.Set("tests", testsDb, cache.DefaultExpiration)

	if len(testsDb) == 0 {
		return []*models.MinifiedTest{}, nil
	}

	return testsDb, nil
}

func (p *TestServiceImpl) FindTestByShortId(testShortId string) (*models.Test, error) {
	query := bson.M{"shortId": testShortId}

	var test *models.Test
	err := p.testCollection.FindOne(p.ctx, query).Decode(&test)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("not found")
		}

		return nil, err
	}

	return test, nil
}
