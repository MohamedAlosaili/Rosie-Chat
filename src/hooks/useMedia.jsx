import { useState, useRef } from "react"

import { mediaVariants } from "util";

function useMedia() {
    const [isOpen, setIsOpen] = useState(false);
    const mediaRef = useRef(null)

    const toggleOpen = () => setIsOpen((isOpen) => !isOpen);

    let variants = {}
    if (mediaRef.current) {
        const { top, left, width } = mediaRef.current?.getBoundingClientRect()
        variants = mediaVariants(top, left, width)
    }

    return [isOpen, toggleOpen, mediaRef, variants]
}

export default useMedia