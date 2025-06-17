import React, { useState, useEffect } from 'react';

export const HeroSection: React.FC = () => {
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

  return (
    <section className="self-center w-full max-w-[1349px] mt-2.5 max-md:max-w-full">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-[74%] max-md:w-full max-md:ml-0">
          <div className="flex flex-col relative min-h-[328px] w-full pl-[25px] pr-20 pt-[67px] pb-[22px] rounded-[5px] max-md:max-w-full max-md:mt-[15px] max-md:px-5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/cc032291cdcbc1303b6055a219dd99b0d9093fb2?placeholderIfAbsent=true"
              alt="Flash Sale Background"
              className="absolute h-full w-full object-cover inset-0"
            />
            <div className="relative text-black text-3xl font-normal max-md:ml-2">
              Flash Sale END in
            </div>
            <div className="relative flex gap-1.5 text-2xl text-[rgba(224,22,43,1)] font-normal whitespace-nowrap mt-[41px] max-md:ml-[7px] max-md:mt-10">
              <div className="flex items-stretch gap-[3px]">
                <div className="bg-white border w-10 h-10 pt-[7px] pb-[15px] px-[13px] rounded-[50%] border-[rgba(224,22,43,1)] border-solid">
                  {Math.floor(timeLeft.days / 10)}
                </div>
                <div className="bg-white border w-10 h-10 pt-[7px] pb-[15px] px-3 rounded-[50%] border-[rgba(224,22,43,1)] border-solid">
                  {timeLeft.days % 10}
                </div>
              </div>
              <div className="text-black text-3xl">:</div>
              <div className="flex items-stretch gap-0.5">
                <div className="bg-white border w-[41px] h-[41px] pt-[7px] pb-[15px] px-[13px] rounded-[50%] border-[rgba(224,22,43,1)] border-solid">
                  {Math.floor(timeLeft.hours / 10)}
                </div>
                <div className="bg-white border w-[41px] h-[41px] pt-[7px] pb-[15px] px-[13px] rounded-[50%] border-[rgba(224,22,43,1)] border-solid">
                  {timeLeft.hours % 10}
                </div>
              </div>
              <div className="text-black text-3xl">:</div>
              <div className="flex items-stretch gap-[3px]">
                <div className="bg-white border w-10 h-10 pt-[7px] pb-4 px-[13px] rounded-[50%] border-[rgba(224,22,43,1)] border-solid max-md:pr-5">
                  {Math.floor(timeLeft.minutes / 10)}
                </div>
                <div className="bg-white border w-10 h-10 pt-[7px] pb-[15px] px-3 rounded-[50%] border-[rgba(224,22,43,1)] border-solid">
                  {timeLeft.minutes % 10}
                </div>
              </div>
            </div>
            <div className="relative flex w-[271px] max-w-full items-stretch gap-5 text-base text-[rgba(224,22,43,1)] font-semibold whitespace-nowrap justify-between ml-7 mt-[7px] max-md:ml-2.5">
              <div>Days</div>
              <div>Hours</div>
              <div>Minutes</div>
            </div>
            <button className="relative bg-[rgba(0,106,78,0.95)] text-[15px] text-white font-semibold mt-[31px] px-[11px] py-2.5 rounded-[15px] hover:bg-[rgba(0,106,78,1)] transition-colors">
              Buy Button
            </button>
            <div className="relative self-center flex w-9 items-stretch gap-1.5 ml-9 mt-[19px]">
              <div className="bg-black flex w-2 shrink-0 h-2 rounded-[50%]" />
              <div className="bg-[rgba(160,160,160,1)] flex w-2 shrink-0 h-2 rounded-[50%]" />
              <div className="bg-[rgba(160,160,160,1)] flex w-2 shrink-0 h-2 rounded-[50%]" />
            </div>
          </div>
        </div>
        <div className="w-[26%] ml-5 max-md:w-full max-md:ml-0">
          <div className="grow mt-[5px] max-md:mt-5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/baf55f8fa62618c257d4667a922c7c874e06aad4?placeholderIfAbsent=true"
              alt="Promotional Banner 1"
              className="aspect-[2.27] object-contain w-full rounded-[5px]"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/a2e7ce6079d265c828121aac0357f9a5fa080179?placeholderIfAbsent=true"
              alt="Promotional Banner 2"
              className="aspect-[2.27] object-contain w-full mt-[13px] rounded-[5px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
