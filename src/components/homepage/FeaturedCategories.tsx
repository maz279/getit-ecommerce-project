import React from 'react';

interface CategoryItem {
  image: string;
  name: string;
  count: number;
}

const categories: CategoryItem[] = Array(11).fill({
  image: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/73c7389418b8a9f8e8a93dad8fb3dfb7eb050268?placeholderIfAbsent=true",
  name: "Category",
  count: 20
});

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center mt-4 pl-[26px] pr-[9px] max-md:max-w-full max-md:pl-5">
      <div className="flex w-full max-w-[1383px] items-center gap-px flex-wrap max-md:max-w-full">
        <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
          &lt;
        </button>
        
        <div className="bg-[rgba(242,242,242,1)] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border self-stretch pt-px pb-[17px] rounded-[5px] border-[rgba(32,32,107,1)] border-solid max-md:max-w-full">
          <div className="bg-[rgba(32,32,107,1)] flex w-full items-stretch gap-5 flex-wrap justify-between px-[15px] py-[9px] rounded-[3px] max-md:max-w-full">
            <div className="text-white text-base font-bold">
              Featured Categories
            </div>
            <div className="flex items-stretch gap-[5px] text-xs font-semibold">
              <div className="text-white grow">SEE ALL</div>
              <button className="bg-white text-[rgba(32,32,107,1)] whitespace-nowrap px-[5px] py-px rounded-[5px] hover:bg-gray-100 transition-colors">
                &gt;
              </button>
            </div>
          </div>
          
          <div className="bg-[rgba(217,217,217,1)] flex shrink-0 h-0.5 max-md:max-w-full" />
          
          <div className="ml-3.5 mr-5 mt-[7px] max-md:max-w-full max-md:mr-2.5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-[66%] max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-[27px] text-black font-normal whitespace-nowrap text-center flex-wrap max-md:mt-[27px]">
                  {categories.slice(0, 7).map((category, index) => (
                    <div key={index} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-[16%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-3.5 text-black font-normal whitespace-nowrap text-center max-md:mt-[27px]">
                  {categories.slice(7, 9).map((category, index) => (
                    <div key={index + 7} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-[17%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-[27px] text-black font-normal whitespace-nowrap text-center max-md:mt-[27px]">
                  {categories.slice(9, 11).map((category, index) => (
                    <div key={index + 9} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-3.5 mr-5 mt-[7px] max-md:max-w-full max-md:mr-2.5">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
              <div className="w-[66%] max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-[27px] text-black font-normal whitespace-nowrap text-center flex-wrap max-md:mt-[27px]">
                  {categories.slice(0, 7).map((category, index) => (
                    <div key={`row2-${index}`} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-[16%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-3.5 text-black font-normal whitespace-nowrap text-center max-md:mt-[27px]">
                  {categories.slice(7, 9).map((category, index) => (
                    <div key={`row2-${index + 7}`} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-[17%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex grow items-stretch gap-[27px] text-black font-normal whitespace-nowrap text-center max-md:mt-[27px]">
                  {categories.slice(9, 11).map((category, index) => (
                    <div key={`row2-${index + 9}`} className="bg-white flex flex-col items-stretch flex-1 px-[17px] py-[11px] rounded-[5px] hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="aspect-[1.13] object-contain w-[62px]"
                      />
                      <div className="text-sm">{category.name}</div>
                      <div className="rounded bg-white border self-center w-[37px] text-xs mt-1 px-[11px] border-[rgba(32,32,107,1)] border-solid">
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="bg-[rgba(32,32,107,1)] self-stretch text-sm text-white font-normal whitespace-nowrap text-center w-[22px] h-[22px] my-auto px-1.5 rounded-[50%] hover:bg-[rgba(32,32,107,0.8)] transition-colors">
          &gt;
        </button>
      </div>
    </section>
  );
};
