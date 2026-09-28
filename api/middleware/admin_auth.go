package middleware

import (
	"crypto/sha256"
	"crypto/subtle"
	"net/http"

	"github.com/labstack/echo/v4"
)

const AdminAPIKeyHeader = "X-Admin-Key"

func AdminAPIKeyAuth(expectedKey string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			if expectedKey == "" {
				return echo.NewHTTPError(
					http.StatusServiceUnavailable,
					"admin API authentication is not configured",
				)
			}

			expectedHash := sha256.Sum256([]byte(expectedKey))
			actualHash := sha256.Sum256([]byte(ctx.Request().Header.Get(AdminAPIKeyHeader)))

			if subtle.ConstantTimeCompare(actualHash[:], expectedHash[:]) != 1 {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid admin credentials")
			}

			return next(ctx)
		}
	}
}
