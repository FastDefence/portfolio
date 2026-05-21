package router

import (
	"database/sql"

	"portfolio-back/core/controller"
	"portfolio-back/core/repository"
	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

func SetupRouter(e *echo.Echo, db *sql.DB) {
	articleRepository := repository.NewArticleRepository(db)
	articleUsecase := usecase.NewArticleUsecase(articleRepository)
	articleController := controller.NewArticleController(articleUsecase)
	e.GET("/articles", articleController.GetAllArticles)
	e.GET("/articles/:id", articleController.GetArticleByID)
	e.POST("/articles", articleController.PostArticle)
	e.PATCH("/articles/:id", articleController.PatchArticle)
	e.DELETE("/articles/:id", articleController.DeleteArticle)
}
