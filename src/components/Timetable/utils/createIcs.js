import ical from "ical-generator";
import moment from "moment";

/**
 * Tìm thứ học (dựa vào dữ liệu từ xls)
 * @param {string} day
 * @returns {{num: number, str: string}}
 */
const findDay = (day) => {
  const map = {
    2: {
      num: 1,
      str: "MO",
    },
    3: {
      num: 2,
      str: "TU",
    },
    4: {
      num: 3,
      str: "WE",
    },
    5: {
      num: 4,
      str: "TH",
    },
    6: {
      num: 5,
      str: "FR",
    },
    7: {
      num: 6,
      str: "SA",
    },
    CN: {
      num: 0,
      str: "SU",
    },
  };
  return map[day];
};

/**
 * Tạo mô tả cho sự kiện
 * @param {object} object Dữ liệu môn học
 * @returns {string} Mô tả môn học
 */
const createDesc = ({
  id,
  subject,
  class: className,
  teacher,
  lesson,
  location,
  studyTime,
}) => {
  const lineData = (title, value) => `<b>${title}:</b> ${value}<br>`;

  let description = "";
  description += lineData("Mã học phần", id);
  description += lineData("Tên học phần", subject);
  description += lineData("Lớp học phần", className);
  description += lineData("Giáo viên giảng dạy", teacher);
  description += lineData("Tiết học", lesson);
  description += lineData("Phòng học", location);
  description += lineData("Thời gian học", studyTime);
  description += lineData(
    "Trang chủ",
    `<a href="https://nihta-cal.netlify.app" id="ow4
  312" __is_owner="true">https://nihta-cal.netlify.app</a>`
  );

  return description;
};

/**
 * Tìm thời gian bắt đầu và kết thúc mỗi tiết
 * @param {number} lesson Tiết học
 * @param {boolean} isSummer
 * @return {{start: string, end: string}} Thời gian bắt đầu và kết thúc của tiết lesson
 */
const lessonToTime = (lesson, isSummer = true) => {
  // Giờ mùa hè
  const summer = [
    ["06:30", "07:20"],
    ["07:25", "08:15"],
    ["08:20", "09:10"],
    ["09:15", "10:05"],
    ["10:10", "11:00"],
    ["13:30", "14:20"],
    ["14:25", "15:15"],
    ["15:20", "16:10"],
    ["16:15", "17:05"],
    ["17:10", "18:00"],
    ["18:05", "18:55"],
  ];
  // Giờ mùa đông
  const winter = [
    ["07:00", "07:50"],
    ["07:55", "08:45"],
    ["08:50", "09:40"],
    ["09:45", "10:35"],
    ["10:40", "11:30"],
    ["13:00", "13:50"],
    ["13:55", "14:45"],
    ["14:50", "15:40"],
    ["15:45", "16:35"],
    ["16:40", "17:30"],
    ["17:35", "18:25"],
  ];

  const map = isSummer ? summer : winter;

  return {
    start: map[lesson - 1][0],
    end: map[lesson - 1][1],
  };
};

/**
 * Tìm ngày thứ day đầu tiên kể từ ngày studyTimeStart
 * @param {string} studyTimeStart Ngày bắt đầu tìm
 * @param {number} day Thứ cần tìm
 * @returns {string} Kết quả dạng 'YYYY-MM-DD'
 */
const findDayStart = (studyTimeStart, day) => {
  const mmStudyTimeStart = moment(studyTimeStart);

  while (mmStudyTimeStart.day() !== day) {
    mmStudyTimeStart.add(1, "day");
  }

  return mmStudyTimeStart.format("YYYY-MM-DD");
};

/**
 * Tìm thời gian bắt đầu và kết thúc sự kiện
 * @param {string} dateEvent - Ngày học
 * @param {string} lesson - Các tiết học
 * @param {boolean} isSummer
 * @returns {{start: moment, end: moment}}
 */
const findTimeStartEndEvent = (dateEvent, lesson, isSummer) => {
  const lessons = lesson.split(",");
  const lessonStart = lessons[0];
  const lessonEnd = lessons[lessons.length - 1];

  const timeEventStart = lessonToTime(lessonStart, isSummer).start;
  const timeEventEnd = lessonToTime(lessonEnd, isSummer).end;

  return {
    start: `${dateEvent}T${timeEventStart}:00`,
    end: `${dateEvent}T${timeEventEnd}:00`,
  };
};

/**
 *
 * @param {array} dataTimeTable Dữ liệu thời khóa biểu phân tích từ xls
 * @param {boolean} isSummer
 * @returns {string} string ics
 */
const createIcs = (dataTimeTable, isSummer = true) => {
  // Khởi tạo lịch
  const cal = ical({
    prodId: {
      company: "Nihta",
      product: "Nihta Calendar",
      language: "EN",
    },
    domain: "https://nihta-cal.netlify.app",
    name: "Thời khóa biểu",
    description: "Thời khóa biểu",
    scale: "GREGORIAN",
    timezone: "Asia/Ho_Chi_Minh",
    method: "PUBLISH",
  });

  // Thêm sự kiện
  dataTimeTable.forEach((subject) => {
    const { day, subject: summary, location, studyTime, lesson } = subject;

    // Ngày thứ 2 của tuần đầu tiên học và ngày chủ nhật của tuần cuối cùng học
    const [studyTimeStart, studyTimeEnd] = studyTime
      .split("-")
      .map((elm) => elm.split("/").reverse().join("-"));

    // Tìm thứ học
    const byDay = [findDay(day).str];

    // Tìm ngày bắt đầu của môn
    const dateEventStart = findDayStart(studyTimeStart, findDay(day).num);

    // Tìm thời gian bắt đầu và kết thúc môn học
    const { start, end } = findTimeStartEndEvent(
      dateEventStart,
      lesson,
      isSummer
    );

    cal.createEvent({
      start,
      end,
      summary,
      description: createDesc(subject),
      location,
      timezone: "Asia/Ho_Chi_Minh",
      repeating: {
        freq: "WEEKLY",
        wkst: "MO",
        until: `${studyTimeEnd}T23:59:59Z`,
        byDay,
      },
      alarms: [
        {
          type: "display",
          trigger: 1800,
        },
        {
          type: "display",
          trigger: 3600,
        },
      ],
    });
  });

  return cal.toString();
};

export { createIcs };
