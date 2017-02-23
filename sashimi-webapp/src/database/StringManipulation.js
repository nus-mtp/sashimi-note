
export default function StringManipulation() {
  this.stringConcat = function stringConcat(...stringToConcat) {
    return stringToConcat.join('');
  };

}
