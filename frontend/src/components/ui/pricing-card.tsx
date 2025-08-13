import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PricingTier, BillingPeriod } from '@/types';

interface PricingCardProps {
  tier: PricingTier;
  billingPeriod: BillingPeriod;
  yearlyDiscount?: number;
  onSelectPlan?: (tierId: string) => void;
  className?: string;
  isCurrentPlan?: boolean;
}

export function PricingCard({
  tier,
  billingPeriod,
  yearlyDiscount = 0,
  onSelectPlan,
  className,
  isCurrentPlan = false,
}: PricingCardProps) {
  const t = useTranslations('pages.pricing');
  
  const price = tier.price[billingPeriod];
  const monthlyPrice = billingPeriod === 'yearly' ? tier.price.yearly / 12 : tier.price.monthly;
  const savings = billingPeriod === 'yearly' && yearlyDiscount > 0 
    ? Math.round(yearlyDiscount * 100) 
    : 0;

  const handleSelectPlan = () => {
    if (!isCurrentPlan && onSelectPlan) {
      onSelectPlan(tier.id);
    }
  };

  return (
    <Card 
      className={cn(
        'relative flex flex-col h-full transition-all duration-200',
        tier.popular && 'border-primary shadow-lg scale-105',
        className
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            {t('badges.popular')}
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">
          {t(`tiers.${tier.id}.name`)}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {t(`tiers.${tier.id}.description`)}
        </CardDescription>
        
        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold">
              {price === 0 ? 'Free' : `$${Math.round(monthlyPrice)}`}
            </span>
            {price > 0 && (
              <span className="text-muted-foreground ml-1">
                /{t('period.month')}
              </span>
            )}
          </div>
          
          {billingPeriod === 'yearly' && price > 0 && (
            <div className="mt-1 text-sm text-muted-foreground">
              ${price} {t('period.billedYearly')}
              {savings > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {t('billingToggle.savePercent', { percent: savings })}
                </Badge>
              )}
            </div>
          )}
          
          {billingPeriod === 'monthly' && price > 0 && (
            <div className="mt-1 text-sm text-muted-foreground">
              {t('period.billedMonthly')}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {tier.features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className={cn(
                  'text-sm',
                  feature.included ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  <span className="font-medium">
                    {t(`featureNames.${feature.id}`)}:
                  </span>
                  <span className="ml-1">{feature.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button
            onClick={handleSelectPlan}
            variant={isCurrentPlan ? 'outline' : tier.cta.variant}
            className="w-full"
            disabled={isCurrentPlan}
          >
            {isCurrentPlan
              ? t('cta.currentPlan')
              : (() => {
                  const ctaKey = tier.cta.text.toLowerCase().replace(/\s+/g, '');
                  const translationKey = `cta.${ctaKey}`;
                  // Map common CTA texts to translation keys
                  const ctaMap: Record<string, string> = {
                    'getstarted': 'cta.getStarted',
                    'startfreetrial': 'cta.startFreeTrial',
                    'contactsales': 'cta.contactSales',
                    'chooseplan': 'cta.choosePlan'
                  };
                  return ctaMap[ctaKey] ? t(ctaMap[ctaKey].replace('cta.', '')) : tier.cta.text;
                })()
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PricingComparisonProps {
  tiers: PricingTier[];
  billingPeriod: BillingPeriod;
  yearlyDiscount?: number;
  onSelectPlan?: (tierId: string) => void;
  currentPlanId?: string;
  className?: string;
}

export function PricingComparison({
  tiers,
  billingPeriod,
  yearlyDiscount,
  onSelectPlan,
  currentPlanId,
  className,
}: PricingComparisonProps) {
  return (
    <div className={cn(
      'grid gap-6 lg:gap-8',
      tiers.length === 3 ? 'md:grid-cols-3' : `md:grid-cols-${Math.min(tiers.length, 4)}`,
      className
    )}>
      {tiers.map((tier) => (
        <PricingCard
          key={tier.id}
          tier={tier}
          billingPeriod={billingPeriod}
          yearlyDiscount={yearlyDiscount}
          onSelectPlan={onSelectPlan}
          isCurrentPlan={currentPlanId === tier.id}
        />
      ))}
    </div>
  );
}
