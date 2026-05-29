package usecase

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"regexp"
	"strings"

	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

type ImageUsecase interface {
	PostArticleImage(articleID string, name string, file multipart.File, fileHeader *multipart.FileHeader) (*domain.ImageResponse, error)
	GetArticleImages(articleID string) ([]domain.ImageResponse, error)
	DeleteArticleImage(articleID string, name string) error
}

type imageUsecase struct {
	imageRepository repository.ImageRepository
	publicBaseURL   string
}

func NewImageUsecase(imageRepository repository.ImageRepository, publicBaseURL string) ImageUsecase {
	return &imageUsecase{
		imageRepository: imageRepository,
		publicBaseURL:   strings.TrimRight(publicBaseURL, "/"),
	}
}

func (u *imageUsecase) PostArticleImage(articleID string, name string, file multipart.File, fileHeader *multipart.FileHeader) (*domain.ImageResponse, error) {
	if err := validateArticleID(articleID); err != nil {
		return nil, err
	}

	if err := validateImageName(name); err != nil {
		return nil, err
	}

	if err := validateImageContentType(fileHeader); err != nil {
		return nil, err
	}

	imagePath := buildImagePath("article", articleID, name)

	if err := u.imageRepository.Upload(imagePath, file, fileHeader); err != nil {
		return nil, err
	}

	imageResponse := u.buildImageResponse("article", articleID, name)

	return &imageResponse, nil
}

func (u *imageUsecase) GetArticleImages(articleID string) ([]domain.ImageResponse, error) {
	if err := validateArticleID(articleID); err != nil {
		return nil, err
	}

	directoryPath := fmt.Sprintf("/article/%s", articleID)

	names, err := u.imageRepository.List(directoryPath)
	if err != nil {
		return nil, err
	}

	imageResponses := make([]domain.ImageResponse, 0, len(names))

	for _, name := range names {
		if validateImageName(name) != nil {
			continue
		}

		imageResponses = append(imageResponses, u.buildImageResponse("article", articleID, name))
	}

	return imageResponses, nil
}

func (u *imageUsecase) DeleteArticleImage(articleID string, name string) error {
	if err := validateArticleID(articleID); err != nil {
		return err
	}

	if err := validateImageName(name); err != nil {
		return err
	}

	imagePath := buildImagePath("article", articleID, name)

	return u.imageRepository.Delete(imagePath)
}

func (u *imageUsecase) buildImageResponse(docType string, id string, name string) domain.ImageResponse {
	imagePath := buildImagePath(docType, id, name)
	imageURL := u.publicBaseURL + imagePath
	title := strings.TrimSuffix(name, filepath.Ext(name))

	return domain.ImageResponse{
		Name:     name,
		Path:     imagePath,
		URL:      imageURL,
		Markdown: fmt.Sprintf("![%s](%s \"%s\")", title, imageURL, title),
	}
}

func buildImagePath(docType string, id string, name string) string {
	return fmt.Sprintf("/%s/%s/%s", docType, id, name)
}

func validateArticleID(articleID string) error {
	if articleID == "" {
		return fmt.Errorf("article id is required")
	}

	pattern := regexp.MustCompile(`^[0-9A-Za-z_-]+$`)
	if !pattern.MatchString(articleID) {
		return fmt.Errorf("invalid article id")
	}

	return nil
}

func validateImageName(name string) error {
	if name == "" {
		return fmt.Errorf("name is required")
	}

	if strings.Contains(name, "/") || strings.Contains(name, "\\") {
		return fmt.Errorf("name must be file name only")
	}

	if strings.Contains(name, "..") {
		return fmt.Errorf("invalid image name")
	}

	pattern := regexp.MustCompile(`^[0-9A-Za-z_-]+\.(png|jpg|jpeg|webp|gif)$`)
	if !pattern.MatchString(strings.ToLower(name)) {
		return fmt.Errorf("unsupported image name")
	}

	return nil
}

func validateImageContentType(fileHeader *multipart.FileHeader) error {
	contentType := fileHeader.Header.Get("Content-Type")

	allowedContentTypes := map[string]bool{
		"image/png":  true,
		"image/jpeg": true,
		"image/webp": true,
		"image/gif":  true,
	}

	if !allowedContentTypes[contentType] {
		return fmt.Errorf("unsupported image content type")
	}

	const maxImageSize = 10 * 1024 * 1024

	if fileHeader.Size > maxImageSize {
		return fmt.Errorf("image size must be less than 10MB")
	}

	return nil
}
