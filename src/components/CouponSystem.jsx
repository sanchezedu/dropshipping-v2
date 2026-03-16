import { useState } from 'react';

export default function CouponSystem() {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState('');

  // Available coupons
  const coupons = {
    'BIENVENIDO10': { discount: 10, type: 'percent', description: '10% de descuento' },
    'BIENVENIDO20': { discount: 20, type: 'percent', description: '20% de descuento' },
    'DROP15': { discount: 15, type: 'percent', description: '15% de descuento' },
    'VIP25': { discount: 25, type: 'percent', description: '25% de descuento' },
    'NOEL10': { discount: 10, type: 'fixed', description: '$10 de descuento' },
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (coupons[code]) {
      setAppliedCoupon({ code, ...coupons[code] });
      setError('');
    } else {
      setError('Cupón inválido');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setError('');
  };

  return {
    coupons,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    error,
    setError
  };
}
