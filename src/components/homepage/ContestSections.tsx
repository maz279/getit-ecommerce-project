import React from 'react';

export const ContestSections: React.FC = () => {
  return (
    <section className="w-full mt-[19px]">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-[33%] max-md:w-full max-md:ml-0">
          <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border flex w-full flex-col mx-auto px-[11px] py-2 rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full max-md:mt-8">
            <div className="flex items-stretch gap-[7px]">
              <div className="flex items-stretch gap-0.5">
                <div className="w-full">
                  <div className="text-[rgba(0,106,78,1)] text-sm font-semibold text-center">
                    FLASH SALE LEADBOARD
                  </div>
                  <div className="flex gap-[7px] mt-[7px] max-md:mr-1">
                    <div className="text-black text-sm font-semibold text-center self-stretch grow">
                      Top Customer:
                    </div>
                    <div className="bg-[rgba(217,217,217,1)] flex flex-col justify-center mt-1 py-px rounded-[50%]">
                      <div className="bg-[rgba(237,237,237,1)] z-10 flex w-[18px] shrink-0 h-[18px] -mt-1 rounded-[50%]" />
                    </div>
                    <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                    <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                  </div>
                </div>
                <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] mt-6 rounded-[50%]" />
              </div>
              <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] mt-6 rounded-[50%]" />
            </div>
            
            <div className="flex items-stretch gap-2 text-sm text-black font-semibold text-center mt-1.5">
              <div className="grow">Top Saling Products:</div>
              <div className="bg-[rgba(237,237,237,1)] flex w-5 shrink-0 h-5 rounded-[3px]" />
              <div className="bg-[rgba(237,237,237,1)] flex w-5 shrink-0 h-5 rounded-[3px]" />
              <div className="bg-[rgba(237,237,237,1)] flex w-5 shrink-0 h-5 rounded-[3px]" />
              <div className="bg-[rgba(237,237,237,1)] flex w-5 shrink-0 h-5 rounded-[3px]" />
              <div className="bg-[rgba(237,237,237,1)] flex w-5 shrink-0 h-5 rounded-[3px]" />
            </div>
            
            <div className="self-stretch flex items-stretch gap-[40px_46px] text-sm font-semibold text-center mt-[11px]">
              <div className="text-black grow shrink w-[235px] basis-auto my-auto">
                Top 5 Customer will get $20 Gift Card
              </div>
              <button className="bg-[rgba(0,106,78,1)] text-white px-4 py-[3px] rounded-[5px] hover:bg-[rgba(0,106,78,0.8)] transition-colors">
                See Details
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
          <div className="bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border grow w-full pl-3.5 pr-1.5 py-[7px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full max-md:mt-8">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-[62%] max-md:w-full max-md:ml-0">
                <div className="flex w-full flex-col self-stretch items-stretch my-auto max-md:mt-[31px]">
                  <div className="text-[rgba(0,106,78,1)] text-sm font-semibold text-center">
                    CONTENT GALLERY
                  </div>
                  <div className="text-black text-sm font-semibold text-center mt-[7px]">
                    Top Customer:
                  </div>
                  <div className="flex w-full gap-[19px]">
                    <div className="flex gap-1.5 mt-[5px]">
                      <div className="bg-[rgba(217,217,217,1)] flex flex-col justify-center mt-1 py-px rounded-[50%]">
                        <div className="bg-[rgba(237,237,237,1)] z-10 flex w-[18px] shrink-0 h-[18px] -mt-1 rounded-[50%]" />
                      </div>
                      <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                      <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                      <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                      <div className="bg-[rgba(237,237,237,1)] flex w-[18px] shrink-0 h-[18px] rounded-[50%]" />
                    </div>
                    <button className="bg-[rgba(0,106,78,1)] text-sm text-white font-semibold text-center px-4 py-[3px] rounded-[5px] hover:bg-[rgba(0,106,78,0.8)] transition-colors">
                      See Details
                    </button>
                  </div>
                  <div className="text-black text-sm font-semibold text-center mt-4">
                    Top 5 winner will get $50 Gift Card
                  </div>
                </div>
              </div>
              <div className="w-[38%] ml-5 max-md:w-full max-md:ml-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/97cf93cced334ad24ba254213f4d3f96fbf74545?placeholderIfAbsent=true"
                  alt="Content Gallery"
                  className="aspect-[1.38] object-contain w-[145px] shrink-0 max-w-full grow rounded-[5px] max-md:mt-[29px]"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
          <div className="flex flex-col relative min-h-[118px] grow text-sm text-black font-semibold text-center pt-[75px] pb-[9px] px-[70px] rounded-[5px] max-md:max-w-full max-md:mt-8 max-md:px-5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/d55564b7fa75aab5f012d2de6a1052c15c43d27e?placeholderIfAbsent=true"
              alt="Regional Promotions"
              className="absolute h-full w-full object-cover inset-0"
            />
            <div className="relative">
              Regional Promotions
              <br />
              (e.g., Eid Sales)
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[rgba(255,215,0,1)] flex flex-col items-stretch justify-center mt-[363px] px-[15px] py-[9px] rounded-[10px] max-md:mt-10 w-fit ml-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/57af553ae4806135aa860ca88efb1cb510498fd6?placeholderIfAbsent=true"
          alt="Floating Action Button"
          className="aspect-[1] object-contain w-[43px]"
        />
      </div>
    </section>
  );
};
