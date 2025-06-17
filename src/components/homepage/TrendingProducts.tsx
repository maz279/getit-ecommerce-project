import React, { useState, useEffect } from 'react';

interface TrendingProductProps {
  image: string;
  price: string;
  onAddToCart?: () => void;
}

const TrendingProduct: React.FC<TrendingProductProps> = ({ image, price, onAddToCart }) => (
  <div className="bg-white flex grow items-stretch gap-5 w-full justify-between pr-[11px] py-[7px] rounded-[5px] border-[rgba(217,217,217,1)] border-solid border-2 max-md:mt-[9px] hover:shadow-lg transition-shadow">
    <div className="font-semibold text-center my-auto">
      <div className="flex items-stretch gap-[13px]">
        <div className="bg-[rgba(224,22,43,1)] text-[9px] text-white px-[9px] py-[3px] rounded-[5px]">
          Reward Coins
        </div>
        <div className="text-black text-[8px] my-auto">
          ONLY 5 LEFT
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/6ec185181e2a9c8f3ed5c269ffe613c4ff3b3431?placeholderIfAbsent=true"
        alt="Trending Product"
        className="aspect-[1.3] object-contain w-[135px] mt-3"
      />
    </div>
    <div className="flex flex-col items-stretch">
      <div className="rounded bg-[rgba(197,197,197,1)] flex flex-col justify-center w-[104px] h-[104px]">
        <img
          src={image}
          alt="Product"
          className="aspect-[1.46] object-contain w-[137px] rounded-[5px] max-md:mr-[-18px]"
        />
      </div>
      <div className="text-[rgba(0,106,78,1)] text-[10px] font-semibold text-center mt-[5px]">
        {price}
      </div>
      <button 
        onClick={onAddToCart}
        className="rounded bg-[rgba(255,215,0,1)] text-[8px] text-black font-semibold text-center mt-[7px] px-[27px] py-[3px] max-md:px-5 hover:bg-[rgba(255,215,0,0.8)] transition-colors"
      >
        ADD TO CART
      </button>
    </div>
  </div>
);

export const TrendingProducts: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 9,
    hours: 23,
    minutes: 10
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

  const products = Array(6).fill({
    image: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/b45f8169d769df0f3d442c08f7a0c200f348c0dd?placeholderIfAbsent=true",
    price: "Tk. 1500.00"
  });

  return (
    <section className="flex w-full max-w-[1349px] items-stretch flex-wrap mt-[19px] max-md:max-w-full">
      <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-fit grow shrink-0 basis-0 py-[13px] rounded-[5px] border-[rgba(242,242,242,1)] border-solid border-2 max-md:max-w-full">
        <div className="flex w-full max-w-[1309px] items-stretch gap-5 text-xs font-semibold flex-wrap justify-between ml-3.5 mr-[13px] max-md:max-w-full max-md:mr-2.5">
          <div className="flex items-stretch gap-2 text-[rgba(32,32,107,1)]">
            <div className="text-base font-bold grow my-auto">
              Trending Products
            </div>
            <div className="bg-[rgba(201,201,201,1)] flex w-0.5 shrink-0 h-6" />
            <div className="flex items-center gap-1">
              <div className="bg-[rgba(217,217,217,1)] self-stretch flex w-[11px] shrink-0 h-[18px] my-auto rounded-[3px]" />
              <div className="self-stretch my-auto">Promotional Text</div>
              <div className="bg-[rgba(201,201,201,1)] self-stretch flex w-0.5 shrink-0 h-6" />
            </div>
            <div className="flex items-stretch gap-1 my-auto">
              <div className="bg-[rgba(217,217,217,1)] flex w-[11px] shrink-0 h-[18px] rounded-[3px]" />
              <div>Promotional Text</div>
            </div>
          </div>
          <div className="flex items-stretch gap-[3px]">
            <div className="text-[rgba(32,32,107,1)] grow">SEE MORE</div>
            <button className="bg-[rgba(32,32,107,1)] text-white whitespace-nowrap px-[5px] py-px rounded-[5px] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
              &gt;
            </button>
          </div>
        </div>
        
        <div className="bg-[rgba(217,217,217,1)] flex shrink-0 h-0.5 mt-[7px] max-md:max-w-full" />
        
        <div className="ml-2.5 mr-4 mt-3 max-md:max-w-full max-md:mr-2.5">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[31%] max-md:w-full max-md:ml-0">
              <div className="flex flex-col relative aspect-[1.223] w-full pl-[13px] pr-20 py-9 rounded-[5px] max-md:mt-[22px] max-md:pr-5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8aba8a2f9921abfe867963f7addb8c67ffd75281?placeholderIfAbsent=true"
                  alt="Deal Background"
                  className="absolute h-full w-full object-cover inset-0"
                />
                <div className="relative text-[rgba(224,22,43,1)] text-xl font-semibold max-md:ml-0.5">
                  DEAL END IN
                </div>
                <div className="relative flex gap-1 text-lg text-white font-normal whitespace-nowrap mt-[13px]">
                  <div className="flex items-stretch gap-0.5 mt-[5px]">
                    <div className="bg-[rgba(224,22,43,1)] w-[29px] h-[29px] pt-[3px] pb-[13px] px-[9px] rounded-[50%]">
                      {Math.floor(timeLeft.days / 10)}
                    </div>
                    <div className="bg-[rgba(224,22,43,1)] w-[29px] h-[29px] pt-[3px] pb-[13px] px-2 rounded-[50%]">
                      {timeLeft.days % 10}
                    </div>
                  </div>
                  <div className="text-[rgba(224,22,43,1)] text-3xl">:</div>
                  <div className="flex items-stretch gap-0.5 mt-[5px]">
                    <div className="bg-[rgba(224,22,43,1)] w-[29px] h-[29px] pt-[3px] pb-[13px] px-[9px] rounded-[50%]">
                      {Math.floor(timeLeft.hours / 10)}
                    </div>
                    <div className="bg-[rgba(224,22,43,1)] w-[29px] h-[29px] pt-[3px] pb-[13px] px-[9px] rounded-[50%]">
                      {timeLeft.hours % 10}
                    </div>
                  </div>
                  <div className="text-[rgba(224,22,43,1)] text-3xl">:</div>
                  <div className="flex items-stretch gap-0.5 mt-[5px]">
                    <div className="bg-[rgba(224,22,43,1)] pt-1 pb-[13px] px-[9px] rounded-[50%]">
                      {Math.floor(timeLeft.minutes / 10)}
                    </div>
                    <div className="bg-[rgba(224,22,43,1)] w-[30px] h-[30px] pt-1 pb-[13px] px-[9px] rounded-[50%]">
                      {timeLeft.minutes % 10}
                    </div>
                  </div>
                </div>
                <div className="relative flex items-stretch gap-8 text-[13px] text-[rgba(224,22,43,1)] font-semibold whitespace-nowrap ml-[13px] mt-[5px] max-md:ml-2.5">
                  <div>Days</div>
                  <div>Hours</div>
                  <div>Minutes</div>
                </div>
                <div className="relative text-black text-sm font-normal text-center self-center mt-[132px] max-md:mt-10">
                  Banner / Picture / Video
                </div>
                <div className="relative self-center flex w-9 items-stretch gap-1.5 mt-[18px]">
                  <div className="bg-black flex w-2 shrink-0 h-2 rounded-[50%]" />
                  <div className="bg-[rgba(160,160,160,1)] flex w-2 shrink-0 h-2 rounded-[50%]" />
                  <div className="bg-[rgba(160,160,160,1)] flex w-2 shrink-0 h-2 rounded-[50%]" />
                </div>
              </div>
            </div>
            
            <div className="w-[69%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex grow items-stretch flex-wrap max-md:mt-[22px]">
                <button className="bg-[rgba(217,217,217,1)] text-sm text-black font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(217,217,217,0.8)] transition-colors">
                  &lt;
                </button>
                
                <div className="grow shrink-0 basis-0 w-fit max-md:max-w-full">
                  <div className="w-full max-md:max-w-full">
                    <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                      {products.slice(0, 3).map((product, index) => (
                        <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                          <TrendingProduct
                            image={product.image}
                            price={product.price}
                            onAddToCart={() => console.log(`Added trending product ${index + 1} to cart`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full mt-[9px] max-md:max-w-full">
                    <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                      {products.slice(3, 6).map((product, index) => (
                        <div key={index + 3} className="w-[33%] max-md:w-full max-md:ml-0">
                          <TrendingProduct
                            image={product.image}
                            price={product.price}
                            onAddToCart={() => console.log(`Added trending product ${index + 4} to cart`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button className="bg-[rgba(217,217,217,1)] text-sm text-black font-normal whitespace-nowrap text-center w-[22px] h-[22px] mt-[210px] px-1.5 rounded-[50%] max-md:mt-10 hover:bg-[rgba(217,217,217,0.8)] transition-colors">
        &gt;
      </button>
    </section>
  );
};
