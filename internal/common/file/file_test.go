package file_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/pkg/profile"
	"github.com/tackboon/cm-catalogue/internal/common/file"
)

func TestRemoveContents(t *testing.T) {
	// create directory
	dirPath := "test-dir"
	err := os.MkdirAll(dirPath, 0777)
	if err != nil {
		t.Errorf("Failed to create directories: %v", err)
	}

	// create dummy files
	filepath := fmt.Sprintf("%s/test-file", dirPath)
	f, err := os.Create(filepath)
	if err != nil {
		t.Errorf("Failed to create file: %v", err)
	}
	defer f.Close()

	// delete contents in directory
	err = file.RemoveContents(dirPath)
	if err != nil {
		t.Errorf("Failed to remove contents: %v", err)
	}

	// check if file exist
	if _, err = os.Stat(filepath); !os.IsNotExist(err) {
		t.Errorf("Content not remove!")
	}

	// remove directory
	err = os.Remove(dirPath)
	if err != nil {
		t.Errorf("Failed to remove directory: %v", err)
	}
}

func TestZip(t *testing.T) {
	defer profile.Start(profile.MemProfile, profile.ProfilePath("tmp")).Stop()

	dstPath := "tmp/file-data.zip"
	srcPath := "tmp/file-data"

	f, err := os.Create(dstPath)
	if err != nil {
		t.Errorf("Failed to create zip file")
	}
	defer f.Close()

	// zip directory
	err = file.Zip(srcPath, f)
	if err != nil {
		t.Errorf("Failed to zip directory: %v", err)
	}
}
