import React from 'react';

export const PromotionalBanners: React.FC = () => {
  return (
    <section className="w-full max-w-[1336px] mt-[21px] max-md:max-w-full">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-6/12 max-md:w-full max-md:ml-0">
          <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border grow w-full pl-1.5 pr-[18px] py-[11px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full max-md:mt-[15px]">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-6/12 max-md:w-full max-md:ml-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/34484030e2887513faa03c9f86bb2b87f86055d1?placeholderIfAbsent=true"
                  alt="Group Shopping Promotion"
                  className="aspect-[1.84] object-contain w-full grow rounded-[5px] max-md:mt-[31px]"
                />
              </div>
              <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                <div className="flex flex-col self-stretch items-stretch text-base font-semibold my-auto max-md:mt-10">
                  <div className="text-black">
                    BUY TOGETHER WITH FRIENDS AND FAMILY AND ENJOY 20% OFF ON SLEETED ITEMS
                  </div>
                  <button className="bg-[rgba(0,106,78,1)] text-white mt-[33px] px-[7px] py-2 rounded-[5px] hover:bg-[rgba(0,106,78,0.8)] transition-colors">
                    ORDER NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
          <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border grow w-full pl-1.5 pr-[17px] py-[11px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full max-md:mt-[15px]">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-6/12 max-md:w-full max-md:ml-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/23996bb07e19f4f571f902838f5b50d1535fee48?placeholderIfAbsent=true"
                  alt="Photo Contest Promotion"
                  className="aspect-[1.73] object-contain w-full grow rounded-[5px] max-md:mt-[30px]"
                />
              </div>
              <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                <div className="flex flex-col self-stretch items-stretch text-base font-semibold my-auto max-md:mt-10">
                  <div className="text-black">
                    SHARE A PHOTO OF YOUR NEW OUTFIT AND WIN A $50 GIFT CARD
                  </div>
                  <button className="bg-[rgba(0,106,78,1)] text-white mt-[52px] px-[7px] py-2 rounded-[5px] max-md:mt-10 hover:bg-[rgba(0,106,78,0.8)] transition-colors">
                    PARTICIPATE NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
