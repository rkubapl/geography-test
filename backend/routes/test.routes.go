package routes

import (
	"geographyTestApi/controllers"
	"geographyTestApi/services"
	"github.com/gin-gonic/gin"
)

type TestRouteController struct {
	testController controllers.TestController
}

func NewTestRouteController(authController controllers.TestController) TestRouteController {
	return TestRouteController{authController}
}

func (tc *TestRouteController) TestRoute(rg *gin.RouterGroup, testService services.TestService) {
	router := rg.Group("/test")

	router.GET("/", tc.testController.FindTests)
	router.GET("/:testShortId/", tc.testController.FindTest)
}
