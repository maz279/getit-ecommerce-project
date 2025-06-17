import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export const FlashSaleSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const products = Array(10).fill({
    image: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/b45f8169d769df0f3d442c08f7a0c200f348c0dd?placeholderIfAbsent=true",
    category: "Product Category",
    title: "Product Full Title",
    originalPrice: "Tk. 1800.00",
    salePrice: "Tk. 1500.00",
    stockLeft: 5
  });

  return (
    <section className="flex items-center gap-0.5 flex-wrap mt-[15px]">
      <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
        &lt;
      </button>
      
      <div className="bg-[rgba(242,242,242,1)] border self-stretch pb-[15px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full">
        <div className="bg-[rgba(32,32,107,1)] flex w-full items-stretch gap-5 flex-wrap justify-between px-[17px] py-[13px] rounded-[5px] max-md:max-w-full">
          <div className="text-white text-base font-bold">
            FLASH SALE : LIMITED TIME OFFER
          </div>
          <div className="flex items-stretch gap-1 text-xs font-semibold">
            <div className="text-white grow">SEE MORE</div>
            <button className="bg-white text-[rgba(32,32,107,1)] whitespace-nowrap px-1 py-px rounded-[5px] hover:bg-gray-100 transition-colors">
              &gt;
            </button>
          </div>
        </div>
        
        <div className="w-full mt-3 px-2 max-md:max-w-full">
          <div className="flex w-[273px] max-w-full gap-2 text-lg text-white font-normal">
            <div className="flex items-stretch gap-0.5">
              <div className="text-black text-base font-bold grow my-auto">
                END IN :
              </div>
              <div className="bg-[rgba(224,22,43,1)] whitespace-nowrap pt-1 pb-3.5 px-[7px] rounded-[5px]">
                {Math.floor(timeLeft.days / 10)}
              </div>
              <div className="bg-[rgba(224,22,43,1)] whitespace-nowrap pt-1 pb-3.5 px-2 rounded-[5px]">
                {timeLeft.days % 10}
              </div>
            </div>
            <div className="text-[rgba(224,22,43,1)] self-stretch">:</div>
            <div className="flex items-stretch gap-0.5 whitespace-nowrap">
              <div className="bg-[rgba(224,22,43,1)] pt-[3px] pb-[15px] px-1.5 rounded-[5px]">
                {Math.floor(timeLeft.hours / 10)}
              </div>
              <div className="bg-[rgba(224,22,43,1)] pt-[3px] pb-[15px] px-2 rounded-[5px]">
                {timeLeft.hours % 10}
              </div>
            </div>
            <div className="flex items-stretch gap-[3px] whitespace-nowrap">
              <div className="text-[rgba(224,22,43,1)] grow">:</div>
              <div className="bg-[rgba(224,22,43,1)] pt-1 pb-3.5 px-[9px] rounded-[5px]">
                {Math.floor(timeLeft.minutes / 10)}
              </div>
              <div className="bg-[rgba(224,22,43,1)] pt-1 pb-3.5 px-2 rounded-[5px]">
                {timeLeft.minutes % 10}
              </div>
            </div>
          </div>
          
          <div className="flex items-stretch gap-2.5 flex-wrap mt-[13px]">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={product.image}
                category={product.category}
                title={product.title}
                originalPrice={product.originalPrice}
                salePrice={product.salePrice}
                stockLeft={product.stockLeft}
                onAddToCart={() => console.log(`Added product ${index + 1} to cart`)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
        &gt;
      </button>
    </section>
  );
};
