'use client'

import useTheme from '@/utils/hooks/useTheme'
import { PiSun, PiMoon } from 'react-icons/pi'

const ModeSwitcher = () => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark')
    }

    return (
        <div
            onClick={toggleTheme}
            className="header-action-item"
        >
            {
                mode === 'dark' ? (
                    <PiSun className="text-xl" />
                ) : (
                    <PiMoon className="text-xl" />
                )
            }
        </div>
    )
}

export default ModeSwitcher
