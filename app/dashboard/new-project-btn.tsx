"use client"

import addPlayground from "./actions"

export default function NewProjectButton(){
    return(
        <form action={addPlayground}>
            <button
            type="submit"
            className="w-full rounded-md bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-white
            hover:bg-[#333] transition"
            >
                Add New Project

            </button>
        </form>
    )
}