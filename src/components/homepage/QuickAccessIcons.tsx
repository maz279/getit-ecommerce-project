import React from 'react';

interface QuickAccessItem {
  icon: string;
  title: string;
  subtitle?: string;
}

const quickAccessItems: QuickAccessItem[] = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Hot Deals", subtitle: "For You" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Today's", subtitle: "Voucher" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Rewards", subtitle: "Coins" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Payment", subtitle: "Offers" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Daily Deals", subtitle: "For You" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "EID", subtitle: "Voucher" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Purchase", subtitle: "Points" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "EID", subtitle: "Offers" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "GETIT", subtitle: "Choice" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Flash Sale" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Free", subtitle: "Delivery" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "Card", subtitle: "Offers" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true", title: "11 : 11Deals" },
];

export const QuickAccessIcons: React.FC = () => {
  return (
    <section className="bg-[rgba(235,235,235,1)] flex gap-5 flex-wrap justify-between mt-[11px] pt-[25px] pb-3 px-[60px] max-md:px-5">
      {quickAccessItems.slice(0, 5).map((item, index) => (
        <div key={index} className="text-sm text-black font-normal text-center">
          <img
            src={item.icon}
            alt={item.title}
            className="aspect-[1.21] object-contain w-[51px] rounded-[5px] max-md:mx-[9px]"
          />
          <div className="mt-[7px]">
            {item.title}
            {item.subtitle && (
              <>
                <br />
                {item.subtitle}
              </>
            )}
          </div>
        </div>
      ))}
      
      <div>
        <div className="flex items-stretch gap-5 justify-between max-md:mr-[5px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="EID Voucher"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="Purchase Points"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
        </div>
        <div className="flex items-stretch gap-5 text-sm text-black font-normal text-center justify-between mt-[7px]">
          <div>EID<br />Voucher</div>
          <div>Purchase<br />Points</div>
        </div>
      </div>

      {quickAccessItems.slice(7, 9).map((item, index) => (
        <div key={index + 7} className="flex flex-col items-stretch text-sm text-black font-normal whitespace-nowrap text-center">
          <img
            src={item.icon}
            alt={item.title}
            className="aspect-[1.21] object-contain w-[51px] rounded-[5px]"
          />
          <div className="mt-[7px]">
            {item.title}
            {item.subtitle && (
              <>
                <br />
                {item.subtitle}
              </>
            )}
          </div>
        </div>
      ))}

      <div className="text-sm text-black font-normal text-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
          alt="Flash Sale"
          className="aspect-[1.21] object-contain w-[51px] rounded-[5px] max-md:ml-[9px] max-md:mr-2"
        />
        <div className="mt-[7px]">Flash Sale</div>
      </div>

      <div>
        <div className="flex items-stretch gap-5 justify-between">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="Free Delivery"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="Card Offers"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
        </div>
        <div className="flex items-stretch gap-5 text-sm text-black font-normal text-center justify-between mt-[7px] max-md:mr-[5px]">
          <div>Free<br />Delivery</div>
          <div>Card<br />Offers</div>
        </div>
      </div>

      <div className="flex flex-col items-stretch text-sm text-black font-normal text-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
          alt="11:11 Deals"
          className="aspect-[1.21] object-contain w-[51px] rounded-[5px]"
        />
        <div className="mt-[7px]">11 : 11Deals</div>
      </div>

      <div className="self-stretch">
        <div className="flex items-stretch gap-5 justify-between">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="Only For You"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c5a9e6a3346949f6969d40ed9f6f4f58/8f675716e74c25eee9d4e25394732a848b8172ec?placeholderIfAbsent=true"
            alt="Buy Get 1 Free"
            className="aspect-[1.21] object-contain w-[51px] shrink-0 rounded-[5px]"
          />
        </div>
        <div className="flex items-stretch gap-[30px] text-black text-center max-md:mr-1">
          <div className="text-sm font-normal my-auto">
            Only For<br />You
          </div>
          <div className="flex items-stretch gap-1 flex-1">
            <div className="flex items-stretch gap-0.5 my-auto">
              <div className="text-sm font-normal">BuyGet</div>
              <div className="text-[32px] font-extralight">1</div>
            </div>
            <div className="text-[10px] font-normal">
              FRE<br />E
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
