
import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { GiftCardHero } from '../components/giftcards/GiftCardHero';
import { GiftCardDenominations } from '../components/giftcards/GiftCardDenominations';
import { GiftCardTypes } from '../components/giftcards/GiftCardTypes';
import { PopularBrands } from '../components/giftcards/PopularBrands';
import { GiftCardCategories } from '../components/giftcards/GiftCardCategories';
import { PurchaseProcess } from '../components/giftcards/PurchaseProcess';
import { RedemptionProcess } from '../components/giftcards/RedemptionProcess';
import { GiftCardOccasions } from '../components/giftcards/GiftCardOccasions';
import { CustomizationOptions } from '../components/giftcards/CustomizationOptions';
import { DeliveryOptions } from '../components/giftcards/DeliveryOptions';
import { MultiVendorBenefits } from '../components/giftcards/MultiVendorBenefits';
import { GiftCardBenefits } from '../components/giftcards/GiftCardBenefits';
import { RecentlyViewed } from '../components/giftcards/RecentlyViewed';
import { GiftCardFAQ } from '../components/giftcards/GiftCardFAQ';

const GiftCards: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <GiftCardHero />
        <GiftCardDenominations />
        <GiftCardTypes />
        <PopularBrands />
        <GiftCardCategories />
        <PurchaseProcess />
        <RedemptionProcess />
        <GiftCardOccasions />
        <CustomizationOptions />
        <DeliveryOptions />
        <MultiVendorBenefits />
        <GiftCardBenefits />
        <RecentlyViewed />
        <GiftCardFAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default GiftCards;
