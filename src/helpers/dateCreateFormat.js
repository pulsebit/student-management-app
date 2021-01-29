export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const monthsPref = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const dateFormatMonthsPref = (date) => {
  const newDate = new Date(date)
  return `${monthsPref[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`
}

export default function(date) {
  const newDate = new Date(date)
  return `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getMilliseconds()}`
}