import React from 'react'

const Header = () => {
    return (
        <>
            <div className="relative flex flex-row items-center justify-around py-2 ">
                <div className='flex flex-row items-center font-semibold gap-2'>
                    <img src="/aterkia.png" alt="logo-ater" className='md:w-16 md:h-16 w-16' />
                    <p className='md:text-xl text-xs md:block hidden text-blue-500 font-semibold'>ATERKIA</p>
                </div>
                <h1 className='text-center md:text-3xl text-xl font-bold text-blue-500'>Monitoring System</h1>
                <div className='flex flex-row items-center font-semibold gap-2'>
                    <p className='md:text-base md:block hidden text-2xl tracking-wider'>Universitas <br /> Diponegoro</p>
                    <img src="/undip.png" alt="logo-undip" className='w-14' />
                </div>
            </div>
            <hr className="border-t-4 border-blue-400" />
        </>
    )
}

export default Header