import React from 'react';

interface ProductCardProps {
  image: string;
  category: string;
  title: string;
  originalPrice: string;
  salePrice: string;
  stockLeft: number;
  badge?: string;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  category,
  title,
  originalPrice,
  salePrice,
  stockLeft,
  badge = "Buy 1 Get 1 Free",
  onAddToCart
}) => {
  return (
    <div className="bg-white flex-1 py-1 rounded-[5px] border-[rgba(217,217,217,1)] border-solid border-2 hover:shadow-lg transition-shadow">
      <div className="flex items-stretch gap-5 justify-between max-md:mr-[5px]">
        <div className="bg-[rgba(224,22,43,1)] text-[9px] text-white font-semibold text-center px-[5px] py-[3px] rounded-[5px]">
          {badge}
        </div>
        <div className="bg-[rgba(0,106,78,0.826)] flex flex-col items-stretch justify-center px-[3px] py-0.5 rounded-[5px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/9f6f4dbd29791e1ad6d1b4374c005f0a71656514?placeholderIfAbsent=true"
            alt="Wishlist"
            className="aspect-[1] object-contain w-3"
          />
        </div>
      </div>
      
      <img
        src={image}
        alt={title}
        className="aspect-[1.46] object-contain w-[137px] mt-[5px] rounded-[5px]"
      />
      
      <div className="bg-[rgba(176,176,176,1)] flex shrink-0 h-0.5 mt-[5px]" />
      
      <div className="flex w-full flex-col items-stretch text-[8px] font-semibold text-center mt-1 px-[5px]">
        <div className="text-black font-normal">{category}</div>
        <div className="text-black text-[10px] mt-1">{title}</div>
        
        <div className="flex items-stretch gap-1.5 text-[10px] mt-[7px] max-md:mr-[3px]">
          <div className="text-[rgba(224,22,43,1)] line-through grow">
            {originalPrice}
          </div>
          <div className="text-[rgba(0,106,78,1)]">
            {salePrice}
          </div>
        </div>
        
        <div className="bg-white border flex flex-col text-white justify-center mt-[9px] py-px rounded-[5px] border-[rgba(32,32,107,1)] border-solid">
          <div className="bg-[rgba(32,32,107,1)] px-[34px] py-0.5 rounded-[5px] max-md:px-5">
            ONLY {stockLeft} LEFT
          </div>
        </div>
        
        <button 
          onClick={onAddToCart}
          className="rounded bg-[rgba(255,215,0,1)] text-black mt-1 px-9 py-[3px] max-md:px-5 hover:bg-[rgba(255,215,0,0.8)] transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
