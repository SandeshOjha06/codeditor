import React from 'react'
import Image from "next/image";
import SignInFormClient from '@/modules/components/sign-in-form-client';




function Page() {
  return (
    <> 
    <Image src={"./login2.svg"} alt="Login-image" height={300} width={300} className='m-6 object-cover'/>
    <SignInFormClient/>
    </>
  )
}

export default Page