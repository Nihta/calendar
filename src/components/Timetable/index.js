import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createIcs, parserXls } from "./utils";
import fileDownload from "js-file-download";
import "./index.css";
import { Row, Col, Button } from "react-bootstrap";

function Timetable() {
  const [dataTimetable, setDataTimetable] = useState(undefined);

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("Hủy đọc file");
      reader.onerror = () => console.log("Đọc file thất bại");

      reader.onload = () => {
        const binaryStr = reader.result;

        // const dataTimetable = parserXls(binaryStr);
        setDataTimetable(parserXls(binaryStr));
      };

      reader.readAsBinaryString(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop,
  });

  const downloadCal = (isSummer) => {
    const contentIcs = createIcs(dataTimetable, isSummer);

    // debug
    console.log(contentIcs);
    // return;

    fileDownload(
      contentIcs,
      isSummer ? "timetable-summer.ics" : "timetable-winter.ics"
    );
  };

  return (
    <Row>
      <Col lg={12}>
        <section className="container">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p
              style={{
                textAlign: "center",
              }}
            >
              Kéo thả hoặc click vào đây để chọn tệp
              <br />
              File xls hiển thị theo ngày học (cmcsoft)
            </p>
          </div>
        </section>
      </Col>
      <Col lg={12}>
        {dataTimetable && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px",
            }}
          >
            <div className="download">
              <Button variant="primary" onClick={() => downloadCal(true)}>
                Mùa hè
              </Button>
            </div>
            <div className="download">
              <Button variant="primary" onClick={() => downloadCal(false)}>
                Mùa đông
              </Button>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default Timetable;
