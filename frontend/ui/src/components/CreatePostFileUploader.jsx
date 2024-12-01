import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF", "AVIF"];

function DragDrop({ setFile, formName }) {
  const handleChange = (file) => {
    console.log(file);
    setFile(file);
  };
  return (
    <>
      <FileUploader handleChange={handleChange} name={formName ? formName : ""} types={fileTypes} multiple={false} label="Sube una foto para el post" hoverTitle="Sube una foto para el post" uploadedLabel="Carga exitosa!" />
    </>
  );
}

export default DragDrop;
