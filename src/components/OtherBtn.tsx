'use client'
import { useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useState } from 'react'

const OtherBtn = ({
    type,
    icon,
    setHoveredItem,
    hoveredItem,
    isActive
}: {
    type: string,
    icon: string,
    setHoveredItem: Dispatch<SetStateAction<string | null>>,
    hoveredItem: string | null,
    isActive: boolean
}) => {
    const { signOut, openUserProfile } = useClerk()
    const [loading, setLoading] = useState(false); // Loading state

    const handleSignOut = async () => {
        setLoading(true); // Set loading to true
        await signOut(); // Call the signOut function
        setLoading(false); // Optionally set loading to false after signOut completes
    };

    return (
        <div
            key={`nav-${type}`}
            className="relative"
            onMouseEnter={() => setHoveredItem(type)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {/* The link */}
            {type === 'Logout' ? (
                loading ? (
                    <div className="flex items-center justify-center lg:justify-start xl:gap-4 gap-2 text-gray-500 py-2 md:px-2 rounded-md">
                        {/* Loader Spinner */}
                        <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-mPurple rounded-full"></div>
                        <span className="hidden lg:block xl:text-[16px] lg:text-[14px]">{type}</span>

                    </div>
                ) : (
                    <div
                        className={`flex cursor-pointer items-center justify-center lg:justify-start xl:gap-4 gap-2 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mSkyLight ${isActive ? "bg-mSkyLight" : ""}`}
                        onClick={handleSignOut} // Use the handleSignOut function
                    >
                        <Image
                            src={icon}
                            alt={`item-${type}`}
                            width={20}
                            height={20}
                        />
                        <span className="hidden lg:block xl:text-[16px] lg:text-[14px]">{type}</span>
                    </div>
                )
            ) : (
                <div
                    className={`flex cursor-pointer items-center justify-center lg:justify-start xl:gap-4 gap-2 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mSkyLight ${isActive ? "bg-mSkyLight" : ""}`}
                    onClick={() => openUserProfile()}
                >
                    <Image
                        src={icon}
                        alt={`item-${type}`}
                        width={20}
                        height={20}
                    />
                    <span className="hidden lg:block xl:text-[16px] lg:text-[14px]">{type}</span>
                </div>
            )}

            {/* Hover title div for screens < lg */}
            {hoveredItem === type && (
                <div className="lg:hidden absolute z-[999] left-[40px] top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md">
                    {type}
                </div>
            )}
        </div>
    )
}

export default OtherBtn
