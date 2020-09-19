import xlsx from "xlsx";

/**
 * Phân tích dữ liệu từ file xls
 * @param {any} data
 */
function parserXls(data) {
  const sheetTimeTable = xlsx.read(data, { type: "binary" }).Sheets
    .ThoiKhoaBieuSV;

  const dataParser = [];
  for (let idx = 11; sheetTimeTable[`D${idx}`]; idx++) {
    dataParser.push({
      day: sheetTimeTable[`A${idx}`].v,
      id: sheetTimeTable[`B${idx}`].v,
      subject: sheetTimeTable[`D${idx}`].v,
      class: sheetTimeTable[`E${idx}`].v,
      teacher: sheetTimeTable[`H${idx}`].v,
      lesson: sheetTimeTable[`I${idx}`].v,
      location: sheetTimeTable[`J${idx}`].v,
      studyTime: sheetTimeTable[`K${idx}`].v,
    });
  }

  return dataParser;
}

export { parserXls };
