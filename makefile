IMG_REF_FOLDER := assets/ref
IMG_FOLDER := assets

.PHONY: all images

all: images

images: $(IMG_REF_FOLDER)/*
	for f in $(IMG_REF_FOLDER)/*; do convert $$f -resize 25% $(IMG_FOLDER)/high/$$(basename $$f); done
	for f in $(IMG_REF_FOLDER)/*; do convert $$f -resize 10% $(IMG_FOLDER)/low/$$(basename $$f); done