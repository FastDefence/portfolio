package usecase

import (
	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

type TagUsecase interface {
	GetAllTags() ([]domain.Tag, error)
	GetTagByID(tagID int) (*domain.Tag, error)
	PostTag(request domain.CreateTagRequest) (*domain.Tag, error)
	PatchTag(tagID int, request domain.UpdateTagRequest) (*domain.Tag, error)
	DeleteTag(tagID int) (*domain.DeleteTagResponse, error)
}

type tagUsecase struct {
	tagRepository repository.TagRepository
}

func NewTagUsecase(tagRepository repository.TagRepository) TagUsecase {
	return &tagUsecase{
		tagRepository: tagRepository,
	}
}

func (usecase *tagUsecase) GetAllTags() ([]domain.Tag, error) {
	return usecase.tagRepository.FindAllTags()
}

func (usecase *tagUsecase) GetTagByID(tagID int) (*domain.Tag, error) {
	return usecase.tagRepository.FindTagByID(tagID)
}

func (usecase *tagUsecase) PostTag(request domain.CreateTagRequest) (*domain.Tag, error) {
	return usecase.tagRepository.CreateTag(request)
}

func (usecase *tagUsecase) PatchTag(tagID int, request domain.UpdateTagRequest) (*domain.Tag, error) {
	return usecase.tagRepository.UpdateTag(tagID, request)
}

func (usecase *tagUsecase) DeleteTag(tagID int) (*domain.DeleteTagResponse, error) {
	err := usecase.tagRepository.DeleteTag(tagID)
	if err != nil {
		return nil, err
	}

	return &domain.DeleteTagResponse{
		ID:      tagID,
		Message: "tag deleted",
	}, nil
}
