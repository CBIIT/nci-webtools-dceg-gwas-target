import { useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { useController } from "react-hook-form";
import { asFileList } from "../analysis/analysis-form.utils";

export default function FileInput(props) {
  const {
    field: { value, name, ref, onChange, onBlur },
    fieldState: { error },
  } = useController(props);
  const inputRef = useRef();
  const fileList = asFileList(value);

  const files = Array.from(fileList);
  useEffect(() => {
    ref(inputRef.current);
    if (inputRef.current && inputRef.current.files !== fileList) {
      inputRef.current.files = fileList;
    }
  }, [fileList, ref]);

  function handleChange(event) {
    const newFiles = event.target.files;
    onChange(newFiles);

    // Notify parent component
    if (props.onFileChange) {
      const filenames = Array.from(newFiles).map((f) => f.name);
      props.onFileChange(name, filenames, newFiles);
    }
  }

  function removeFile(index) {
    const remainingFiles = files.filter((f, i) => i !== index);
    const remainingFileList = asFileList(remainingFiles);
    onChange(remainingFileList);

    // Clear native input if no files remain
    if (remainingFiles.length === 0 && inputRef.current) {
      inputRef.current.value = "";
    }

    // Notify parent with updated files
    if (props.onFileChange) {
      const filenames = remainingFiles.map((f) => f.name);
      props.onFileChange(name, filenames, remainingFileList);
    }

    // Keep backward compatibility with onRemove
    if (props.onRemove) {
      props.onRemove(name, remainingFiles);
    }
  }

  return (
    <div className="form-control-list-group">
      <Form.Control
        type="file"
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        ref={inputRef}
        id={props.id}
        multiple={props.multiple}
        accept={props.accept}
        capture={props.capture}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
        required={props.required}
        isInvalid={!!error}
      />
      {props.multiple && (
        <ListGroup>
          {files.map((file, index) => (
            <ListGroup.Item
              className="list-group-item-action d-flex justify-content-between align-items-center"
              key={index}>
              <small className="text-muted text-break me-2" style={{ minWidth: 0 }}>
                {file.name}
              </small>
              <Button
                size="sm"
                variant="outline-danger"
                className="border-0 flex-shrink-0"
                onClick={(ev) => removeFile(index)}>
                <i className="bi bi-x-lg" role="img" aria-label="Remove File Icon"></i>
                <span className="visually-hidden">Remove File</span>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {!props.multiple && files.length > 0 && (
        <ListGroup>
          <ListGroup.Item className="list-group-item-action d-flex justify-content-between align-items-center">
            <small className="text-muted text-break me-2" style={{ minWidth: 0 }}>
              {files[0].name}
            </small>
            <Button
              size="sm"
              variant="outline-danger"
              className="border-0 flex-shrink-0"
              onClick={(ev) => removeFile(0)}>
              <i className="bi bi-x-lg" role="img" aria-label="Remove File Icon"></i>
              <span className="visually-hidden">Remove File</span>
            </Button>
          </ListGroup.Item>
        </ListGroup>
      )}
      {error && <Form.Text className="text-danger">{error.message}</Form.Text>}
    </div>
  );
}
