import { useRef, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { useController } from "react-hook-form";
import { asFileList } from "../analysis/analysis-form.utils";

export default function FileInput(props) {
  const {
    field: { value, name, ref, onChange, onBlur },
  } = useController(props);
  const inputRef = useRef();
  const fileList = asFileList(value);

  const files = Array.from(fileList);
  useEffect(() => {
    ref(inputRef.current);
    if (inputRef.current) {
      inputRef.current.files = fileList;
    }
  }, [fileList, ref]);

  function handleChange(event) {
    console.log(value)
    console.log(fileList)
    onChange(event.target.files);
  }

  function removeFile(index) {
    const remainingFiles = files.filter((f, i) => i !== index);
    onChange(asFileList(remainingFiles));
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
      />
      {props.multiple && (
        <ListGroup>
          {files.map((file, index) => (
            <ListGroup.Item
              className="list-group-item-action d-flex justify-content-between align-items-center"
              key={index}>
              <small className="text-muted">{file.name}</small>
              <Button size="sm" variant="outline-danger" className="border-0" onClick={(ev) => removeFile(index)}>
                <i className="bi bi-x-lg" role="img" aria-label="Remove File Icon"></i>
                <span className="visually-hidden">Remove File</span>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
