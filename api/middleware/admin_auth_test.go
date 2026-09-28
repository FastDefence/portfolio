package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
)

func TestAdminAPIKeyAuth(t *testing.T) {
	tests := []struct {
		name        string
		expectedKey string
		requestKey  string
		wantStatus  int
	}{
		{
			name:        "accepts the configured key",
			expectedKey: "configured-secret",
			requestKey:  "configured-secret",
			wantStatus:  http.StatusNoContent,
		},
		{
			name:        "rejects a missing key",
			expectedKey: "configured-secret",
			wantStatus:  http.StatusUnauthorized,
		},
		{
			name:        "rejects an incorrect key",
			expectedKey: "configured-secret",
			requestKey:  "wrong-secret",
			wantStatus:  http.StatusUnauthorized,
		},
		{
			name:       "fails closed when the server key is not configured",
			requestKey: "any-secret",
			wantStatus: http.StatusServiceUnavailable,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			e := echo.New()
			handler := AdminAPIKeyAuth(test.expectedKey)(func(ctx echo.Context) error {
				return ctx.NoContent(http.StatusNoContent)
			})

			request := httptest.NewRequest(http.MethodPost, "/articles", nil)
			if test.requestKey != "" {
				request.Header.Set(AdminAPIKeyHeader, test.requestKey)
			}
			recorder := httptest.NewRecorder()
			ctx := e.NewContext(request, recorder)

			err := handler(ctx)
			if err != nil {
				e.HTTPErrorHandler(err, ctx)
			}

			if recorder.Code != test.wantStatus {
				t.Fatalf("expected status %d, got %d", test.wantStatus, recorder.Code)
			}
		})
	}
}
