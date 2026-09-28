package usecase

import (
	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

type ReferenceUsecase interface {
	GetReferencesByArticleID(articleID int) ([]domain.Reference, error)
	PostReference(articleID int, request domain.CreateReferenceRequest) (*domain.Reference, error)
	PatchReference(referenceID int, request domain.UpdateReferenceRequest) (*domain.Reference, error)
	DeleteReference(referenceID int) (*domain.DeleteReferenceResponse, error)
}

type referenceUsecase struct {
	referenceRepository repository.ReferenceRepository
}

func NewReferenceUsecase(referenceRepository repository.ReferenceRepository) ReferenceUsecase {
	return &referenceUsecase{
		referenceRepository: referenceRepository,
	}
}

func (usecase *referenceUsecase) GetReferencesByArticleID(articleID int) ([]domain.Reference, error) {
	return usecase.referenceRepository.FindReferencesByArticleID(articleID)
}

func (usecase *referenceUsecase) PostReference(articleID int, request domain.CreateReferenceRequest) (*domain.Reference, error) {
	return usecase.referenceRepository.CreateReference(articleID, request)
}

func (usecase *referenceUsecase) PatchReference(referenceID int, request domain.UpdateReferenceRequest) (*domain.Reference, error) {
	return usecase.referenceRepository.UpdateReference(referenceID, request)
}

func (usecase *referenceUsecase) DeleteReference(referenceID int) (*domain.DeleteReferenceResponse, error) {
	err := usecase.referenceRepository.DeleteReference(referenceID)
	if err != nil {
		return nil, err
	}

	return &domain.DeleteReferenceResponse{
		ID:      referenceID,
		Message: "reference deleted",
	}, nil
}
