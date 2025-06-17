import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="w-full pt-[23px] px-[52px] max-md:max-w-full max-md:px-5">
      <div className="flex items-stretch gap-[31px] flex-wrap ml-2.5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/2c9693715eb99cfe31a3e3d303c3fbdfdf3971ed?placeholderIfAbsent=true"
          alt="Company Logo"
          className="aspect-[3.11] object-contain w-[183px] shrink-0 max-w-full rounded-md"
        />
        <div className="flex flex-col items-stretch grow shrink-0 basis-0 w-fit max-md:max-w-full">
          <div className="flex items-stretch gap-[29px] flex-wrap">
            <div className="flex items-center gap-[21px] grow shrink basis-auto">
              <div className="bg-white self-stretch flex items-stretch gap-[40px_100px] flex-wrap px-[25px] py-2.5 rounded-[5px] max-md:max-w-full max-md:pr-5">
                <div className="flex items-stretch gap-[21px]">
                  <div className="flex items-stretch gap-[3px] text-base text-black font-normal whitespace-nowrap my-auto">
                    <div className="grow">Categories</div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/c105b2e3aaf71ae1b66da7264d393724651705a5?placeholderIfAbsent=true"
                      alt="Dropdown arrow"
                      className="aspect-[1.33] object-contain w-3 shrink-0 my-auto"
                    />
                  </div>
                  <div className="flex items-stretch gap-5 text-xs text-[rgba(155,155,155,1)] font-semibold">
                    <div className="bg-[rgba(181,181,181,1)] flex w-0.5 shrink-0 h-6" />
                    <input
                      type="search"
                      placeholder="Search for products ....."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="basis-auto my-auto bg-transparent outline-none placeholder-[rgba(155,155,155,1)]"
                    />
                  </div>
                </div>
                <div className="flex items-stretch gap-[34px]">
                  <div className="flex items-stretch gap-[13px]">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/d63810b1cac5f1f20ea49a01f5c8b62f956a6c07?placeholderIfAbsent=true"
                      alt="Search"
                      className="aspect-[1] object-contain w-6 shrink-0"
                    />
                    <div className="bg-[rgba(181,181,181,1)] flex w-0.5 shrink-0 h-6" />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/666196f510f02dd26cbc18ddc221dbbb6dbcce51?placeholderIfAbsent=true"
                      alt="Wishlist"
                      className="aspect-[1] object-contain w-[22px] shrink-0"
                    />
                    <div className="bg-[rgba(181,181,181,1)] flex w-0.5 shrink-0 h-6" />
                  </div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/4691830e7954df49fa1bef75f80544a1e11f889e?placeholderIfAbsent=true"
                    alt="Cart"
                    className="aspect-[1] object-contain w-[22px] shrink-0"
                  />
                </div>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/c04fe0e5417e6fd5c3abe910f6e65918f57e02e7?placeholderIfAbsent=true"
                alt="Notification"
                className="aspect-[1.1] object-contain w-8 self-stretch shrink-0 my-auto"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/112f9be4050a546c7f064d2851faff0ff1dea587?placeholderIfAbsent=true"
                alt="Messages"
                className="aspect-[0.85] object-contain w-[29px] self-stretch shrink-0 my-auto"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/b2c4140b73b1cf4ba925ebb93d5868cd362ddcb6?placeholderIfAbsent=true"
                alt="Profile"
                className="aspect-[1.14] object-contain w-[33px] self-stretch shrink-0 my-auto"
              />
            </div>
            <div className="flex items-stretch gap-1.5 text-xs text-white font-normal">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/c141086018bc5bb2e3048696221fa73bbb8dfac7?placeholderIfAbsent=true"
                alt="User"
                className="aspect-[1] object-contain w-[29px] shrink-0 mt-2"
              />
              <div>
                <span style={{color: 'rgba(255,255,255,1)'}}>Sign In</span>
                <br />
                <span style={{fontSize: '10px', color: 'rgba(255,255,255,1)'}}>or</span>
                <br />
                <span style={{color: 'rgba(255,255,255,1)'}}>Sign Up</span>
              </div>
            </div>
          </div>
          <div className="text-white text-sm font-normal">
            Popular Search KeyWord
          </div>
        </div>
      </div>
      <nav className="flex w-full max-w-[1240px] gap-5 text-white flex-wrap justify-between mt-[17px] max-md:max-w-full">
        <div className="flex gap-[19px] text-[15px] font-extrabold">
          <div className="bg-[rgba(255,215,0,1)] self-stretch flex items-stretch gap-[40px_41px] text-black px-[23px] py-2 rounded-[5px_5px_0px_0px] max-md:pl-5">
            <div>ALL CATEGORIES</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/e11a1fc76c0a998832674a737bc1a4aa350be12c?placeholderIfAbsent=true"
              alt="Dropdown"
              className="aspect-[0.83] object-contain w-2.5 shrink-0 my-auto"
            />
          </div>
          <div>Flash Sale</div>
          <div>Promotions</div>
          <div>Mega Menu</div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-normal whitespace-nowrap">
          <div className="rounded bg-white self-stretch flex w-5 shrink-0 h-5 my-auto" />
          <div className="self-stretch my-auto">EN</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8ce44c3ebb039f8dbb63191528f067f61dfc0579?placeholderIfAbsent=true"
            alt="Dropdown"
            className="aspect-[0.78] object-contain w-[7px] self-stretch shrink-0 my-auto"
          />
          <div className="bg-[rgba(217,217,217,1)] self-stretch flex w-0.5 shrink-0 h-6" />
          <div className="rounded bg-white self-stretch flex w-[18px] shrink-0 h-5 my-auto" />
          <div className="self-stretch my-auto">USD</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8ce44c3ebb039f8dbb63191528f067f61dfc0579?placeholderIfAbsent=true"
            alt="Dropdown"
            className="aspect-[0.78] object-contain w-[7px] self-stretch shrink-0 my-auto"
          />
        </div>
      </nav>
    </header>
  );
};
