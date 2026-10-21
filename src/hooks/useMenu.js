import { useEffect, useRef, useState } from 'react'

/**
 * Controls a small popover menu that closes on outside click or Escape.
 *
 * @returns {{isOpen: boolean, toggle: Function, close: Function, menuRef: import('react').RefObject<HTMLElement>}} Menu state and ref for the wrapper element.
 * @example
 * const menu = useMenu()
 * <div ref={menu.menuRef}><button onClick={menu.toggle} /></div>
 */
export function useMenu() {
  const [isOpen, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handlePointer(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }

    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  return { isOpen, toggle: () => setOpen((value) => !value), close: () => setOpen(false), menuRef }
}
