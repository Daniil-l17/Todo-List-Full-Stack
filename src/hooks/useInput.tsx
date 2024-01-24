import { useState } from "react"

export const useInput = () => {
  const [value,setValue] = useState('')
  return {
    value,
    onChange: (event) => setValue(event.target.value)
  }
}