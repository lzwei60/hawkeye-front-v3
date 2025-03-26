import { useDarkModeStoreWithOut } from '@/store/modules/darkMode'

export function useDarkMode() {
  return useDarkModeStoreWithOut().darkMode
}

export function useToggleDarkMode(event?: TouchEvent | MouseEvent) {
  useDarkModeStoreWithOut().toggleDarkMode(event)
}

export function useGetDarkMode() {
  return useDarkModeStoreWithOut().getDarkMode()
}
