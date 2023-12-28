export function generateArrayOfYears(length) {
  var max = new Date().getFullYear();
  var min = max - length;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}
