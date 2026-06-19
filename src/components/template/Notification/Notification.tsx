'use client'

import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import { HiOutlineMailOpen } from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
} from '@/services/CommonService'
import isLastChild from '@/utils/isLastChild'
// import useResponsive from '@/utils/hooks/useResponsive'
import { useRouter } from 'next/navigation'

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const notificationHeight = 'h-[280px]'

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<NotificationList[]>([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    // const { larger } = useResponsive()
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const getNotificationCount = async () => {
        const resp = await apiGetNotificationCount()
        if (resp.count > 0) {
            setNoResult(false)
            setUnreadNotification(true)
        } else {
            setNoResult(true)
        }
    }

    useEffect(() => {
        getNotificationCount()
    }, [])

    const fetchNotifications = async () => {
        if (notificationList.length === 0) {
            setLoading(true)
            const resp = await apiGetNotificationList()
            setNotificationList(resp)
            setLoading(false)
        }
    }

    const toggleDropdown = async () => {
        setOpen(!open)
        if (!open) await fetchNotifications()
    }

    const onMarkAllAsRead = () => {
        const list = notificationList.map((item) => ({ ...item, readed: true }))
        setNotificationList(list)
        setUnreadNotification(false)
    }

    const onMarkAsRead = (id: string) => {
        const list = notificationList.map((item) =>
            item.id === id ? { ...item, readed: true } : item
        )
        setNotificationList(list)
        const hasUnread = list.some((item) => !item.readed)
        if (!hasUnread) setUnreadNotification(false)
    }

    const handleViewAllActivity = () => {
        router.push('/concepts/account/activity-log')
        setOpen(false)
    }

    // Close when clicking outside
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
        <div className="" ref={dropdownRef}>
            <div onClick={toggleDropdown}>
                <NotificationToggle dot={unreadNotification} className={className} />
            </div>

            {open && (
                <div
                    className={classNames(
                        'cstm_dropdown_holder',
                        'min-w-[280px] md:min-w-[340px]'
                    )}
                >
                    <div className="dark:border-gray-700 px-2 flex items-center justify-between mb-1 border-b py-2">
                        <h6>Notifications</h6>
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<HiOutlineMailOpen className="text-lg" />}
                            title="Mark all as read"
                            onClick={onMarkAllAsRead}
                        />
                    </div>

                    <ScrollBar
                        className={classNames('overflow-y-auto', notificationHeight)}
                    >
                        {notificationList.length > 0 &&
                            notificationList.map((item, index) => (
                                <div key={item.id}>
                                    <div
                                        className="relative rounded-xl flex px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => onMarkAsRead(item.id)}
                                    >
                                        <NotificationAvatar {...item} />
                                        <div className="mx-3">
                                            <div>
                                                {item.target && (
                                                    <span className="font-semibold heading-text">
                                                        {item.target}{' '}
                                                    </span>
                                                )}
                                                <span>{item.description}</span>
                                            </div>
                                            <span className="text-xs">{item.date}</span>
                                        </div>
                                        <Badge
                                            className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                            innerClass={`${
                                                item.readed
                                                    ? 'bg-gray-300 dark:bg-gray-600'
                                                    : 'bg-primary'
                                            } `}
                                        />
                                    </div>
                                    {!isLastChild(notificationList, index) && (
                                        <div className="border-b border-gray-200 dark:border-gray-700 my-2" />
                                    )}
                                </div>
                            ))}

                        {loading && (
                            <div
                                className={classNames(
                                    'flex items-center justify-center',
                                    notificationHeight
                                )}
                            >
                                <Spinner size={40} />
                            </div>
                        )}

                        {noResult && notificationList.length === 0 && (
                            <div
                                className={classNames(
                                    'flex items-center justify-center',
                                    notificationHeight
                                )}
                            >
                                <div className="text-center">
                                    <img
                                        className="mx-auto mb-2 max-w-[150px]"
                                        src="/img/others/no-notification.png"
                                        alt="no-notification"
                                    />
                                    <h6 className="font-semibold">No notifications!</h6>
                                    <p className="mt-1">Please Try again later</p>
                                </div>
                            </div>
                        )}
                    </ScrollBar>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                        <Button block variant="solid" onClick={handleViewAllActivity}>
                            View All Activity
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
