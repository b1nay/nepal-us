import Image from "next/image"
import Link from "next/link"
import { MdLocalLibrary } from "react-icons/md";
export default function Navbar(){
    return(
    <div className="w-full flex justify-between items-center bg-white px-32  py-4">
        
         <p className="inline-flex items-center text-3xl font-open text-teal-active">
            <Image src="logo-cropped.svg" alt="Logo" height={60} width={60}/>
<span>O</span>
<span className="text-purple-deep">S</span>
<span>O</span>
        </p>
<div>
    <Link href="/studio" className="bg-teal-active text-white py-3 px-5 inline-flex items-center gap-2 rounded-xl">Studio <MdLocalLibrary className="text-2xl"/></Link>
</div>

    </div>)
}