import { useState } from 'react'

export default function useLoading(initialValue: boolean = false) {
  const [isLoading, setLoading] = useState(initialValue)
  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  return { isLoading, startLoading, stopLoading }
}
