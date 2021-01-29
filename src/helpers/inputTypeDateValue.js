export default function(date) {
  const newDate = new Date(date)
  return `${newDate.getFullYear()}-${(newDate.getMonth() + 1) < 10 ? '0'+ (newDate.getMonth() + 1) : (newDate.getMonth() + 1)}-${newDate.getDate() < 10 ? '0'+ newDate.getDate() : newDate.getDate()}`
}