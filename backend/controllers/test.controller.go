package controllers

import (
	"geographyTestApi/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type TestController struct {
	testService services.TestService
}

func NewTestController(testService services.TestService) TestController {
	return TestController{testService}
}

func (tc *TestController) FindTests(ctx *gin.Context) {
	tests, err := tc.testService.FindTests()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	ctx.JSON(http.StatusOK, tests)
}

func (tc *TestController) FindTest(ctx *gin.Context) {
	testId := ctx.Param("testShortId")

	test, err := tc.testService.FindTestByShortId(testId)

	if err != nil {
		if err.Error() == "not found" {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	ctx.JSON(http.StatusOK, test)
}
