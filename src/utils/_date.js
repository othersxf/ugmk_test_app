import { timeParse, timeFormatLocale } from 'd3-time-format'

const tfLocale = timeFormatLocale({
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
});

export const parseDate = (date, format) => {
  let timeParser = tfLocale.parse('%e/%_m/%Y')
  if(typeof(format) === 'string'){
    timeParser = tfLocale.parse(format)
  }
  return timeParser(date)
}

export const formatDate = (date, format) => {
  let timeFormatter = tfLocale.format('%e/%_m/%Y')
  if(typeof(format) === 'string'){
    timeFormatter = tfLocale.format(format)
  }
  return timeFormatter(date)
}
