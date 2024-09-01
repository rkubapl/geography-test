package services

import "geographyTestApi/models"

type TestService interface {
	FindTests() ([]*models.MinifiedTest, error) //for now returning all available tests, because only I can add tests
	FindTestByShortId(testShortId string) (*models.Test, error)
}
