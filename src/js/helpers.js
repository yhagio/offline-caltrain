/**
 * Helper functions
 */

function hhmmssToSeconds(time) {
  const t = time.split(':');
  const hour = parseInt(t[0], 10);
  const minute = parseInt(t[1], 10);
  const second = parseInt(t[2], 10);

  return (hour * 60 * 60) + (minute * 60) + second;
}

function getDuration(departureTime, arrivalTime) {
  const dSec = hhmmssToSeconds(departureTime);
  const aSec = hhmmssToSeconds(arrivalTime);
  const duration = (aSec - dSec) / 60;

  return `${duration.toString()} min`;
}

function sortSchedules(a, b) {
  if (hhmmssToSeconds(a.departure) > hhmmssToSeconds(b.departure)) {
    return 1;
  } else if (hhmmssToSeconds(a.departure) < hhmmssToSeconds(b.departure)) {
    return -1;
  }
  return 0;
}

// Remove starting & ending quotation marks of a string if exists
function removeQuotations(text) {
  if (text.startsWith('"')) {
    return text.slice(1, text.length - 1);
  }
  return text;
}

// Determine today is weekday, saturday, or sunday
function whatDayIsToday(date) {
  switch (date.getDay()) {
    case 0:
      return 'sunday';
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    default:
      return '';
  }
}
// Format date to yyyymmdd
function formatDate(date) {
  let month = '';
  let day = '';

  const year = date.getFullYear().toString();

  if (date.getMonth() < 9) {
    month = `0${parseInt(date.getMonth() + 1, 10).toString()}`;
  } else {
    month = parseInt(date.getMonth() + 1, 10).toString();
  }

  if (date.getDate() < 10) {
    day = `0${date.getDate()}`;
  } else {
    day = date.getDate().toString();
  }

  return year + month + day;
}

export {
  getDuration,
  sortSchedules,
  hhmmssToSeconds,
  removeQuotations,
  whatDayIsToday,
  formatDate,
};
