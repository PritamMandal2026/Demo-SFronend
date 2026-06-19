'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiCheck } from 'react-icons/hi'
import { setLocale } from '@/server/actions/locale'
import { useLocale } from 'next-intl'
import type { CommonProps } from '@/@types/common'

import useTheme from '@/utils/hooks/useTheme'
import { THEME_ENUM } from '@/constants/theme.constant'


const languageList = [
    { label: 'English', value: 'en', flag: 'US' },
    { label: 'Chinese', value: 'zh', flag: 'CN' },
    { label: 'Espanol', value: 'es', flag: 'ES' },
    { label: 'Arabic', value: 'ar', flag: 'SA' },
]

const _LanguageSelector = ({ className }: CommonProps) => {
    const locale = useLocale()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const setDirection = useTheme((state) => state.setDirection) 

    // Detect click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectLangFlag = useMemo(() => {
        return languageList.find((lang) => lang.value === locale)?.flag
    }, [locale])

    const handleUpdateLocale = async (newLocale: string) => {
        await setLocale(newLocale)
        if (newLocale === 'ar') {
            setDirection(THEME_ENUM.DIR_RTL)
        } else {
            setDirection(THEME_ENUM.DIR_LTR)
        }
        setIsOpen(false)
    }

    return (
        <div
            className={classNames('inline-block', className)}
            ref={dropdownRef}
        >
            {/* Trigger Button */}
            <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <Avatar
                    size={12}
                    shape="circle"
                    src={`/img/countries/${selectLangFlag}.png`}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="cstm_dropdown_holder">
                    {languageList.map((lang) => (
                        <div
                            key={lang.value}
                            className={classNames(
                                'flex justify-between items-center px-3 py-2 gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-300 transition-colors',
                                locale === lang.value && 'bg-gray-300 dark:bg-gray-700'
                            )}
                            onClick={() => handleUpdateLocale(lang.value)}
                        >
                            <span className="flex items-center gap-2">
                                <Avatar
                                    size={18}
                                    shape="circle"
                                    src={`/img/countries/${lang.flag}.png`}
                                />
                                <span>{lang.label}</span>
                            </span>
                            {locale === lang.value && (
                                <HiCheck className="text-emerald-500 text-lg" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const LanguageSelector = withHeaderItem(_LanguageSelector)

export default LanguageSelector
