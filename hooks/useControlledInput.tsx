import { ChangeEvent, useState } from 'react'

export default function useControlledInput(
  defaultValue: string = ''
): [string, (e: ChangeEvent<HTMLInputElement>) => void, () => void] {
  const [inputValue, setInputValue] = useState(defaultValue)
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value)
  const clearValue = () => setInputValue('')

  return [inputValue, onChangeHandler, clearValue]
}
