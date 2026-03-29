import Image from "next/image"
import Link from "next/link"
import { MdLocalLibrary } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";
export default function Navbar(){
    return(
    <div className="w-full flex justify-between items-center bg-white px-32  py-4">
        
         <p className="inline-flex items-center text-3xl font-open text-teal-active">
            <Image src="logo-cropped.svg" alt="Logo" height={60} width={60}/>
<span>O</span>
<span className="text-purple-deep">S</span>
<span>O</span>
        </p>
<div className="inline-flex items-center gap-2">

    <Link href="/dashboard" className="bg-transparent border border-teal-active text-teal-active py-3 px-5 inline-flex items-center gap-2 rounded-xl"> Dashboard </Link>
    <Link href="/tracer" className="bg-transparent border border-teal-active text-teal-active py-3 px-5 inline-flex items-center gap-2 rounded-xl"> Tracer <FaPaintBrush className="text-2xl"/></Link>
    <Link href="/reading-studio" className="bg-teal-active text-white py-3 px-5 inline-flex items-center gap-2 rounded-xl"> Reading Studio <MdLocalLibrary className="text-2xl"/></Link>
</div>

    </div>)
}