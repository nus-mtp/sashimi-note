
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

  this.resolveSQLInjections = function resolveSQLInjections(stringToReplace) {
    return stringToReplace.replace(/["\\]/g, (char) => {
      switch (char) {
        case '"':
        case '\\':
          return `\\${char}`; // prepends a backslash to backslash, percent,
                              // and double/single quotes
        default:
          return char;
      }
    });
  };

  this.revertSQLInjections = function revertSQLInjections(stringToReplace) {
    stringToReplace = this.replaceAll(stringToReplace, '\\\\"', '"');
    stringToReplace = this.replaceAll(stringToReplace, '\\\\\\\\', '\\');
    return stringToReplace;
  };

  this.getPreviousPath = function getPreviousPath(fullPath, lastFolderName) {
    const lengthOfExtraCurrentFolder = lastFolderName.length + 1; // extra slash
    return fullPath.substring(0, fullPath.length - lengthOfExtraCurrentFolder);
  };
}
