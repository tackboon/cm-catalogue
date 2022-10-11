package file

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"
)

// Remove all contents in the directory
func RemoveContents(dir string) error {
	d, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer d.Close()

	names, err := d.Readdirnames(-1)
	if err != nil {
		return err
	}

	for _, name := range names {
		err = os.RemoveAll(filepath.Join(dir, name))
		if err != nil {
			return err
		}
	}

	return nil
}

func Zip(src string, w io.Writer) error {
	zipWriter := zip.NewWriter(w)
	defer zipWriter.Close()

	buf := make([]byte, 16*1024)
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Set relative path of a file as the header name
		p, err := filepath.Rel(filepath.Dir(src), path)
		if err != nil {
			return err
		}
		if info.IsDir() {
			p += "/"
		}

		f, err := zipWriter.Create(p)
		if err != nil {
			return err
		}

		reader, err := os.OpenFile(path, os.O_RDONLY, 0666)
		if err != nil {
			return err
		}
		defer reader.Close()

		for {
			n, err := reader.Read(buf)
			f.Write(buf[:n])
			if err != nil {
				break
			}
		}

		return nil
	})
}
