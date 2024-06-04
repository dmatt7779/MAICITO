import { DragEvent } from "react";

class Upload {
  DragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  DragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  Drop = (files: Array<File>) => {
    const reader = new FileReader();

    files.forEach((file) => {
      reader.onloadend = () => {
        console.log(reader.result);
      };

      reader.onerror = () => {
        console.error("There was an issue reading the file.");
      };
      reader.readAsDataURL(file);
      return reader;
    });
  };
}

export default new Upload();
