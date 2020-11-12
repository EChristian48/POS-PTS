import { useState } from 'react'

export default function useToggler(
  defaultValue: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [state, setState] = useState(defaultValue)
  const setTrue = () => setState(true)
  const setFalse = () => setState(false)
  const toggle = () => setState(!state)

  return [state, setTrue, setFalse, toggle]
}
