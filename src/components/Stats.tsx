"use client"
import { useEffect, useState } from 'react'

function Counter({ value, label, loop = false }: { value: number; label: string; loop?: boolean }){
  const [count,setCount]=useState(0)
  useEffect(()=>{
    let start=0
    const dur=1000
    const step=Math.max(1, Math.ceil(value/(dur/16)))
    const id=setInterval(()=>{
      start+=step
      if(start>=value){
        if(loop){
          start = 0
          setCount(0)
        } else {
          setCount(value)
          clearInterval(id)
        }
      } else setCount(start)
    },16)
    return ()=>clearInterval(id)
  },[value, loop])
  return (
    <div className="text-center">
      <div className="text-3xl font-bold" style={{color:'var(--secondary)'}}>{count}{label.includes('MW')? ' MW':''}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  )
}

export default function Stats(){
  return (
    <section className="py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
        <Counter value={500} label={'Installations'} loop />
        <Counter value={10} label={'MW Installed'} loop />
        <Counter value={25} label={'Year Warranty'} loop />
        <Counter value={98} label={'Customer Satisfaction'} loop />
      </div>
    </section>
  )
}
