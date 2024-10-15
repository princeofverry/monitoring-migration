import Image from 'next/image'
import React from 'react'
import kapal from '/public/kapal.png'

const Footer = () => {
    return (
        <>
            <div className="bg-[#2992BE] w-screen h-16 bottom-0 md:fixed md:block hidden">
                <div className="relative h-full">
                    <Image
                        src={kapal}
                        alt="kapal"
                        className="absolute bottom-4 left-0 transform"
                        width={250}
                    />
                </div>
            </div>
        </>
    )
}

export default Footer