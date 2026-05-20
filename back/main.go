package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"portfolio-back/router"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	_ = godotenv.Load()

	db, err := connectDBWithRetry()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://127.0.0.1:3000",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPatch,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
		},
	}))

	e.GET("/health", func(ctx echo.Context) error {
		return ctx.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	router.SetupRouter(e, db)

	port := getEnv("SERVER_PORT", "8080")

	if err := e.Start(":" + port); err != nil {
		log.Fatal(err)
	}
}

func connectDBWithRetry() (*sql.DB, error) {
	var db *sql.DB
	var err error

	for i := 0; i < 10; i++ {
		db, err = connectDB()
		if err == nil {
			return db, nil
		}

		log.Printf("failed to connect database. retrying... %d/10: %v", i+1, err)
		time.Sleep(3 * time.Second)
	}

	return nil, err
}

func connectDB() (*sql.DB, error) {
	user := getEnv("MYSQL_USER", "root")
	password := getEnv("MYSQL_PASSWORD", "password")
	host := getEnv("MYSQL_HOST", "mysql")
	port := getEnv("MYSQL_PORT", "3306")
	database := getEnv("MYSQL_DATABASE", "portfolio_db")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Asia%%2FTokyo", user, password, host, port, database)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func getEnv(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}
