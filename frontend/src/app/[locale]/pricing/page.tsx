'use client';

import * as React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingComparison } from '@/components/ui/pricing-card';
import { Check } from 'lucide-react';
import type { PricingConfig, BillingPeriod } from '@/types';

// Import the pricing configuration
import pricingData from '../../../../config/pricing.json';

export default function PricingPage() {
  const t = useTranslations('pages.pricing');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  
  const pricingConfig = pricingData as PricingConfig;

  const handleSelectPlan = (tierId: string) => {
    // Handle plan selection - could redirect to checkout, show modal, etc.
    console.log(`Selected plan: ${tierId} with ${billingPeriod} billing`);
    // TODO: Implement plan selection logic
  };

  const toggleBillingPeriod = (period: BillingPeriod) => {
    setBillingPeriod(period);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleBillingPeriod('monthly')}
            className="relative"
          >
            {t('billingToggle.monthly')}
          </Button>
          <Button
            variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleBillingPeriod('yearly')}
            className="relative"
          >
            {t('billingToggle.yearly')}
            {pricingConfig.billing.yearlyDiscount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('billingToggle.savePercent', { 
                  percent: Math.round(pricingConfig.billing.yearlyDiscount * 100) 
                })}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mb-16">
        <PricingComparison
          tiers={pricingConfig.tiers}
          billingPeriod={billingPeriod}
          yearlyDiscount={pricingConfig.billing.yearlyDiscount}
          onSelectPlan={handleSelectPlan}
          className="max-w-6xl mx-auto"
        />
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('faq.title')}
        </h2>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.canIChangePlans')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.canIChangePlansAnswer')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.whatPaymentMethods')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.whatPaymentMethodsAnswer')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.isThereFreeTrial')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.isThereFreeTrialAnswer')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('faq.whatIfINeedMoreUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('faq.whatIfINeedMoreUsersAnswer')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-16 py-16 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust our platform for their business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => handleSelectPlan('professional')}>
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}
