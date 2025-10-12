import Sendcart from '@/app/carts/Sendcart';
import { getPro, tp } from '@/app/product/page'
import React from 'react'

interface Ic{
    params:Promise<{slug:string}>;
}
async function Category(props:Ic) {

    const data=await getPro();

const {slug}=await props.params;
const items=data.filter((item:tp)=>item.range===slug)
  return (
    <div>

<p>{slug}</p>
    <div className='grid grid-cols-4 justify-items-center'>
{
    items.map((item:tp)=>(
        <Sendcart key={item.id} className='' product={item}/>
    ))
}
    </div>



    </div>
  )
}

export default Category