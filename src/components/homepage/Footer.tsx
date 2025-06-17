import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="flex w-full flex-col items-stretch mt-[19px] pt-6 pb-[39px] max-md:max-w-full">
      <div className="bg-[rgba(217,217,217,1)] flex w-[1254px] shrink-0 max-w-full h-0.5 ml-[46px]" />
      
      <div className="z-10 flex w-[196px] max-w-full flex-col items-stretch text-base mr-20 mt-6 max-md:mr-2.5">
        <div className="text-white font-bold max-md:mr-2.5">
          GETIT APP DOWNLOAD
        </div>
        
        <div className="flex gap-[17px] font-light leading-loose mt-[27px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/1b93a5e6a99a4ad68afe20b903a78031495a7507?placeholderIfAbsent=true"
            alt="QR Code"
            className="aspect-[1] object-contain w-[79px] shrink-0 mt-[5px]"
          />
          <div className="flex-1">
            <div className="flex items-stretch gap-2.5 text-white">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/0ba5709f4bca2fa387762ba4976828231a455720?placeholderIfAbsent=true"
                alt="App Store"
                className="aspect-[1] object-contain w-[17px] shrink-0 my-auto"
              />
              <div>app store</div>
            </div>
            <div className="flex items-stretch gap-2.5 text-black mt-[7px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/a7a26358839cbe0e1460e609c5e2798e8d088a40?placeholderIfAbsent=true"
                alt="Google Play"
                className="aspect-[1] object-contain w-[17px] shrink-0 my-auto"
              />
              <div>app store</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-white font-normal whitespace-nowrap mt-[39px]">
          <div className="rounded bg-white self-stretch flex w-5 shrink-0 h-5 my-auto" />
          <div className="self-stretch my-auto">EN</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8ce44c3ebb039f8dbb63191528f067f61dfc0579?placeholderIfAbsent=true"
            alt="Dropdown"
            className="aspect-[0.78] object-contain w-[7px] self-stretch shrink-0 my-auto"
          />
          <div className="bg-[rgba(168,168,168,1)] self-stretch flex w-0.5 shrink-0 h-6" />
          <div className="rounded bg-white self-stretch flex w-[18px] shrink-0 h-5 my-auto" />
          <div className="self-stretch my-auto">USD</div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8ce44c3ebb039f8dbb63191528f067f61dfc0579?placeholderIfAbsent=true"
            alt="Dropdown"
            className="aspect-[0.78] object-contain w-[7px] self-stretch shrink-0 my-auto"
          />
        </div>
      </div>
      
      <div className="z-10 flex mt-[-186px] w-full flex-col pl-[72px] pr-[17px] max-md:max-w-full max-md:pl-5">
        <div className="w-[944px] max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[44%] max-md:w-full max-md:ml-0">
              <div className="flex grow items-stretch gap-3.5 max-md:mt-10">
                <div className="flex flex-col">
                  <div className="text-white text-base font-bold">
                    NEWS LETTER
                  </div>
                  <div className="text-white text-xs font-normal mt-[9px]">
                    Subscribe for exclusive offers and updates
                  </div>
                  
                  <form onSubmit={handleSubscribe} className="bg-white flex items-stretch gap-[40px_46px] text-[10px] text-black mt-1.5 pl-[7px]">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-thin my-auto bg-transparent outline-none flex-1"
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-[rgba(165,165,165,1)] font-normal whitespace-nowrap px-[7px] py-1.5 hover:bg-[rgba(165,165,165,0.8)] transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  
                  <div className="text-white text-[15px] font-semibold mt-9">
                    Our Recent Highlights
                  </div>
                  <div className="self-stretch flex items-stretch gap-3.5 mt-2.5">
                    <div className="bg-[rgba(151,151,151,1)] flex w-[68px] shrink-0 h-[50px] rounded-[5px]" />
                    <div className="bg-[rgba(151,151,151,1)] flex w-[69px] shrink-0 h-[50px] rounded-[5px]" />
                    <div className="bg-[rgba(151,151,151,1)] flex w-[69px] shrink-0 h-[50px] rounded-[5px]" />
                  </div>
                </div>
                <div className="bg-[rgba(151,151,151,1)] flex w-[68px] shrink-0 h-[50px] mt-[145px] rounded-[5px] max-md:mt-10" />
              </div>
            </div>
            
            <div className="w-[56%] ml-5 max-md:w-full max-md:ml-0">
              <div className="max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  <div className="w-3/5 max-md:w-full max-md:ml-0">
                    <div className="text-white text-base font-bold max-md:mt-10">
                      <span style={{color: 'rgba(255,255,255,1)'}}>QUICK LINKS</span>
                      <br />
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>About Us</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>Contact</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>FAQ</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>Terms & Conditions</span>
                    </div>
                  </div>
                  
                  <div className="w-2/5 ml-5 max-md:w-full max-md:ml-0">
                    <div className="text-white text-base font-bold max-md:mt-10">
                      <span style={{color: 'rgba(255,255,255,1)'}}>FOLLOW US</span>
                      <br />
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>Facebook</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>Instagram</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>Twitter</span>
                      <br />
                      <span style={{fontWeight: 300, lineHeight: '25px', color: 'rgba(255,255,255,1)'}}>LinkedIn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/1a3634dd95335ba1bd1043ed859054c2777d6ceb?placeholderIfAbsent=true"
          alt="Company Logo"
          className="aspect-[1] object-contain w-20 z-10 -mt-2.5"
        />
      </div>
      
      <div className="text-white text-base font-light self-center mt-[-22px] max-md:max-w-full">
        © 2025 GETIT. All Rights Reserved . Country & Region: Singapore | Indonesia | Thailand Malaysia | Vietnam | Philippines | Brazil | México | Colombia
      </div>
    </footer>
  );
};
