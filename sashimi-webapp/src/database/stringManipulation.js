
export default function stringManipulation() {
  this.stringConcat = function stringConcat(...stringToConcat) {
    return stringToConcat.join('');
  };

  this.stringDateTime00Format = function stringDateTime00Format(dateTimeNumber) {
    if (typeof dateTimeNumber == 'number') {
      if (dateTimeNumber < 10) {
        return this.stringConcat('0', dateTimeNumber);
      }
    }
    return dateTimeNumber;
  };

  this.replaceAll = function replaceAll(string, stringToReplace, replacement) {
    return string.replace(new RegExp(stringToReplace, 'g'), replacement);
  };
}
