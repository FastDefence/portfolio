package usecase

import (
	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

type DailyUsecase interface {
	GetAllDailies(keyword string) ([]domain.Daily, error)
	GetDailyByID(dailyID int) (*domain.Daily, error)
	PostDaily(request domain.CreateDailyRequest) (*domain.Daily, error)
	PatchDaily(dailyID int, request domain.UpdateDailyRequest) (*domain.Daily, error)
	DeleteDaily(dailyID int) (*domain.DeleteDailyResponse, error)
}

type dailyUsecase struct {
	dailyRepository repository.DailyRepository
}

func NewDailyUsecase(dailyRepository repository.DailyRepository) DailyUsecase {
	return &dailyUsecase{dailyRepository: dailyRepository}
}

func (usecase *dailyUsecase) GetAllDailies(keyword string) ([]domain.Daily, error) {
	return usecase.dailyRepository.FindAllDailies(keyword)
}

func (usecase *dailyUsecase) GetDailyByID(dailyID int) (*domain.Daily, error) {
	return usecase.dailyRepository.FindDailyByID(dailyID)
}

func (usecase *dailyUsecase) PostDaily(request domain.CreateDailyRequest) (*domain.Daily, error) {
	return usecase.dailyRepository.CreateDaily(request)
}

func (usecase *dailyUsecase) PatchDaily(dailyID int, request domain.UpdateDailyRequest) (*domain.Daily, error) {
	return usecase.dailyRepository.UpdateDaily(dailyID, request)
}

func (usecase *dailyUsecase) DeleteDaily(dailyID int) (*domain.DeleteDailyResponse, error) {
	if err := usecase.dailyRepository.DeleteDaily(dailyID); err != nil {
		return nil, err
	}

	return &domain.DeleteDailyResponse{ID: dailyID, Message: "daily deleted"}, nil
}
