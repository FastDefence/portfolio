package router

import (
	"database/sql"
	"os"

	"portfolio-back/core/controller"
	"portfolio-back/core/repository"
	"portfolio-back/core/usecase"
	appmiddleware "portfolio-back/middleware"

	"github.com/labstack/echo/v4"
)

func SetupRouter(e *echo.Echo, db *sql.DB) {
	adminOnly := appmiddleware.AdminAPIKeyAuth(os.Getenv("ADMIN_API_KEY"))

	articleTagRepository := repository.NewArticleTagRepository(db)
	articleTagUsecase := usecase.NewArticleTagUsecase(articleTagRepository)
	articleTagController := controller.NewArticleTagController(articleTagUsecase)

	e.GET("/articles/:id/tags", articleTagController.GetArticleTags)
	e.PUT("/articles/:id/tags", articleTagController.PutArticleTags, adminOnly)

	referenceRepository := repository.NewReferenceRepository(db)
	referenceUsecase := usecase.NewReferenceUsecase(referenceRepository)
	referenceController := controller.NewReferenceController(referenceUsecase)

	e.GET("/articles/:id/references", referenceController.GetReferencesByArticleID)
	e.POST("/articles/:id/references", referenceController.PostReference, adminOnly)
	e.PATCH("/references/:id", referenceController.PatchReference, adminOnly)
	e.DELETE("/references/:id", referenceController.DeleteReference, adminOnly)

	articleRepository := repository.NewArticleRepository(db)
	articleUsecase := usecase.NewArticleUsecase(articleRepository)
	articleController := controller.NewArticleController(articleUsecase)

	e.GET("/articles", articleController.GetAllArticles)
	e.GET("/articles/:id", articleController.GetArticleByID)
	e.POST("/articles", articleController.PostArticle, adminOnly)
	e.PATCH("/articles/:id", articleController.PatchArticle, adminOnly)
	e.DELETE("/articles/:id", articleController.DeleteArticle, adminOnly)

	tagRepository := repository.NewTagRepository(db)
	tagUsecase := usecase.NewTagUsecase(tagRepository)
	tagController := controller.NewTagController(tagUsecase)

	e.GET("/tags", tagController.GetAllTags)
	e.GET("/tags/:id", tagController.GetTagByID)
	e.POST("/tags", tagController.PostTag, adminOnly)
	e.PATCH("/tags/:id", tagController.PatchTag, adminOnly)
	e.DELETE("/tags/:id", tagController.DeleteTag, adminOnly)

	imageRepository := repository.NewImageRepository(
		getEnv("SEAWEED_FILER_INTERNAL_URL", "http://seaweed-filer:8888"),
	)
	imageUsecase := usecase.NewImageUsecase(
		imageRepository,
		getEnv("IMAGE_PUBLIC_BASE_URL", "http://localhost:8888"),
	)
	imageController := controller.NewImageController(imageUsecase)

	e.POST("/articles/:id/images", imageController.PostArticleImage, adminOnly)
	e.GET("/articles/:id/images", imageController.GetArticleImages)
	e.DELETE("/articles/:id/images/:name", imageController.DeleteArticleImage, adminOnly)
}

func getEnv(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}
