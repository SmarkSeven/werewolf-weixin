const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function getDateDiff(dateTimeStamp, isUTC) {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // const month = day * 30;
  const today = new Date();
  const now = today.getTime();
  const diffValue = now - dateTimeStamp;
  if (diffValue < 0) { return; }
  // const months = diffValue / month;
  // const weeks = diffValue / (7 * day);
  const days = diffValue / day;
  const hours = diffValue / hour;
  const mins = diffValue / minute;
  let result = '';
  // if (months >= 1) {
  //   result = `${Math.floor(months)}月前`;
  // }else if (weeks >= 1) {
    // result = `${Math.floor(months)}周前`;
  // }
  if (isUTC) {
    return `${today.getDate()} ${monthArr[today.getMonth()]}.${today.getFullYear()}`;
  } else if (days > 3) {
    result = `${today.getDate()} ${monthArr[today.getMonth()]}.${today.getFullYear()}`;
  } else if (days >= 1) {
    result = `${parseInt(`${days}`, 10)}天前`;
  } else if (hours >= 1) {
    result = `${Math.floor(hours)}小时前`;
  } else if (mins >= 1) {
    result = `${Math.floor(mins)}分钟前`;
  } else {
    result = '今天';
  }
  return result;
}
