import { CDatePicker } from '@coreui/react-pro'

export function DateShow({ date, onDateChange }: any) {
  return (
    <CDatePicker
      placeholder={'Выберите дату'}
      style={{
        width: '60%',
      }}
      locale="ru-RU"
      onDateChange={(e: any) => {
        onDateChange(e)
      }}
      date={date}
      weekdayFormat={1}
    />
  )
}
