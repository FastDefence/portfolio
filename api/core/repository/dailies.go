package repository

import (
	"database/sql"
	"errors"

	"portfolio-back/core/domain"
)

type DailyRepository interface {
	FindAllDailies(keyword string) ([]domain.Daily, error)
	FindDailyByID(dailyID int) (*domain.Daily, error)
	CreateDaily(request domain.CreateDailyRequest) (*domain.Daily, error)
	UpdateDaily(dailyID int, request domain.UpdateDailyRequest) (*domain.Daily, error)
	DeleteDaily(dailyID int) error
}

type dailyRepository struct {
	posts *postRepository
}

func NewDailyRepository(db *sql.DB) DailyRepository {
	return &dailyRepository{posts: newPostRepository(db)}
}

func (repository *dailyRepository) FindAllDailies(keyword string) ([]domain.Daily, error) {
	return repository.posts.findAll(postKindDaily, keyword)
}

func (repository *dailyRepository) FindDailyByID(dailyID int) (*domain.Daily, error) {
	daily, err := repository.posts.findByID(postKindDaily, dailyID)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrDailyNotFound
	}
	return daily, err
}

func (repository *dailyRepository) CreateDaily(request domain.CreateDailyRequest) (*domain.Daily, error) {
	return repository.posts.create(postKindDaily, request)
}

func (repository *dailyRepository) UpdateDaily(dailyID int, request domain.UpdateDailyRequest) (*domain.Daily, error) {
	daily, err := repository.posts.update(postKindDaily, dailyID, request)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrDailyNotFound
	}
	return daily, err
}

func (repository *dailyRepository) DeleteDaily(dailyID int) error {
	err := repository.posts.delete(postKindDaily, dailyID)
	if errors.Is(err, sql.ErrNoRows) {
		return domain.ErrDailyNotFound
	}
	return err
}
