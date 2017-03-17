/**
 * Unit conversion helper
 * https://www.w3.org/Style/Examples/007/units.en.html
 * |  1.00 in |
 * |  2.54 cm |
 * | 25.40 mm |
 * | 96.00 px |
 * | 72.00 pt |
 * |  6.00 pc |
 *
 * 1 centimeters = pixels * 2.54 / 96
 */

const inchTable = {
  in: 1,
  cm: 2.54,
  mm: 25.4,
  px: 96,
  pt: 72,
  pc: 6
};

function getUnitType(input) {
  return input.trim().slice(-2);
}

function getUnitInch(value) {
  const unitType = getUnitType(value);
  if (!unitType) {
    throw new Error('Invalid unit type');
  }

  const unitValue = Number.parseFloat(value, 10);
  if (Number.isNaN(unitValue)) {
    throw new Error(`Cannot parse "${value}" into a number`);
  }

  return unitValue / inchTable[unitType];
}

export default {
  /**
   * Convert a number of a given unit to another
   * Usage: get('50cm', 'px')
   *
   * @param {string} value
   * @param {string} targetUnit
   * @param {boolean} shouldPrintUnit - optional, default to true
   */
  get(value, targetUnit, shouldPrintUnit) {
    if (shouldPrintUnit == null) {
      shouldPrintUnit = true;
    }

    if (!value || !targetUnit) {
      // if either one of the param is missing, throw error
      throw new Error('Input value parameter is empty');
    }

    const unitValue = getUnitInch(value);
    const result = unitValue * inchTable[targetUnit];

    if (Number.isNaN(result)) {
      throw new Error(`Cannot parse "${result}" into a number`);
    }

    if (shouldPrintUnit) {
      return `${result}${targetUnit}`;
    } else {
      return parseFloat(result);
    }
  }
};
