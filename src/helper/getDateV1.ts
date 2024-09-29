import { monthToWord } from './timeFormat'

export const getDateV1 = (date: any, time?: boolean) => {
  const dateObj = new Date(date)
  const month = dateObj.getUTCMonth() + 1 //months from 1-12
  const day = dateObj.getUTCDate()
  const year = dateObj.getUTCFullYear()
  if (time) {
    const hour = date.split(':')[0]
    const minute = date.split(':')[1]

    return `${hour}:${minute}`
  }
  return day + ' ' + monthToWord(month) + ' ' + year
}
