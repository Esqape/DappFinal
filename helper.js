export const NAME_CHAR_LIMIT = 50;
export const DESC_CHAR_LIMIT = 400;

export function fieldsAreValid(fields) {
  let { deanAddress,viceDeanAddress,academicAffairsAddress,type,
    name,institute,certificateName,description,date } = fields;
  let day, month, year;
  // Check all fields are filled out
  if (!(deanAddress && viceDeanAddress && academicAffairsAddress && type && name && institute && certificateName && description && date)) {
    return 'Make sure all fields are filled out';

    // return false;
  }

  [day, month, year] = (fields.date).split("-");
  // check date format is dd-mm-yyyy
  if ( !(parseInt(day) < 32 && parseInt(month) < 13 && parseInt(year) < 9999 && year.length == 4) ) {
    return 'Date format is: dd-mm-yyyy';
    // return false;
  }

  // Check names are under n chars
  if (!(name.length < NAME_CHAR_LIMIT && certificateName.length < NAME_CHAR_LIMIT)) {
    return 'Make sure Recipient name and Certificate name are under 50 characters';
    // return false;
  }
  // Check vows are under n chars
  if (!(description.length < DESC_CHAR_LIMIT)) {
    return 'Make sure the description is under 400 characters';
    // return false;
  }

  // console.log("All field inputs are valid");
  // Check vows are under XX chars
  return ''; 
}



// String to UTC EPOCH
export function dateToEpoch(date) {
  let day, month, year;
  [day, month, year] = (date).split("-");
  const dateEpoch = Date.UTC(year, month-1, day);
  return dateEpoch;
}

export function epochToDate(numString) {
  const date = new Date(parseInt(numString));
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateString = `${months[month]} ${day}, ${year}`;
  return dateString;
}