'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Steps from '@/components/ui/Steps'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useCustomerListStore } from '../_store/customerListStore'
import dynamic from 'next/dynamic'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import RichTextEditor from '@/components/shared/RichTextEditor'

const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), {
    ssr: false,
})

const tagsOption = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'repair', label: 'Repair' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'replacement', label: 'Replacement' },
    { value: 'upgrade', label: 'Upgrade' },
]

const customersOption = [
    { value: 'customer_1', label: 'John Doe' },
    { value: 'customer_2', label: 'Jane Smith' },
    { value: 'customer_3', label: 'Acme Corp' },
    { value: 'customer_4', label: 'Tech Solutions Ltd' },
    { value: 'customer_5', label: 'Global Industries' },
]

const locationOption = [
    { value: 'warehouse_a', label: 'Warehouse A' },
    { value: 'warehouse_b', label: 'Warehouse B' },
    { value: 'office_floor_1', label: 'Office - Floor 1' },
    { value: 'office_floor_2', label: 'Office - Floor 2' },
    { value: 'external_site', label: 'External Site' },
]

const contractValuesOption = [
    { value: '0-1000', label: '$0 - $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-50000', label: '$10,000 - $50,000' },
    { value: '50000+', label: '$50,000+' },
]

const RequiredInput = ({
    name,
    placeholder,
}: {
    name: string
    placeholder: string
}) => {
    const [hasValue, setHasValue] = useState(false)

    return (
        <div className="relative">
            {!hasValue && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs pointer-events-none select-none">
                    {placeholder}
                    <span className="text-red-500 ml-0.5">*</span>
                </span>
            )}
            <input
                type="text"
                name={name}
                className="form-input w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 h-10 px-3 text-sm focus:ring-primary focus:border-primary"
                onChange={(e) => setHasValue(e.target.value.length > 0)}
            />
        </div>
    )
}

const AssetListsActionTools = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const customerList = useCustomerListStore((state) => state.customerList)

    const handleAddNew = () => {
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    const [step, setStep] = useState(0)

    const onChange = (nextStep: number) => {
        if (nextStep < 0) {
            setStep(0)
        } else if (nextStep > 5) {
            setStep(5)
        } else {
            setStep(nextStep)
        }
    }

    const onNext = () => onChange(step + 1)

    const onPrevious = () => onChange(step - 1)

    const Footer = (
        <div className="flex justify-center w-full">
            <Button
                className="mx-2"
                disabled={step === 0}
                onClick={onPrevious}
            >
                Previous
            </Button>
            <Button disabled={step === 5} variant="solid" onClick={onNext}>
                {step === 5 ? 'Completed' : 'Next'}
            </Button>
        </div>
    )

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <CSVLink
                    className="w-full"
                    filename="customerList.csv"
                    data={customerList}
                >
                    <Button
                        icon={<TbCloudDownload className="text-xl" />}
                        className="w-full"
                    >
                        Download
                    </Button>
                </CSVLink>
                <Button
                    variant="solid"
                    icon={<TbUserPlus className="text-xl" />}
                    onClick={handleAddNew}
                >
                    Add new
                </Button>
            </div>

            <Drawer
                title="Add New Asset"
                isOpen={isDrawerOpen}
                footer={Footer}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
                width={620}
            >
                <div className="overflow-visible">
                    <Steps labelDown current={step} className='mb-2'>
                        <Steps.Item title="Required Details" />
                        <Steps.Item title="Contract Type" />
                        <Steps.Item title="Service Level Agreement" />
                        <Steps.Item title="Billing Cycle" />
                        <Steps.Item title="Payment Method" />
                        <Steps.Item title="Service Provider" />
                    </Steps>

                    <div className="overflow-visible">
                        <h4 className='text-xs font-medium mb-2'>Required Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <RequiredInput name="contract_num" placeholder="Contract No." />
                            <RequiredInput name="contract" placeholder="Contract" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-2">
                            <RichTextEditor content="" editorContentClass="min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <DatePicker size='sm' placeholder="Pick date & time" />
                            <DatePicker size='sm' placeholder="Pick date & time" />
                            <Select
                                placeholder="Tag"
                                options={tagsOption}
                                menuPlacement="auto"
                            ></Select>
                            <Select
                                placeholder="Customer"
                                options={customersOption}
                                menuPlacement="auto"
                            ></Select>
                            <Select
                                placeholder="Location"
                                options={locationOption}
                                menuPlacement="auto"
                            ></Select>
                            <Select
                                placeholder="Total Contract Value"
                                options={contractValuesOption}
                                menuPlacement="auto"
                            ></Select>
                        </div>
                    </div>
                    <div className="mt-6 h-40 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-center">
                        <h6>Step {`${step + 1}`} content</h6>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default AssetListsActionTools
