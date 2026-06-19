'use client'

import { useState, useRef, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import signOut from '@/server/actions/auth/handleSignOut'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import {
    PiUserDuotone,
    PiGearDuotone,
    PiPulseDuotone,
    PiSignOutDuotone,
} from 'react-icons/pi'
import classNames from 'classnames'

import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/concepts/account/settings',
        icon: <PiUserDuotone />,
    },
    {
        label: 'Account Setting',
        path: '/concepts/account/settings',
        icon: <PiGearDuotone />,
    },
    {
        label: 'Activity Log',
        path: '/concepts/account/activity-log',
        icon: <PiPulseDuotone />,
    },
]

const _UserDropdown = () => {
    const { session } = useCurrentSession()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleSignOut = async () => {
        await signOut()
        setOpen(false)
    }

    const avatarProps = {
        ...(session?.user?.image
            ? { src: session.user.image }
            : { icon: <PiUserDuotone /> }),
    }

    const toggleDropdown = () => setOpen(!open)

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={dropdownRef}>
            {/* Avatar + name (clickable toggle) */}
            <div
                onClick={toggleDropdown}
                className="cursor-pointer flex items-center gap-2 avatar_holder"
            >
                <Avatar size={32} {...avatarProps} />
                <div className='more_info_holder'>
                    <div className="font-bold text-gray-900 dark:text-gray-100">
                        {session?.user?.name || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {session?.user?.email || 'No email available'}
                    </div>
                </div>
            </div>

            {/* Custom dropdown content */}
            {open && (
                <div
                    className={classNames('min-w-[196px] cstm_dropdown_holder')}
                >
                    {/* Header */}
                    {/* <div className="py-2 px-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                        <Avatar {...avatarProps} />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {session?.user?.name || 'Anonymous'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {session?.user?.email || 'No email available'}
                            </div>
                        </div>
                    </div> */}

                    {/* Links */}
                    <div className="py-2">
                        {dropdownItemList.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    {/* <div className="border-t border-gray-200 dark:border-gray-700" /> */}

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="text-xl">
                            <PiSignOutDuotone />
                        </span>
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
