import StringManipulator from 'src/database/stringManipulation';

const date = new Date();
const stringManipulator = new StringManipulator();

export default function dateTime() {
  this.getCurrentDateTime = function getCurrentDateTime() {
    const year = date.getFullYear();
    const month = stringManipulator.stringDateTime00Format(date.getMonth());
    const day = stringManipulator.stringDateTime00Format(date.getDate());
    const hour = stringManipulator.stringDateTime00Format(date.getHours());
    const minute = stringManipulator.stringDateTime00Format(date.getMinutes());
    const second = stringManipulator.stringDateTime00Format(date.getSeconds());

    return stringManipulator.stringConcat(year, '.', month, '.', day, ' ', hour, ':', minute, ':', second);
  };

  this.getCurrentLongTime = function getCurrentLongTime() {
    return date.getTime();
  };
}
