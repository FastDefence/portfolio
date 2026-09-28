package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

type ImageRepository interface {
	Upload(path string, file multipart.File, fileHeader *multipart.FileHeader) error
	List(directoryPath string) ([]string, error)
	Delete(path string) error
}

type imageRepository struct {
	filerInternalURL string
	httpClient       *http.Client
}

func NewImageRepository(filerInternalURL string) ImageRepository {
	return &imageRepository{
		filerInternalURL: strings.TrimRight(filerInternalURL, "/"),
		httpClient:       &http.Client{},
	}
}

func (r *imageRepository) Upload(path string, file multipart.File, fileHeader *multipart.FileHeader) error {
	var body bytes.Buffer

	writer := multipart.NewWriter(&body)

	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return err
	}

	if _, err := io.Copy(part, file); err != nil {
		return err
	}

	if err := writer.Close(); err != nil {
		return err
	}

	uploadURL := r.filerInternalURL + path

	request, err := http.NewRequest(http.MethodPost, uploadURL, &body)
	if err != nil {
		return err
	}

	request.Header.Set("Content-Type", writer.FormDataContentType())

	response, err := r.httpClient.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(response.Body)
		return fmt.Errorf("failed to upload image: status=%d body=%s", response.StatusCode, string(responseBody))
	}

	return nil
}

func (r *imageRepository) List(directoryPath string) ([]string, error) {
	listURL := r.filerInternalURL + directoryPath + "?pretty=y"

	request, err := http.NewRequest(http.MethodGet, listURL, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Set("Accept", "application/json")

	response, err := r.httpClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		return []string{}, nil
	}

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(response.Body)
		return nil, fmt.Errorf("failed to list images: status=%d body=%s", response.StatusCode, string(responseBody))
	}

	responseBody, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	var filerResponse struct {
		Entries []struct {
			FullPath    string `json:"FullPath"`
			Name        string `json:"Name"`
			IsDirectory bool   `json:"IsDirectory"`
		} `json:"Entries"`
	}

	if err := json.Unmarshal(responseBody, &filerResponse); err != nil {
		return nil, fmt.Errorf("failed to decode filer response: %w body=%s", err, string(responseBody))
	}

	names := make([]string, 0, len(filerResponse.Entries))

	for _, entry := range filerResponse.Entries {
		if entry.IsDirectory {
			continue
		}

		if entry.Name != "" {
			names = append(names, entry.Name)
			continue
		}

		if entry.FullPath != "" {
			parts := strings.Split(entry.FullPath, "/")
			names = append(names, parts[len(parts)-1])
		}
	}

	return names, nil
}

func (r *imageRepository) Delete(path string) error {
	deleteURL := r.filerInternalURL + path

	request, err := http.NewRequest(http.MethodDelete, deleteURL, nil)
	if err != nil {
		return err
	}

	response, err := r.httpClient.Do(request)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		return nil
	}

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(response.Body)
		return fmt.Errorf("failed to delete image: status=%d body=%s", response.StatusCode, string(responseBody))
	}

	return nil
}
