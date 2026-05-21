package router

import (
	"database/sql"

	"portfolio-back/core/controller"
	"portfolio-back/core/repository"
	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

func SetupRouter(e *echo.Echo, db *sql.DB) {
	articleTagRepository := repository.NewArticleTagRepository(db)
	articleTagUsecase := usecase.NewArticleTagUsecase(articleTagRepository)
	articleTagController := controller.NewArticleTagController(articleTagUsecase)

	e.GET("/articles/:id/tags", articleTagController.GetArticleTags)
	e.PUT("/articles/:id/tags", articleTagController.PutArticleTags)

	referenceRepository := repository.NewReferenceRepository(db)
	referenceUsecase := usecase.NewReferenceUsecase(referenceRepository)
	referenceController := controller.NewReferenceController(referenceUsecase)

	e.GET("/articles/:id/references", referenceController.GetReferencesByArticleID)
	e.POST("/articles/:id/references", referenceController.PostReference)
	e.PATCH("/references/:id", referenceController.PatchReference)
	e.DELETE("/references/:id", referenceController.DeleteReference)

	articleRepository := repository.NewArticleRepository(db)
	articleUsecase := usecase.NewArticleUsecase(articleRepository)
	articleController := controller.NewArticleController(articleUsecase)

	e.GET("/articles", articleController.GetAllArticles)
	e.GET("/articles/:id", articleController.GetArticleByID)
	e.POST("/articles", articleController.PostArticle)
	e.PATCH("/articles/:id", articleController.PatchArticle)
	e.DELETE("/articles/:id", articleController.DeleteArticle)

	tagRepository := repository.NewTagRepository(db)
	tagUsecase := usecase.NewTagUsecase(tagRepository)
	tagController := controller.NewTagController(tagUsecase)

	e.GET("/tags", tagController.GetAllTags)
	e.GET("/tags/:id", tagController.GetTagByID)
	e.POST("/tags", tagController.PostTag)
	e.PATCH("/tags/:id", tagController.PatchTag)
	e.DELETE("/tags/:id", tagController.DeleteTag)
}
