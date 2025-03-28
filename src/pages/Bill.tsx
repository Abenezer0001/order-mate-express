
import React, { useState } from 'react';
import { useOrders } from '@/context/OrdersContext';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark, Banknote, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTableInfo } from '@/context/TableContext';
import { format } from 'date-fns';

const Bill: React.FC = () => {
  const { orders, clearOrders } = useOrders();
  const { tableNumber, restaurantName } = useTableInfo();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  
  // Calculate total from all orders
  const subtotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const tax = orders.reduce((sum, order) => sum + order.tax, 0);
  const serviceCharge = subtotal * 0.1; // 10% service charge
  const total = subtotal + tax + serviceCharge;
  
  // Only show the bill if there are orders
  if (orders.length === 0) {
    return (
      <div className="px-4 py-8 mt-16">
        <h1 className="text-2xl font-semibold mb-6">Your Bill</h1>
        
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any orders to pay for yet</p>
          
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => window.location.href = '/'}
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }
  
  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    setIsPaying(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaying(false);
      setPaid(true);
      clearOrders();
      toast.success('Payment successful!');
    }, 2000);
  };

  if (paid) {
    return (
      <div className="px-4 py-8 mt-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Payment Complete!</h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for dining with us. We hope to see you again soon!
        </p>
        
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => window.location.href = '/'}
        >
          Return to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 mt-16">
      <h1 className="text-2xl font-semibold mb-6">Your Bill</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="text-center mb-4">
          <h2 className="font-bold text-xl">{restaurantName}</h2>
          <p className="text-sm text-gray-500">Table {tableNumber}</p>
          <p className="text-sm text-gray-500">{format(new Date(), 'MMM d, yyyy h:mm a')}</p>
        </div>
        
        <div className="border-t border-b py-4 my-4">
          {orders.map((order, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-sm mb-2">Order #{order.id.split('-')[1]}</h3>
              
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between text-sm py-1">
                  <span>{item.quantity} x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Service Charge (10%)</span>
            <span>${serviceCharge.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="font-medium mb-4">Select Payment Method</h2>
        
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            className={`h-20 flex flex-col ${
              paymentMethod === 'card' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>Card</span>
          </Button>
          
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            className={`h-20 flex flex-col ${
              paymentMethod === 'cash' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            <Banknote className="h-6 w-6 mb-2" />
            <span>Cash</span>
          </Button>
          
          <Button
            variant={paymentMethod === 'bank' ? 'default' : 'outline'}
            className={`h-20 flex flex-col ${
              paymentMethod === 'bank' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
            onClick={() => setPaymentMethod('bank')}
          >
            <Landmark className="h-6 w-6 mb-2" />
            <span>Bank</span>
          </Button>
        </div>
      </div>
      
      <Button
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={handlePayment}
        disabled={isPaying}
      >
        {isPaying ? (
          <>
            <span className="animate-spin mr-2">⭕</span> Processing...
          </>
        ) : (
          <>Pay ${total.toFixed(2)}</>
        )}
      </Button>
    </div>
  );
};

export default Bill;
