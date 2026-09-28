package domain

type ImageResponse struct {
	Name     string `json:"name"`     // File name
	Path     string `json:"path"`     // Storage path, e.g. /article/1/1.png
	URL      string `json:"url"`      // Public URL
	Markdown string `json:"markdown"` // Markdown image syntax
}
