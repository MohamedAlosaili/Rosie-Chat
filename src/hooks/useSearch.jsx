import { useRef, useState } from "react"

function useSearch(listName, list, propertyName) {
    const [value, setValue] = useState("")
    const results = useRef([])

    const changeValue = (e) => {
        results.current = []

        const newSearchValue = e.target.value
        setValue(newSearchValue)
        setResults(newSearchValue)
    }

    const setResults = (newSearchValue) => {
        results.current = list.filter(item => (
            item[propertyName].toLowerCase().includes(newSearchValue.toLowerCase())
        ))
    }

    return [value, changeValue, results.current]
}

export default useSearch