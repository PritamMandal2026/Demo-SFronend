import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'
import classNames from '@/utils/classNames'
// import NavToggle from '@/components/shared/NavToggle'
import type { CommonProps } from '@/@types/common'

const _SideNavToggle = ({ className }: CommonProps) => {
    const { layout, setSideNavCollapse } = useTheme((state) => state)

    const sideNavCollapse = layout.sideNavCollapse

    const onCollapse = () => {
        setSideNavCollapse(!sideNavCollapse)
    }

    return (
        <div
            className={classNames('toggle_sidemenu_btn', className)}
            role="button"
            onClick={onCollapse}
        >
            <svg width="8" height="28" viewBox="0 0 8 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.98438 0V5.5H2.98438C6.58437 4.7 7.81771 1.5 7.98438 0Z" fill="#9EA2A9"></path><path d="M0.015625 8.5C0.015625 6.84315 1.35877 5.5 3.01562 5.5H7.98438V22.5H3.01562C1.35877 22.5 0.015625 21.1569 0.015625 19.5V8.5Z" fill="#9EA2A9"></path><path d="M1.01562 18.5V9.5H2.21563V18.5H1.01562ZM3.41563 14L7.01562 9.5V18.5L3.41563 14Z" fill="white"></path><path d="M7.98438 28V22.5H2.98438C6.58437 23.3 7.81771 26.5 7.98438 28Z" fill="#9EA2A9"></path></svg>
            {/* <NavToggle className="text-2xl" toggled={sideNavCollapse} /> */}
        </div>
    )
}

const SideNavToggle = withHeaderItem(_SideNavToggle)

export default SideNavToggle
