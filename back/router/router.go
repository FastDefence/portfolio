package router

import (
	"database/sql"

	"github.com/labstack/echo/v4"
)

func SetupRouter(e *echo.Echo, db *sql.DB) {
	e.GET("/", func(c echo.Context) error {
		return c.JSON(200, map[string]string{
			"message": "api server is running",
		})
	})

}
